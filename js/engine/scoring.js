/**
 * @file scoring.js
 * Multi-Criteria Agronomic & Economic Suitability Scoring Algorithm for FarmWise
 */

import { calculateEffectiveWaterCapacity } from './feasibility.js';

/**
 * Calculates deterministic multi-factor suitability scores for a candidate plan.
 * 
 * @param {Object} planData
 * @param {string} planData.strategyType
 * @param {number} planData.estimatedCost
 * @param {number} planData.waterRequirementMm
 * @param {number} planData.yieldIndex
 * @param {import('../types.js').FeasibilityEvaluation} feasibility
 * @param {import('../types.js').FarmContext} context
 * @param {Object} cropConfig
 * @returns {import('../types.js').SuitabilityScoreBreakdown}
 */
export function calculateSuitabilityScore(planData, feasibility, context, cropConfig) {
  const { strategyType, estimatedCost, waterRequirementMm, yieldIndex } = planData;
  const { farmer, cropHealthRisk } = context;
  const budget = farmer.budget || 1;
  const effectiveWaterCapacityMm = calculateEffectiveWaterCapacity(context);

  // ==========================================
  // 1. Budget Fit Score (0 - 100)
  // ==========================================
  let budgetScore = 75;
  if (feasibility.budgetFit) {
    const costRatio = estimatedCost / budget; // e.g. 0.75 means uses 75% of budget
    if (costRatio >= 0.55 && costRatio <= 0.85) {
      // Optimal zone: meaningful investment + comfortable safety cushion
      budgetScore = Math.round(90 + (1 - Math.abs(costRatio - 0.70) * 2) * 10);
    } else if (costRatio < 0.55) {
      // Under-investment in crop yield potential
      budgetScore = Math.round(75 + (costRatio / 0.55) * 15);
    } else {
      // Close to budget ceiling (tight buffer)
      budgetScore = Math.round(80 + (1 - (costRatio - 0.85) / 0.15) * 10);
    }
  } else {
    // Infeasible budget deficit penalty
    const deficitRatio = (estimatedCost - budget) / budget;
    budgetScore = Math.max(5, Math.round(60 - deficitRatio * 100));
  }

  // ==========================================
  // 2. Water Fit Score (0 - 100)
  // ==========================================
  let waterScore = 75;
  if (feasibility.waterFit) {
    const waterRatio = waterRequirementMm / Math.max(1, effectiveWaterCapacityMm);
    if (waterRatio >= 0.50 && waterRatio <= 0.85) {
      // Efficient water usage with contingency safety margin
      waterScore = Math.round(90 + (1 - Math.abs(waterRatio - 0.70) * 2) * 10);
    } else if (waterRatio < 0.50) {
      // Very low water usage (safe, but check if under-irrigating)
      waterScore = Math.round(80 + (waterRatio / 0.50) * 12);
    } else {
      // Utilizing near 100% capacity
      waterScore = Math.round(82 + (1 - (waterRatio - 0.85) / 0.15) * 8);
    }
  } else {
    // Water deficit penalty
    const waterDeficitRatio = (waterRequirementMm - effectiveWaterCapacityMm) / Math.max(1, effectiveWaterCapacityMm);
    waterScore = Math.max(5, Math.round(55 - waterDeficitRatio * 100));
  }

  // ==========================================
  // 3. Agronomic & Soil Fit Score (0 - 100)
  // ==========================================
  let agronomicScore = 80;
  const idealSoils = cropConfig.idealSoil || [];
  const farmerSoil = farmer.soilCondition;

  if (idealSoils.includes(farmerSoil)) {
    agronomicScore += 12; // Ideal soil match bonus
  } else if (farmerSoil === 'Sandy Loam' && (farmer.crop === 'Rice' || farmer.crop === 'Cotton')) {
    agronomicScore -= 10; // High percolation / poor retention penalty
  }

  // Stage criticality bonus for precision plans
  const currentStageInfo = cropConfig.stages?.[farmer.cropStage];
  if (currentStageInfo?.criticalStage && strategyType === 'high_yield') {
    agronomicScore += 8;
  } else if (currentStageInfo?.criticalStage && strategyType === 'low_cost' && farmer.waterAvailability === 'Low') {
    agronomicScore -= 5;
  }
  agronomicScore = Math.min(100, Math.max(10, agronomicScore));

  // ==========================================
  // 4. Risk Mitigation Score (0 - 100)
  // ==========================================
  let riskMitigationScore = 75;
  if (cropHealthRisk === 'Critical') {
    if (strategyType === 'high_yield') riskMitigationScore = 95;
    else if (strategyType === 'balanced') riskMitigationScore = 72;
    else riskMitigationScore = 30; // Low cost lacks intense firepower
  } else if (cropHealthRisk === 'High') {
    if (strategyType === 'high_yield') riskMitigationScore = 92;
    else if (strategyType === 'balanced') riskMitigationScore = 88;
    else riskMitigationScore = 55;
  } else if (cropHealthRisk === 'Moderate') {
    if (strategyType === 'balanced') riskMitigationScore = 96; // Best IPM efficiency
    else if (strategyType === 'high_yield') riskMitigationScore = 90;
    else riskMitigationScore = 78;
  } else {
    // Low risk: Low-cost and balanced avoid chemical over-use
    if (strategyType === 'balanced') riskMitigationScore = 95;
    else if (strategyType === 'low_cost') riskMitigationScore = 92;
    else riskMitigationScore = 84;
  }

  // ==========================================
  // 5. Yield Potential Score (0 - 100)
  // ==========================================
  const yieldPotentialScore = Math.round(yieldIndex || 80);

  // ==========================================
  // 6. Overall Weighted Composite Score
  // Weights:
  // - Budget: 30%
  // - Water: 25%
  // - Agronomic: 20%
  // - Risk: 15%
  // - Yield: 10%
  // ==========================================
  let rawWeighted = (
    budgetScore * 0.30 +
    waterScore * 0.25 +
    agronomicScore * 0.20 +
    riskMitigationScore * 0.15 +
    yieldPotentialScore * 0.10
  );

  // If the plan has hard constraint violations, apply a penalty for sorting rank
  if (!feasibility.isFeasible) {
    rawWeighted = Math.max(10, rawWeighted - 30);
  }

  const overallScore = Math.min(100, Math.max(0, Math.round(rawWeighted)));

  return {
    budgetScore,
    waterScore,
    agronomicScore,
    riskMitigationScore,
    yieldPotentialScore,
    overallScore
  };
}
