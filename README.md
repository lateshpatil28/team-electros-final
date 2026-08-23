# 🌱 FarmWise — Complete Working MVP (Phase 1 + Phase 2)

**FarmWise** is a farmer-first AI agronomic decision-support system specifically designed for Indian and Punjabi agriculture (originating from the Government of Punjab problem statement). It delivers a **genuinely working prototype** that calculates stage-specific agronomic recommendations, evaluates feasibility constraints, performs multimodal crop disease analysis via Google Gemini AI, provides voice recognition and text-to-speech in regional languages, and runs interactive What-If climate simulations.

---

## 🚀 Key Features

1. **Deterministic Agronomic Decision Engine**:
   - Evaluates input costs, water demands (mm), residual risk, and feasibility.
   - Generates 3 candidate strategies (*High-Yield Commercial, Balanced Integrated, Low-Cost Resilient*).
   - Generates dynamic **"WHY THIS PLAN?"** rationale based on active field constraints.
2. **Interactive Real-Time What-If Simulator**:
   - Live sliders for Budget, Water Availability, Rainfall Probability, Soil Moisture, and Pest Threats.
   - Re-evaluates recommendations in real-time with side-by-side comparison and delta badges.
3. **Multimodal AI Crop Disease Scanner (`Crop Scan`)**:
   - Real photo upload & drag-and-drop powered by Google Gemini multimodal AI (`gemini-2.5-flash`).
   - Structured diagnosis: Likely Crop, Pathogen/Issue, Confidence Score, Symptoms, and Action Items.
   - **Context Sync Button**: Immediately syncs diagnosed risk to the Farm Context -> recalculating recommendations in real time.
   - Built-in verified sample dataset (*Wheat Stripe Rust, Cotton Pink Bollworm, Rice Blast, Healthy Wheat*).
4. **Voice Input (STT) & Speech Synthesis (TTS)**:
   - Web Speech Recognition supporting **Punjabi (`pa-IN`)**, **Hindi (`hi-IN`)**, **Marathi (`mr-IN`)**, and **English (`en-IN`)**.
   - Natural language entity parser extracts budget, farm size, crop, state, and water availability.
   - Audio read-aloud (TTS) for knowledge library guides and assistant responses.
5. **Context-Aware AI Farm Assistant**:
   - Chatbot with real-time access to the active Farm Context, weather, and recommended plan.
   - Uses live Gemini AI or deterministic agronomic expert engine fallback.
6. **Regional Crop Explorer & Knowledge Library**:
   - Comprehensive crop database for **Punjab** (*Wheat, Rice, Cotton, Maize, Mustard, Potato*) and **Maharashtra** (*Cotton, Soybean, Sugarcane, Wheat, Gram, Onion*).
   - "Load into Farm Profile" button to switch crops immediately.
7. **Agro-Weather & IoT Farm Monitor**:
   - Live weather via **Open-Meteo API** + Simulation mode toggle.
   - Hardware sensor emulator for soil moisture, temperature, and borewell water levels.
   - **ESP32 & LoRaWAN Blueprint Tab**: Hardware telemetry schema and MQTT JSON payload specs.
8. **100% Multilingual Localization**:
   - Complete native UI translation across **English, Punjabi (ਪੰਜਾਬੀ - Gurmukhi), Hindi (हिन्दी), and Marathi (मराठी)**.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: Vanilla HTML5, CSS3 (Light outdoor-readable design system), Modern Modular JavaScript (ES Modules).
- **Backend / Dev Server**: Zero-dependency Python HTTP server (`server.py`).
- **AI / Multimodal**: Google Gemini API (`gemini-2.5-flash` / `gemini-1.5-flash`).
- **Weather API**: Open-Meteo Weather API.
- **Audio & Voice**: Web Speech API (`SpeechRecognition` & `SpeechSynthesis`).

---

## 💻 How to Run Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/FarmWise.git
   cd FarmWise
   ```

2. **Start the local server**:
   ```bash
   python server.py 8000
   ```

3. **Open in your browser**:
   Visit **`http://localhost:8000/index.html`**

---

## 🧪 Running Automated Tests

```bash
# Run Phase 1 Decision Engine tests
python tests/run_tests.py

# Run Multilingual translation coverage tests
python tests/test_i18n.py

# Run Phase 2 feature and integration tests
python tests/test_phase2.py

# Run End-to-End scenario verification
python tests/test_e2e_verification.py
```

---

## 🔒 API Key & Security Notice

- All Google Gemini API keys are configured client-side via the **Settings (⚙️)** modal and stored only in the user's browser `localStorage`.
- No API keys are ever hardcoded or committed to version control.
