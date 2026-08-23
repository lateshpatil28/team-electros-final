/**
 * @file decisionEngine.js
 * Core Deterministic Agronomic Decision Engine for FarmWise
 * Evaluates candidate plans, computes feasibility & scores, and selects optimal recommendations.
 */

import { CROPS_DATA, getLocalizedStrategyMeta, calculateCropEconomics } from '../data/cropsData.js';
import { evaluateFeasibility } from './feasibility.js';
import { calculateSuitabilityScore } from './scoring.js';
import { generatePlanReasons } from './explanations.js';

/**
 * Runs the deterministic decision engine on a given Farm Context.
 * 
 * @param {import('../types.js').FarmContext} context 
 * @returns {import('../types.js').EngineResult}
 */
export function runDecisionEngine(context) {
  if (!context || !context.farmer) {
    throw new Error('Invalid Farm Context provided to Decision Engine.');
  }

  const { farmer } = context;
  const cropKey = farmer.crop;
  const cropConfig = CROPS_DATA[cropKey] || CROPS_DATA.Wheat;
  const stageKey = farmer.cropStage || 'Vegetative / Tillering';
  const stageData = cropConfig.stages?.[stageKey] || cropConfig.stages['Vegetative / Tillering'];
  const farmSize = Math.max(0.1, Number(farmer.farmSize) || 1.0);

  // Soil adjustment factor on costs
  let soilCostMultiplier = 1.0;
  if (farmer.soilCondition === 'Clay Loam' || farmer.soilCondition === 'Black Cotton') {
    soilCostMultiplier = 1.03;
  } else if (farmer.soilCondition === 'Sandy Loam') {
    soilCostMultiplier = 0.98;
  }

  // Soil moisture adjustment on water demand
  const moisturePercent = farmer.soilMoisturePercent || 50;
  const moistureDeficitFactor = Math.max(0.75, Math.min(1.25, 1.20 - (moisturePercent / 200)));

  // Generate and evaluate each plan strategy template (High-Yield, Balanced, Low-Cost)
  const templateKeys = ['high_yield', 'balanced', 'low_cost'];
  const evaluatedPlans = templateKeys.map(strategyKey => {
    const template = cropConfig.planTemplates[strategyKey];
    if (!template) return null;

    const localizedMeta = getLocalizedStrategyMeta(strategyKey);

    // 1. Calculate Costs
    const baseStageCostPerAcre = stageData.stageCostPerAcre[strategyKey] || 4000;
    const costPerAcre = Math.round(baseStageCostPerAcre * soilCostMultiplier);
    const estimatedCost = Math.round(costPerAcre * farmSize);

    // 2. Calculate Water Requirements
    const baseWaterDemandMm = stageData.baseWaterDemandMm || 60;
    const waterFactor = template.waterFactor || 1.0;
    const waterRequirementMm = Math.round(baseWaterDemandMm * waterFactor * moistureDeficitFactor);
    const waterRequirementM3 = Math.round(waterRequirementMm * 40.468 * farmSize);

    // 3. Extract Stage-Specific Actions
    const actions = template.getStageActions(stageKey, context);

    // 4. Calculate Residual Risk Level
    let residualRisk = 'Low';
    if (context.cropHealthRisk === 'Critical') {
      residualRisk = strategyKey === 'high_yield' ? 'Low' : (strategyKey === 'balanced' ? 'Moderate' : 'High');
    } else if (context.cropHealthRisk === 'High') {
      residualRisk = strategyKey === 'high_yield' ? 'Low' : (strategyKey === 'balanced' ? 'Low' : 'Moderate');
    }

    const planData = {
      id: template.id,
      name: localizedMeta.name,
      strategyType: template.strategyType,
      description: localizedMeta.description,
      actions,
      estimatedCost,
      costPerAcre,
      waterRequirementMm,
      waterRequirementM3,
      yieldIndex: template.yieldIndex,
      yieldMultiplier: template.yieldMultiplier || (template.yieldIndex / 82),
      residualRisk
    };

    // 5. Feasibility Evaluation
    const feasibility = evaluateFeasibility(planData, context);

    // 6. Suitability Scoring
    const score = calculateSuitabilityScore(planData, feasibility, context, cropConfig);

    // 7. Dynamic Rationale Generation
    const reasons = generatePlanReasons(planData, feasibility, score, context, cropConfig);

    return {
      ...planData,
      feasibility,
      score,
      reasons,
      tag: 'FEASIBLE ALTERNATIVE'
    };
  }).filter(Boolean);

  // Separate Feasible and Infeasible plans
  const feasiblePlans = evaluatedPlans.filter(p => p.feasibility.isFeasible);
  const infeasiblePlans = evaluatedPlans.filter(p => !p.feasibility.isFeasible);

  // Sort feasible plans by overallScore descending
  feasiblePlans.sort((a, b) => b.score.overallScore - a.score.overallScore);
  // Sort infeasible plans by overallScore descending
  infeasiblePlans.sort((a, b) => b.score.overallScore - a.score.overallScore);

  let recommendedPlan = null;
  let alternativeFeasiblePlans = [];

  if (feasiblePlans.length > 0) {
    recommendedPlan = feasiblePlans[0];
    recommendedPlan.tag = 'RECOMMENDED';
    alternativeFeasiblePlans = feasiblePlans.slice(1);
    alternativeFeasiblePlans.forEach(p => { p.tag = 'FEASIBLE ALTERNATIVE'; });
  } else {
    recommendedPlan = infeasiblePlans[0];
    recommendedPlan.tag = 'RECOMMENDED (CONDITIONAL)';
    alternativeFeasiblePlans = [];
  }

  infeasiblePlans.forEach(p => {
    if (p.id !== recommendedPlan?.id) {
      p.tag = 'INFEASIBLE';
    }
  });

  const allPlans = [
    ...(recommendedPlan ? [recommendedPlan] : []),
    ...alternativeFeasiblePlans,
    ...infeasiblePlans.filter(p => p.id !== recommendedPlan?.id)
  ];

  const dynamicSummary = [
    `Evaluated 3 strategies for ${farmer.farmerName || 'Farmer'} (${farmer.farmSize} acres of ${farmer.crop}).`,
    `Recommended: ${recommendedPlan.name} (${recommendedPlan.score.overallScore}/100 score).`,
    `Budget: ₹${recommendedPlan.estimatedCost.toLocaleString('en-IN')} (Budget: ₹${farmer.budget.toLocaleString('en-IN')}).`,
    `Water Demand: ${recommendedPlan.waterRequirementMm} mm (${recommendedPlan.waterRequirementM3.toLocaleString('en-IN')} m³ total).`
  ];

  return {
    recommendedPlan,
    allPlans,
    alternativeFeasiblePlans,
    infeasiblePlans,
    evaluatedContext: JSON.parse(JSON.stringify(context)),
    dynamicSummary
  };
}

/**
 * Runs a What-If simulation by applying delta parameters to base context,
 * then executing the exact same decision engine.
 * 
 * @param {import('../types.js').FarmContext} baseContext 
 * @param {import('../types.js').WhatIfScenario} scenarioDeltas 
 * @returns {{ baseResult: import('../types.js').EngineResult, simulatedResult: import('../types.js').EngineResult, changedRecommendation: boolean, deltaSummary: Object, baseEconomics: Object, simulatedEconomics: Object }}
 */
export function runWhatIfSimulation(baseContext, scenarioDeltas = {}) {
  const baseResult = runDecisionEngine(baseContext);
  const simulatedContext = JSON.parse(JSON.stringify(baseContext));

  if (scenarioDeltas.budget !== undefined) {
    simulatedContext.farmer.budget = Number(scenarioDeltas.budget);
  }
  if (scenarioDeltas.waterAvailability !== undefined) {
    simulatedContext.farmer.waterAvailability = scenarioDeltas.waterAvailability;
  }
  if (scenarioDeltas.soilMoisturePercent !== undefined) {
    simulatedContext.farmer.soilMoisturePercent = Number(scenarioDeltas.soilMoisturePercent);
  }
  if (scenarioDeltas.rainfallProbability !== undefined) {
    simulatedContext.weather.rainfallProbability = Number(scenarioDeltas.rainfallProbability);
  }
  if (scenarioDeltas.cropHealthRisk !== undefined) {
    simulatedContext.cropHealthRisk = scenarioDeltas.cropHealthRisk;
  }

  const simulatedResult = runDecisionEngine(simulatedContext);

  const changedRecommendation = baseResult.recommendedPlan.strategyType !== simulatedResult.recommendedPlan.strategyType;

  // Compute Crop Economics for baseline and simulated scenarios
  const baseEconomics = calculateCropEconomics(baseResult.recommendedPlan, baseContext.farmer, { mode: 'current' });
  const simulatedEconomics = calculateCropEconomics(simulatedResult.recommendedPlan, simulatedContext.farmer, scenarioDeltas.marketPriceScenario);

  const deltaSummary = {
    budgetDiff: simulatedContext.farmer.budget - baseContext.farmer.budget,
    costDiff: simulatedResult.recommendedPlan.estimatedCost - baseResult.recommendedPlan.estimatedCost,
    waterDiffMm: simulatedResult.recommendedPlan.waterRequirementMm - baseResult.recommendedPlan.waterRequirementMm,
    scoreDiff: simulatedResult.recommendedPlan.score.overallScore - baseResult.recommendedPlan.score.overallScore,
    previousPlanName: baseResult.recommendedPlan.name,
    newPlanName: simulatedResult.recommendedPlan.name,
    changedRecommendation,
    baseEconomics,
    simulatedEconomics
  };

  return {
    baseResult,
    simulatedResult,
    changedRecommendation,
    deltaSummary,
    baseEconomics,
    simulatedEconomics
  };
}
