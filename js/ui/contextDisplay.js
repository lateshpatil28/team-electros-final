/**
 * @file contextDisplay.js
 * 100% Multilingual Visual Component for Live Farm Context & Agro-Climatic Intelligence
 */

import { farmStore } from '../state/farmContext.js';
import { i18n, t } from '../i18n/i18n.js';

export function initContextDisplay() {
  const container = document.getElementById('farm-context-summary');
  if (!container) return;

  // Subscribe to live farm store updates
  farmStore.subscribe((context, result) => {
    renderContextSummary(context, result);
  });

  // Subscribe to language changes
  i18n.subscribe(() => {
    renderContextSummary(farmStore.getContext(), farmStore.getEngineResult());
  });

  // Initial render
  renderContextSummary(farmStore.getContext(), farmStore.getEngineResult());
}

export function renderContextSummary(context, result) {
  const container = document.getElementById('farm-context-summary');
  if (!container) return;

  const { farmer, weather, cropHealthRisk, riskFactorReason } = context;
  const lang = i18n.getLanguage();

  const riskBadgeClass = {
    Low: 'badge-emerald',
    Moderate: 'badge-amber',
    High: 'badge-rose',
    Critical: 'badge-danger-glow'
  }[cropHealthRisk] || 'badge-amber';

  const waterBadgeClass = {
    High: 'badge-blue',
    Moderate: 'badge-teal',
    Low: 'badge-amber'
  }[farmer.waterAvailability] || 'badge-teal';

  const localizedState = t('states.' + farmer.state, {}, farmer.state);
  const localizedWeatherSummary = translateWeatherSummary(weather.weatherSummary, lang);
  const localizedRiskReason = translateRiskReason(riskFactorReason, lang);

  container.innerHTML = `
    <div class="form-header" style="margin-bottom: 1rem;">
      <span class="form-icon">📡</span>
      <div>
        <h2 class="form-title">${t('context.title')}</h2>
        <p class="form-subtitle">${t('context.subtitle')}</p>
      </div>
    </div>

    <div class="context-grid">
      <!-- Farmer & Land Identity -->
      <div class="context-card">
        <div class="context-card-header">
          <span class="context-icon">👨‍🌾</span>
          <div>
            <h4 class="context-title">${escapeHtml(farmer.farmerName || 'Farmer')}</h4>
            <p class="context-subtitle">${escapeHtml(farmer.district)}, ${escapeHtml(localizedState)}</p>
          </div>
        </div>
        <div class="context-chips">
          <span class="chip">📏 <strong>${farmer.farmSize}</strong> ${t('context.acres')}</span>
          <span class="chip">💰 <strong>₹${Number(farmer.budget).toLocaleString('en-IN')}</strong> ${t('context.budgetLabel')}</span>
          <span class="chip ${waterBadgeClass}">💧 <strong>${i18n.translateWater(farmer.waterAvailability)}</strong> ${t('context.waterLabel')}</span>
        </div>
      </div>

      <!-- Crop & Soil Physiological State -->
      <div class="context-card">
        <div class="context-card-header">
          <span class="context-icon">🌾</span>
          <div>
            <h4 class="context-title">${escapeHtml(i18n.translateCrop(farmer.crop))}</h4>
            <p class="context-subtitle">${escapeHtml(i18n.translateStage(farmer.cropStage))}</p>
          </div>
        </div>
        <div class="context-chips">
          <span class="chip">🌱 ${t('context.soilLabel')} <strong>${escapeHtml(i18n.translateSoil(farmer.soilCondition))}</strong></span>
          <span class="chip">💧 ${t('context.moistureLabel')} <strong>${farmer.soilMoisturePercent}%</strong></span>
          <span class="chip">🗣️ ${t('context.langLabel')} <strong>${farmer.preferredLanguage.toUpperCase()}</strong></span>
        </div>
      </div>

      <!-- Agro-Weather & Pest Threat Level -->
      <div class="context-card context-card-weather">
        <div class="context-card-header">
          <span class="context-icon">⛅</span>
          <div>
            <div class="flex-between">
              <h4 class="context-title">${t('context.environmentTitle')}</h4>
              <span class="badge ${riskBadgeClass}">${t('context.riskPrefix')} ${i18n.translateRisk(cropHealthRisk)}</span>
            </div>
            <p class="context-subtitle">${escapeHtml(localizedWeatherSummary)}</p>
          </div>
        </div>
        <div class="weather-metrics-row">
          <div class="weather-metric">
            <span class="w-label">${t('context.temp')}</span>
            <span class="w-val">${weather.temperatureC}°C</span>
          </div>
          <div class="weather-metric">
            <span class="w-label">${t('context.rainProb')}</span>
            <span class="w-val">${weather.rainfallProbability}%</span>
          </div>
          <div class="weather-metric">
            <span class="w-label">${t('context.sevenDayRain')}</span>
            <span class="w-val">${weather.forecastRainMm} mm</span>
          </div>
          <div class="weather-metric">
            <span class="w-label">${t('context.humidity')}</span>
            <span class="w-val">${weather.humidityPercent}%</span>
          </div>
        </div>
        ${localizedRiskReason ? `
          <div class="risk-indicator-box">
            <span class="risk-icon">⚠️</span>
            <span class="risk-text">${escapeHtml(localizedRiskReason)}</span>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function translateWeatherSummary(summary, lang) {
  if (!summary) return 'Normal seasonal conditions';
  if (summary.includes('Clear skies') || summary.includes('optimal tillering')) {
    return {
      en: 'Clear skies, mild winter breeze, optimal tillering temperature.',
      hi: 'आसमान साफ, हल्की ठंडी हवा, कल्ले फूटने के लिए अनुकूल तापमान।',
      mr: 'निरभ्र आकाश, आल्हाददायक थंड वारे, फुटवे फुटण्यासाठी अनुकूल तापमान.',
      pa: 'ਸਾਫ ਅਸਮਾਨ, ਹਲਕੀ ਠੰਡੀ ਹਵਾ, ਫੁਟਾਰੇ ਲਈ ਅਨੁਕੂਲ ਤਾਪਮਾਨ।'
    }[lang] || summary;
  }
  if (summary.includes('Warm and humid') || summary.includes('bollworm')) {
    return {
      en: 'Warm and humid, favorable for bollworm emergence.',
      hi: 'गर्म और आर्द्र मौसम, बोंड इल्ली के प्रकोप के अनुकूल।',
      mr: 'उबदार व दमट हवामान, बोंडअळीच्या प्रादुर्भावास पोषक.',
      pa: 'ਗਰਮ ਅਤੇ ਸਿੱਲ੍ਹਾ ਮੌਸਮ, ਸੁੰਡੀ ਦੇ ਹਮਲੇ ਲਈ ਅਨੁਕੂਲ।'
    }[lang] || summary;
  }
  if (summary.includes('Scattered monsoon') || summary.includes('monsoon showers')) {
    return {
      en: 'Scattered monsoon showers expected in next 5 days.',
      hi: 'अगले 5 दिनों में हल्की मानसूनी बौछारें संभावित।',
      mr: 'पुढील ५ दिवसांत मान्सूनच्या हलक्या सरींची शक्यता.',
      pa: 'ਅਗਲੇ 5 ਦਿਨਾਂ ਵਿੱਚ ਮਾਨਸੂਨ ਦੀਆਂ ਹਲਕੀਆਂ ਫੁਹਾਰਾਂ ਦੀ ਸੰਭਾਵਨਾ।'
    }[lang] || summary;
  }
  if (summary.includes('Hot and dry') || summary.includes('dry spell')) {
    return {
      en: 'Hot and dry conditions with high evapotranspiration.',
      hi: 'तेज धूप और सूखा मौसम, वाष्पोत्सर्जन दर उच्च।',
      mr: 'उष्ण व कोरडे हवामान, बाष्पीभवनाचा वेग जास्त.',
      pa: 'ਗਰਮ ਅਤੇ ਖੁਸ਼ਕ ਮੌਸਮ, ਪਾਣੀ ਉੱਡਣ ਦੀ ਦਰ ਵੱਧ।'
    }[lang] || summary;
  }
  if (summary.includes('Partly cloudy') || summary.includes('showers expected')) {
    return {
      en: 'Partly cloudy with isolated light showers expected.',
      hi: 'आंशिक रूप से बादल छाए रहने व हल्की बारिश की संभावना।',
      mr: 'अंशतः ढगाळ वातावरण आणि हलक्या पावसाची शक्यता.',
      pa: 'ਬੱਦਲਵਾਈ ਅਤੇ ਹਲਕੀ ਬਾਰਿਸ਼ ਦੀ ਸੰਭਾਵਨਾ।'
    }[lang] || summary;
  }
  return summary;
}

function translateRiskReason(reason, lang) {
  if (!reason) return '';
  if (reason.includes('aphid') || reason.includes('threshold')) {
    return {
      en: 'Minor localized aphid presence; well within economic threshold.',
      hi: 'माहू का हल्का प्रकोप; आर्थिक नुकसान सीमा से नीचे।',
      mr: 'माव्याचा किरकोळ प्रादुर्भाव; आर्थिक नुकसान पातळीच्या आत.',
      pa: 'ਤੇਲੇ ਦਾ ਮਾਮੂਲੀ ਹਮਲਾ; ਨੁਕਸਾਨ ਸੀਮਾ ਤੋਂ ਹੇਠਾਂ।'
    }[lang] || reason;
  }
  if (reason.includes('Pink Bollworm') || reason.includes('Trap catches') || reason.includes('square shedding') || reason.includes('sucking pest')) {
    return {
      en: 'Trap catches indicate elevated Pink Bollworm egg-laying & square shedding.',
      hi: 'फेरोमोन ट्रैप में गुलाबी सुंडी (PBW) की सक्रियता व बोंड गिरने के लक्षण दर्ज।',
      mr: 'कामगंध सापळ्यात गुलाबी बोंडअळीची अंडी घालण्याची क्रिया व पातेगळ वाढल्याचे संकेत.',
      pa: 'ਟਰੈਪਾਂ ਵਿੱਚ ਗੁਲਾਬੀ ਸੁੰਡੀ ਦੇ ਹਮਲੇ ਅਤੇ ਗੁੱਲਰ ਡਿੱਗਣ ਦੇ ਸੰਕੇਤ।'
    }[lang] || reason;
  }
  if (reason.includes('defoliator') || reason.includes('caterpillar')) {
    return {
      en: 'Moderate defoliator caterpillar incidence on lower canopy.',
      hi: 'निचली पत्तियों पर इल्ली (कैटरपिलर) का मध्यम प्रकोप।',
      mr: 'खालच्या पानांवर पाने खाणाऱ्या अळीचा मध्यम प्रादुर्भाव.',
      pa: 'ਹੇਠਲੇ ਪੱਤਿਆਂ ਤੇ ਸੁੰਡੀ ਦਾ ਦਰਮਿਆਨਾ ਹਮਲਾ।'
    }[lang] || reason;
  }
  if (reason.includes('Fall Armyworm') || reason.includes('FAW')) {
    return {
      en: 'Fall Armyworm whorl damage detected on 8% plants.',
      hi: '8% पौधों के पोंगों में फॉल आर्मीवर्म का प्रकोप दर्ज।',
      mr: '८% पिकाच्या पोंग्यांमध्ये लष्करी अळीचा प्रादुर्भाव आढळून आला.',
      pa: '8% ਬੂਟਿਆਂ ਵਿੱਚ ਲਸ਼ਕਰੀ ਸੁੰਡੀ ਦਾ ਹਮਲਾ ਦੇਖਿਆ ਗਿਆ।'
    }[lang] || reason;
  }
  if (reason.includes('Clean field') || reason.includes('nil pest')) {
    return {
      en: 'Clean field with nil pest threshold.',
      hi: 'खेत पूरी तरह स्वच्छ; कीट प्रभाव शून्य स्तर पर।',
      mr: 'शेत पूर्णपणे स्वच्छ; कीड प्रादुर्भाव शून्य पातळीवर.',
      pa: 'ਖੇਤ ਬਿਲਕੁਲ ਸਾਫ; ਕੀੜਿਆਂ ਦਾ ਪ੍ਰਭਾਵ ਨਾ-ਮਾਤਰ।'
    }[lang] || reason;
  }
  return reason;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
