#!/usr/bin/env python3
"""
FarmWise Multi-Page Navigation & Shared State Test Suite
Validates:
1. Existence and integrity of all 7 HTML pages
2. Shared Navigation Header & Slide-out Drawer consistency across all pages
3. Active page navigation indicator correctness
4. CSS stylesheets and JavaScript module script tags
5. State persistence & localStorage hydration in farmContext.js
"""

import os
import sys
import re

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT_DIR)

REQUIRED_PAGES = [
    ('index.html', 'home', ['section-regional', 'section-library', 'home-hero-card', 'home-status-strip']),
    ('profile.html', 'profile', ['section-profile', 'farm-profile-container', 'farm-context-summary']),
    ('advisory.html', 'advisory', ['section-recommendation', 'section-alternatives', 'section-whatif']),
    ('crop-scan.html', 'crop-scan', ['section-cropscan', 'crop-scan-container']),
    ('assistant.html', 'assistant', ['section-assistant', 'ai-assistant-container', 'section-library']),
    ('weather.html', 'weather', ['section-weather', 'weather-container']),
    ('iot.html', 'iot', ['section-iot', 'iot-monitor-container'])
]

ALL_PAGE_HREFS = [
    'index.html', 'profile.html', 'advisory.html', 'crop-scan.html',
    'assistant.html', 'weather.html', 'iot.html'
]

def test_page_existence_and_mounts():
    print("\n--- TEST 1: ALL 7 HTML PAGES EXISTENCE & CONTAINER MOUNTS ---")
    for filename, page_id, required_dom_ids in REQUIRED_PAGES:
        filepath = os.path.join(ROOT_DIR, filename)
        assert os.path.exists(filepath), f"Missing page: {filename}"
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        for dom_id in required_dom_ids:
            assert dom_id in content, f"Page {filename} is missing required DOM element #{dom_id}"

        print(f"[PASS] {filename} (Page ID: '{page_id}') verified with all DOM containers: {required_dom_ids}")

def test_navigation_consistency():
    print("\n--- TEST 2: NAVIGATION SYSTEM CONSISTENCY ACROSS ALL 7 PAGES ---")
    for filename, page_id, _ in REQUIRED_PAGES:
        filepath = os.path.join(ROOT_DIR, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check App Header elements
        assert 'class="app-header"' in content, f"Missing .app-header in {filename}"
        assert 'class="header-nav"' in content, f"Missing .header-nav in {filename}"
        assert 'id="lang-selector-group"' in content, f"Missing #lang-selector-group in {filename}"
        assert 'id="btn-nav-menu"' in content, f"Missing #btn-nav-menu in {filename}"
        assert 'id="btn-open-settings-header"' in content, f"Missing #btn-open-settings-header in {filename}"

        # Check Navigation Drawer
        assert 'id="nav-drawer"' in content, f"Missing #nav-drawer in {filename}"
        assert 'id="nav-drawer-backdrop"' in content, f"Missing #nav-drawer-backdrop in {filename}"
        assert 'id="btn-close-nav-drawer"' in content, f"Missing #btn-close-nav-drawer in {filename}"

        # Check all 7 href targets are present in each page's navigation
        for target_href in ALL_PAGE_HREFS:
            assert f'href="{target_href}"' in content, f"Link to {target_href} missing in {filename}"

        print(f"[PASS] {filename} contains complete header, drawer, and valid links to all 7 pages.")

def test_active_navigation_state():
    print("\n--- TEST 3: ACTIVE NAVIGATION INDICATION ---")
    for filename, page_id, _ in REQUIRED_PAGES:
        filepath = os.path.join(ROOT_DIR, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Verify page data-page attribute on body
        assert f'data-page="{page_id}"' in content, f"Body missing data-page='{page_id}' in {filename}"

        # Verify active class on corresponding header nav link or drawer item in HTML
        assert f'href="{filename}" class="header-nav-link active"' in content or f'href="{filename}" class="drawer-nav-item active"' in content, f"Active nav class missing for {filename}"

        print(f"[PASS] {filename} correctly designates active navigation state for '{page_id}'.")

def test_css_and_js_bootstrapping():
    print("\n--- TEST 4: CSS AND JS BOOTSTRAPPING ACROSS ALL PAGES ---")
    for filename, _, _ in REQUIRED_PAGES:
        filepath = os.path.join(ROOT_DIR, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        assert 'css/design-system.css' in content, f"Missing design-system.css in {filename}"
        assert 'css/components.css' in content, f"Missing components.css in {filename}"
        assert 'css/responsive.css' in content, f"Missing responsive.css in {filename}"
        assert 'type="module" src="js/app.js"' in content, f"Missing js/app.js bootstrap in {filename}"

        print(f"[PASS] {filename} imports all stylesheets and js/app.js.")

def test_shared_state_persistence():
    print("\n--- TEST 5: SHARED STATE LOCALSTORAGE PERSISTENCE IN FARMCONTEXT.JS ---")
    fc_path = os.path.join(ROOT_DIR, 'js', 'state', 'farmContext.js')
    with open(fc_path, 'r', encoding='utf-8') as f:
        fc_code = f.read()

    assert "STORAGE_CONTEXT_KEY = 'farmwise_farm_context'" in fc_code, "STORAGE_CONTEXT_KEY missing in farmContext.js"
    assert "STORAGE_WHATIF_KEY = 'farmwise_whatif_scenario'" in fc_code, "STORAGE_WHATIF_KEY missing in farmContext.js"
    assert "loadSavedContext()" in fc_code, "loadSavedContext() missing in farmContext.js"
    assert "saveToStorage()" in fc_code, "saveToStorage() missing in farmContext.js"
    assert "localStorage.setItem" in fc_code, "localStorage.setItem missing in farmContext.js"
    assert "localStorage.getItem" in fc_code, "localStorage.getItem missing in farmContext.js"
    assert "window.addEventListener('storage'" in fc_code, "storage event listener missing in farmContext.js"

    print("[PASS] farmContext.js includes automatic localStorage state hydration and multi-page sync.")

def main():
    print("=" * 65)
    print("FARMWISE MULTI-PAGE APPLICATION VALIDATION")
    print("=" * 65)

    try:
        test_page_existence_and_mounts()
        test_navigation_consistency()
        test_active_navigation_state()
        test_css_and_js_bootstrapping()
        test_shared_state_persistence()
        print("\n" + "=" * 65)
        print("ALL MULTI-PAGE TESTS PASSED WITH 100% SUCCESS!")
        print("=" * 65)
        return 0
    except AssertionError as e:
        print(f"\n[FAIL]: {e}")
        return 1

if __name__ == '__main__':
    sys.exit(main())
