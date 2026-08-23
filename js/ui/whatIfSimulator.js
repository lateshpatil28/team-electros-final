/**
 * @file whatIfSimulator.js
 * Multilingual Interactive Real-Time What-If Agronomic & Market Price Simulator Controller
 */

import { farmStore } from '../state/farmContext.js';
import { CROPS_DATA, calculateCropEconomics } from '../data/cropsData.js';
import { i18n, t } from '../i18n/i18n.js';

export function initWhatIfSimulator() {
  const container = document.getElementById('whatif-simulator-container');
  if (!container) return;

  renderSimulatorControls();
  bindSimulatorEvents();

  // Subscribe to store updates
  farmStore.subscribeWhatIf((whatIfScenario, comparisonResult) => {
    updateSimulatorDisplay(whatIfScenario, comparisonResult);
  });

  // Subscribe to language updates (preserves current slider state)
  i18n.subscribe(() => {
    renderSimulatorControls();
    bindSimulatorEvents();
    const comparison = farmStore.runWhatIfComparison();
    updateSimulatorDisplay(farmStore.getWhatIfScenario(), comparison);
  });

  // Trigger initial comparison
  const initialComparison = farmStore.runWhatIfComparison();
  updateSimulatorDisplay(farmStore.getWhatIfScenario(), initialComparison);
}

function renderSimulatorControls() {
  const container = document.getElementById('whatif-simulator-container');
  if (!container) return;

  const currentCtx = farmStore.getContext();
  const whatIf = farmStore.getWhatIfScenario();
  const farmer = currentCtx.farmer;
  const weather = currentCtx.weather;

  const cropKey = farmer.crop || 'Wheat';
  const cropConfig = CROPS_DATA[cropKey] || CROPS_DATA.Wheat;
  const basePrice = cropConfig.baseMarketPricePerQuintal || 2400;
  const priceRange = cropConfig.priceRange || { min: 1000, max: 8000, step: 25 };

  const priceScenario = whatIf.marketPriceScenario || { mode: 'current', customPrice: basePrice };
  const currentMode = priceScenario.mode || 'current';

  let activePrice = basePrice;
  if (currentMode === 'plus10') {
    activePrice = Math.round(basePrice * 1.10);
  } else if (currentMode === 'minus10') {
    activePrice = Math.round(basePrice * 0.90);
  } else if (currentMode === 'custom' && priceScenario.customPrice) {
    activePrice = Number(priceScenario.customPrice);
  }

  const activeBudget = whatIf.budget || farmer.budget;
  const activeWater = whatIf.waterAvailability || farmer.waterAvailability;
  const activeRain = whatIf.rainfallProbability !== undefined ? whatIf.rainfallProbability : weather.rainfallProbability;
  const activeMoisture = whatIf.soilMoisturePercent !== undefined ? whatIf.soilMoisturePercent : farmer.soilMoisturePercent;
  const activeRisk = whatIf.cropHealthRisk || currentCtx.cropHealthRisk;

  container.innerHTML = `
    <div class="whatif-card">
      <div class="whatif-header">
        <div class="whatif-title-group">
          <span class="whatif-icon">⚡</span>
          <div>
            <h3 class="whatif-title">${t('whatif.title')}</h3>
            <p class="whatif-subtitle">${t('whatif.subtitle')}</p>
          </div>
        </div>
        <div class="whatif-actions">
          <button id="btn-reset-whatif" class="btn-ghost-sm" title="${t('whatif.resetBtn')}">${t('whatif.resetBtn')}</button>
          <button id="btn-apply-whatif" class="btn-primary-sm" title="${t('whatif.applyBtn')}">${t('whatif.applyBtn')}</button>
        </div>
      </div>

      <!-- Simulator Controls Grid -->
      <div class="whatif-controls-grid">
        <!-- Budget Slider -->
        <div class="sim-control-group">
          <div class="sim-control-header">
            <label for="sim-budget">${t('whatif.simBudget')}</label>
            <span id="sim-budget-val" class="sim-val-display">₹${Number(activeBudget).toLocaleString('en-IN')}</span>
          </div>
          <input type="range" id="sim-budget" min="5000" max="120000" step="1000" value="${activeBudget}" class="sim-range">
          <div class="sim-range-scale">
            <span>₹5k</span>
            <span>₹40k</span>
            <span>₹80k</span>
            <span>₹120k</span>
          </div>
        </div>

        <!-- Water Availability -->
        <div class="sim-control-group">
          <div class="sim-control-header">
            <label>${t('whatif.waterLabel')}</label>
            <span id="sim-water-val" class="sim-val-display">${i18n.translateWater(activeWater)}</span>
          </div>
          <div class="pill-selector" id="sim-water-selector">
            <button type="button" class="pill-btn ${activeWater === 'Low' ? 'active' : ''}" data-water="Low">${t('waterShort.Low')}</button>
            <button type="button" class="pill-btn ${activeWater === 'Moderate' ? 'active' : ''}" data-water="Moderate">${t('waterShort.Moderate')}</button>
            <button type="button" class="pill-btn ${activeWater === 'High' ? 'active' : ''}" data-water="High">${t('waterShort.High')}</button>
          </div>
        </div>

        <!-- Rainfall Probability -->
        <div class="sim-control-group">
          <div class="sim-control-header">
            <label for="sim-rain">${t('whatif.rainLabel')}</label>
            <span id="sim-rain-val" class="sim-val-display">${activeRain}%</span>
          </div>
          <input type="range" id="sim-rain" min="0" max="100" step="5" value="${activeRain}" class="sim-range">
          <div class="sim-range-scale">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        <!-- Soil Moisture -->
        <div class="sim-control-group">
          <div class="sim-control-header">
            <label for="sim-moisture">${t('whatif.moistureLabel')}</label>
            <span id="sim-moisture-val" class="sim-val-display">${activeMoisture}%</span>
          </div>
          <input type="range" id="sim-moisture" min="10" max="90" step="5" value="${activeMoisture}" class="sim-range">
          <div class="sim-range-scale">
            <span>10%</span>
            <span>50%</span>
            <span>90%</span>
          </div>
        </div>

        <!-- Crop Health Risk -->
        <div class="sim-control-group sim-span-2">
          <div class="sim-control-header">
            <label>${t('whatif.pestThreat')}</label>
            <span id="sim-risk-val" class="sim-val-display">${i18n.translateRisk(activeRisk)}</span>
          </div>
          <div class="pill-selector" id="sim-risk-selector">
            <button type="button" class="pill-btn ${activeRisk === 'Low' ? 'active' : ''}" data-risk="Low">${t('risks.Low')}</button>
            <button type="button" class="pill-btn ${activeRisk === 'Moderate' ? 'active' : ''}" data-risk="Moderate">${t('risks.Moderate')}</button>
            <button type="button" class="pill-btn ${activeRisk === 'High' ? 'active' : ''}" data-risk="High">${t('risks.High')}</button>
            <button type="button" class="pill-btn ${activeRisk === 'Critical' ? 'active' : ''}" data-risk="Critical">${t('risks.Critical')}</button>
          </div>
        </div>

        <!-- Market Price Component (Decision Variable) -->
        <div class="sim-control-group sim-span-2 price-simulator-panel">
          <div class="sim-control-header">
            <div class="flex-row gap-xs">
              <span>🌾</span>
              <div>
                <label><strong>${t('whatif.marketPriceTitle')} (${i18n.translateCrop(cropKey)})</strong></label>
                <div class="price-sub-meta">${t('whatif.benchmarkLabel')}: <strong>₹${basePrice.toLocaleString('en-IN')} / ${t('whatif.quintal')}</strong></div>
              </div>
            </div>
            <span id="sim-price-val" class="sim-val-display price-val-highlight">₹${activePrice.toLocaleString('en-IN')} / ${t('whatif.quintal')}</span>
          </div>

          <!-- Scenario Pills -->
          <div class="pill-selector price-pills-row" id="sim-price-selector">
            <button type="button" class="pill-btn ${currentMode === 'current' ? 'active' : ''}" data-price-mode="current">
              ${t('whatif.currentPriceBtn')} (₹${basePrice.toLocaleString('en-IN')})
            </button>
            <button type="button" class="pill-btn ${currentMode === 'plus10' ? 'active' : ''}" data-price-mode="plus10">
              ${t('whatif.plus10Btn')} (+10%)
            </button>
            <button type="button" class="pill-btn ${currentMode === 'minus10' ? 'active' : ''}" data-price-mode="minus10">
              ${t('whatif.minus10Btn')} (-10%)
            </button>
            <button type="button" class="pill-btn ${currentMode === 'custom' ? 'active' : ''}" data-price-mode="custom">
              ⚙️ ${t('whatif.customPriceBtn')}
            </button>
          </div>

          <!-- Custom Price Interactive Slider / Input -->
          <div class="custom-price-slider-row" id="custom-price-slider-row" style="${currentMode === 'custom' ? 'display: block;' : 'display: none;'}">
            <div class="custom-price-inputs">
              <label for="sim-custom-price-range" class="custom-price-label">${t('whatif.customPriceLabel')}:</label>
              <input type="range" id="sim-custom-price-range" min="${priceRange.min}" max="${priceRange.max}" step="${priceRange.step}" value="${activePrice}" class="sim-range">
            </div>
            <div class="sim-range-scale">
              <span>₹${priceRange.min.toLocaleString('en-IN')}</span>
              <span>₹${Math.round((priceRange.min + priceRange.max) / 2).toLocaleString('en-IN')}</span>
              <span>₹${priceRange.max.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Dynamic Live Comparison Result Area -->
      <div id="whatif-comparison-results" class="whatif-results-wrapper">
        <!-- Populated dynamically -->
      </div>
    </div>
  `;
}

function bindSimulatorEvents() {
  const currentCtx = farmStore.getContext();
  const cropKey = currentCtx.farmer.crop || 'Wheat';
  const cropConfig = CROPS_DATA[cropKey] || CROPS_DATA.Wheat;
  const basePrice = cropConfig.baseMarketPricePerQuintal || 2400;

  const budgetInput = document.getElementById('sim-budget');
  const rainInput = document.getElementById('sim-rain');
  const moistureInput = document.getElementById('sim-moisture');
  const waterButtons = document.querySelectorAll('#sim-water-selector .pill-btn');
  const riskButtons = document.querySelectorAll('#sim-risk-selector .pill-btn');
  const priceButtons = document.querySelectorAll('#sim-price-selector .pill-btn');
  const customPriceRange = document.getElementById('sim-custom-price-range');
  const customSliderRow = document.getElementById('custom-price-slider-row');
  const priceValDisplay = document.getElementById('sim-price-val');
  const resetBtn = document.getElementById('btn-reset-whatif');
  const applyBtn = document.getElementById('btn-apply-whatif');

  budgetInput?.addEventListener('input', (e) => {
    const val = Number(e.target.value);
    document.getElementById('sim-budget-val').textContent = `₹${val.toLocaleString('en-IN')}`;
    farmStore.updateWhatIf({ budget: val });
  });

  rainInput?.addEventListener('input', (e) => {
    const val = Number(e.target.value);
    document.getElementById('sim-rain-val').textContent = `${val}%`;
    farmStore.updateWhatIf({ rainfallProbability: val });
  });

  moistureInput?.addEventListener('input', (e) => {
    const val = Number(e.target.value);
    document.getElementById('sim-moisture-val').textContent = `${val}%`;
    farmStore.updateWhatIf({ soilMoisturePercent: val });
  });

  waterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      waterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const water = btn.getAttribute('data-water');
      document.getElementById('sim-water-val').textContent = i18n.translateWater(water);
      farmStore.updateWhatIf({ waterAvailability: water });
    });
  });

  riskButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      riskButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const risk = btn.getAttribute('data-risk');
      document.getElementById('sim-risk-val').textContent = i18n.translateRisk(risk);
      farmStore.updateWhatIf({ cropHealthRisk: risk });
    });
  });

  // Price Mode Pill Buttons
  priceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      priceButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.getAttribute('data-price-mode');

      let targetPrice = basePrice;
      if (mode === 'plus10') {
        targetPrice = Math.round(basePrice * 1.10);
        if (customSliderRow) customSliderRow.style.display = 'none';
      } else if (mode === 'minus10') {
        targetPrice = Math.round(basePrice * 0.90);
        if (customSliderRow) customSliderRow.style.display = 'none';
      } else if (mode === 'custom') {
        targetPrice = customPriceRange ? Number(customPriceRange.value) : basePrice;
        if (customSliderRow) customSliderRow.style.display = 'block';
      } else {
        if (customSliderRow) customSliderRow.style.display = 'none';
      }

      if (priceValDisplay) {
        priceValDisplay.textContent = `₹${targetPrice.toLocaleString('en-IN')} / ${t('whatif.quintal')}`;
      }

      farmStore.updateWhatIf({
        marketPriceScenario: { mode, customPrice: targetPrice }
      });
    });
  });

  // Custom Price Slider
  customPriceRange?.addEventListener('input', (e) => {
    const val = Number(e.target.value);
    if (priceValDisplay) {
      priceValDisplay.textContent = `₹${val.toLocaleString('en-IN')} / ${t('whatif.quintal')}`;
    }
    farmStore.updateWhatIf({
      marketPriceScenario: { mode: 'custom', customPrice: val }
    });
  });

  resetBtn?.addEventListener('click', () => {
    farmStore.resetWhatIf();
    renderSimulatorControls();
    bindSimulatorEvents();
  });

  applyBtn?.addEventListener('click', () => {
    const whatIf = farmStore.getWhatIfScenario();
    farmStore.updateFarmer({
      budget: whatIf.budget,
      waterAvailability: whatIf.waterAvailability,
      soilMoisturePercent: whatIf.soilMoisturePercent
    });
    farmStore.updateWeather({
      rainfallProbability: whatIf.rainfallProbability
    });
    farmStore.updateRisk(whatIf.cropHealthRisk);
    farmStore.resetWhatIf();
    renderSimulatorControls();
    bindSimulatorEvents();
    
    // Show visual confirmation
    const btn = document.getElementById('btn-apply-whatif');
    if (btn) {
      const origText = btn.textContent;
      btn.textContent = t('whatif.appliedText');
      btn.classList.add('btn-applied');
      setTimeout(() => {
        btn.textContent = origText;
        btn.classList.remove('btn-applied');
      }, 1500);
    }
  });
}

function updateSimulatorDisplay(whatIfScenario, comparison) {
  const resultContainer = document.getElementById('whatif-comparison-results');
  if (!resultContainer || !comparison) return;

  const { baseResult, simulatedResult, changedRecommendation, deltaSummary } = comparison;
  const basePlan = baseResult.recommendedPlan;
  const simPlan = simulatedResult.recommendedPlan;
  const baseFarmer = baseResult.evaluatedContext.farmer;
  const simFarmer = simulatedResult.evaluatedContext.farmer;

  const scoreDiff = simPlan.score.overallScore - basePlan.score.overallScore;
  const scoreDiffText = scoreDiff > 0 ? `+${scoreDiff}` : `${scoreDiff}`;
  const costDiff = simPlan.estimatedCost - basePlan.estimatedCost;
  const costDiffText = costDiff > 0 ? `+₹${costDiff.toLocaleString('en-IN')}` : (costDiff < 0 ? `-₹${Math.abs(costDiff).toLocaleString('en-IN')}` : '₹0');
  const waterDiff = simPlan.waterRequirementMm - basePlan.waterRequirementMm;
  const waterDiffText = waterDiff > 0 ? `+${waterDiff} mm` : (waterDiff < 0 ? `${waterDiff} mm` : '0 mm');

  // Economics Projections
  const baseEcon = comparison.baseEconomics || calculateCropEconomics(basePlan, baseFarmer, { mode: 'current' });
  const simEcon = comparison.simulatedEconomics || calculateCropEconomics(simPlan, simFarmer, whatIfScenario?.marketPriceScenario);

  const profitDiff = simEcon.profitDelta;
  const profitDiffText = profitDiff >= 0 ? `+₹${profitDiff.toLocaleString('en-IN')}` : `-₹${Math.abs(profitDiff).toLocaleString('en-IN')}`;

  resultContainer.innerHTML = `
    <!-- Shift Banner -->
    <div class="simulation-alert-banner ${changedRecommendation ? 'banner-shifted' : 'banner-steady'}">
      <div class="shift-icon">${changedRecommendation ? '⚡' : '✓'}</div>
      <div>
        <h4 class="shift-title">
          ${changedRecommendation ? t('whatif.shiftDetected') : t('whatif.shiftSteady')}
        </h4>
        <p class="shift-desc">
          ${changedRecommendation 
            ? t('whatif.shiftDescChanged', { prev: escapeHtml(basePlan.name), new: escapeHtml(simPlan.name) })
            : t('whatif.shiftDescSteady', { current: escapeHtml(simPlan.name) })
          }
        </p>
      </div>
    </div>

    <!-- Side-by-Side Agronomic Comparison Grid -->
    <div class="comparison-dual-grid">
      <!-- Current Baseline Column -->
      <div class="comparison-column col-current">
        <div class="col-header">
          <span class="col-tag">${t('whatif.currentTag')}</span>
          <span class="col-sub">${t('whatif.activeProfile')}</span>
        </div>

        <div class="col-body">
          <div class="col-plan-title">${escapeHtml(basePlan.name)}</div>
          <div class="col-status-row">
            <span>${t('whatif.statusLabel')}</span>
            <span class="badge ${basePlan.feasibility.isFeasible ? 'badge-emerald-sm' : 'badge-amber-sm'}">
              ${basePlan.feasibility.isFeasible ? t('whatif.feasible') : t('whatif.conditional')}
            </span>
          </div>

          <div class="col-metric-list">
            <div class="col-metric-row">
              <span class="cm-label">${t('whatif.availableBudget')}</span>
              <span class="cm-val">₹${Number(baseFarmer.budget).toLocaleString('en-IN')}</span>
            </div>
            <div class="col-metric-row">
              <span class="cm-label">${t('whatif.estCost')}</span>
              <span class="cm-val"><strong>₹${basePlan.estimatedCost.toLocaleString('en-IN')}</strong></span>
            </div>
            <div class="col-metric-row">
              <span class="cm-label">${t('whatif.waterDemand')}</span>
              <span class="cm-val"><strong>${basePlan.waterRequirementMm} mm</strong> (${i18n.translateWater(baseFarmer.waterAvailability)})</span>
            </div>
            <div class="col-metric-row">
              <span class="cm-label">${t('whatif.suitabilityMatch')}</span>
              <span class="cm-val"><strong>${basePlan.score.overallScore}/100</strong></span>
            </div>
          </div>
        </div>
      </div>

      <!-- What-If Simulated Column -->
      <div class="comparison-column col-simulated">
        <div class="col-header">
          <span class="col-tag col-tag-sim">${t('whatif.simulatedTag')}</span>
          <span class="col-sub">${t('whatif.recalculated')}</span>
        </div>

        <div class="col-body">
          <div class="col-plan-title ${changedRecommendation ? 'title-highlight' : ''}">${escapeHtml(simPlan.name)}</div>
          <div class="col-status-row">
            <span>${t('whatif.statusLabel')}</span>
            <span class="badge ${simPlan.feasibility.isFeasible ? 'badge-emerald-sm' : 'badge-amber-sm'}">
              ${simPlan.feasibility.isFeasible ? t('whatif.feasible') : t('whatif.conditional')}
            </span>
          </div>

          <div class="col-metric-list">
            <div class="col-metric-row">
              <span class="cm-label">${t('whatif.simulatedBudget')}</span>
              <span class="cm-val">₹${Number(simFarmer.budget).toLocaleString('en-IN')}</span>
            </div>
            <div class="col-metric-row">
              <span class="cm-label">${t('whatif.estCost')}</span>
              <span class="cm-val">
                <strong>₹${simPlan.estimatedCost.toLocaleString('en-IN')}</strong>
                <span class="delta-tag ${costDiff <= 0 ? 'delta-good' : 'delta-warn'}">(${costDiffText})</span>
              </span>
            </div>
            <div class="col-metric-row">
              <span class="cm-label">${t('whatif.waterDemand')}</span>
              <span class="cm-val">
                <strong>${simPlan.waterRequirementMm} mm</strong> (${i18n.translateWater(simFarmer.waterAvailability)})
                <span class="delta-tag">(${waterDiffText})</span>
              </span>
            </div>
            <div class="col-metric-row">
              <span class="cm-label">${t('whatif.suitabilityMatch')}</span>
              <span class="cm-val">
                <strong>${simPlan.score.overallScore}/100</strong>
                <span class="delta-tag ${scoreDiff >= 0 ? 'delta-good' : 'delta-warn'}">(${scoreDiffText})</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Live Market Economics & Revenue/Profit Projection Grid -->
    <div class="economics-projection-card">
      <div class="econ-card-header">
        <div class="flex-row gap-xs">
          <span class="econ-icon">📈</span>
          <div>
            <h4 class="econ-title">${t('whatif.economicsTitle')}</h4>
            <p class="econ-subtitle">
              ${t('whatif.econSummaryDesc', {
                price: simEcon.scenarioPrice.toLocaleString('en-IN'),
                yield: simEcon.expectedYieldQuintals,
                rev: simEcon.scenarioRevenue.toLocaleString('en-IN'),
                cost: simEcon.estimatedCost.toLocaleString('en-IN')
              })}
            </p>
          </div>
        </div>
        <span class="badge ${simEcon.isProfitable ? 'badge-emerald' : 'badge-rose'}">
          ${simEcon.isProfitable ? t('whatif.econViable') : t('whatif.econLoss')}
        </span>
      </div>

      <div class="econ-metrics-grid">
        <div class="econ-metric-box">
          <span class="emb-label">${t('whatif.expectedYield')}</span>
          <span class="emb-val">${simEcon.expectedYieldQuintals} ${t('whatif.quintals')}</span>
          <span class="emb-sub">${simFarmer.farmSize} ${t('context.acres')} (${escapeHtml(i18n.translateCrop(simFarmer.crop))})</span>
        </div>

        <div class="econ-metric-box">
          <span class="emb-label">${t('whatif.grossRevenue')}</span>
          <span class="emb-val text-emerald">₹${simEcon.scenarioRevenue.toLocaleString('en-IN')}</span>
          <span class="emb-sub">@ ₹${simEcon.scenarioPrice.toLocaleString('en-IN')}/${t('whatif.quintal')} (${simEcon.priceChangePercent >= 0 ? '+' : ''}${simEcon.priceChangePercent}%)</span>
        </div>

        <div class="econ-metric-box">
          <span class="emb-label">${t('whatif.expectedCost')}</span>
          <span class="emb-val text-amber">₹${simEcon.estimatedCost.toLocaleString('en-IN')}</span>
          <span class="emb-sub">${simPlan.name}</span>
        </div>

        <div class="econ-metric-box">
          <span class="emb-label">${t('whatif.netProfit')}</span>
          <span class="emb-val ${simEcon.scenarioProfit >= 0 ? 'text-emerald' : 'text-rose'}">₹${simEcon.scenarioProfit.toLocaleString('en-IN')}</span>
          <span class="emb-sub">
            <span class="delta-tag ${profitDiff >= 0 ? 'delta-good' : 'delta-warn'}">${profitDiffText} (${simEcon.profitMarginPercent}% margin)</span>
          </span>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

