#!/usr/bin/env python3
"""
FarmWise Local Development Server
Provides zero-dependency static HTTP file serving for FarmWise.

Usage:
  python server.py [PORT]

Example:
  python server.py 8000
"""

import sys
import os
import json
import urllib.request
import urllib.error
import http.server
import socketserver
import base64
import re

# Ensure UTF-8 output on Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

DEFAULT_PORT = 8000
DEFAULT_MODEL = "gemini-2.5-flash"
FALLBACK_MODELS = ["gemini-1.5-flash", "gemini-2.0-flash"]

class FarmWiseHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS and caching headers for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def send_json(self, status_code, data):
        response_bytes = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(response_bytes)))
        self.end_headers()
        self.wfile.write(response_bytes)

    def do_GET(self):
        if self.path == '/api/config':
            has_key = bool(os.environ.get('GEMINI_API_KEY', '').strip())
            self.send_json(200, {
                'success': True,
                'hasServerKey': has_key,
                'defaultModel': DEFAULT_MODEL
            })
            return

        super().do_GET()

    def do_POST(self):
        if self.path == '/api/analyze-crop':
            self.handle_analyze_crop()
            return
        elif self.path == '/api/assistant':
            self.handle_assistant()
            return
        elif self.path == '/api/test-key':
            self.handle_test_key()
            return

        self.send_json(404, {'success': False, 'message': f'Not found: {self.path}'})

    def get_api_key(self, request_data):
        auth_header = self.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            header_key = auth_header.split('Bearer ', 1)[1].strip()
            if header_key:
                return header_key

        body_key = request_data.get('apiKey', '').strip() if isinstance(request_data, dict) else ''
        if body_key:
            return body_key

        return os.environ.get('GEMINI_API_KEY', '').strip()

    def parse_request_json(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length <= 0:
                return None
            body = self.rfile.read(content_length)
            return json.loads(body.decode('utf-8'))
        except Exception as e:
            print(f"[server] Error parsing request body: {e}")
            return None

    def call_gemini_api(self, api_key, model, payload):
        """Call Gemini API with model fallback if needed"""
        models_to_try = [model] + [m for m in FALLBACK_MODELS if m != model]
        last_error = None

        for current_model in models_to_try:
            endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/{current_model}:generateContent?key={api_key}"
            req_data = json.dumps(payload).encode('utf-8')
            req = urllib.request.Request(
                endpoint,
                data=req_data,
                headers={'Content-Type': 'application/json'}
            )

            try:
                with urllib.request.urlopen(req, timeout=30) as resp:
                    resp_body = resp.read().decode('utf-8')
                    return json.loads(resp_body), current_model
            except urllib.error.HTTPError as e:
                err_body = e.read().decode('utf-8', errors='ignore')
                print(f"[server] Gemini API HTTP {e.code} for {current_model}: {err_body}")
                try:
                    err_json = json.loads(err_body)
                    last_error = err_json.get('error', {}).get('message', f"HTTP {e.code}")
                except Exception:
                    last_error = f"HTTP {e.code}: {e.reason}"
                # If model not found or deprecated, try next model
                if e.code in (404, 400) and 'not found' in str(last_error).lower():
                    continue
                break
            except Exception as e:
                print(f"[server] Network error calling Gemini: {e}")
                last_error = str(e)
                break

        raise RuntimeError(last_error or "Gemini API request failed")

    def handle_analyze_crop(self):
        data = self.parse_request_json()
        if not data:
            self.send_json(400, {'success': False, 'mode': 'INVALID_REQUEST', 'message': 'Invalid JSON request body.'})
            return

        api_key = self.get_api_key(data)
        if not api_key:
            self.send_json(200, {
                'success': False,
                'mode': 'NO_API_KEY',
                'message': 'Please configure the GEMINI_API_KEY environment variable on the server, or enter your Google Gemini API Key in Settings (⚙️).'
            })
            return

        base64_data = data.get('base64Data', '')
        mime_type = data.get('mimeType', 'image/jpeg')
        model = data.get('model', DEFAULT_MODEL)

        if not base64_data:
            self.send_json(400, {'success': False, 'mode': 'INVALID_IMAGE', 'message': 'No image data provided.'})
            return

        # Clean base64 string
        if ',' in base64_data:
            base64_data = base64_data.split(',', 1)[1]
        base64_data = base64_data.strip()

        # Validate base64 length / format
        try:
            image_bytes = base64.b64decode(base64_data, validate=True)
            if len(image_bytes) < 100:
                self.send_json(400, {'success': False, 'mode': 'INVALID_IMAGE', 'message': 'Image file is too small or corrupt.'})
                return
            if len(image_bytes) > 10 * 1024 * 1024:
                self.send_json(400, {'success': False, 'mode': 'INVALID_IMAGE', 'message': 'Image exceeds maximum allowed size (10MB).'})
                return
        except Exception:
            self.send_json(400, {'success': False, 'mode': 'INVALID_IMAGE', 'message': 'Corrupted or unsupported image file format.'})
            return

        prompt_text = (
            "You are an expert agronomic visual diagnostician specializing in Indian agriculture (Punjab, Maharashtra, Indo-Gangetic Plain, Deccan).\n"
            "Analyze this crop/plant photograph carefully.\n\n"
            "Respond ONLY with a valid JSON object matching this exact schema:\n"
            "{\n"
            '  "likelyCrop": "Scientific and common name of the crop",\n'
            '  "possibleIssue": "Specific disease, insect pest, nutritional deficiency, or \'Healthy Plant\'",\n'
            '  "riskLevel": "Low" | "Moderate" | "High" | "Critical",\n'
            '  "confidenceScore": number between 40 and 99 representing confidence percentage,\n'
            '  "visibleSymptoms": "Detailed 2-3 sentence description of visual leaf/stem/fruit symptoms, chlorosis, lesions, spores, frass or webbing",\n'
            '  "suggestedActions": [\n'
            '    "Actionable agronomic recommendation 1 (cultural or biological)",\n'
            '    "Actionable agronomic recommendation 2 (chemical with dosage in Indian metric units e.g. ml/acre)",\n'
            '    "Actionable recommendation 3 (scouting/monitoring instruction)"\n'
            "  ],\n"
            '  "riskDriverForContext": "Concise 1-sentence reason to feed into the farm decision engine",\n'
            '  "disclaimer": "AI-assisted visual screening for decision support. Confirm diagnosis with local Krishi Vigyan Kendra (KVK) or State Agriculture Officers before chemical intervention."\n'
            "}\n"
            "Do NOT include markdown backticks around the JSON. Output only raw JSON."
        )

        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt_text},
                        {
                            "inline_data": {
                                "mime_type": mime_type,
                                "data": base64_data
                            }
                        }
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.2,
                "topP": 0.8
            }
        }

        try:
            resp_json, used_model = self.call_gemini_api(api_key, model, payload)
            candidates = resp_json.get('candidates', [])
            if not candidates:
                self.send_json(200, {
                    'success': False,
                    'mode': 'API_ERROR',
                    'message': 'Gemini API returned no analysis candidate for this image.'
                })
                return

            raw_text = candidates[0].get('content', {}).get('parts', [{}])[0].get('text', '')
            # Clean markdown JSON formatting if present
            clean_json = re.sub(r'^```(?:json)?\s*', '', raw_text.strip())
            clean_json = re.sub(r'\s*```$', '', clean_json.strip())

            parsed_data = json.loads(clean_json)

            # Ensure essential keys exist
            if not isinstance(parsed_data, dict) or 'likelyCrop' not in parsed_data:
                raise ValueError("Parsed JSON missing required schema fields.")

            self.send_json(200, {
                'success': True,
                'mode': 'LIVE_GEMINI_AI',
                'modelUsed': used_model,
                'data': parsed_data,
                'notice': f'Analyzed via Live Gemini Multimodal AI ({used_model}).'
            })
        except json.JSONDecodeError as je:
            print(f"[server] JSON decode error from Gemini: {je}")
            self.send_json(200, {
                'success': False,
                'mode': 'PARSE_ERROR',
                'message': 'AI analysis was received but could not be parsed as structured agronomic data. Please try another angle.'
            })
        except Exception as e:
            print(f"[server] Error analyzing crop: {e}")
            self.send_json(200, {
                'success': False,
                'mode': 'API_ERROR',
                'message': f'Gemini API error: {str(e)}'
            })

    def handle_assistant(self):
        data = self.parse_request_json()
        if not data:
            self.send_json(400, {'success': False, 'message': 'Invalid request body.'})
            return

        api_key = self.get_api_key(data)
        if not api_key:
            self.send_json(200, {
                'success': False,
                'mode': 'NO_API_KEY',
                'message': 'No Gemini API key available.'
            })
            return

        user_message = data.get('userMessage', '')
        system_prompt = data.get('systemPrompt', '')
        model = data.get('model', DEFAULT_MODEL)

        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": system_prompt},
                        {"text": f'Farmer Question: "{user_message}"'}
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.3,
                "maxOutputTokens": 600
            }
        }

        try:
            resp_json, used_model = self.call_gemini_api(api_key, model, payload)
            candidates = resp_json.get('candidates', [])
            text = candidates[0].get('content', {}).get('parts', [{}])[0].get('text', '') if candidates else ''
            self.send_json(200, {
                'success': True,
                'mode': 'LIVE_GEMINI_AI',
                'modelUsed': used_model,
                'answer': text.strip(),
                'notice': f'Answered via Live Gemini AI ({used_model}) with Farm Context.'
            })
        except Exception as e:
            self.send_json(200, {
                'success': False,
                'mode': 'API_ERROR',
                'message': str(e)
            })

    def handle_test_key(self):
        data = self.parse_request_json() or {}
        api_key = self.get_api_key(data)
        if not api_key:
            self.send_json(200, {'success': False, 'message': 'No API key provided.'})
            return

        model = data.get('model', DEFAULT_MODEL)
        payload = {
            "contents": [{"parts": [{"text": "Respond with exactly the single word: READY"}]}]
        }

        try:
            resp_json, used_model = self.call_gemini_api(api_key, model, payload)
            candidates = resp_json.get('candidates', [])
            text = candidates[0].get('content', {}).get('parts', [{}])[0].get('text', '').strip() if candidates else ''
            self.send_json(200, {
                'success': True,
                'message': 'Gemini API connected successfully!',
                'model': used_model,
                'responseText': text
            })
        except Exception as e:
            self.send_json(200, {
                'success': False,
                'message': str(e)
            })

def main():
    port = DEFAULT_PORT
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print(f"Invalid port: {sys.argv[1]}. Using default {DEFAULT_PORT}")

    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    handler = FarmWiseHTTPRequestHandler
    with socketserver.TCPServer(("", port), handler) as httpd:
        url = f"http://localhost:{port}/index.html"
        has_server_key = bool(os.environ.get('GEMINI_API_KEY', '').strip())
        print("=" * 60)
        print("FARMWISE - PRECISION AGRONOMIC DECISION SUPPORT MVP")
        print(f"Local Server Active at: {url}")
        print(f"Server Gemini Key: {'Configured (Environment)' if has_server_key else 'Not set (Provide via env or UI Settings)'}")
        print("Multilingual UI Supported: English, Punjabi, Hindi, Marathi")
        print("=" * 60)
        print("Press Ctrl+C to stop the server.")

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down FarmWise server.")

if __name__ == '__main__':
    main()
