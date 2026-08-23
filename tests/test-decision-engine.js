/**
 * @file test-decision-engine.js
 * Comprehensive Automated Test Suite for FarmWise Decision Engine
 * Tests Scenarios A through G
 */

import { runDecisionEngine, runWhatIfSimulation } from '../js/engine/decisionEngine.js';
import { CROPS_DATA } from '../js/data/cropsData.js';
import { DEMO_PRESETS } from '../js/data/presetsData.js';

export function runAllTests() {
  const results = [];
  let passedCount = 0;
  let failedCount = 0;

  function assert(testName, condition, details = '') {
    if (condition) {
      passedCount++;
      results.push({ name: testName, status: 'PASSED', details });
      console.log(`✅ [PASS] ${testName} - ${details}`);
    } else {
      failedCount++;
      results.push({ name: testName, status: 'FAILED', details });
      console.error(`❌ [FAIL] ${testName} - ${details}`);
    }
  }

  console.log('🧪 Starting FarmWise Decision Engine Test Suite...\n');

  // =========================================================================
  // TEST A: Farmer with high budget and high water availability
  // =========================================================================
  const contextA = {
    farmer: {
      farmerName: 'Baldev Singh (High Resource)',
      state: 'Punjab',
      district: 'Ludhiana',
      preferredLanguage: 'pa',
      crop: 'Wheat',
      cropStage: 'Vegetative / Tillering',
      farmSize: 4.0,
      budget: 60000,
      waterAvailability: 'High',
      soilCondition: 'Alluvial',
      soilMoisturePercent: 70
    },
    weather: {
      temperatureC: 22,
      humidityPercent: 60,
      rainfallProbability: 15,
      forecastRainMm: 5,
      weatherSummary: 'Sunny and optimal.'
    },
    cropHealthRisk: 'Low',
    riskFactorReason: 'Clean field with minimal pest pressure.',
    timestamp: Date.now()
  };

  const resultA = runDecisionEngine(contextA);
  assert(
    'TEST A: High Budget & High Water Selection',
    resultA.recommendedPlan.strategyType === 'high_yield' && resultA.recommendedPlan.feasibility.isFeasible,
    `Recommended: ${resultA.recommendedPlan.name} (Score: ${resultA.recommendedPlan.score.overallScore}/100, Cost: ₹${resultA.recommendedPlan.estimatedCost})`
  );

  // =========================================================================
  // TEST B: Farmer with low budget and low water availability
  // =========================================================================
  const contextB = {
    farmer: {
      farmerName: 'Shambhu Lal (Low Resource)',
      state: 'Madhya Pradesh',
      district: 'Dewas',
      preferredLanguage: 'hi',
      crop: 'Wheat',
      cropStage: 'Vegetative / Tillering',
      farmSize: 4.0,
      budget: 15000, // tight budget (₹3,750/ac)
      waterAvailability: 'Low',
      soilCondition: 'Alluvial',
      soilMoisturePercent: 30
    },
    weather: {
      temperatureC: 28,
      humidityPercent: 45,
      rainfallProbability: 5,
      forecastRainMm: 0,
      weatherSummary: 'Dry conditions.'
    },
    cropHealthRisk: 'Low',
    riskFactorReason: 'No major pest outbreaks.',
    timestamp: Date.now()
  };

  const resultB = runDecisionEngine(contextB);
  assert(
    'TEST B: Low Budget & Low Water Selection',
    resultB.recommendedPlan.strategyType === 'low_cost' && resultB.recommendedPlan.feasibility.isFeasible,
    `Recommended: ${resultB.recommendedPlan.name} (Score: ${resultB.recommendedPlan.score.overallScore}/100, Cost: ₹${resultB.recommendedPlan.estimatedCost})`
  );

  // Recommendation A vs B must be distinctly different
  assert(
    'TEST A vs B: Different recommendations for different resource profiles',
    resultA.recommendedPlan.strategyType !== resultB.recommendedPlan.strategyType,
    `Profile A got '${resultA.recommendedPlan.strategyType}' vs Profile B got '${resultB.recommendedPlan.strategyType}'`
  );

  // =========================================================================
  // TEST C: Take same farmer and reduce budget significantly
  // =========================================================================
  const contextC_lowBudget = {
    ...contextA,
    farmer: {
      ...contextA.farmer,
      budget: 18000 // Slashed from 60,000 to 18,000 for 4 acres
    }
  };
  const resultC = runDecisionEngine(contextC_lowBudget);
  const highYieldInC = resultC.allPlans.find(p => p.strategyType === 'high_yield');

  assert(
    'TEST C: High-Yield Plan becomes Infeasible on Budget Reduction',
    !highYieldInC.feasibility.isFeasible && highYieldInC.feasibility.budgetDeficit > 0,
    `High-Yield plan cost: ₹${highYieldInC.estimatedCost} > budget ₹${contextC_lowBudget.farmer.budget} (Deficit: ₹${highYieldInC.feasibility.budgetDeficit})`
  );

  assert(
    'TEST C: Recommendation shifts to an affordable plan',
    resultC.recommendedPlan.strategyType !== 'high_yield' && resultC.recommendedPlan.feasibility.isFeasible,
    `New Recommended Plan: ${resultC.recommendedPlan.name} (Cost: ₹${resultC.recommendedPlan.estimatedCost})`
  );

  // =========================================================================
  // TEST D: Take same farmer and reduce water availability
  // =========================================================================
  const contextD_lowWater = {
    ...contextA,
    farmer: {
      ...contextA.farmer,
      waterAvailability: 'Low',
      soilMoisturePercent: 20
    },
    weather: {
      ...contextA.weather,
      rainfallProbability: 0,
      forecastRainMm: 0
    }
  };
  const resultD = runDecisionEngine(contextD_lowWater);
  const highYieldInD = resultD.allPlans.find(p => p.strategyType === 'high_yield');

  assert(
    'TEST D: High-Water Plan flags water constraint violation under Low Water',
    !highYieldInD.feasibility.waterFit || highYieldInD.score.waterScore < 60,
    `Water score penalized to ${highYieldInD.score.waterScore}/100, Water Fit: ${highYieldInD.feasibility.waterFit}`
  );

  // =========================================================================
  // TEST E: Change Crop from Wheat to Cotton
  // =========================================================================
  const contextE_cotton = {
    ...contextA,
    farmer: {
      ...contextA.farmer,
      crop: 'Cotton',
      cropStage: 'Flowering / Reproductive',
      soilCondition: 'Black Cotton',
      budget: 40000
    }
  };
  const resultE = runDecisionEngine(contextE_cotton);

  assert(
    'TEST E: Crop-specific Cotton plans and actions generated',
    resultE.recommendedPlan.name.includes('Cotton') && 
    resultE.recommendedPlan.actions.some(a => a.description.toLowerCase().includes('boll') || a.description.toLowerCase().includes('square')),
    `Cotton plan: "${resultE.recommendedPlan.name}", Actions cite cotton-specific physiology (boll/squares).`
  );

  // =========================================================================
  // TEST F: Change Crop Stage from Sowing to Flowering
  // =========================================================================
  const contextF_sowing = {
    ...contextA,
    farmer: {
      ...contextA.farmer,
      cropStage: 'Sowing / Germination'
    }
  };
  const contextF_flowering = {
    ...contextA,
    farmer: {
      ...contextA.farmer,
      cropStage: 'Flowering / Reproductive'
    }
  };
  const resultF_sowing = runDecisionEngine(contextF_sowing);
  const resultF_flowering = runDecisionEngine(contextF_flowering);

  assert(
    'TEST F: Stage-specific water demands & actions adjust between Sowing and Flowering',
    resultF_flowering.recommendedPlan.waterRequirementMm > resultF_sowing.recommendedPlan.waterRequirementMm,
    `Flowering water demand (${resultF_flowering.recommendedPlan.waterRequirementMm} mm) > Sowing water demand (${resultF_sowing.recommendedPlan.waterRequirementMm} mm)`
  );

  // =========================================================================
  // TEST G: Real-Time What-If Simulation Reactivity
  // =========================================================================
  const whatIfSim = runWhatIfSimulation(contextA, {
    budget: 15000,
    waterAvailability: 'Low',
    rainfallProbability: 0,
    soilMoisturePercent: 20
  });

  assert(
    'TEST G: What-If Simulator detects recommendation shift dynamically',
    whatIfSim.changedRecommendation && whatIfSim.simulatedResult.recommendedPlan.strategyType !== 'high_yield',
    `Original plan: ${whatIfSim.baseResult.recommendedPlan.name} -> Simulated plan: ${whatIfSim.simulatedResult.recommendedPlan.name}`
  );

  console.log(`\n========================================`);
  console.log(`TEST SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log(`========================================\n`);

  return { passedCount, failedCount, results };
}
