/**
 * @file settingsModal.js
 * Application Settings & Google Gemini API Key Management Modal
 * Securely stores API keys in localStorage; enables live testing of multimodal models.
 */

import { GeminiService } from '../services/geminiService.js';
import { i18n, t } from '../i18n/i18n.js';

export function initSettingsModal() {
  ensureSettingsModalMount();

  window.openSettingsModal = () => {
    openSettingsModal();
  };
}

function ensureSettingsModalMount() {
  if (document.getElementById('settings-modal-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'settings-modal-overlay';
  overlay.className = 'modal-overlay';
  overlay.style.display = 'none';

  overlay.innerHTML = `
    <div class="modal-card">
      <div class="modal-header">
        <div class="flex-row gap-xs">
          <span class="modal-icon">⚙️</span>
          <div>
            <h3 class="modal-title">${t('settings.title')}</h3>
            <p class="modal-subtitle">${t('settings.subtitle')}</p>
          </div>
        </div>
        <button type="button" class="btn-close-modal" id="btn-close-settings-modal">✕</button>
      </div>

      <div class="modal-body-content">
        <!-- API Key Input Field -->
        <div class="field-group">
          <label class="field-label" for="settings-gemini-key">${t('settings.apiKeyLabel')}</label>
          <div class="key-input-wrapper">
            <input type="password" id="settings-gemini-key" class="field-input" placeholder="${t('settings.apiKeyPlaceholder')}">
            <button type="button" class="btn-toggle-reveal" id="btn-toggle-key-reveal">👁️</button>
          </div>
        </div>

        <!-- Model Selection Dropdown -->
        <div class="field-group">
          <label class="field-label" for="settings-model-select">${t('settings.modelLabel')}</label>
          <select id="settings-model-select" class="field-select">
            <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended - Multimodal & Fast)</option>
            <option value="gemini-1.5-flash">Gemini 1.5 Flash (Standard Multimodal)</option>
            <option value="gemini-2.5-pro">Gemini 2.5 Pro (High Agronomic Precision)</option>
          </select>
        </div>

        <!-- Connection Test Feedback -->
        <div id="settings-test-status" class="settings-test-box" style="display: none;"></div>

        <!-- Security Notice -->
        <div class="settings-security-note">
          <span class="sec-icon">🔒</span>
          <p>${t('settings.noteSecurity')}</p>
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="modal-footer">
        <button type="button" class="btn-ghost-sm" id="btn-clear-key">${t('settings.clearBtn')}</button>
        <button type="button" class="btn-secondary-sm" id="btn-test-key">${t('settings.testBtn')}</button>
        <button type="button" class="btn-primary-sm" id="btn-save-settings">${t('settings.saveBtn')}</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  bindSettingsEvents();
}

function openSettingsModal() {
  const overlay = document.getElementById('settings-modal-overlay');
  if (!overlay) return;

  const keyInput = document.getElementById('settings-gemini-key');
  const modelSelect = document.getElementById('settings-model-select');
  const testBox = document.getElementById('settings-test-status');

  if (keyInput) keyInput.value = GeminiService.getApiKey();
  if (modelSelect) modelSelect.value = GeminiService.getModel();
  if (testBox) testBox.style.display = 'none';

  overlay.style.display = 'flex';
}

function bindSettingsEvents() {
  const overlay = document.getElementById('settings-modal-overlay');
  const closeBtn = document.getElementById('btn-close-settings-modal');
  const saveBtn = document.getElementById('btn-save-settings');
  const testBtn = document.getElementById('btn-test-key');
  const clearBtn = document.getElementById('btn-clear-key');
  const revealBtn = document.getElementById('btn-toggle-key-reveal');
  const keyInput = document.getElementById('settings-gemini-key');
  const modelSelect = document.getElementById('settings-model-select');
  const testBox = document.getElementById('settings-test-status');

  closeBtn?.addEventListener('click', () => {
    if (overlay) overlay.style.display = 'none';
  });

  revealBtn?.addEventListener('click', () => {
    if (keyInput) {
      keyInput.type = keyInput.type === 'password' ? 'text' : 'password';
    }
  });

  clearBtn?.addEventListener('click', () => {
    GeminiService.setApiKey('');
    if (keyInput) keyInput.value = '';
    if (testBox) {
      testBox.style.display = 'block';
      testBox.className = 'settings-test-box test-info';
      testBox.textContent = 'Cleared Gemini API key.';
    }
  });

  saveBtn?.addEventListener('click', () => {
    const key = keyInput?.value || '';
    const model = modelSelect?.value || 'gemini-2.5-flash';

    GeminiService.setApiKey(key);
    GeminiService.setModel(model);

    showSettingsToast(t('settings.savedToast'));
    if (overlay) overlay.style.display = 'none';
  });

  testBtn?.addEventListener('click', async () => {
    const key = keyInput?.value || '';
    if (!key) {
      if (testBox) {
        testBox.style.display = 'block';
        testBox.className = 'settings-test-box test-err';
        testBox.textContent = 'Please enter an API key first.';
      }
      return;
    }

    if (testBox) {
      testBox.style.display = 'block';
      testBox.className = 'settings-test-box test-loading';
      testBox.textContent = 'Testing connection to Gemini API...';
    }

    const res = await GeminiService.testApiKey(key);
    if (testBox) {
      testBox.style.display = 'block';
      if (res.success) {
        testBox.className = 'settings-test-box test-ok';
        testBox.textContent = `✓ ${res.message} (Model: ${res.model})`;
      } else {
        testBox.className = 'settings-test-box test-err';
        testBox.textContent = `✕ Connection Failed: ${res.message}`;
      }
    }
  });
}

function showSettingsToast(msg) {
  let toast = document.getElementById('farmwise-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'farmwise-toast';
    toast.className = 'farmwise-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}
