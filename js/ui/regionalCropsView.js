/**
 * @file regionalCropsView.js
 * Punjab and Maharashtra Regional Crop Explorer UI Component
 * Features State/District selectors, comprehensive agronomics, growth stages, and "Load into Profile" integration.
 */

import { REGIONAL_CROPS_DATABASE } from '../data/regionalCropsData.js';
import { farmStore } from '../state/farmContext.js';
import { i18n, t } from '../i18n/i18n.js';

let selectedState = 'Punjab';
let selectedDistrict = 'Ludhiana';

export function initRegionalCropsView() {
  const container = document.getElementById('regional-crops-container');
  if (!container) return;

  renderRegionalCropsUI();
  bindRegionalCropsEvents();

  i18n.subscribe(() => {
    renderRegionalCropsUI();
    bindRegionalCropsEvents();
  });
}

function renderRegionalCropsUI() {
  const container = document.getElementById('regional-crops-container');
  if (!container) return;

  const stateData = REGIONAL_CROPS_DATABASE[selectedState] || REGIONAL_CROPS_DATABASE['Punjab'];
  const stateKeys = Object.keys(REGIONAL_CROPS_DATABASE);
  const localizedState = t('states.' + selectedState, {}, selectedState);

  container.innerHTML = `
    <div class="regional-crops-card">
      <div class="form-header">
        <span class="form-icon">🗺️</span>
        <div>
          <h2 class="form-title">${t('regionalCrops.title')}</h2>
          <p class="form-subtitle">${t('regionalCrops.subtitle')}</p>
        </div>
      </div>

      <!-- State and District Selection Bar -->
      <div class="regional-selector-bar">
        <div class="reg-select-group">
          <label for="reg-state-select">${t('regionalCrops.selectState')}</label>
          <select id="reg-state-select" class="field-select">
            ${stateKeys.map(st => `
              <option value="${st}" ${st === selectedState ? 'selected' : ''}>
                ${t('states.' + st, {}, st)} (${REGIONAL_CROPS_DATABASE[st].nativeName})
              </option>
            `).join('')}
          </select>
        </div>

        <div class="reg-select-group">
          <label for="reg-district-select">${t('regionalCrops.selectDistrict')}</label>
          <select id="reg-district-select" class="field-select">
            ${stateData.districts.map(d => `
              <option value="${d}" ${d === selectedDistrict ? 'selected' : ''}>${d}</option>
            `).join('')}
          </select>
        </div>

        <div class="reg-climate-badge">
          <span>🌦️ <strong>Zone:</strong> ${stateData.climateZone}</span>
        </div>
      </div>

      <!-- Crops Grid -->
      <div class="regional-crops-grid">
        ${stateData.crops.map(crop => `
          <div class="reg-crop-card">
            <!-- Crop Header -->
            <div class="reg-crop-header">
              <div>
                <span class="badge badge-emerald-sm">${crop.season}</span>
                <h3 class="reg-crop-title">${escapeHtml(crop.cropName)} <span class="reg-crop-native">(${crop.nativeName})</span></h3>
              </div>
              <button type="button" class="btn-load-crop-profile" data-crop="${crop.cropName}" data-state="${selectedState}" data-district="${selectedDistrict}">
                ${t('regionalCrops.loadProfileBtn')}
              </button>
            </div>

            <!-- Key Agronomic Specs -->
            <div class="reg-spec-grid">
              <div class="reg-spec-item">
                <span class="spec-lbl">📅 ${t('regionalCrops.sowing')}</span>
                <span class="spec-val">${crop.sowingWindow}</span>
              </div>
              <div class="reg-spec-item">
                <span class="spec-lbl">💧 ${t('regionalCrops.water')}</span>
                <span class="spec-val"><strong>${crop.waterRequirementMm}</strong></span>
              </div>
              <div class="reg-spec-item">
                <span class="spec-lbl">⚖️ ${t('regionalCrops.yield')}</span>
                <span class="spec-val"><strong>${crop.yieldPotential}</strong></span>
              </div>
              <div class="reg-spec-item">
                <span class="spec-lbl">🌾 ${t('regionalCrops.varieties')}</span>
                <span class="spec-val">${crop.recommendedVarieties.join(', ')}</span>
              </div>
            </div>

            <!-- Growth Stages Timeline -->
            <div class="reg-stages-section">
              <span class="reg-section-lbl">📈 ${t('regionalCrops.stages')}</span>
              <div class="reg-stages-timeline">
                ${crop.stages.map(st => `
                  <div class="timeline-step">
                    <div class="step-dot"></div>
                    <div class="step-content">
                      <strong class="step-name">${escapeHtml(st.name)}</strong>
                      <span class="step-days">${st.days} | 💧 ${st.waterNeed}</span>
                      <p class="step-notes">${escapeHtml(st.notes)}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Risks & Management -->
            <div class="reg-risks-section">
              <span class="reg-section-lbl">🛡️ ${t('regionalCrops.risks')}</span>
              <ul class="reg-risks-list">
                ${crop.commonRisks.map(r => `
                  <li>
                    <strong>${escapeHtml(r.pest)}:</strong> ${escapeHtml(r.symptom)} 
                    <span class="mgmt-tag">👉 ${escapeHtml(r.management)}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <!-- Advisory Note -->
            <div class="reg-advisory-box">
              <span class="adv-icon">💡</span>
              <p class="adv-text">${escapeHtml(crop.advisory)}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function bindRegionalCropsEvents() {
  const container = document.getElementById('regional-crops-container');
  if (!container) return;

  const stateSelect = document.getElementById('reg-state-select');
  const districtSelect = document.getElementById('reg-district-select');
  const loadButtons = container.querySelectorAll('.btn-load-crop-profile');

  stateSelect?.addEventListener('change', (e) => {
    selectedState = e.target.value;
    const stateData = REGIONAL_CROPS_DATABASE[selectedState];
    selectedDistrict = stateData.districts[0];
    renderRegionalCropsUI();
    bindRegionalCropsEvents();
  });

  districtSelect?.addEventListener('change', (e) => {
    selectedDistrict = e.target.value;
  });

  loadButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const crop = btn.getAttribute('data-crop');
      const state = btn.getAttribute('data-state');
      const district = btn.getAttribute('data-district');

      const stateData = REGIONAL_CROPS_DATABASE[state];
      const defaultSoil = stateData?.defaultSoil || 'Alluvial';

      // Update Farm Context Store!
      farmStore.updateFarmer({
        crop,
        state,
        district,
        soilCondition: defaultSoil
      });

      showRegionalToast(t('regionalCrops.loadedToast', { crop, district, state }));

      // Scroll to Profile Form to see it updated
      window.scrollToSection?.('section-profile');
    });
  });
}

function showRegionalToast(msg) {
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
