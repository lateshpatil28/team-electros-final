/**
 * @file farmContext.js
 * Centralized Reactive State Store for Farm Context and What-If Simulations
 */

import { DEMO_PRESETS } from '../data/presetsData.js';
import { runDecisionEngine, runWhatIfSimulation } from '../engine/decisionEngine.js';
import { i18n } from '../i18n/i18n.js';

// Default initial baseline state
const DEFAULT_FARM_CONTEXT = {
  farmer: {
    farmerName: 'Ramesh Patel',
    state: 'Maharashtra',
    district: 'Yavatmal',
    preferredLanguage: 'mr',
    crop: 'Cotton',
    cropStage: 'Flowering / Reproductive',
    farmSize: 3.0,
    budget: 35000,
    waterAvailability: 'Moderate',
    soilCondition: 'Black Cotton',
    soilMoisturePercent: 50
  },
  weather: {
    temperatureC: 31,
    humidityPercent: 68,
    rainfallProbability: 30,
    forecastRainMm: 15,
    weatherSummary: 'Partly cloudy with isolated light showers expected.'
  },
  cropHealthRisk: 'Moderate',
  riskFactorReason: 'Moderate sucking pest presence and sporadic square shedding.',
  timestamp: Date.now()
};

class FarmContextStore {
  constructor() {
    this.context = JSON.parse(JSON.stringify(DEFAULT_FARM_CONTEXT));
    this.listeners = new Set();
    this.whatIfListeners = new Set();

    // Default What-If scenario mirroring active context
    this.whatIfScenario = {
      active: false,
      budget: this.context.farmer.budget,
      waterAvailability: this.context.farmer.waterAvailability,
      rainfallProbability: this.context.weather.rainfallProbability,
      soilMoisturePercent: this.context.farmer.soilMoisturePercent,
      cropHealthRisk: this.context.cropHealthRisk,
      marketPriceScenario: { mode: 'current', customPrice: 0 }
    };

    // Cache latest engine result
    this.latestResult = null;
    this.recompute();

    // Automatically recompute & notify when UI language changes
    if (typeof i18n !== 'undefined' && i18n.subscribe) {
      i18n.subscribe(() => {
        this.recompute();
        this.notify();
      });
    }
  }

  getContext() {
    return JSON.parse(JSON.stringify(this.context));
  }

  getWhatIfScenario() {
    return JSON.parse(JSON.stringify(this.whatIfScenario));
  }

  getEngineResult() {
    if (!this.latestResult) {
      this.recompute();
    }
    return this.latestResult;
  }

  recompute() {
    this.latestResult = runDecisionEngine(this.context);
  }

  updateFarmer(farmerPartial) {
    this.context.farmer = {
      ...this.context.farmer,
      ...farmerPartial
    };
    this.context.timestamp = Date.now();
    this.syncWhatIfDefaults();
    this.recompute();
    this.notify();
  }

  updateWeather(weatherPartial) {
    this.context.weather = {
      ...this.context.weather,
      ...weatherPartial
    };
    this.context.timestamp = Date.now();
    this.syncWhatIfDefaults();
    this.recompute();
    this.notify();
  }

  updateRisk(riskLevel, reason) {
    this.context.cropHealthRisk = riskLevel;
    if (reason) this.context.riskFactorReason = reason;
    this.context.timestamp = Date.now();
    this.syncWhatIfDefaults();
    this.recompute();
    this.notify();
  }

  setFullContext(newContext) {
    this.context = JSON.parse(JSON.stringify(newContext));
    this.context.timestamp = Date.now();
    this.syncWhatIfDefaults();
    this.recompute();
    this.notify();
  }

  loadPreset(presetId) {
    const preset = DEMO_PRESETS.find(p => p.id === presetId) || DEMO_PRESETS[0];
    if (preset) {
      this.setFullContext({
        farmer: { ...preset.data },
        weather: { ...preset.data.weather },
        cropHealthRisk: preset.data.cropHealthRisk,
        riskFactorReason: preset.data.riskFactorReason,
        timestamp: Date.now()
      });
    }
  }

  resetToDefault() {
    this.setFullContext(DEFAULT_FARM_CONTEXT);
    this.resetWhatIf();
  }

  syncWhatIfDefaults() {
    if (!this.whatIfScenario.active) {
      this.whatIfScenario.budget = this.context.farmer.budget;
      this.whatIfScenario.waterAvailability = this.context.farmer.waterAvailability;
      this.whatIfScenario.rainfallProbability = this.context.weather.rainfallProbability;
      this.whatIfScenario.soilMoisturePercent = this.context.farmer.soilMoisturePercent;
      this.whatIfScenario.cropHealthRisk = this.context.cropHealthRisk;
      this.whatIfScenario.marketPriceScenario = { mode: 'current', customPrice: 0 };
    }
  }

  updateWhatIf(scenarioPartial) {
    this.whatIfScenario = {
      ...this.whatIfScenario,
      ...scenarioPartial,
      active: true
    };
    this.notifyWhatIf();
  }

  resetWhatIf() {
    this.whatIfScenario = {
      active: false,
      budget: this.context.farmer.budget,
      waterAvailability: this.context.farmer.waterAvailability,
      rainfallProbability: this.context.weather.rainfallProbability,
      soilMoisturePercent: this.context.farmer.soilMoisturePercent,
      cropHealthRisk: this.context.cropHealthRisk,
      marketPriceScenario: { mode: 'current', customPrice: 0 }
    };
    this.notifyWhatIf();
  }

  runWhatIfComparison() {
    return runWhatIfSimulation(this.context, this.whatIfScenario);
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  subscribeWhatIf(listener) {
    this.whatIfListeners.add(listener);
    return () => this.whatIfListeners.delete(listener);
  }

  notify() {
    const ctx = this.getContext();
    const result = this.getEngineResult();
    this.listeners.forEach(fn => {
      try {
        fn(ctx, result);
      } catch (err) {
        console.error('Error in FarmContext subscriber:', err);
      }
    });
    this.notifyWhatIf();
  }

  notifyWhatIf() {
    const whatIf = this.getWhatIfScenario();
    const comparison = this.runWhatIfComparison();
    this.whatIfListeners.forEach(fn => {
      try {
        fn(whatIf, comparison);
      } catch (err) {
        console.error('Error in WhatIf subscriber:', err);
      }
    });
  }
}

export const farmStore = new FarmContextStore();
