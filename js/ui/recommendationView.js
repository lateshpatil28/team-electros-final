/**
 * @file recommendationView.js
 * Multilingual Primary Recommendation Hero View & "Why This Plan?" Analysis
 * Includes full Text-to-Speech audio advisory read-aloud.
 */

import { farmStore } from '../state/farmContext.js';
import { SpeechService } from '../services/speechService.js';
import { i18n, t } from '../i18n/i18n.js';

let isAdvisorySpeaking = false;
let isAdvisoryPaused = false;

export function initRecommendationView() {
  const container = document.getElementById('recommended-plan-container');
  if (!container) return;

  farmStore.subscribe((context, result) => {
    SpeechService.stop();
    isAdvisorySpeaking = false;
    isAdvisoryPaused = false;
    renderRecommendation(result);
  });

  i18n.subscribe(() => {
    SpeechService.stop();
    isAdvisorySpeaking = false;
    isAdvisoryPaused = false;
    renderRecommendation(farmStore.getEngineResult());
  });

  renderRecommendation(farmStore.getEngineResult());
}

export function renderRecommendation(engineResult) {
  const container = document.getElementById('recommended-plan-container');
  if (!container) return;

  if (!engineResult || !engineResult.recommendedPlan) {
    container.innerHTML = `<div class="empty-state">No recommendation available. Fill in the Farm Profile.</div>`;
    return;
  }

  const plan = engineResult.recommendedPlan;
  const context = engineResult.evaluatedContext;
  const farmer = context.farmer;

  const isFeasible = plan.feasibility.isFeasible;
  const badgeClass = isFeasible ? 'badge-recommended' : 'badge-conditional';
  const tagText = isFeasible ? t('recommendation.badge') : t('recommendation.conditionalBadge');

  const categoryIcons = {
    nutrition: '🧪',
    irrigation: '💧',
    protection: '🛡️',
    soil_intercultural: '🚜'
  };

  container.innerHTML = `
    <div class="recommendation-hero-card ${isFeasible ? 'hero-feasible' : 'hero-warning'}">
      <!-- Header / Tag -->
      <div class="rec-header">
        <div>
          <div class="flex-row gap-xs" style="margin-bottom: 6px;">
            <span class="badge ${badgeClass}">${tagText}</span>
            <button type="button" class="btn-tts-listen" id="btn-listen-advisory" style="padding: 4px 10px; font-size: 0.85rem; border-radius: 6px; cursor: pointer;">
              ${isAdvisorySpeaking ? (isAdvisoryPaused ? '▶ ' + (t('library.readBtn') || 'Resume') : '⏸ ' + t('recommendation.pauseAdvisoryBtn')) : '🔊 ' + t('recommendation.listenAdvisoryBtn')}
            </button>
            ${isAdvisorySpeaking ? `
              <button type="button" class="btn-ghost-sm" id="btn-stop-advisory" style="padding: 4px 8px; font-size: 0.8rem; border-radius: 6px; cursor: pointer;">
                ⏹ ${t('recommendation.stopAdvisoryBtn')}
              </button>
            ` : ''}
          </div>
          <h2 class="rec-title">${escapeHtml(plan.name)}</h2>
          <p class="rec-desc">${escapeHtml(plan.description)}</p>
        </div>
        <div class="rec-score-box">
          <div class="score-radial">
            <span class="score-number">${plan.score.overallScore}</span>
            <span class="score-max">/ 100</span>
          </div>
          <span class="score-label">${t('recommendation.suitabilityMatch')}</span>
        </div>
      </div>

      <!-- Core Metrics Bar -->
      <div class="rec-metrics-grid">
        <div class="metric-card">
          <div class="metric-icon">💰</div>
          <div class="metric-details">
            <span class="metric-title">${t('recommendation.estTotalCost')}</span>
            <span class="metric-value">₹${plan.estimatedCost.toLocaleString('en-IN')}</span>
            <span class="metric-sub">₹${plan.costPerAcre.toLocaleString('en-IN')} ${t('recommendation.perAcre')} (${Math.round((plan.estimatedCost / farmer.budget) * 100)}% ${t('recommendation.ofBudget')})</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon">💧</div>
          <div class="metric-details">
            <span class="metric-title">${t('recommendation.waterDemand')}</span>
            <span class="metric-value">${plan.waterRequirementMm} mm</span>
            <span class="metric-sub">${plan.waterRequirementM3.toLocaleString('en-IN')} m³ ${t('recommendation.totalVolume')}</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon">🛡️</div>
          <div class="metric-details">
            <span class="metric-title">${t('recommendation.residualRisk')}</span>
            <span class="metric-value">${i18n.translateRisk(plan.residualRisk)}</span>
            <span class="metric-sub">${t('recommendation.riskProtection')}</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon">⚖️</div>
          <div class="metric-details">
            <span class="metric-title">${t('recommendation.feasibilityStatus')}</span>
            <span class="metric-value ${isFeasible ? 'status-ok' : 'status-warn'}">
              ${isFeasible ? t('recommendation.fullyFeasible') : t('recommendation.exceedsLimits')}
            </span>
            <span class="metric-sub">${isFeasible ? t('recommendation.allSatisfied') : t('recommendation.checkAlternatives')}</span>
          </div>
        </div>
      </div>

      <!-- Suitability Score Breakdown Bars -->
      <div class="score-breakdown-panel">
        <h4 class="breakdown-title">${t('recommendation.scoreBreakdown')}</h4>
        <div class="breakdown-grid">
          <div class="score-bar-item">
            <div class="bar-header">
              <span>${t('recommendation.budgetScore')}</span>
              <strong>${plan.score.budgetScore}/100</strong>
            </div>
            <div class="progress-track"><div class="progress-fill fill-budget" style="width: ${plan.score.budgetScore}%"></div></div>
          </div>
          <div class="score-bar-item">
            <div class="bar-header">
              <span>${t('recommendation.waterScore')}</span>
              <strong>${plan.score.waterScore}/100</strong>
            </div>
            <div class="progress-track"><div class="progress-fill fill-water" style="width: ${plan.score.waterScore}%"></div></div>
          </div>
          <div class="score-bar-item">
            <div class="bar-header">
              <span>${t('recommendation.agronomicScore')}</span>
              <strong>${plan.score.agronomicScore}/100</strong>
            </div>
            <div class="progress-track"><div class="progress-fill fill-agronomy" style="width: ${plan.score.agronomicScore}%"></div></div>
          </div>
          <div class="score-bar-item">
            <div class="bar-header">
              <span>${t('recommendation.riskScore')}</span>
              <strong>${plan.score.riskMitigationScore}/100</strong>
            </div>
            <div class="progress-track"><div class="progress-fill fill-risk" style="width: ${plan.score.riskMitigationScore}%"></div></div>
          </div>
        </div>
      </div>

      <!-- WHY THIS PLAN? Section -->
      <div class="why-this-plan-box">
        <div class="why-header">
          <span class="why-badge-icon">💡</span>
          <div>
            <h3 class="why-title">${t('recommendation.whyTitle')}</h3>
            <p class="why-subtitle">${t('recommendation.whySubtitle', { farmerName: escapeHtml(farmer.farmerName || 'Farmer') })}</p>
          </div>
        </div>
        <ul class="why-reasons-list">
          ${plan.reasons.map(r => `
            <li class="reason-item">
              <span class="reason-bullet">›</span>
              <span class="reason-text">${formatMarkdownBold(r)}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <!-- Prescriptive Action Roadmap -->
      <div class="actions-roadmap-section">
        <h3 class="actions-heading">${t('recommendation.actionPlanTitle', { stage: escapeHtml(i18n.translateStage(farmer.cropStage)) })}</h3>
        <div class="actions-grid">
          ${plan.actions.map(action => `
            <div class="action-card action-${action.category}">
              <div class="action-top">
                <span class="action-cat-icon">${categoryIcons[action.category] || '🌱'}</span>
                <div class="action-meta">
                  <span class="action-cat-title">${t(`actions.${action.category}`, {}, action.category)}</span>
                  <h4 class="action-title">${escapeHtml(action.title)}</h4>
                </div>
              </div>
              <p class="action-desc">${escapeHtml(action.description)}</p>
              <div class="action-bottom">
                <span class="action-timing">${t('recommendation.timingPrefix')} ${escapeHtml(action.timing)}</span>
                <span class="action-cost">${t('recommendation.costEst', { cost: Math.round(action.costShare * farmer.farmSize).toLocaleString('en-IN') })}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  bindAdvisoryAudioEvents(plan, farmer);
}

function bindAdvisoryAudioEvents(plan, farmer) {
  const listenBtn = document.getElementById('btn-listen-advisory');
  const stopBtn = document.getElementById('btn-stop-advisory');

  if (!listenBtn) return;

  const buildAdvisorySpokenText = () => {
    const reasonsSpoken = plan.reasons.join('. ');
    const actionsSpoken = plan.actions.map(a => `${a.title}. ${a.description}`).join('. ');
    return `${plan.name}. ${plan.description}. ${reasonsSpoken}. ${actionsSpoken}`;
  };

  listenBtn.addEventListener('click', () => {
    if (isAdvisorySpeaking) {
      if (isAdvisoryPaused) {
        SpeechService.resume();
        isAdvisoryPaused = false;
        listenBtn.textContent = '⏸ ' + t('recommendation.pauseAdvisoryBtn');
      } else {
        SpeechService.pause();
        isAdvisoryPaused = true;
        listenBtn.textContent = '▶ ' + (t('library.readBtn') || 'Resume');
      }
    } else {
      const fullText = buildAdvisorySpokenText();
      isAdvisorySpeaking = true;
      isAdvisoryPaused = false;
      listenBtn.textContent = '⏸ ' + t('recommendation.pauseAdvisoryBtn');

      SpeechService.speak({
        text: fullText,
        languageCode: i18n.getLanguage(),
        onStart: () => {
          isAdvisorySpeaking = true;
          isAdvisoryPaused = false;
        },
        onEnd: () => {
          isAdvisorySpeaking = false;
          isAdvisoryPaused = false;
          renderRecommendation(farmStore.getEngineResult());
        },
        onError: () => {
          isAdvisorySpeaking = false;
          isAdvisoryPaused = false;
          renderRecommendation(farmStore.getEngineResult());
        }
      });
    }
  });

  stopBtn?.addEventListener('click', () => {
    SpeechService.stop();
    isAdvisorySpeaking = false;
    isAdvisoryPaused = false;
    renderRecommendation(farmStore.getEngineResult());
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatMarkdownBold(text) {
  if (!text) return '';
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

