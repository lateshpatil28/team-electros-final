/**
 * @file i18n.js
 * Reactive Multilingual Localization Engine for FarmWise
 * Preserves Farm Context and updates UI text reactively without re-executing calculations.
 */

import { TRANSLATIONS } from './translations.js';

const STORAGE_KEY = 'farmwise_user_language';
const SUPPORTED_LANGUAGES = ['en', 'hi', 'mr', 'pa'];
const DEFAULT_LANGUAGE = 'en';

class I18nEngine {
  constructor() {
    this.currentLanguage = this.loadSavedLanguage();
    this.listeners = new Set();
  }

  loadSavedLanguage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED_LANGUAGES.includes(saved)) {
        return saved;
      }
    } catch (e) {
      // localStorage may be disabled in some environments
    }
    return DEFAULT_LANGUAGE;
  }

  getLanguage() {
    return this.currentLanguage;
  }

  setLanguage(langCode) {
    if (!SUPPORTED_LANGUAGES.includes(langCode)) {
      console.warn(`[i18n] Unsupported language "${langCode}". Defaulting to English.`);
      langCode = DEFAULT_LANGUAGE;
    }

    if (this.currentLanguage === langCode) return;

    this.currentLanguage = langCode;

    try {
      localStorage.setItem(STORAGE_KEY, langCode);
    } catch (e) {}

    // Update document lang & direction
    document.documentElement.lang = langCode;

    this.notify();
  }

  /**
   * Translate a key with optional parameters
   * @param {string} key - e.g. "app.title" or "recommendation.whySubtitle"
   * @param {Object} [params] - Key-value replacements e.g. { farmerName: 'Ramesh' }
   * @param {string} [fallback] - Optional default string if key is missing
   * @returns {string}
   */
  t(key, params = {}, fallback = '') {
    const langDict = TRANSLATIONS[this.currentLanguage] || TRANSLATIONS.en;
    const defaultDict = TRANSLATIONS.en;

    const val = this.getNested(langDict, key) ?? this.getNested(defaultDict, key) ?? fallback ?? key;

    if (typeof val !== 'string') {
      return String(val ?? key);
    }

    // Replace {placeholder} tokens
    return val.replace(/\{(\w+)\}/g, (match, paramName) => {
      return params[paramName] !== undefined ? params[paramName] : match;
    });
  }

  getNested(obj, path) {
    if (!obj || !path) return undefined;
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  // Domain Helper Translators
  translateCrop(cropName) {
    return this.t(`crops.${cropName}`, {}, cropName);
  }

  translateStage(stageName) {
    return this.t(`stages.${stageName}`, {}, stageName);
  }

  translateSoil(soilName) {
    return this.t(`soils.${soilName}`, {}, soilName);
  }

  translateWater(waterLevel) {
    return this.t(`waterShort.${waterLevel}`, {}, waterLevel);
  }

  translateWaterFull(waterLevel) {
    return this.t(`waterLevels.${waterLevel}`, {}, waterLevel);
  }

  translateRisk(riskLevel) {
    return this.t(`risks.${riskLevel}`, {}, riskLevel);
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(fn => {
      try {
        fn(this.currentLanguage);
      } catch (err) {
        console.error('[i18n] Error in subscriber:', err);
      }
    });
  }
}

export const i18n = new I18nEngine();
export const t = (key, params, fallback) => i18n.t(key, params, fallback);
