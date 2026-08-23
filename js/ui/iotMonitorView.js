/**
 * @file iotMonitorView.js
 * IoT Farm Sensor Telemetry Monitor & Hardware Specification Component
 * Explicitly marks Simulation Mode, allows manual slider adjustments, syncs to Farm Context, and shows ESP32 MQTT specs.
 */

import { iotStore, IOT_HARDWARE_SPEC } from '../services/iotService.js';
import { farmStore } from '../state/farmContext.js';
import { i18n, t } from '../i18n/i18n.js';

let activeTab = 'simulator'; // 'simulator' | 'hardware'

export function initIoTMonitorView() {
  const container = document.getElementById('iot-monitor-container');
  if (!container) return;

  renderIoTUI();
  bindIoTEvents();

  iotStore.subscribe(() => {
    updateIoTDials();
  });

  i18n.subscribe(() => {
    renderIoTUI();
    bindIoTEvents();
  });
}

function renderIoTUI() {
  const container = document.getElementById('iot-monitor-container');
  if (!container) return;

  const sensors = iotStore.getSensors();

  container.innerHTML = `
    <div class="iot-card">
      <div class="weather-top-bar">
        <div class="form-header" style="margin-bottom: 0;">
          <span class="form-icon">📡</span>
          <div>
            <div class="flex-row gap-xs">
              <h2 class="form-title">${t('iot.title')}</h2>
              <span class="badge badge-amber">${t('iot.simBadge')}</span>
            </div>
            <p class="form-subtitle">${t('iot.subtitle')}</p>
          </div>
        </div>

        <div class="weather-actions-group">
          <div class="pill-selector" id="iot-tab-selector">
            <button type="button" class="pill-btn ${activeTab === 'simulator' ? 'active' : ''}" data-tab="simulator">
              ${t('iot.simulatorTab')}
            </button>
            <button type="button" class="pill-btn ${activeTab === 'hardware' ? 'active' : ''}" data-tab="hardware">
              ${t('iot.hardwareSpecTab')}
            </button>
          </div>

          <button type="button" class="btn-primary-sm" id="btn-sync-iot-context">
            ${t('iot.syncBtn')}
          </button>
        </div>
      </div>

      <!-- Tab Content Area -->
      ${activeTab === 'simulator' ? renderSimulatorTab(sensors) : renderHardwareTab()}
    </div>
  `;
}

function renderSimulatorTab(sensors) {
  return `
    <div class="iot-simulator-view">
      <!-- Status Strip -->
      <div class="iot-status-strip">
        <div class="status-metric">
          <span>🔋 ${t('iot.battery')}</span>
          <strong>${sensors.batteryVoltage}V (Optimal)</strong>
        </div>
        <div class="status-metric">
          <span>📶 ${t('iot.signal')}</span>
          <strong>${sensors.rssiSignalDbm} dBm (Good)</strong>
        </div>
        <div class="status-metric">
          <span>⏱️ Last Ping:</span>
          <strong>Just now</strong>
        </div>
      </div>

      <!-- Interactive Sensor Sliders Grid -->
      <div class="iot-dials-grid">
        <!-- Soil Moisture -->
        <div class="iot-dial-card">
          <div class="dial-header">
            <span class="d-icon">🌱</span>
            <span class="d-label">${t('iot.soilMoisture')}</span>
            <strong class="d-val" id="disp-soil-moisture">${sensors.soilMoisturePercent}%</strong>
          </div>
          <input type="range" class="sim-range" id="slider-soil-moisture" min="10" max="90" step="1" value="${sensors.soilMoisturePercent}">
          <div class="sim-range-scale">
            <span>10% (Dry)</span>
            <span>50% (Optimum)</span>
            <span>90% (Saturated)</span>
          </div>
        </div>

        <!-- Soil Temperature -->
        <div class="dial-card iot-dial-card">
          <div class="dial-header">
            <span class="d-icon">🌡️</span>
            <span class="d-label">${t('iot.soilTemp')}</span>
            <strong class="d-val" id="disp-soil-temp">${sensors.soilTemperatureC}°C</strong>
          </div>
          <input type="range" class="sim-range" id="slider-soil-temp" min="15" max="45" step="1" value="${sensors.soilTemperatureC}">
          <div class="sim-range-scale">
            <span>15°C (Cool)</span>
            <span>30°C (Mild)</span>
            <span>45°C (Heat Stress)</span>
          </div>
        </div>

        <!-- Air Humidity -->
        <div class="dial-card iot-dial-card">
          <div class="dial-header">
            <span class="d-icon">💧</span>
            <span class="d-label">${t('iot.ambientHumidity')}</span>
            <strong class="d-val" id="disp-air-humidity">${sensors.ambientHumidityPercent}%</strong>
          </div>
          <input type="range" class="sim-range" id="slider-air-humidity" min="20" max="95" step="1" value="${sensors.ambientHumidityPercent}">
          <div class="sim-range-scale">
            <span>20% (Arid)</span>
            <span>60% (Normal)</span>
            <span>95% (Humid)</span>
          </div>
        </div>

        <!-- Borewell Water Level -->
        <div class="dial-card iot-dial-card">
          <div class="dial-header">
            <span class="d-icon">🌊</span>
            <span class="d-label">${t('iot.waterLevel')}</span>
            <strong class="d-val" id="disp-water-level">${sensors.borewellWaterLevelMeters} m</strong>
          </div>
          <input type="range" class="sim-range" id="slider-water-level" min="10" max="90" step="1" value="${sensors.borewellWaterLevelMeters}">
          <div class="sim-range-scale">
            <span>10m (Shallow)</span>
            <span>50m (Moderate)</span>
            <span>90m (Critical Deep)</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderHardwareTab() {
  return `
    <div class="iot-hardware-view">
      <div class="hardware-header-note">
        <span class="h-icon">⚙️</span>
        <div>
          <h4>${escapeHtml(IOT_HARDWARE_SPEC.architectureOverview)}</h4>
          <p>This technical blueprint details how real physical sensor nodes transmit field telemetry to FarmWise.</p>
        </div>
      </div>

      <div class="hw-specs-grid">
        <div class="hw-spec-box">
          <span class="hw-label">Microcontroller Unit (MCU):</span>
          <strong>${IOT_HARDWARE_SPEC.microcontroller}</strong>
        </div>
        <div class="hw-spec-box">
          <span class="hw-label">Long-Range Wireless Transceiver:</span>
          <strong>${IOT_HARDWARE_SPEC.transceiver}</strong>
        </div>
        <div class="hw-spec-box">
          <span class="hw-label">Power & Energy Harvesting:</span>
          <strong>${IOT_HARDWARE_SPEC.powerSystem}</strong>
        </div>
        <div class="hw-spec-box">
          <span class="hw-label">MQTT Telemetry Topic:</span>
          <code>${IOT_HARDWARE_SPEC.mqttTopic}</code>
        </div>
      </div>

      <!-- Sensor Interfaces List -->
      <div class="hw-sensors-section">
        <h4 style="margin-bottom: 0.75rem; font-size: 0.95rem; font-weight: 700;">Deployed Sensor Interfaces:</h4>
        <div class="hw-sensor-items">
          ${IOT_HARDWARE_SPEC.sensorInterfaces.map(item => `
            <div class="hw-sensor-card">
              <span class="badge badge-teal-sm">${item.type}</span>
              <p><strong>Hardware Model:</strong> ${item.model}</p>
              <p><strong>Operating Range:</strong> ${item.range}</p>
              <p><strong>Sampling Routine:</strong> ${item.sampling}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Live JSON Schema Payload -->
      <div class="hw-payload-section">
        <span class="hw-label" style="margin-bottom: 0.5rem; display: block;">MQTT JSON Telemetry Packet:</span>
        <pre class="hw-code-block"><code>${escapeHtml(IOT_HARDWARE_SPEC.sampleJsonPayload)}</code></pre>
      </div>
    </div>
  `;
}

function bindIoTEvents() {
  const container = document.getElementById('iot-monitor-container');
  if (!container) return;

  const tabButtons = container.querySelectorAll('#iot-tab-selector .pill-btn');
  const syncBtn = document.getElementById('btn-sync-iot-context');

  const moistureSlider = document.getElementById('slider-soil-moisture');
  const tempSlider = document.getElementById('slider-soil-temp');
  const humiditySlider = document.getElementById('slider-air-humidity');
  const waterSlider = document.getElementById('slider-water-level');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      activeTab = btn.getAttribute('data-tab');
      renderIoTUI();
      bindIoTEvents();
    });
  });

  moistureSlider?.addEventListener('input', (e) => {
    const val = Number(e.target.value);
    iotStore.updateSensor('soilMoisturePercent', val);
    const disp = document.getElementById('disp-soil-moisture');
    if (disp) disp.textContent = `${val}%`;
  });

  tempSlider?.addEventListener('input', (e) => {
    const val = Number(e.target.value);
    iotStore.updateSensor('soilTemperatureC', val);
    const disp = document.getElementById('disp-soil-temp');
    if (disp) disp.textContent = `${val}°C`;
  });

  humiditySlider?.addEventListener('input', (e) => {
    const val = Number(e.target.value);
    iotStore.updateSensor('ambientHumidityPercent', val);
    const disp = document.getElementById('disp-air-humidity');
    if (disp) disp.textContent = `${val}%`;
  });

  waterSlider?.addEventListener('input', (e) => {
    const val = Number(e.target.value);
    iotStore.updateSensor('borewellWaterLevelMeters', val);
    const disp = document.getElementById('disp-water-level');
    if (disp) disp.textContent = `${val} m`;
  });

  syncBtn?.addEventListener('click', () => {
    const sensors = iotStore.getSensors();

    // Map borewell depth to water availability category
    let waterAvail = 'Moderate';
    if (sensors.borewellWaterLevelMeters < 30) {
      waterAvail = 'High';
    } else if (sensors.borewellWaterLevelMeters > 60) {
      waterAvail = 'Low';
    }

    // Sync to Farm Context!
    farmStore.updateFarmer({
      soilMoisturePercent: sensors.soilMoisturePercent,
      waterAvailability: waterAvail
    });

    farmStore.updateWeather({
      temperatureC: sensors.ambientTemperatureC,
      humidityPercent: sensors.ambientHumidityPercent
    });

    showIoTToast(t('iot.syncedToast'));
  });
}

function updateIoTDials() {
  const sensors = iotStore.getSensors();
  const dispM = document.getElementById('disp-soil-moisture');
  const dispT = document.getElementById('disp-soil-temp');
  const dispH = document.getElementById('disp-air-humidity');
  const dispW = document.getElementById('disp-water-level');

  if (dispM) dispM.textContent = `${sensors.soilMoisturePercent}%`;
  if (dispT) dispT.textContent = `${sensors.soilTemperatureC}°C`;
  if (dispH) dispH.textContent = `${sensors.ambientHumidityPercent}%`;
  if (dispW) dispW.textContent = `${sensors.borewellWaterLevelMeters} m`;
}

function showIoTToast(msg) {
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
