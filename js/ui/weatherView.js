/**
 * @file weatherView.js
 * Live & Simulated Weather Display Component for FarmWise
 * Integrates Open-Meteo live API, 5-day forecast, mode toggles, and context synchronization.
 */

import { WeatherService } from '../services/weatherService.js';
import { farmStore } from '../state/farmContext.js';
import { i18n, t } from '../i18n/i18n.js';

let latestWeatherData = null;
let isLoadingWeather = false;

export function initWeatherView() {
  const container = document.getElementById('weather-container');
  if (!container) return;

  loadWeatherForActiveContext();

  // Re-fetch weather when district/state changes in farm store
  farmStore.subscribe((context) => {
    const activeDistrict = context.farmer.district;
    if (!latestWeatherData || latestWeatherData.district !== activeDistrict) {
      loadWeatherForActiveContext();
    }
  });

  i18n.subscribe(() => {
    if (latestWeatherData) {
      renderWeatherUI(latestWeatherData);
    }
  });
}

async function loadWeatherForActiveContext() {
  const container = document.getElementById('weather-container');
  if (!container) return;

  const currentCtx = farmStore.getContext();
  const district = currentCtx.farmer.district || 'Ludhiana';

  isLoadingWeather = true;
  renderLoadingState();

  try {
    const data = await WeatherService.fetchWeatherForDistrict(district);
    latestWeatherData = data;
    isLoadingWeather = false;
    renderWeatherUI(data);
  } catch (err) {
    console.error('Weather load error:', err);
    isLoadingWeather = false;
  }
}

function renderLoadingState() {
  const container = document.getElementById('weather-container');
  if (!container) return;

  container.innerHTML = `
    <div class="weather-card">
      <div class="scan-loading" style="padding: 2rem;">
        <div class="spinner"></div>
        <p>Fetching agrometeorological forecast...</p>
      </div>
    </div>
  `;
}

function renderWeatherUI(weatherData) {
  const container = document.getElementById('weather-container');
  if (!container || !weatherData) return;

  const isLive = weatherData.isLive;
  const badgeClass = isLive ? 'badge-emerald' : 'badge-amber';
  const badgeText = isLive ? t('weather.liveBadge') : t('weather.simBadge');
  const currentMode = WeatherService.getMode();

  container.innerHTML = `
    <div class="weather-card">
      <div class="weather-top-bar">
        <div class="form-header" style="margin-bottom: 0;">
          <span class="form-icon">⛅</span>
          <div>
            <div class="flex-row gap-xs">
              <h2 class="form-title">${t('weather.title')}</h2>
              <span class="badge ${badgeClass}">${badgeText}</span>
            </div>
            <p class="form-subtitle">${t('weather.subtitle')}</p>
          </div>
        </div>

        <!-- Controls: Mode Switch & Sync -->
        <div class="weather-actions-group">
          <button type="button" class="btn-ghost-sm" id="btn-toggle-weather-mode">
            ${currentMode === 'live' ? t('weather.modeToggleSim') : t('weather.modeToggleLive')}
          </button>
          <button type="button" class="btn-primary-sm" id="btn-sync-weather-context">
            ${t('weather.syncBtn')}
          </button>
        </div>
      </div>

      <!-- Current Weather Live Metrics Grid -->
      <div class="weather-hero-metrics">
        <div class="w-main-stat">
          <div class="w-temp-display">
            <span class="w-big-temp">${weatherData.temperatureC}°C</span>
            <div class="w-sub-loc">
              <strong>${escapeHtml(weatherData.district)}, ${escapeHtml(weatherData.state)}</strong>
              <span>${escapeHtml(weatherData.weatherSummary)}</span>
            </div>
          </div>
        </div>

        <div class="w-grid-metrics">
          <div class="w-metric-card">
            <span class="wm-icon">💧</span>
            <div class="wm-meta">
              <span class="wm-label">${t('weather.humidity')}</span>
              <span class="wm-val">${weatherData.humidityPercent}%</span>
            </div>
          </div>

          <div class="w-metric-card">
            <span class="wm-icon">🌧️</span>
            <div class="wm-meta">
              <span class="wm-label">${t('weather.rainProb')}</span>
              <span class="wm-val">${weatherData.rainfallProbability}%</span>
            </div>
          </div>

          <div class="w-metric-card">
            <span class="wm-icon">🌊</span>
            <div class="wm-meta">
              <span class="wm-label">${t('weather.sevenDayRain')}</span>
              <span class="wm-val">${weatherData.forecastRainMm} mm</span>
            </div>
          </div>

          <div class="w-metric-card">
            <span class="wm-icon">💨</span>
            <div class="wm-meta">
              <span class="wm-label">${t('weather.wind')}</span>
              <span class="wm-val">${weatherData.windSpeedKmH} km/h</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 5-Day Daily Weather Forecast -->
      <div class="weather-forecast-strip">
        <h4 class="forecast-title">${t('weather.forecastTitle')}</h4>
        <div class="forecast-cards-row">
          ${(weatherData.forecastDays || []).map(day => `
            <div class="f-day-card">
              <span class="f-date">${day.date}</span>
              <span class="f-icon">${day.icon}</span>
              <div class="f-temps">
                <strong>${day.maxTemp}°</strong> / <span>${day.minTemp}°</span>
              </div>
              <span class="f-rain">🌧️ ${day.rainProb}% (${day.rainMm}mm)</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  bindWeatherEvents();
}

function bindWeatherEvents() {
  const toggleBtn = document.getElementById('btn-toggle-weather-mode');
  const syncBtn = document.getElementById('btn-sync-weather-context');

  toggleBtn?.addEventListener('click', () => {
    const currentMode = WeatherService.getMode();
    const newMode = currentMode === 'live' ? 'simulation' : 'live';
    WeatherService.setMode(newMode);
    loadWeatherForActiveContext();
  });

  syncBtn?.addEventListener('click', () => {
    if (!latestWeatherData) return;

    // Update central Farm Context weather values!
    farmStore.updateWeather({
      temperatureC: latestWeatherData.temperatureC,
      humidityPercent: latestWeatherData.humidityPercent,
      rainfallProbability: latestWeatherData.rainfallProbability,
      forecastRainMm: latestWeatherData.forecastRainMm,
      weatherSummary: latestWeatherData.weatherSummary
    });

    showWeatherToast(t('weather.syncedToast'));
  });
}

function showWeatherToast(msg) {
  let toast = document.getElementById('farmwise-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'farmwise-toast';
    toast.className = 'farmwise-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
