/**
 * @file cropScanView.js
 * Multimodal AI Crop Disease Scanner UI Component
 * Integrates image upload, drag & drop, sample test buttons, Gemini multimodal diagnosis, and Farm Context sync.
 */

import { GeminiService, SAMPLE_CROP_ANALYSES } from '../services/geminiService.js';
import { farmStore } from '../state/farmContext.js';
import { i18n, t } from '../i18n/i18n.js';

let activeAnalysisResult = null;
let activeImageBase64 = null;

export function initCropScanView() {
  const container = document.getElementById('crop-scan-container');
  if (!container) return;

  renderCropScanUI();
  bindCropScanEvents();

  i18n.subscribe(() => {
    renderCropScanUI();
    bindCropScanEvents();
    if (activeAnalysisResult) {
      renderAnalysisResult(activeAnalysisResult);
    }
  });
}

function renderCropScanUI() {
  const container = document.getElementById('crop-scan-container');
  if (!container) return;

  const hasApiKey = !!GeminiService.getApiKey();

  container.innerHTML = `
    <div class="crop-scan-card">
      <div class="form-header">
        <span class="form-icon">📷</span>
        <div>
          <h2 class="form-title">${t('cropScan.title')}</h2>
          <p class="form-subtitle">${t('cropScan.subtitle')}</p>
        </div>
      </div>

      ${!hasApiKey ? `
        <div class="api-notice-box">
          <span class="notice-icon">ℹ️</span>
          <div class="notice-content">
            <p>${t('cropScan.missingKeyNotice')}</p>
            <button type="button" class="btn-notice-action" id="btn-open-settings-scan">${t('cropScan.setupKeyBtn')}</button>
          </div>
        </div>
      ` : ''}

      <!-- Upload Zone & Sample Picker -->
      <div class="scan-input-layout">
        <!-- Drag and drop zone -->
        <div class="drop-zone" id="scan-drop-zone">
          <input type="file" id="scan-file-input" accept="image/*" class="file-input-hidden">
          <div class="drop-zone-content" id="drop-zone-content">
            <span class="drop-zone-icon">📸</span>
            <p class="drop-zone-text">${t('cropScan.dragPrompt')}</p>
            <button type="button" class="btn-file-select" id="btn-trigger-file-select">${t('cropScan.chooseFileBtn')}</button>
          </div>
          <!-- Image preview container -->
          <div class="image-preview-wrapper" id="image-preview-wrapper" style="display: none;">
            <img id="scan-image-preview" src="" alt="Crop Preview" class="preview-img">
            <button type="button" class="btn-remove-img" id="btn-remove-img" title="Remove image">✕</button>
          </div>
        </div>

        <!-- Built-in verified sample images picker -->
        <div class="sample-picker-panel">
          <span class="sample-picker-title">${t('cropScan.sampleBtn')}</span>
          <div class="sample-buttons-list">
            <button type="button" class="btn-sample-crop" data-sample="wheat_rust">
              <span class="s-icon">🌾</span>
              <span>${t('cropScan.sampleWheat')}</span>
            </button>
            <button type="button" class="btn-sample-crop" data-sample="cotton_bollworm">
              <span class="s-icon">🐛</span>
              <span>${t('cropScan.sampleCotton')}</span>
            </button>
            <button type="button" class="btn-sample-crop" data-sample="rice_blast">
              <span class="s-icon">🌾</span>
              <span>${t('cropScan.sampleRice')}</span>
            </button>
            <button type="button" class="btn-sample-crop" data-sample="healthy_crop">
              <span class="s-icon">🌱</span>
              <span>${t('cropScan.sampleHealthy')}</span>
            </button>
          </div>

          <!-- Analyze Action Button -->
          <button type="button" class="btn-run-analysis" id="btn-run-analysis" disabled>
            ${t('cropScan.analyzeBtn')}
          </button>
        </div>
      </div>

      <!-- Analysis Status / Loader -->
      <div id="scan-loading-indicator" class="scan-loading" style="display: none;">
        <div class="spinner"></div>
        <p>${t('cropScan.analyzing')}</p>
      </div>

      <!-- Analysis Results Container -->
      <div id="scan-results-container" class="scan-results-wrapper">
        <!-- Rendered dynamically -->
      </div>
    </div>
  `;
}

function bindCropScanEvents() {
  const dropZone = document.getElementById('scan-drop-zone');
  const fileInput = document.getElementById('scan-file-input');
  const triggerBtn = document.getElementById('btn-trigger-file-select');
  const removeImgBtn = document.getElementById('btn-remove-img');
  const analyzeBtn = document.getElementById('btn-run-analysis');
  const sampleBtns = document.querySelectorAll('.btn-sample-crop');
  const openSettingsBtn = document.getElementById('btn-open-settings-scan');

  openSettingsBtn?.addEventListener('click', () => {
    window.openSettingsModal?.();
  });

  triggerBtn?.addEventListener('click', () => {
    fileInput?.click();
  });

  fileInput?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelected(file);
    }
  });

  // Drag and drop handlers
  dropZone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });

  dropZone?.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
  });

  dropZone?.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelected(file);
    }
  });

  removeImgBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    clearSelectedImage();
  });

  sampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sampleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const sampleKey = btn.getAttribute('data-sample');
      loadSampleImage(sampleKey);
    });
  });

  analyzeBtn?.addEventListener('click', () => {
    executeAnalysis();
  });
}

function handleFileSelected(file) {
  if (!file) return;

  // Validate format
  const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/heic', 'image/gif'];
  if (!file.type.startsWith('image/') && !validMimes.includes(file.type.toLowerCase())) {
    showScanToast(t('cropScan.invalidFormatError', {}, 'Please select a valid image file (JPEG, PNG, WEBP).'));
    return;
  }

  // Validate size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    showScanToast(t('cropScan.fileTooLargeError', {}, 'Image size must be less than 10MB.'));
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    activeImageBase64 = e.target.result;
    displayImagePreview(activeImageBase64);
    
    // Clear sample button highlights
    document.querySelectorAll('.btn-sample-crop').forEach(b => b.classList.remove('active'));
    
    const analyzeBtn = document.getElementById('btn-run-analysis');
    if (analyzeBtn) {
      analyzeBtn.disabled = false;
      analyzeBtn.removeAttribute('data-sample-fallback');
    }
  };
  reader.onerror = () => {
    showScanToast('Failed to read selected image file.');
  };
  reader.readAsDataURL(file);
}

function loadSampleImage(sampleKey) {
  const sample = SAMPLE_CROP_ANALYSES[sampleKey];
  if (!sample) return;

  activeImageBase64 = sample.imageUrl;
  displayImagePreview(activeImageBase64);

  const analyzeBtn = document.getElementById('btn-run-analysis');
  if (analyzeBtn) {
    analyzeBtn.disabled = false;
    analyzeBtn.setAttribute('data-sample-fallback', sampleKey);
  }
}

function displayImagePreview(src) {
  const dropContent = document.getElementById('drop-zone-content');
  const previewWrapper = document.getElementById('image-preview-wrapper');
  const previewImg = document.getElementById('scan-image-preview');

  if (dropContent) dropContent.style.display = 'none';
  if (previewWrapper) previewWrapper.style.display = 'block';
  if (previewImg) previewImg.src = src;
}

function clearSelectedImage() {
  activeImageBase64 = null;
  activeAnalysisResult = null;

  const dropContent = document.getElementById('drop-zone-content');
  const previewWrapper = document.getElementById('image-preview-wrapper');
  const previewImg = document.getElementById('scan-image-preview');
  const fileInput = document.getElementById('scan-file-input');
  const analyzeBtn = document.getElementById('btn-run-analysis');
  const resultsContainer = document.getElementById('scan-results-container');

  if (dropContent) dropContent.style.display = 'flex';
  if (previewWrapper) previewWrapper.style.display = 'none';
  if (previewImg) previewImg.src = '';
  if (fileInput) fileInput.value = '';
  if (analyzeBtn) {
    analyzeBtn.disabled = true;
    analyzeBtn.removeAttribute('data-sample-fallback');
  }
  if (resultsContainer) resultsContainer.innerHTML = '';
  document.querySelectorAll('.btn-sample-crop').forEach(b => b.classList.remove('active'));
}

async function executeAnalysis() {
  if (!activeImageBase64) return;

  const loading = document.getElementById('scan-loading-indicator');
  const analyzeBtn = document.getElementById('btn-run-analysis');
  const resultsContainer = document.getElementById('scan-results-container');

  if (loading) loading.style.display = 'flex';
  if (analyzeBtn) analyzeBtn.disabled = true;
  if (resultsContainer) resultsContainer.innerHTML = '';

  const sampleFallbackKey = analyzeBtn?.getAttribute('data-sample-fallback');

  try {
    const response = await GeminiService.analyzeCropImage({
      base64Data: activeImageBase64,
      mimeType: 'image/jpeg',
      language: i18n.getLanguage(),
      sampleFallbackKey
    });

    if (loading) loading.style.display = 'none';
    if (analyzeBtn) analyzeBtn.disabled = false;

    if (response.success && response.data) {
      activeAnalysisResult = response;
      renderAnalysisResult(response);
    } else {
      if (resultsContainer) {
        resultsContainer.innerHTML = `
          <div class="infeasible-alert-box" style="margin-top: 1rem;">
            <div class="infeasible-alert-header">
              <span>⚠️</span>
              <strong>Analysis Notice</strong>
            </div>
            <p style="margin-top: 0.5rem; font-size: 0.9rem;">${escapeHtml(response.message || 'Could not complete scan.')}</p>
          </div>
        `;
      }
    }
  } catch (err) {
    if (loading) loading.style.display = 'none';
    if (analyzeBtn) analyzeBtn.disabled = false;
    if (resultsContainer) {
      resultsContainer.innerHTML = `
        <div class="infeasible-alert-box" style="margin-top: 1rem;">
          <p>We could not complete the image analysis right now. Please try again.</p>
        </div>
      `;
    }
  }
}

function renderAnalysisResult(response) {
  const container = document.getElementById('scan-results-container');
  if (!container || !response || !response.data) return;

  const data = response.data;
  const isSample = response.mode === 'SAMPLE_OFFLINE_VERIFIED';
  const riskClass = {
    Low: 'badge-emerald',
    Moderate: 'badge-amber',
    High: 'badge-rose',
    Critical: 'badge-danger-glow'
  }[data.riskLevel] || 'badge-amber';

  container.innerHTML = `
    <div class="analysis-result-card">
      <!-- Result Top Header -->
      <div class="analysis-header">
        <div>
          <div class="flex-row gap-sm">
            <span class="badge ${isSample ? 'badge-teal' : 'badge-blue'}">
              ${isSample ? 'Verified Knowledge Base' : 'Live Gemini 2.5 Flash AI'}
            </span>
            <span class="badge ${riskClass}">
              ${t('cropScan.riskLevel')} ${i18n.translateRisk(data.riskLevel)}
            </span>
          </div>
          <h3 class="analysis-title">${escapeHtml(data.possibleIssue)}</h3>
          <span class="analysis-crop-meta">${t('cropScan.likelyCrop')} <strong>${escapeHtml(data.likelyCrop)}</strong></span>
        </div>
        <div class="confidence-box">
          <span class="conf-val">${data.confidenceScore}%</span>
          <span class="conf-lbl">${t('cropScan.confidence')}</span>
        </div>
      </div>

      <!-- Visible Symptoms -->
      <div class="analysis-section">
        <h4 class="a-section-title">${t('cropScan.symptoms')}</h4>
        <p class="a-section-text">${escapeHtml(data.visibleSymptoms)}</p>
      </div>

      <!-- Suggested Actions -->
      <div class="analysis-section">
        <h4 class="a-section-title">${t('cropScan.actionsTitle')}</h4>
        <ul class="a-actions-list">
          ${(data.suggestedActions || []).map(action => `
            <li><span class="bullet">✓</span> ${escapeHtml(action)}</li>
          `).join('')}
        </ul>
      </div>

      <!-- Disclaimer Box -->
      <div class="analysis-disclaimer-box">
        <span class="disc-icon">⚠️</span>
        <p class="disc-text">${escapeHtml(data.disclaimer || t('cropScan.disclaimer'))}</p>
      </div>

      <!-- Sync to Farm Context Action Button -->
      <div class="analysis-footer-actions">
        <button type="button" class="btn-apply-to-context" id="btn-sync-scan-to-context">
          ${t('cropScan.applyToContextBtn')}
        </button>
      </div>
    </div>
  `;

  // Bind the Sync button
  const syncBtn = document.getElementById('btn-sync-scan-to-context');
  syncBtn?.addEventListener('click', () => {
    farmStore.updateRisk(data.riskLevel, data.riskDriverForContext || data.possibleIssue);
    showScanToast(t('cropScan.appliedToContextToast'));

    // Smooth scroll to recommendation view to see the updated plan!
    window.scrollToSection?.('section-recommendation');
  });
}

function showScanToast(msg) {
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

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
