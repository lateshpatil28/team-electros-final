/**
 * @file presetsData.js
 * Regional presets and demo datasets for FarmWise
 */

export const REGIONS_DATA = {
  Punjab: {
    districts: ['Ludhiana', 'Bhatinda', 'Amritsar', 'Patiala', 'Jalandhar', 'Sangrur', 'Firozpur'],
    defaultSoil: 'Alluvial',
    defaultLanguage: 'pa'
  },
  Haryana: {
    districts: ['Karnal', 'Hisar', 'Sirsa', 'Kurukshetra', 'Ambala', 'Rohtak'],
    defaultSoil: 'Alluvial',
    defaultLanguage: 'hi'
  },
  Maharashtra: {
    districts: ['Yavatmal', 'Nagpur', 'Amravati', 'Aurangabad', 'Nashik', 'Kolhapur', 'Akola'],
    defaultSoil: 'Black Cotton',
    defaultLanguage: 'mr'
  },
  'Madhya Pradesh': {
    districts: ['Indore', 'Ujjain', 'Hoshangabad', 'Sehore', 'Dewas', 'Bhopal', 'Dhar'],
    defaultSoil: 'Black Cotton',
    defaultLanguage: 'hi'
  },
  'Uttar Pradesh': {
    districts: ['Meerut', 'Varanasi', 'Gorakhpur', 'Aligarh', 'Kanpur', 'Bareilly', 'Agra'],
    defaultSoil: 'Alluvial',
    defaultLanguage: 'hi'
  },
  Gujarat: {
    districts: ['Rajkot', 'Surat', 'Vadodara', 'Junagadh', 'Bhavnagar', 'Mehsana', 'Ahmedabad'],
    defaultSoil: 'Sandy Loam',
    defaultLanguage: 'gu'
  },
  'Andhra Pradesh': {
    districts: ['Guntur', 'Krishna', 'East Godavari', 'West Godavari', 'Kurnool', 'Anantapur'],
    defaultSoil: 'Red Soil',
    defaultLanguage: 'te'
  },
  Karnataka: {
    districts: ['Belagavi', 'Dharwad', 'Shimoga', 'Raichur', 'Davangere', 'Mysuru'],
    defaultSoil: 'Red Soil',
    defaultLanguage: 'kn'
  }
};

export const DEMO_PRESETS = [
  {
    id: 'punjab_wheat_high',
    title: 'Punjab Commercial Wheat (High Budget, High Water)',
    description: '4 acres in Ludhiana with ₹60,000 budget and abundant tubewell water. Tests maximum yield recommendation.',
    data: {
      farmerName: 'Gurpreet Singh',
      state: 'Punjab',
      district: 'Ludhiana',
      preferredLanguage: 'pa',
      crop: 'Wheat',
      cropStage: 'Vegetative / Tillering',
      farmSize: 4.0,
      budget: 60000,
      waterAvailability: 'High',
      soilCondition: 'Alluvial',
      soilMoisturePercent: 65,
      weather: {
        temperatureC: 22,
        humidityPercent: 60,
        rainfallProbability: 15,
        forecastRainMm: 5,
        weatherSummary: 'Clear skies, mild winter breeze, optimal tillering temperature.'
      },
      cropHealthRisk: 'Low',
      riskFactorReason: 'Minor localized aphid presence; well within economic threshold.'
    }
  },
  {
    id: 'vidarbha_cotton_stress',
    title: 'Vidarbha Water-Stressed Cotton (Low Water, High Pest Risk)',
    description: '3 acres in Yavatmal with ₹30,000 budget, limited water, and high Pink Bollworm risk during flowering.',
    data: {
      farmerName: 'Eknath Shinde',
      state: 'Maharashtra',
      district: 'Yavatmal',
      preferredLanguage: 'mr',
      crop: 'Cotton',
      cropStage: 'Flowering / Reproductive',
      farmSize: 3.0,
      budget: 30000,
      waterAvailability: 'Low',
      soilCondition: 'Black Cotton',
      soilMoisturePercent: 40,
      weather: {
        temperatureC: 33,
        humidityPercent: 70,
        rainfallProbability: 35,
        forecastRainMm: 12,
        weatherSummary: 'Warm and humid, favorable for bollworm emergence.'
      },
      cropHealthRisk: 'High',
      riskFactorReason: 'Trap catches indicate elevated Pink Bollworm egg-laying.'
    }
  },
  {
    id: 'mp_soybean_rainfed',
    title: 'MP Rainfed Soybean (Moderate Budget, Sandy Clay)',
    description: '2.5 acres in Indore with ₹25,000 budget and moderate rainfed water during pod formation.',
    data: {
      farmerName: 'Rajesh Patidar',
      state: 'Madhya Pradesh',
      district: 'Indore',
      preferredLanguage: 'hi',
      crop: 'Soybean',
      cropStage: 'Grain Filling / Pod Formation',
      farmSize: 2.5,
      budget: 25000,
      waterAvailability: 'Moderate',
      soilCondition: 'Clay Loam',
      soilMoisturePercent: 55,
      weather: {
        temperatureC: 29,
        humidityPercent: 75,
        rainfallProbability: 50,
        forecastRainMm: 25,
        weatherSummary: 'Scattered monsoon showers expected in next 5 days.'
      },
      cropHealthRisk: 'Moderate',
      riskFactorReason: 'Moderate defoliator caterpillar incidence on lower canopy.'
    }
  },
  {
    id: 'up_maize_balanced',
    title: 'UP Alluvial Maize (Tight Budget Constraint)',
    description: '2 acres in Meerut with ₹12,000 tight budget during grand growth. Tests low-cost feasibility selection.',
    data: {
      farmerName: 'Dharmendra Kumar',
      state: 'Uttar Pradesh',
      district: 'Meerut',
      preferredLanguage: 'hi',
      crop: 'Maize',
      cropStage: 'Vegetative / Tillering',
      farmSize: 2.0,
      budget: 12000,
      waterAvailability: 'Moderate',
      soilCondition: 'Alluvial',
      soilMoisturePercent: 50,
      weather: {
        temperatureC: 31,
        humidityPercent: 65,
        rainfallProbability: 20,
        forecastRainMm: 8,
        weatherSummary: 'Warm sunny intervals, ideal for vegetative vegetative spurts.'
      },
      cropHealthRisk: 'Moderate',
      riskFactorReason: 'Early whorl damage by Fall Armyworm on border rows.'
    }
  },
  {
    id: 'ap_rice_coastal',
    title: 'Andhra Coastal Rice (High Water, Moderate Budget)',
    description: '3 acres in Guntur with ₹45,000 budget and high canal water availability during flowering.',
    data: {
      farmerName: 'Venkata Reddy',
      state: 'Andhra Pradesh',
      district: 'Guntur',
      preferredLanguage: 'te',
      crop: 'Rice',
      cropStage: 'Flowering / Reproductive',
      farmSize: 3.0,
      budget: 45000,
      waterAvailability: 'High',
      soilCondition: 'Clay Loam',
      soilMoisturePercent: 80,
      weather: {
        temperatureC: 32,
        humidityPercent: 85,
        rainfallProbability: 60,
        forecastRainMm: 45,
        weatherSummary: 'Humid coastal weather with monsoon downpour warnings.'
      },
      cropHealthRisk: 'High',
      riskFactorReason: 'High humidity creating conducive environment for Neck Blast.'
    }
  }
];
