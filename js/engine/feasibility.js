/**
 * @file feasibility.js
 * Deterministic Multilingual Feasibility and Constraint Evaluation Engine for FarmWise
 */

import { t } from '../i18n/i18n.js';

/**
 * Calculates effective available water capacity in mm based on farmer supply,
 * current soil moisture, and 7-day rainfall forecast.
 * 
 * @param {import('../types.js').FarmContext} context 
 * @returns {number} Effective available water in mm
 */
export function calculateEffectiveWaterCapacity(context) {
  const { farmer, weather } = context;
  
  // Base water allocation by supply category
  let baseSupplyMm = 45; // Low / Rainfed deficit
  if (farmer.waterAvailability === 'Moderate') {
    baseSupplyMm = 75; // Canal rotation or limited borewell
  } else if (farmer.waterAvailability === 'High') {
    baseSupplyMm = 135; // Abundant tubewell / round-the-clock canal
  }

  // Soil moisture buffering (Soil moisture above 50% provides accessible root-zone buffer)
  const soilMoisture = farmer.soilMoisturePercent || 50;
  const soilBufferMm = Math.max(0, (soilMoisture - 30) * 0.4);

  // Rain forecast contribution with certainty discount (effective rainfall = rainMm * (probability / 100) * 0.7)
  const rainProbability = weather?.rainfallProbability || 0;
  const forecastRainMm = weather?.forecastRainMm || 0;
  const effectiveRainMm = forecastRainMm * (rainProbability / 100) * 0.7;

  return Math.round(baseSupplyMm + soilBufferMm + effectiveRainMm);
}

/**
 * Evaluates whether an agronomic plan satisfies all operational and financial constraints.
 * 
 * @param {Object} planData
 * @param {number} planData.estimatedCost - Total estimated cost in INR
 * @param {number} planData.waterRequirementMm - Stage water requirement in mm
 * @param {string} planData.strategyType - 'high_yield' | 'balanced' | 'low_cost'
 * @param {import('../types.js').FarmContext} context - Current Farm Context
 * @returns {import('../types.js').FeasibilityEvaluation}
 */
export function evaluateFeasibility(planData, context) {
  const { estimatedCost, waterRequirementMm, strategyType } = planData;
  const { farmer, weather, cropHealthRisk } = context;

  const budget = farmer.budget || 0;
  const effectiveWaterCapacityMm = calculateEffectiveWaterCapacity(context);
  const constraintViolations = [];

  // 1. Budget Constraint Check
  let budgetFit = true;
  let budgetDeficit = 0;

  if (estimatedCost > budget) {
    budgetFit = false;
    budgetDeficit = Math.round(estimatedCost - budget);
    constraintViolations.push(
      t('violations.budgetShortfall', {
        cost: estimatedCost.toLocaleString('en-IN'),
        budget: budget.toLocaleString('en-IN'),
        deficit: budgetDeficit.toLocaleString('en-IN')
      }, `Budget Shortfall: Plan cost of ₹${estimatedCost.toLocaleString('en-IN')} exceeds your available budget of ₹${budget.toLocaleString('en-IN')} by ₹${budgetDeficit.toLocaleString('en-IN')}.`)
    );
  }

  // 2. Water Availability Constraint Check
  let waterFit = true;
  let waterDeficitMm = 0;

  // We allow a minor tolerance (5%) before hard failure, but flag severe deficit
  if (waterRequirementMm > effectiveWaterCapacityMm) {
    waterDeficitMm = Math.round(waterRequirementMm - effectiveWaterCapacityMm);
    
    // Low availability cannot support high-water intensity plans
    if (farmer.waterAvailability === 'Low' && strategyType === 'high_yield') {
      waterFit = false;
      constraintViolations.push(
        t('violations.waterDeficit', {
          demand: waterRequirementMm,
          capacity: effectiveWaterCapacityMm,
          deficit: waterDeficitMm
        }, `Water Deficit: Requires ${waterRequirementMm} mm water, which exceeds your low water capacity (${effectiveWaterCapacityMm} mm) by ${waterDeficitMm} mm.`)
      );
    } else if (waterDeficitMm > 15) {
      waterFit = false;
      constraintViolations.push(
        t('violations.severeWaterStress', {
          demand: waterRequirementMm,
          capacity: effectiveWaterCapacityMm,
          deficit: waterDeficitMm
        }, `Severe Water Stress: Required irrigation depth of ${waterRequirementMm} mm exceeds total available capacity of ${effectiveWaterCapacityMm} mm by ${waterDeficitMm} mm.`)
      );
    }
  }

  // 3. Crop Stage Constraint Check
  let stageFit = true;
  if (farmer.cropStage === 'Maturity / Harvest' && strategyType === 'high_yield' && waterRequirementMm > 40) {
    stageFit = false;
    constraintViolations.push(
      t('violations.maturityMismatch', {}, `Maturity Stage Mismatch: Heavy irrigation at harvest maturity will cause grain lodging and fungal spoiling.`)
    );
  }

  // 4. Risk Tolerance Check
  let riskFit = true;
  if (cropHealthRisk === 'Critical' && strategyType === 'low_cost') {
    riskFit = false;
    constraintViolations.push(
      t('violations.insufficientProtection', {}, `Insufficient Protection: Under Critical pest/disease outbreak, organic contact sprays alone cannot prevent severe economic loss.`)
    );
  }

  const isFeasible = budgetFit && waterFit && stageFit && riskFit;

  return {
    isFeasible,
    budgetFit,
    budgetDeficit,
    waterFit,
    waterDeficitMm,
    stageFit,
    riskFit,
    constraintViolations
  };
}
