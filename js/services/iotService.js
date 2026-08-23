/**
 * @file iotService.js
 * IoT Farm Sensor Telemetry Simulation Service & Physical Hardware Integration Specification
 * Explicitly distinguishes Simulation Mode from real hardware.
 */

class IoTServiceState {
  constructor() {
    this.sensors = {
      soilMoisturePercent: 55,
      soilTemperatureC: 24,
      ambientHumidityPercent: 65,
      ambientTemperatureC: 28,
      borewellWaterLevelMeters: 42,
      borewellDischargeLpm: 120,
      batteryVoltage: 3.95,
      rssiSignalDbm: -72,
      lastTelemetryTime: Date.now()
    };
    this.subscribers = new Set();
  }

  getSensors() {
    return { ...this.sensors };
  }

  updateSensor(key, value) {
    if (this.sensors[key] !== undefined) {
      this.sensors[key] = Number(value);
      this.sensors.lastTelemetryTime = Date.now();
      this.notify();
    }
  }

  updateAll(partial) {
    this.sensors = {
      ...this.sensors,
      ...partial,
      lastTelemetryTime: Date.now()
    };
    this.notify();
  }

  subscribe(fn) {
    this.subscribers.add(fn);
    return () => this.subscribers.delete(fn);
  }

  notify() {
    const data = this.getSensors();
    this.subscribers.forEach(fn => {
      try {
        fn(data);
      } catch (e) {
        console.error('IoT subscriber error:', e);
      }
    });
  }
}

export const iotStore = new IoTServiceState();

/**
 * Technical Architecture Specification & JSON Schema for Physical ESP32 Hardware
 */
export const IOT_HARDWARE_SPEC = {
  architectureOverview: 'LoRaWAN / 4G-LTE Agricultural Field Telemetry Node Architecture',
  microcontroller: 'Espressif ESP32-WROOM-32D (Dual-core 240MHz, Ultra-Low-Power Co-processor)',
  transceiver: 'Semtech SX1276 LoRa Transceiver (865-867 MHz India License-Free Band) or SIMCom SIM7600E 4G Cat-1 Module',
  powerSystem: '3.7V 3400mAh 18650 Li-ion Battery with 6V 3W Monocrystalline Solar Panel & TP4056 MPPT Charger',
  sensorInterfaces: [
    {
      type: 'Soil Moisture',
      model: 'Capacitive Soil Moisture Sensor v1.2 / RS485 Modbus Soil NPK+Moisture Probe',
      range: '0 - 100% Volumetric Water Content (VWC)',
      sampling: 'Deep-sleep wakeup every 15 minutes, 10-sample ADC averaging'
    },
    {
      type: 'Ambient Weather',
      model: 'Sensirion SHT31-DIS High Precision Digital Humidity & Temperature Sensor (I2C)',
      range: '-40°C to +125°C (±0.2°C), 0 to 100% RH (±2% RH)',
      sampling: 'I2C polled every 15 minutes'
    },
    {
      type: 'Borewell Water Level',
      model: 'Hydrostatic Submersible Pressure Transducer (4-20mA loop powered)',
      range: '0 - 100 meters water column depth',
      sampling: 'ADC measurement across 250-ohm precision shunt resistor'
    }
  ],
  mqttTopic: 'farmwise/node/punjab/ludhiana_node_01/telemetry',
  sampleJsonPayload: JSON.stringify({
    device_id: "FW-ESP32-PB-0824",
    firmware_version: "2.4.1-ota",
    timestamp_epoch: 1740231600,
    metrics: {
      soil_moisture_pct: 54.8,
      soil_temp_c: 23.6,
      air_temp_c: 27.9,
      air_humidity_pct: 64.2,
      borewell_level_m: 41.8,
      battery_v: 3.96,
      rssi_dbm: -74
    },
    status: "HEALTHY",
    solar_charging: true
  }, null, 2)
};
