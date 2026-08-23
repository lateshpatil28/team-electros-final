/**
 * @file voiceModal.js
 * Voice Input Listening & Structured Entity Review Modal Component
 * Displays live speech feedback, extracted farm parameters, undetected field notices, and farmer confirmation before applying.
 */

import { VoiceService } from '../services/voiceService.js';
import { farmStore } from '../state/farmContext.js';
import { i18n, t } from '../i18n/i18n.js';

let activeRecognitionSession = null;
let currentTranscribedText = '';
let currentExtractedEntities = null;
let onVoiceCompleteCallback = null;

export function initVoiceModal() {
  ensureVoiceModalMount();

  // Expose global trigger for opening voice modal
  window.openVoiceModal = (callback) => {
    onVoiceCompleteCallback = callback;
    openVoiceModal();
  };
}

function ensureVoiceModalMount() {
  if (document.getElementById('voice-modal-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'voice-modal-overlay';
  overlay.className = 'modal-overlay';
  overlay.style.display = 'none';

  overlay.innerHTML = `
    <div class="modal-card modal-card-wide">
      <div class="modal-header">
        <div class="flex-row gap-xs">
          <span class="modal-icon">🎤</span>
          <div>
            <h3 class="modal-title" id="vm-title">${t('voiceModal.title')}</h3>
            <p class="modal-subtitle" id="vm-subtitle">${t('voiceModal.subtitle')}</p>
          </div>
        </div>
        <button type="button" class="btn-close-modal" id="btn-close-voice-modal">✕</button>
      </div>

      <!-- Listening Pulse Wave -->
      <div class="voice-listening-center" id="voice-wave-container">
        <div class="mic-pulse-ring">
          <div class="pulse-wave"></div>
          <span class="mic-giant-icon">🎙️</span>
        </div>
        <p class="voice-listening-label" id="voice-status-label">${t('voiceModal.listeningText')}</p>
      </div>

      <!-- Live Transcribed Text Box -->
      <div class="transcription-box">
        <span class="transcription-label">Transcribed Speech:</span>
        <p class="transcription-content" id="voice-transcription-text">...</p>
      </div>

      <!-- Extracted Entities Review Panel -->
      <div class="extracted-review-box" id="extracted-entities-box" style="display: none;">
        <h4 class="review-box-title" id="vm-review-title">${t('voiceModal.reviewTitle')}</h4>
        <div class="entities-chips-grid" id="entities-chips-list"></div>
        <div class="undetected-fields-box" id="undetected-fields-list" style="margin-top: 10px; font-size: 0.85rem; color: var(--text-muted);"></div>
      </div>

      <!-- Actions -->
      <div class="modal-footer">
        <button type="button" class="btn-ghost-sm" id="btn-cancel-voice">${t('voiceModal.cancelBtn')}</button>
        <button type="button" class="btn-ghost-sm" id="btn-edit-in-form-voice" style="display: none;">${t('voiceModal.editBtn') || 'Edit in Form'}</button>
        <button type="button" class="btn-primary-sm" id="btn-confirm-voice" disabled>${t('voiceModal.confirmBtn')}</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Bind close & action events
  document.getElementById('btn-close-voice-modal')?.addEventListener('click', closeVoiceModal);
  document.getElementById('btn-cancel-voice')?.addEventListener('click', closeVoiceModal);
  document.getElementById('btn-edit-in-form-voice')?.addEventListener('click', () => {
    confirmAndApplyEntities();
    const formSec = document.getElementById('section-profile');
    if (formSec) {
      formSec.scrollIntoView({ behavior: 'smooth' });
    }
  });
  document.getElementById('btn-confirm-voice')?.addEventListener('click', confirmAndApplyEntities);
}

function openVoiceModal() {
  const overlay = document.getElementById('voice-modal-overlay');
  if (!overlay) return;

  currentTranscribedText = '';
  currentExtractedEntities = null;

  const textEl = document.getElementById('voice-transcription-text');
  const reviewBox = document.getElementById('extracted-entities-box');
  const confirmBtn = document.getElementById('btn-confirm-voice');
  const editBtn = document.getElementById('btn-edit-in-form-voice');
  const statusLabel = document.getElementById('voice-status-label');

  if (textEl) textEl.textContent = 'Listening... Speak your farm details in English, Punjabi, Hindi, or Marathi.';
  if (reviewBox) reviewBox.style.display = 'none';
  if (confirmBtn) confirmBtn.disabled = true;
  if (editBtn) editBtn.style.display = 'none';
  if (statusLabel) statusLabel.textContent = t('voiceModal.listeningText');

  overlay.style.display = 'flex';

  // Start Speech Recognition in currently active language
  const lang = i18n.getLanguage();
  activeRecognitionSession = VoiceService.startListening({
    languageCode: lang,
    onResult: (transcript, isFinal) => {
      currentTranscribedText = transcript;
      if (textEl) textEl.textContent = transcript;

      // Extract entities across all parameters
      const entities = VoiceService.extractEntities(transcript, lang);
      if (entities && Object.keys(entities).length > 0) {
        currentExtractedEntities = entities;
        renderExtractedEntities(entities);
        if (confirmBtn) confirmBtn.disabled = false;
        if (editBtn) editBtn.style.display = 'inline-block';
      }
    },
    onError: (err) => {
      if (statusLabel) statusLabel.textContent = err;
    },
    onEnd: () => {
      if (statusLabel) statusLabel.textContent = 'Listening complete.';
    }
  });
}

function renderExtractedEntities(entities) {
  const reviewBox = document.getElementById('extracted-entities-box');
  const chipsList = document.getElementById('entities-chips-list');
  const undetectedBox = document.getElementById('undetected-fields-list');
  if (!reviewBox || !chipsList) return;

  reviewBox.style.display = 'block';
  chipsList.innerHTML = '';

  const allSupportedFields = [
    { key: 'farmerName', label: 'Farmer Name', icon: '👨‍🌾', format: (v) => v },
    { key: 'state', label: 'State', icon: '📍', format: (v) => v },
    { key: 'district', label: 'District', icon: '🗺️', format: (v) => v },
    { key: 'farmSize', label: 'Farm Size', icon: '📏', format: (v) => `${v} Acres` },
    { key: 'crop', label: 'Crop', icon: '🌾', format: (v) => i18n.translateCrop(v) },
    { key: 'cropStage', label: 'Crop Stage', icon: '🌱', format: (v) => i18n.translateStage(v) },
    { key: 'waterAvailability', label: 'Water Availability', icon: '💧', format: (v) => v },
    { key: 'soilCondition', label: 'Soil Condition', icon: '🟤', format: (v) => v },
    { key: 'budget', label: 'Budget', icon: '💰', format: (v) => `₹${Number(v).toLocaleString('en-IN')}` }
  ];

  const detectedKeys = [];

  for (const field of allSupportedFields) {
    if (entities[field.key] !== undefined && entities[field.key] !== null) {
      detectedKeys.push(field.key);
      const valStr = field.format(entities[field.key]);
      chipsList.innerHTML += `
        <span class="entity-pill" style="background: rgba(16,185,129,0.12); border: 1px solid var(--border-emerald); padding: 4px 8px; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px;">
          ${field.icon} ${field.label}: <strong style="color: var(--emerald-400);">${valStr}</strong>
        </span>
      `;
    }
  }

  // Identify undetected fields
  const missingFields = allSupportedFields.filter(f => !detectedKeys.includes(f.key));
  if (undetectedBox) {
    if (missingFields.length > 0) {
      const missingLabels = missingFields.map(f => f.label).join(', ');
      undetectedBox.innerHTML = `
        <p style="margin: 6px 0 0; color: #94a3b8; font-size: 0.82rem;">
          ℹ️ <em>${t('voiceModal.undetectedTitle') || 'These details were not detected:'}</em> <span style="color: #cbd5e1;">${missingLabels}</span>
        </p>
      `;
    } else {
      undetectedBox.innerHTML = '';
    }
  }
}

function confirmAndApplyEntities() {
  if (currentExtractedEntities) {
    // 1. Update centralized context store
    farmStore.updateFarmer(currentExtractedEntities);

    // 2. Directly sync form inputs on DOM
    populateFormInputs(currentExtractedEntities);

    showVoiceToast(t('voiceModal.appliedToast') || 'Applied spoken farm details to Farm Profile!');
  }

  if (onVoiceCompleteCallback && currentTranscribedText) {
    onVoiceCompleteCallback(currentTranscribedText);
  }

  closeVoiceModal();
}

function populateFormInputs(entities) {
  if (!entities) return;

  if (entities.farmerName) {
    const el = document.getElementById('field-name');
    if (el) el.value = entities.farmerName;
  }
  if (entities.state) {
    const el = document.getElementById('field-state');
    if (el) {
      el.value = entities.state;
      el.dispatchEvent(new Event('change'));
    }
  }
  if (entities.district) {
    const el = document.getElementById('field-district');
    if (el) el.value = entities.district;
  }
  if (entities.crop) {
    const el = document.getElementById('field-crop');
    if (el) el.value = entities.crop;
  }
  if (entities.cropStage) {
    const el = document.getElementById('field-stage');
    if (el) el.value = entities.cropStage;
  }
  if (entities.farmSize) {
    const el = document.getElementById('field-size');
    if (el) el.value = entities.farmSize;
  }
  if (entities.budget) {
    const el = document.getElementById('field-budget');
    if (el) el.value = entities.budget;
  }
  if (entities.waterAvailability) {
    const el = document.getElementById('field-water');
    if (el) el.value = entities.waterAvailability;
  }
  if (entities.soilCondition) {
    const el = document.getElementById('field-soil');
    if (el) el.value = entities.soilCondition;
  }
}

function closeVoiceModal() {
  const overlay = document.getElementById('voice-modal-overlay');
  if (overlay) overlay.style.display = 'none';

  if (activeRecognitionSession) {
    activeRecognitionSession.stop();
    activeRecognitionSession = null;
  }
}

function showVoiceToast(msg) {
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
  }, 2800);
}

