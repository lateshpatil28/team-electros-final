/**
 * @file demoControls.js
 * Multilingual Demo Mode, Regional Presets & Quick Test Scenarios Controller
 */

import { DEMO_PRESETS } from '../data/presetsData.js';
import { farmStore } from '../state/farmContext.js';
import { i18n, t } from '../i18n/i18n.js';

export function initDemoControls() {
  const container = document.getElementById('demo-controls-bar');
  if (!container) return;

  renderDemoControls();
  bindDemoEvents();

  i18n.subscribe(() => {
    renderDemoControls();
    bindDemoEvents();
  });
}

function renderDemoControls() {
  const container = document.getElementById('demo-controls-bar');
  if (!container) return;

  container.innerHTML = `
    <div class="demo-bar-wrapper">
      <div class="demo-presets-group">
        <span class="demo-label">${t('demo.label')}</span>
        <select id="demo-preset-select" class="demo-select">
          ${DEMO_PRESETS.map(p => `
            <option value="${p.id}">${escapeHtml(t('presets.' + p.id, {}, p.title))}</option>
          `).join('')}
        </select>
        <button id="btn-load-preset" class="btn-demo-load">${t('demo.loadBtn')}</button>
      </div>

      <div class="demo-quick-tests">
        <span class="demo-label">${t('demo.quickTests')}</span>
        <button class="btn-test-pill" data-test="testA" title="${t('demo.testA')}">${t('demo.testA')}</button>
        <button class="btn-test-pill" data-test="testB" title="${t('demo.testB')}">${t('demo.testB')}</button>
        <button class="btn-test-pill" data-test="testC" title="${t('demo.testC')}">${t('demo.testC')}</button>
        <button class="btn-test-pill" data-test="testD" title="${t('demo.testD')}">${t('demo.testD')}</button>
        <button class="btn-test-pill" data-test="testE" title="${t('demo.testE')}">${t('demo.testE')}</button>
      </div>

      <div class="demo-reset-group">
        <button id="btn-reset-demo" class="btn-reset-app" title="${t('demo.resetBtn')}">${t('demo.resetBtn')}</button>
      </div>
    </div>
  `;
}

function bindDemoEvents() {
  const container = document.getElementById('demo-controls-bar');
  if (!container) return;

  const presetSelect = document.getElementById('demo-preset-select');
  const loadBtn = document.getElementById('btn-load-preset');
  const resetBtn = document.getElementById('btn-reset-demo');

  const executeLoadPreset = (selectedId) => {
    const preset = DEMO_PRESETS.find(p => p.id === selectedId);
    if (preset) {
      // Sync preferred language from preset if valid
      if (preset.data.preferredLanguage) {
        i18n.setLanguage(preset.data.preferredLanguage);
      }
      farmStore.loadPreset(selectedId);
      const presetName = t('presets.' + preset.id, {}, preset.title);
      showToast(t('demo.toastLoaded', { name: presetName }));
    }
  };

  loadBtn?.addEventListener('click', () => {
    executeLoadPreset(presetSelect.value);
  });

  presetSelect?.addEventListener('change', () => {
    executeLoadPreset(presetSelect.value);
  });

  resetBtn?.addEventListener('click', () => {
    farmStore.resetToDefault();
    showToast(t('demo.toastReset'));
  });

  // Bind Quick Test buttons
  const testButtons = container.querySelectorAll('.btn-test-pill');
  testButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const testKey = btn.getAttribute('data-test');
      runQuickTest(testKey);
    });
  });
}

function runQuickTest(testKey) {
  switch (testKey) {
    case 'testA':
      farmStore.setFullContext({
        farmer: {
          farmerName: 'Baldev Singh',
          state: 'Punjab',
          district: 'Ludhiana',
          preferredLanguage: 'pa',
          crop: 'Wheat',
          cropStage: 'Vegetative / Tillering',
          farmSize: 5.0,
          budget: 80000,
          waterAvailability: 'High',
          soilCondition: 'Alluvial',
          soilMoisturePercent: 70
        },
        weather: {
          temperatureC: 21,
          humidityPercent: 55,
          rainfallProbability: 10,
          forecastRainMm: 2,
          weatherSummary: 'Sunny, clear skies with optimal tillering conditions.'
        },
        cropHealthRisk: 'Low',
        riskFactorReason: 'Clean field with nil pest threshold.',
        timestamp: Date.now()
      });
      showToast(t('demo.toastTestA'));
      break;

    case 'testB':
      farmStore.setFullContext({
        farmer: {
          farmerName: 'Shambhu Lal',
          state: 'Madhya Pradesh',
          district: 'Dewas',
          preferredLanguage: 'hi',
          crop: 'Soybean',
          cropStage: 'Vegetative / Tillering',
          farmSize: 2.0,
          budget: 6000,
          waterAvailability: 'Low',
          soilCondition: 'Clay Loam',
          soilMoisturePercent: 35
        },
        weather: {
          temperatureC: 32,
          humidityPercent: 50,
          rainfallProbability: 15,
          forecastRainMm: 5,
          weatherSummary: 'Dry spell during vegetative branching.'
        },
        cropHealthRisk: 'Low',
        riskFactorReason: 'Minor localized weed presence.',
        timestamp: Date.now()
      });
      showToast(t('demo.toastTestB'));
      break;

    case 'testC':
      const currentCtx = farmStore.getContext();
      const slashed = Math.round(currentCtx.farmer.budget * 0.35);
      farmStore.updateFarmer({
        budget: slashed
      });
      showToast(t('demo.toastTestC', { budget: slashed.toLocaleString('en-IN') }));
      break;

    case 'testD':
      farmStore.updateFarmer({
        waterAvailability: 'Low',
        soilMoisturePercent: 25
      });
      farmStore.updateWeather({
        rainfallProbability: 5,
        forecastRainMm: 0
      });
      showToast(t('demo.toastTestD'));
      break;

    case 'testE':
      farmStore.updateFarmer({
        crop: 'Cotton',
        cropStage: 'Flowering / Reproductive',
        soilCondition: 'Black Cotton'
      });
      showToast(t('demo.toastTestE'));
      break;
  }
}

function showToast(msg) {
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
  }, 2400);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
