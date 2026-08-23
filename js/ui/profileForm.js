/**
 * @file profileForm.js
 * 100% Multilingual Farm Profile Form Controller and Validation
 */

import { REGIONS_DATA } from '../data/presetsData.js';
import { CROPS_DATA } from '../data/cropsData.js';
import { farmStore } from '../state/farmContext.js';
import { i18n, t } from '../i18n/i18n.js';

export function initProfileForm() {
  const container = document.getElementById('farm-profile-container');
  if (!container) return;

  renderProfileFormStructure();
  bindFormEvents();

  // Re-render form labels and translated option texts when language changes (preserves all farmer inputs)
  i18n.subscribe((lang) => {
    syncFormToState();
    const currentContext = farmStore.getContext();
    renderProfileFormStructure();
    bindFormEvents();
    populateFormFromContext(currentContext);
    
    // Also sync the preferredLanguage dropdown in the form
    const langSelect = document.getElementById('field-language');
    if (langSelect && langSelect.value !== lang) {
      langSelect.value = lang;
    }
  });

  // Sync state to form values when external context updates (e.g. preset loaded)
  farmStore.subscribe((context) => {
    populateFormFromContext(context);
  });

  // Initial population from store
  populateFormFromContext(farmStore.getContext());
}

function renderProfileFormStructure() {
  const container = document.getElementById('farm-profile-container');
  if (!container) return;

  const currentFarmer = farmStore.getContext().farmer;
  const activeLang = i18n.getLanguage();

  const cropKeys = Object.keys(CROPS_DATA);
  const stateKeys = Object.keys(REGIONS_DATA);
  const selectedState = currentFarmer.state || 'Maharashtra';
  const region = REGIONS_DATA[selectedState] || REGIONS_DATA['Maharashtra'];
  const currentCrop = currentFarmer.crop || 'Wheat';
  const cropData = CROPS_DATA[currentCrop] || CROPS_DATA['Wheat'];
  const stageKeys = Object.keys(cropData.stages);

  container.innerHTML = `
    <div class="form-header flex-between">
      <div class="flex-row gap-xs">
        <span class="form-icon">📝</span>
        <div>
          <h2 class="form-title">${t('profile.title')}</h2>
          <p class="form-subtitle">${t('profile.subtitle')}</p>
        </div>
      </div>
      <button type="button" class="btn-voice-prompt" id="btn-voice-profile">
        ${t('profile.voicePromptBtn')}
      </button>
    </div>

    <form id="farm-profile-form" onsubmit="event.preventDefault();">
      <div class="fields-grid">
        <!-- Farmer Name -->
        <div class="field-group">
          <label class="field-label" for="field-name">${t('profile.farmerName')}</label>
          <input type="text" id="field-name" class="field-input" placeholder="${t('profile.farmerNamePlaceholder')}" value="${escapeHtml(currentFarmer.farmerName || '')}" required>
        </div>

        <!-- Preferred Language -->
        <div class="field-group">
          <label class="field-label" for="field-language">${t('profile.preferredLang')}</label>
          <select id="field-language" class="field-select">
            <option value="en" ${activeLang === 'en' ? 'selected' : ''}>English</option>
            <option value="hi" ${activeLang === 'hi' ? 'selected' : ''}>हिन्दी (Hindi)</option>
            <option value="mr" ${activeLang === 'mr' ? 'selected' : ''}>मराठी (Marathi)</option>
            <option value="pa" ${activeLang === 'pa' ? 'selected' : ''}>ਪੰਜਾਬੀ (Punjabi)</option>
          </select>
        </div>

        <!-- State -->
        <div class="field-group">
          <label class="field-label" for="field-state">${t('profile.state')}</label>
          <select id="field-state" class="field-select">
            ${stateKeys.map(st => `<option value="${st}" ${st === currentFarmer.state ? 'selected' : ''}>${t('states.' + st, {}, st)}</option>`).join('')}
          </select>
        </div>

        <!-- District -->
        <div class="field-group">
          <label class="field-label" for="field-district">${t('profile.district')}</label>
          <select id="field-district" class="field-select">
            ${region.districts.map(d => `<option value="${d}" ${d === currentFarmer.district ? 'selected' : ''}>${d}</option>`).join('')}
          </select>
        </div>

        <!-- Crop -->
        <div class="field-group">
          <label class="field-label" for="field-crop">${t('profile.crop')}</label>
          <select id="field-crop" class="field-select">
            ${cropKeys.map(c => `<option value="${c}" ${c === currentFarmer.crop ? 'selected' : ''}>${i18n.translateCrop(c)}</option>`).join('')}
          </select>
        </div>

        <!-- Crop Stage -->
        <div class="field-group">
          <label class="field-label" for="field-stage">${t('profile.cropStage')}</label>
          <select id="field-stage" class="field-select">
            ${stageKeys.map(st => `<option value="${st}" ${st === currentFarmer.cropStage ? 'selected' : ''}>${i18n.translateStage(st)}</option>`).join('')}
          </select>
        </div>

        <!-- Farm Size -->
        <div class="field-group">
          <label class="field-label" for="field-size">${t('profile.farmSize')}</label>
          <input type="number" id="field-size" class="field-input" min="0.5" max="100" step="0.5" value="${currentFarmer.farmSize || 3.0}">
        </div>

        <!-- Budget -->
        <div class="field-group">
          <label class="field-label" for="field-budget">${t('profile.budget')}</label>
          <input type="number" id="field-budget" class="field-input" min="1000" max="500000" step="1000" value="${currentFarmer.budget || 35000}">
        </div>

        <!-- Water Availability -->
        <div class="field-group">
          <label class="field-label" for="field-water">${t('profile.waterAvailability')}</label>
          <select id="field-water" class="field-select">
            <option value="Low" ${currentFarmer.waterAvailability === 'Low' ? 'selected' : ''}>${t('waterLevels.Low')}</option>
            <option value="Moderate" ${currentFarmer.waterAvailability === 'Moderate' ? 'selected' : ''}>${t('waterLevels.Moderate')}</option>
            <option value="High" ${currentFarmer.waterAvailability === 'High' ? 'selected' : ''}>${t('waterLevels.High')}</option>
          </select>
        </div>

        <!-- Soil Type -->
        <div class="field-group">
          <label class="field-label" for="field-soil">${t('profile.soilCondition')}</label>
          <select id="field-soil" class="field-select">
            <option value="Alluvial" ${currentFarmer.soilCondition === 'Alluvial' ? 'selected' : ''}>${t('soils.Alluvial')}</option>
            <option value="Black Cotton" ${currentFarmer.soilCondition === 'Black Cotton' ? 'selected' : ''}>${t('soils.Black Cotton')}</option>
            <option value="Sandy Loam" ${currentFarmer.soilCondition === 'Sandy Loam' ? 'selected' : ''}>${t('soils.Sandy Loam')}</option>
            <option value="Clay Loam" ${currentFarmer.soilCondition === 'Clay Loam' ? 'selected' : ''}>${t('soils.Clay Loam')}</option>
            <option value="Red Soil" ${currentFarmer.soilCondition === 'Red Soil' ? 'selected' : ''}>${t('soils.Red Soil')}</option>
          </select>
        </div>

        <!-- Soil Moisture % Slider -->
        <div class="field-group span-2">
          <div class="field-label">
            <span>${t('profile.soilMoisture')}</span>
            <strong id="moisture-value-display">${currentFarmer.soilMoisturePercent || 50}%</strong>
          </div>
          <div class="range-slider-wrapper">
            <input type="range" id="field-moisture" class="field-range" min="10" max="90" step="5" value="${currentFarmer.soilMoisturePercent || 50}">
          </div>
        </div>
      </div>
    </form>
  `;
}

function bindFormEvents() {
  const form = document.getElementById('farm-profile-form');
  if (!form) return;

  const stateSelect = document.getElementById('field-state');
  const districtSelect = document.getElementById('field-district');
  const cropSelect = document.getElementById('field-crop');
  const stageSelect = document.getElementById('field-stage');
  const langSelect = document.getElementById('field-language');

  function updateDistricts(selectedState, preserveDistrict = null) {
    if (!districtSelect) return;
    const region = REGIONS_DATA[selectedState] || REGIONS_DATA['Maharashtra'];
    districtSelect.innerHTML = region.districts.map(d => 
      `<option value="${d}">${d}</option>`
    ).join('');

    if (preserveDistrict && region.districts.includes(preserveDistrict)) {
      districtSelect.value = preserveDistrict;
    }
  }

  function updateStages(selectedCrop, preserveStage = null) {
    if (!stageSelect) return;
    const cropData = CROPS_DATA[selectedCrop] || CROPS_DATA['Wheat'];
    stageSelect.innerHTML = Object.keys(cropData.stages).map(st => 
      `<option value="${st}">${i18n.translateStage(st)}</option>`
    ).join('');

    if (preserveStage && cropData.stages[preserveStage]) {
      stageSelect.value = preserveStage;
    }
  }

  // Voice trigger button
  const voiceBtn = document.getElementById('btn-voice-profile');
  voiceBtn?.addEventListener('click', () => {
    window.openVoiceModal?.();
  });

  // Handle Language Change from Form Dropdown -> updates app i18n
  langSelect?.addEventListener('change', (e) => {
    const newLang = e.target.value;
    if (newLang) {
      i18n.setLanguage(newLang);
      farmStore.updateFarmer({ preferredLanguage: newLang });
    }
  });

  // Handle State Change -> update district & default soil
  stateSelect?.addEventListener('change', (e) => {
    const state = e.target.value;
    updateDistricts(state);
    const region = REGIONS_DATA[state];
    if (region?.defaultSoil) {
      const soilInput = document.getElementById('field-soil');
      if (soilInput) soilInput.value = region.defaultSoil;
    }
    syncFormToState();
  });

  // Handle Crop Change -> update stages
  cropSelect?.addEventListener('change', (e) => {
    const crop = e.target.value;
    updateStages(crop);
    syncFormToState();
  });

  // Attach live input listeners to all form fields
  const inputs = form.querySelectorAll('input, select');
  inputs.forEach(input => {
    if (input.id === 'field-language') return; // Handled separately
    input.addEventListener('input', () => {
      syncFormToState();
    });
    input.addEventListener('change', () => {
      syncFormToState();
    });
  });
}

function syncFormToState() {
  const form = document.getElementById('farm-profile-form');
  if (!form) return;

  const farmerName = document.getElementById('field-name')?.value?.trim() || 'Farmer';
  const state = document.getElementById('field-state')?.value || 'Maharashtra';
  const district = document.getElementById('field-district')?.value || 'Yavatmal';
  const preferredLanguage = document.getElementById('field-language')?.value || i18n.getLanguage();
  const crop = document.getElementById('field-crop')?.value || 'Wheat';
  const cropStage = document.getElementById('field-stage')?.value || 'Vegetative / Tillering';
  const farmSize = parseFloat(document.getElementById('field-size')?.value) || 1.0;
  const budget = parseFloat(document.getElementById('field-budget')?.value) || 10000;
  const waterAvailability = document.getElementById('field-water')?.value || 'Moderate';
  const soilCondition = document.getElementById('field-soil')?.value || 'Alluvial';
  const soilMoisturePercent = parseInt(document.getElementById('field-moisture')?.value) || 50;

  farmStore.updateFarmer({
    farmerName,
    state,
    district,
    preferredLanguage,
    crop,
    cropStage,
    farmSize: Math.max(0.1, farmSize),
    budget: Math.max(1000, budget),
    waterAvailability,
    soilCondition,
    soilMoisturePercent
  });
}

export function populateFormFromContext(context) {
  const { farmer } = context;
  if (!farmer) return;

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el && el.value !== String(val)) {
      el.value = val;
    }
  };

  const stateSelect = document.getElementById('field-state');
  const cropSelect = document.getElementById('field-crop');
  const districtSelect = document.getElementById('field-district');
  const stageSelect = document.getElementById('field-stage');

  if (stateSelect && farmer.state && stateSelect.value !== farmer.state) {
    stateSelect.value = farmer.state;
    const region = REGIONS_DATA[farmer.state] || REGIONS_DATA['Maharashtra'];
    if (districtSelect) {
      districtSelect.innerHTML = region.districts.map(d => `<option value="${d}">${d}</option>`).join('');
    }
  }

  if (cropSelect && farmer.crop && cropSelect.value !== farmer.crop) {
    cropSelect.value = farmer.crop;
    const cropData = CROPS_DATA[farmer.crop] || CROPS_DATA['Wheat'];
    if (stageSelect) {
      stageSelect.innerHTML = Object.keys(cropData.stages).map(st => `<option value="${st}">${i18n.translateStage(st)}</option>`).join('');
    }
  }

  setVal('field-name', farmer.farmerName || '');
  setVal('field-district', farmer.district || '');
  setVal('field-language', farmer.preferredLanguage || i18n.getLanguage());
  setVal('field-stage', farmer.cropStage || '');
  setVal('field-size', farmer.farmSize || 1.0);
  setVal('field-budget', farmer.budget || 30000);
  setVal('field-water', farmer.waterAvailability || 'Moderate');
  setVal('field-soil', farmer.soilCondition || 'Alluvial');
  setVal('field-moisture', farmer.soilMoisturePercent || 50);

  const moistureVal = document.getElementById('moisture-value-display');
  if (moistureVal) {
    moistureVal.textContent = `${farmer.soilMoisturePercent || 50}%`;
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
