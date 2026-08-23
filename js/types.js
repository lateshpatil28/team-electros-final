/**
 * @file types.js
 * Centralized Type Definitions and Contracts for FarmWise Core Decision Engine
 */

/**
 * @typedef {'Wheat' | 'Rice' | 'Cotton' | 'Soybean' | 'Maize'} CropType
 */

/**
 * @typedef {'Sowing / Germination' | 'Vegetative / Tillering' | 'Flowering / Reproductive' | 'Grain Filling / Pod Formation' | 'Maturity / Harvest'} CropStage
 */

/**
 * @typedef {'Low' | 'Moderate' | 'High'} WaterAvailabilityLevel
 */

/**
 * @typedef {'Alluvial' | 'Black Cotton' | 'Sandy Loam' | 'Clay Loam' | 'Red Soil'} SoilType
 */

/**
 * @typedef {'Low' | 'Moderate' | 'High' | 'Critical'} RiskLevel
 */

/**
 * @typedef {'en' | 'hi' | 'pa' | 'mr' | 'te'} LanguageCode
 */

/**
 * @typedef {Object} FarmerProfile
 * @property {string} farmerName - Name of the farmer
 * @property {string} state - Indian State / Region
 * @property {string} district - District / Sub-district
 * @property {LanguageCode} preferredLanguage - Selected language
 * @property {CropType} crop - Selected crop
 * @property {CropStage} cropStage - Current physiological stage of crop
 * @property {number} farmSize - Farm size in acres (e.g. 1.5, 4.0)
 * @property {number} budget - Total available budget in INR (₹)
 * @property {WaterAvailabilityLevel} waterAvailability - Water supply category
 * @property {SoilType} soilCondition - Primary soil type
 * @property {number} soilMoisturePercent - Current soil moisture % (0 - 100)
 */

/**
 * @typedef {Object} WeatherContext
 * @property {number} temperatureC - Current / average temperature in Celsius
 * @property {number} humidityPercent - Relative humidity % (0 - 100)
 * @property {number} rainfallProbability - Forecast rain probability % (0 - 100)
 * @property {number} forecastRainMm - Expected rainfall in next 7-10 days in mm
 * @property {string} weatherSummary - Short descriptive weather forecast
 */

/**
 * @typedef {Object} FarmContext
 * @property {FarmerProfile} farmer
 * @property {WeatherContext} weather
 * @property {RiskLevel} cropHealthRisk
 * @property {string} riskFactorReason - Specific pest / weather stress driver
 * @property {number} timestamp - Last state update timestamp
 */

/**
 * @typedef {Object} PlanAction
 * @property {'irrigation' | 'nutrition' | 'protection' | 'soil_intercultural'} category
 * @property {string} title - Action title
 * @property {string} description - Detailed prescriptive instruction
 * @property {string} timing - When to execute (e.g. "Within 48 hours", "Morning 7-9 AM")
 * @property {number} costShare - Estimated INR cost for this action
 */

/**
 * @typedef {Object} FeasibilityEvaluation
 * @property {boolean} isFeasible - Overall feasibility status
 * @property {boolean} budgetFit - Budget compliance
 * @property {number} budgetDeficit - INR shortage (0 if within budget)
 * @property {boolean} waterFit - Water compliance
 * @property {number} waterDeficitMm - Water shortage in mm (0 if within supply)
 * @property {boolean} stageFit - Agronomic validity for current crop stage
 * @property {boolean} riskFit - Risk tolerance compliance
 * @property {string[]} constraintViolations - List of human-readable violation reasons
 */

/**
 * @typedef {Object} SuitabilityScoreBreakdown
 * @property {number} budgetScore - Score based on affordability & buffer (0-100)
 * @property {number} waterScore - Score based on irrigation efficiency & adequacy (0-100)
 * @property {number} agronomicScore - Score based on crop stage & soil match (0-100)
 * @property {number} riskMitigationScore - Score based on pest/weather protection (0-100)
 * @property {number} yieldPotentialScore - Expected yield efficiency (0-100)
 * @property {number} overallScore - Weighted composite score (0-100)
 */

/**
 * @typedef {Object} AgronomicPlan
 * @property {string} id - Unique identifier (e.g. "plan_high_yield")
 * @property {string} name - Display name (e.g. "High-Yield Precision Commercial Strategy")
 * @property {'high_yield' | 'balanced' | 'low_cost'} strategyType - Strategy classification
 * @property {PlanAction[]} actions - Specific prescriptive actions
 * @property {number} estimatedCost - Total cost for the entire farm size in INR (₹)
 * @property {number} costPerAcre - Cost per acre in INR (₹)
 * @property {number} waterRequirementMm - Water requirement in mm for this stage/week
 * @property {number} waterRequirementM3 - Water requirement in m³ for the farm size
 * @property {RiskLevel} residualRisk - Risk remaining after executing this plan
 * @property {FeasibilityEvaluation} feasibility - Feasibility evaluation details
 * @property {SuitabilityScoreBreakdown} score - Detailed suitability scoring
 * @property {string[]} reasons - Dynamically generated context-aware reasons
 * @property {string} tag - 'RECOMMENDED' | 'FEASIBLE ALTERNATIVE' | 'INFEASIBLE'
 */

/**
 * @typedef {Object} EngineResult
 * @property {AgronomicPlan} recommendedPlan - Best feasible plan
 * @property {AgronomicPlan[]} allPlans - All evaluated plans (sorted by suitability)
 * @property {AgronomicPlan[]} alternativeFeasiblePlans - Other feasible options
 * @property {AgronomicPlan[]} infeasiblePlans - Infeasible options with violations
 * @property {FarmContext} evaluatedContext - The context that was evaluated
 * @property {string[]} dynamicSummary - Executive summary bullets for the farmer
 */

/**
 * @typedef {Object} WhatIfScenario
 * @property {number} budget - Adjusted budget in INR (₹)
 * @property {WaterAvailabilityLevel} waterAvailability - Adjusted water supply
 * @property {number} rainfallProbability - Adjusted rainfall probability %
 * @property {number} soilMoisturePercent - Adjusted soil moisture %
 * @property {RiskLevel} cropHealthRisk - Adjusted crop health risk level
 */
