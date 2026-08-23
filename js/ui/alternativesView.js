/**
 * @file alternativesView.js
 * Multilingual Visual Component for Alternative & Infeasible Plans Comparison
 */

import { farmStore } from '../state/farmContext.js';
import { i18n, t } from '../i18n/i18n.js';

export function initAlternativesView() {
  const container = document.getElementById('alternative-plans-container');
  if (!container) return;

  farmStore.subscribe((context, result) => {
    renderAlternatives(result);
  });

  i18n.subscribe(() => {
    renderAlternatives(farmStore.getEngineResult());
  });

  renderAlternatives(farmStore.getEngineResult());
}

export function renderAlternatives(engineResult) {
  const container = document.getElementById('alternative-plans-container');
  if (!container) return;

  if (!engineResult || !engineResult.allPlans) {
    container.innerHTML = '';
    return;
  }

  const { allPlans, recommendedPlan } = engineResult;
  const context = engineResult.evaluatedContext;
  const farmer = context.farmer;

  container.innerHTML = `
    <div class="alternatives-wrapper">
      <div class="section-header-row">
        <div>
          <h3 class="section-title">${t('alternatives.title')}</h3>
          <p class="section-subtitle">${t('alternatives.subtitle', { crop: escapeHtml(i18n.translateCrop(farmer.crop)), size: farmer.farmSize })}</p>
        </div>
      </div>

      <div class="plans-comparison-grid">
        ${allPlans.map(plan => {
          const isRec = plan.id === recommendedPlan.id;
          const isFeasible = plan.feasibility.isFeasible;

          let badgeClass = 'badge-feasible-alt';
          let tagLabel = t('alternatives.feasibleAltTag');

          if (isRec) {
            badgeClass = 'badge-recommended';
            tagLabel = t('alternatives.recommendedTag');
          } else if (!isFeasible) {
            badgeClass = 'badge-infeasible';
            tagLabel = t('alternatives.infeasibleTag');
          }

          return `
            <div class="plan-card ${isRec ? 'card-recommended' : ''} ${!isFeasible ? 'card-infeasible' : ''}">
              <!-- Top Badge & Score -->
              <div class="plan-card-top">
                <span class="badge ${badgeClass}">${tagLabel}</span>
                <span class="plan-score-pill">${t('alternatives.scoreLabel')} <strong>${plan.score.overallScore}</strong>/100</span>
              </div>

              <!-- Title & Description -->
              <h4 class="plan-title">${escapeHtml(plan.name)}</h4>
              <p class="plan-summary">${escapeHtml(plan.description)}</p>

              <!-- Cost & Resource Indicators -->
              <div class="plan-spec-list">
                <div class="plan-spec-row">
                  <span class="spec-label">${t('alternatives.estCost')}</span>
                  <span class="spec-val"><strong>₹${plan.estimatedCost.toLocaleString('en-IN')}</strong> (₹${plan.costPerAcre.toLocaleString('en-IN')}/ac)</span>
                </div>
                <div class="plan-spec-row">
                  <span class="spec-label">${t('alternatives.waterDemand')}</span>
                  <span class="spec-val"><strong>${plan.waterRequirementMm} mm</strong> (${plan.waterRequirementM3.toLocaleString('en-IN')} m³)</span>
                </div>
                <div class="plan-spec-row">
                  <span class="spec-label">${t('alternatives.residualRisk')}</span>
                  <span class="spec-val"><strong>${i18n.translateRisk(plan.residualRisk)}</strong></span>
                </div>
                <div class="plan-spec-row">
                  <span class="spec-label">${t('alternatives.yieldPotential')}</span>
                  <span class="spec-val"><strong>${plan.score.yieldPotentialScore}%</strong></span>
                </div>
              </div>

              <!-- Feasibility or Infeasibility Explanation -->
              ${!isFeasible ? `
                <div class="infeasible-alert-box">
                  <div class="infeasible-alert-header">
                    <span>⚠️</span>
                    <strong>${t('alternatives.whyInfeasible')}</strong>
                  </div>
                  <ul class="infeasible-violations-list">
                    ${plan.feasibility.constraintViolations.map(v => `
                      <li>${escapeHtml(v)}</li>
                    `).join('')}
                  </ul>
                </div>
              ` : `
                <div class="feasible-perks-box">
                  <div class="feasible-perks-header">
                    <span>✓</span>
                    <strong>${t('alternatives.feasibilityVerified')}</strong>
                  </div>
                  <p class="feasible-note">
                    ${isRec ? t('alternatives.recNote') : t('alternatives.altNote')}
                  </p>
                </div>
              `}

              <!-- Action Highlights -->
              <div class="plan-actions-preview">
                <span class="actions-preview-label">${t('alternatives.actionHighlights')}</span>
                <ul class="actions-preview-list">
                  ${plan.actions.slice(0, 3).map(a => `
                    <li><strong>${escapeHtml(a.title)}</strong>: ${escapeHtml(a.description.substring(0, 110))}...</li>
                  `).join('')}
                </ul>
              </div>
            </div>
          `;
        }).join('')}
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
