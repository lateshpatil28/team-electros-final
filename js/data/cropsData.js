/**
 * @file cropsData.js
 * Complete Multilingual Agronomic Knowledge Base and Crop Model Configurations
 * Supports: Wheat, Rice, Cotton, Soybean, Maize in English, Hindi, Marathi, Punjabi
 */

import { i18n } from '../i18n/i18n.js';

export const STRATEGY_METADATA = {
  high_yield: {
    name: {
      en: 'High-Yield Precision Commercial Plan',
      hi: 'उच्च-उत्पादन सटीक वाणिज्यिक योजना',
      mr: 'उच्च-उत्पादन अचूक व्यावसायिक योजना',
      pa: 'ਵੱਧ-ਝਾੜ ਸਟੀਕ ਵਪਾਰਕ ਯੋਜਨਾ'
    },
    description: {
      en: 'Maximizes yield & grain quality using precision fertigation, micro-nutrients, and proactive systemic protection.',
      hi: 'सटीक उर्वरक प्रबंधन, सूक्ष्म पोषक तत्वों और सक्रिय फसल सुरक्षा से अधिकतम गुणवत्तापूर्ण उत्पादन प्राप्त करता है।',
      mr: 'अचूक खत व्यवस्थापन, सूक्ष्म अन्नद्रव्ये आणि सक्रिय पीक संरक्षणाने जास्तीत जास्त दर्जेदार उत्पादन देणारे धोरण.',
      pa: 'ਸਹੀ ਖਾਦ ਪ੍ਰਬੰਧਨ, ਖੁਰਾਕੀ ਤੱਤਾਂ ਅਤੇ ਸਰਗਰਮ ਫਸਲ ਸੁਰੱਖਿਆ ਨਾਲ ਵੱਧ ਤੋਂ ਵੱਧ ਝਾੜ ਲੈਣ ਵਾਲੀ ਯੋਜਨਾ।'
    }
  },
  balanced: {
    name: {
      en: 'Balanced Integrated Resource Plan',
      hi: 'संतुलित एकीकृत संसाधन योजना (IPM)',
      mr: 'संतुलित एकात्मिक संसाधन योजना (IPM)',
      pa: 'ਸੰਤੁਲਿਤ ਏਕੀਕ੍ਰਿਤ ਵਸੀਲਾ ਯੋਜਨਾ (IPM)'
    },
    description: {
      en: 'Optimizes cost-to-benefit ratio using Integrated Pest Management (IPM), split fertilizer dosage, and schedule-based irrigation.',
      hi: 'एकीकृत कीट प्रबंधन (IPM), उर्वरक की किस्तों और समयबद्ध सिंचाई से लागत-लाभ अनुपात को सर्वोत्तम बनाता है।',
      mr: 'एकात्मिक कीड व्यवस्थापन (IPM), खतांचे हप्ते आणि पाळीच्या सिंचनाने योग्य नफा देणारी योजना.',
      pa: 'ਏਕੀਕ੍ਰਿਤ ਕੀੜਾ ਪ੍ਰਬੰਧਨ (IPM), ਖਾਦਾਂ ਦੀ ਸਹੀ ਵੰਡ ਅਤੇ ਸਮੇਂ ਸਿਰ ਸਿੰਚਾਈ ਨਾਲ ਵਧੀਆ ਮੁਨਾਫਾ ਦੇਣ ਵਾਲੀ ਯੋਜਨਾ।'
    }
  },
  low_cost: {
    name: {
      en: 'Low-Cost Resilient / Organic Contingency Plan',
      hi: 'कम-लागत टिकाऊ / जैविक सुरक्षा योजना',
      mr: 'कमी-खर्च शाश्वत / सेंद्रिय सुरक्षा योजना',
      pa: 'ਘੱਟ-ਖਰਚਾ ਟਿਕਾਊ / ਜੈਵਿਕ ਸੁਰੱਖਿਆ ਯੋਜਨਾ'
    },
    description: {
      en: 'Minimizes cash outlays while protecting base crop yield via bio-fertilizers, stress mitigation, and deficit irrigation.',
      hi: 'जैव उर्वरकों, तनाव रोधी उपायों और बचत वाली सिंचाई से न्यूनतम खर्च में फसल की रक्षा करता है।',
      mr: 'जैविक खते, ताण व्यवस्थापन आणि कमी पाण्याच्या सिंचनाने कमीत कमी खर्चात पिकाचे रक्षण करणारी योजना.',
      pa: 'ਜੈਵਿਕ ਖਾਦਾਂ, ਤਣਾਅ ਰੋਕੂ ਉਪਾਵਾਂ ਅਤੇ ਬੱਚਤ ਵਾਲੀ ਸਿੰਚਾਈ ਨਾਲ ਘੱਟ ਤੋਂ ਘੱਟ ਖਰਚੇ ਵਿੱਚ ਫਸਲ ਦੀ ਰਾਖੀ।'
    }
  }
};

export function getLocalizedStrategyMeta(strategyKey) {
  const lang = i18n ? i18n.getLanguage() : 'en';
  const meta = STRATEGY_METADATA[strategyKey] || STRATEGY_METADATA.balanced;
  return {
    name: meta.name[lang] || meta.name.en,
    description: meta.description[lang] || meta.description.en
  };
}

// Comprehensive Action Dictionary per Crop, Strategy & Language
function buildActions(crop, strategy, stage, context) {
  const lang = i18n ? i18n.getLanguage() : 'en';
  const isFlowering = stage.includes('Flowering') || stage.includes('Reproductive');
  const isTillering = stage.includes('Tillering') || stage.includes('Vegetative');
  const isPod = stage.includes('Grain Filling') || stage.includes('Pod Formation');

  // ==========================================
  // 1. WHEAT ACTIONS
  // ==========================================
  if (crop === 'Wheat') {
    if (strategy === 'high_yield') {
      if (lang === 'hi') {
        return [
          { category: 'nutrition', title: 'सटीक उर्वरक एवं पर्णीय पोषण', description: isFlowering ? 'दाने के अच्छे भराव के लिए 13-00-45 (1.5 किग्रा/एकड़) + बोरॉन 20% (250 ग्राम) का सुबह छिड़काव करें।' : 'सिंचाई के बाद यूरिया 45 किग्रा + जिंक सल्फेट 33% (5 किग्रा/एकड़) डालें।', timing: 'सुबह 7:00 - 9:30 बजे', costShare: 2400 },
          { category: 'irrigation', title: 'नियंत्रित स्प्रिंकलर / क्यारी सिंचाई', description: `जड़ क्षेत्र में 65% नमी बनाए रखने हेतु ${isFlowering ? 75 : 55} मिमी गहराई पर पानी दें।`, timing: 'शाम के शांत मौसम में', costShare: 1400 },
          { category: 'protection', title: 'सर्वांगीण कवकनाशी व कीट सुरक्षा', description: 'पीला रतुआ और माहू रोकथाम हेतु प्रोपिकोनाज़ोल 25% EC (200 मिली) + थायमेथॉक्सम 25% WG (80 ग्राम/एकड़)।', timing: '48 घंटों के भीतर', costShare: 1800 },
          { category: 'soil_intercultural', title: 'खरपतवार नियंत्रण व मृदा वायु-संचार', description: 'सल्फोसल्फ्यूरॉन + मेटसल्फ्यूरॉन द्वारा संकरी व चौड़ी पत्ती वाले खरपतवारों का पूर्ण नियंत्रण।', timing: 'शांत मौसम में', costShare: 600 }
        ];
      } else if (lang === 'mr') {
        return [
          { category: 'nutrition', title: 'अचूक खत व विद्राव्य पोषण फवारणी', description: isFlowering ? 'दाणे भरण्यासाठी 13-00-45 (1.5 किलो/एकर) + बोरॉन 20% (250 ग्रॅम) ची फवारणी करा.' : 'पाणी दिल्यानंतर युरिया 45 किलो + झिंक सल्फेट (5 किलो/एकर) द्यावे.', timing: 'सकाळी 7:00 - 9:30', costShare: 2400 },
          { category: 'irrigation', title: 'नियोजित सिंचन व्यवस्थापन', description: `मुळांच्या कार्यक्षेत्रात ओलावा टिकवण्यासाठी ${isFlowering ? 75 : 55} मिमी पाणी द्यावे.`, timing: 'संध्याकाळच्या वेळी', costShare: 1400 },
          { category: 'protection', title: 'बुरशीनाशक व कीटक संरक्षण', description: 'तांबेरा व मावा नियंत्रणासाठी प्रोपिकोनाझोल 25% EC (200 मिली) + थायामेथॉक्झाम 25% WG (80 ग्रॅम).', timing: '४८ तासांच्या आत', costShare: 1800 },
          { category: 'soil_intercultural', title: 'तण नियंत्रण व आंतरमशागत', description: 'शिफारस केलेल्या तणनाशकाचा वापर करून पीक तणमुक्त ठेवा.', timing: 'योग्य ओलाव्यावर', costShare: 600 }
        ];
      } else if (lang === 'pa') {
        return [
          { category: 'nutrition', title: 'ਸਟੀਕ ਖਾਦ ਅਤੇ ਪੱਤਿਆਂ ਰਾਹੀਂ ਪੋਸ਼ਣ', description: isFlowering ? 'ਦਾਣਿਆਂ ਦੇ ਚੰਗੇ ਭਰਾਅ ਲਈ 13-00-45 (1.5 ਕਿਲੋ/ਏਕੜ) + ਬੋਰਾਨ 20% (250 ਗ੍ਰਾਮ) ਦਾ ਛਿੜਕਾਅ ਕਰੋ।' : 'ਪਾਣੀ ਲਾਉਣ ਤੋਂ ਬਾਅਦ ਯੂਰੀਆ 45 ਕਿਲੋ + ਜ਼ਿੰਕ ਸਲਫੇਟ 33% (5 ਕਿਲੋ/ਏਕੜ) ਪਾਓ।', timing: 'ਸਵੇਰੇ 7:00 - 9:30 ਵਜੇ', costShare: 2400 },
          { category: 'irrigation', title: 'ਕੈਲੀਬਰੇਟਡ ਸਿੰਚਾਈ ਪ੍ਰਬੰਧਨ', description: `ਜ਼ਮੀਨ ਵਿੱਚ ਨਮੀ ਬਣਾਈ ਰੱਖਣ ਲਈ ${isFlowering ? 75 : 55} ਮਿਲੀਮੀਟਰ ਪਾਣੀ ਲਗਾਓ।`, timing: 'ਸ਼ਾਂਤ ਮੌਸਮ ਵਿੱਚ', costShare: 1400 },
          { category: 'protection', title: 'ਪੀਲ਼ੀ ਕੁੰਗੀ ਅਤੇ ਤੇਲੇ ਤੋਂ ਬਚਾਅ', description: 'ਪੀਲ਼ੀ ਕੁੰਗੀ ਅਤੇ ਤੇਲੇ ਦੀ ਰੋਕਥਾਮ ਲਈ ਪ੍ਰੋਪੀਕੋਨਾਜ਼ੋਲ 25% EC (200 ਮਿਲੀ) + ਥਾਇਆਮੈਥੋਕਸਮ 25% WG (80 ਗ੍ਰਾਮ)।', timing: '48 ਘੰਟਿਆਂ ਦੇ ਅੰਦਰ', costShare: 1800 },
          { category: 'soil_intercultural', title: 'ਨਦੀਨਾਂ ਦੀ ਰੋਕਥਾਮ', description: 'ਸਿਫਾਰਸ਼ੀ ਨਦੀਨਨਾਸ਼ਕ ਨਾਲ ਗੁੱਲੀ ਡੰਡੇ ਅਤੇ ਚੌੜੀ ਪੱਤੀ ਵਾਲੇ ਨਦੀਨਾਂ ਦਾ ਸਫਾਇਆ।', timing: 'ਹਵਾ ਰਹਿਤ ਦਿਨ ਵੇਲੇ', costShare: 600 }
        ];
      }
      return [
        { category: 'nutrition', title: 'Precision Fertigation & Foliar Boost', description: isFlowering ? 'Apply soluble 13-0-45 (1.5 kg/acre) + Boron 20% (250g/acre) to optimize grain setting.' : 'Top-dress Urea @ 45 kg/acre split with Zinc Sulfate (33% @ 5 kg/acre) after irrigation.', timing: 'Early morning (7:00 - 9:30 AM)', costShare: 2400 },
        { category: 'irrigation', title: 'Check Basin / Sprinkler Irrigation', description: `Provide ${isFlowering ? 75 : 55} mm depth scheduled to maintain root-zone moisture above 65%.`, timing: 'Evening / calm wind', costShare: 1400 },
        { category: 'protection', title: 'Proactive Systemic Fungicide & Insect Defense', description: 'Tank mix: Propiconazole 25% EC (Tilt @ 200 ml/acre) + Thiamethoxam 25% WG (80 g/acre).', timing: 'Within 48 hours', costShare: 1800 },
        { category: 'soil_intercultural', title: 'Intercultural Aeration & Weed Suppression', description: 'Apply targeted herbicide (Sulfosulfuron + Metsulfuron) with zero crop phytotoxicity.', timing: 'During calm weather', costShare: 600 }
      ];
    } else if (strategy === 'balanced') {
      if (lang === 'hi') {
        return [
          { category: 'nutrition', title: 'संतुलित किस्तों में खाद अनुप्रयोग', description: isFlowering ? '00-52-34 (1 किग्रा/एकड़) का पर्णीय छिड़काव करें ताकि बालियों में दाने ठोस भरें।' : 'नीम लेपित यूरिया 35 किग्रा/एकड़ का भुरकाव दूसरी सिंचाई से पहले करें।', timing: 'हल्की नमी पर', costShare: 1700 },
          { category: 'irrigation', title: 'क्रांतिक अवस्था पर क्यारी सिंचाई', description: `${isFlowering ? 60 : 45} मिमी पानी मुख्य क्रांतिक अवस्था पर दें।`, timing: 'दोपहर बाद', costShare: 1000 },
          { category: 'protection', title: 'एकीकृत कीट व रतुआ प्रबंधन (IPM)', description: 'टेबुकोनाज़ोल 25.9% EC (200 मिली/एकड़) या नीम तेल (1500 ppm) का सुरक्षात्मक छिड़काव।', timing: '3 से 5 दिनों में', costShare: 1200 },
          { category: 'soil_intercultural', title: 'हल्की गुड़ाई व नमी संरक्षण', description: 'सतह की पपड़ी तोड़कर वाष्पीकरण रोकने के लिए हल्की गुड़ाई करें।', timing: 'ओट आने पर', costShare: 500 }
        ];
      } else if (lang === 'mr') {
        return [
          { category: 'nutrition', title: 'संतुलित खत मात्रा व फवारणी', description: isFlowering ? '00-52-34 (1 किलो/एकर) ची फवारणी करून ओंबीमध्ये दाणे भरण्यास मदत करा.' : 'युरिया 35 किलो/एकर दुसऱ्या पाण्याच्या वेळी द्यावा.', timing: 'ओलावा असताना', costShare: 1700 },
          { category: 'irrigation', title: 'महत्त्वाच्या अवस्थेत सिंचन', description: `${isFlowering ? 60 : 45} मिमी पाणी देऊन पिकाची पाण्याची गरज भागवा.`, timing: 'दुपारनंतर', costShare: 1000 },
          { category: 'protection', title: 'एकात्मिक कीड व्यवस्थापन (IPM)', description: 'निंबोळी अर्क किंवा टेबुकोनाझोल 25.9% EC (200 मिली/एकर) चा प्रतिबंधात्मक वापर.', timing: '३ ते ५ दिवसांत', costShare: 1200 },
          { category: 'soil_intercultural', title: 'आंतरमशागत व ओलावा टिकवणे', description: 'जमिनीचा वरचा थर मोकळा करून बाष्पीभवन कमी करा.', timing: 'वाफसा असताना', costShare: 500 }
        ];
      } else if (lang === 'pa') {
        return [
          { category: 'nutrition', title: 'ਸੰਤੁਲਿਤ ਖਾਦ ਅਤੇ ਸਪਰੇਅ ਪ੍ਰਬੰਧਨ', description: isFlowering ? '00-52-34 (1 ਕਿਲੋ/ਏਕੜ) ਦੀ ਸਪਰੇਅ ਕਰੋ ਤਾਂ ਜੋ ਸਿੱਟਿਆਂ ਵਿੱਚ ਦਾਣੇ ਵਧੀਆ ਭਰਨ।' : 'ਯੂਰੀਆ 35 ਕਿਲੋ/ਏਕੜ ਦੂਜੇ ਪਾਣੀ ਵੇਲੇ ਛੱਟਾ ਦਿਓ।', timing: 'ਨਮੀ ਵਾਲੀ ਜ਼ਮੀਨ ਤੇ', costShare: 1700 },
          { category: 'irrigation', title: 'ਨਾਜ਼ੁਕ ਪੜਾਵਾਂ ਤੇ ਸਿੰਚਾਈ', description: `${isFlowering ? 60 : 45} ਮਿਲੀਮੀਟਰ ਡੂੰਘਾਈ ਨਾਲ ਪਾਣੀ ਲਗਾਓ।`, timing: 'ਦੁਪਹਿਰ ਤੋਂ ਬਾਅਦ', costShare: 1000 },
          { category: 'protection', title: 'ਏਕੀਕ੍ਰਿਤ ਕੀੜਾ ਅਤੇ ਕੁੰਗੀ ਰੋਕਥਾਮ', description: 'ਟੈਬੂਕੋਨਾਜ਼ੋਲ 25.9% EC (200 ਮਿਲੀ/ਏਕੜ) ਜਾਂ ਨਿੰਮ ਅਧਾਰਿਤ ਸਪਰੇਅ ਕਰੋ।', timing: '3 ਤੋਂ 5 ਦਿਨਾਂ ਵਿੱਚ', costShare: 1200 },
          { category: 'soil_intercultural', title: 'ਜ਼ਮੀਨ ਦੀ ਹਲਕੀ ਗੋਡੀ ਤੇ ਨਮੀ ਦੀ ਸੰਭਾਲ', description: 'ਜ਼ਮੀਨ ਦੀ ਪੇਪੜੀ ਤੋੜ ਕੇ ਨਮੀ ਬਚਾਉਣ ਲਈ ਹਲਕਾ ਵਾਹਣਾ।', timing: 'ਵੱਤਰ ਆਉਣ ਤੇ', costShare: 500 }
        ];
      }
      return [
        { category: 'nutrition', title: 'Targeted Split Nutrient Application', description: isFlowering ? 'Foliar spray of 00-52-34 (1 kg/acre) to enhance spikelet fertility and grain filling.' : 'Broadcast Urea @ 35 kg/acre blended with neem oil coating prior to irrigation.', timing: 'Post-irrigation on moist soil', costShare: 1700 },
        { category: 'irrigation', title: 'Furrow Irrigation at Critical Stages', description: `Apply ${isFlowering ? 60 : 45} mm depth strictly aligned with critical moisture window.`, timing: 'Late afternoon', costShare: 1000 },
        { category: 'protection', title: 'Integrated Pest & Rust Management (IPM)', description: 'Tebuconazole 25.9% EC @ 200 ml/acre spray combined with yellow sticky traps.', timing: 'Within 3 - 5 days', costShare: 1200 },
        { category: 'soil_intercultural', title: 'Manual/Mechanical Hoeing & Moisture Conservation', description: 'Shallow inter-row hoeing to break soil crust and reduce capillary evaporation.', timing: 'When topsoil is workable', costShare: 500 }
      ];
    } else {
      // low_cost
      if (lang === 'hi') {
        return [
          { category: 'nutrition', title: 'जैविक व कम लागत पोषक तत्व', description: '2% यूरिया + 0.5% जिंक सल्फेट घोल या वर्मीवॉश (5 लीटर/एकड़) का सस्ता पर्णीय पोषण।', timing: 'सुबह के समय', costShare: 1100 },
          { category: 'irrigation', title: 'बचत वाली सुरक्षात्मक सिंचाई', description: `${isFlowering ? 40 : 30} मिमी पानी केवल फसल की मुख्य आवश्यकता पर दें।`, timing: 'रात या सुबह', costShare: 700 },
          { category: 'protection', title: 'नीम व वानस्पतिक सुरक्षा', description: 'नीम का काढ़ा (5%) या कॉपर ऑक्सीक्लोराइड 50% WP (500 ग्राम/एकड़) का छिड़काव।', timing: 'शुरुआती लक्षण पर', costShare: 700 },
          { category: 'soil_intercultural', title: 'पुआल मल्चिंग व नमी संरक्षण', description: 'खेत में फसल अवशेष/पुआल बिछाकर मिट्टी की नमी को उड़ने से बचाएं।', timing: 'तुरंत', costShare: 400 }
        ];
      } else if (lang === 'mr') {
        return [
          { category: 'nutrition', title: 'कमी खर्चातील जैविक पोषण', description: '२% युरिया + ०.५% झिंक सल्फेट किंवा वर्मीवॉश (५ लिटर/एकर) चा स्वस्त फवारा.', timing: 'सकाळच्या वेळी', costShare: 1100 },
          { category: 'irrigation', title: 'काटकसरीचे सिंचन', description: `${isFlowering ? 40 : 30} मिमी पाणी गरजेपुरतेच द्यावे.`, timing: 'पहाटे किंवा रात्री', costShare: 700 },
          { category: 'protection', title: 'वनस्पतीजन्य कीड नियंत्रण', description: 'निंबोळी अर्क (५%) किंवा कॉपर ऑक्सिक्लोराईड (५०० ग्रॅम/एकर) चा फवारा.', timing: 'किडीची सुरुवात होताच', costShare: 700 },
          { category: 'soil_intercultural', title: 'आच्छादन (मल्चिंग) व्यवस्थापन', description: 'काडीकचरा किंवा पेंढा जमिनीवर पसरवून ओलावा टिकवून ठेवा.', timing: 'तातडीने', costShare: 400 }
        ];
      } else if (lang === 'pa') {
        return [
          { category: 'nutrition', title: 'ਘੱਟ ਖਰਚੇ ਵਾਲੀ ਜੈਵਿਕ ਖੁਰਾਕ', description: '2% ਯੂਰੀਆ + 0.5% ਜ਼ਿੰਕ ਸਲਫੇਟ ਜਾਂ ਵਰਮੀਵਾਸ਼ (5 ਲੀਟਰ/ਏਕੜ) ਦੀ ਸਸਤੀ ਸਪਰੇਅ।', timing: 'ਸਵੇਰ ਦੇ ਵੇਲੇ', costShare: 1100 },
          { category: 'irrigation', title: 'ਬੱਚਤ ਵਾਲੀ ਸਿੰਚਾਈ', description: `${isFlowering ? 40 : 30} ਮਿਲੀਮੀਟਰ ਪਾਣੀ ਲੋੜ ਅਨੁਸਾਰ ਹੀ ਲਗਾਓ।`, timing: 'ਸਵੇਰੇ ਜਾਂ ਰਾਤ ਨੂੰ', costShare: 700 },
          { category: 'protection', title: 'ਨਿੰਮ ਅਤੇ ਦੇਸੀ ਘੋਲ ਨਾਲ ਸੁਰੱਖਿਆ', description: 'ਨਿੰਮ ਦਾ ਅਰਕ (5%) ਜਾਂ ਕਾਪਰ ਆਕਸੀਕਲੋਰਾਈਡ (500 ਗ੍ਰਾਮ/ਏਕੜ) ਦੀ ਸਪਰੇਅ।', timing: 'ਲੱਛਣ ਦਿੱਸਣ ਤੇ', costShare: 700 },
          { category: 'soil_intercultural', title: 'ਪਰਾਲੀ ਦੀ ਮਲਚਿੰਗ', description: 'ਜ਼ਮੀਨ ਤੇ ਪਰਾਲੀ ਵਿਛਾ ਕੇ ਨਮੀ ਨੂੰ ਉੱਡਣ ਤੋਂ ਬਚਾਓ।', timing: 'ਤੁਰੰਤ', costShare: 400 }
        ];
      }
      return [
        { category: 'nutrition', title: 'Bio-Enriched Low-Cost Nutrients', description: 'Foliar spray of 2% Urea + 0.5% Zinc Sulfate solution or vermiwash (5 L/acre).', timing: 'Cool morning hours', costShare: 1100 },
        { category: 'irrigation', title: 'Deficit / Alternate Furrow Irrigation', description: `Deliver ${isFlowering ? 40 : 30} mm depth targeted strictly to vital growth stages.`, timing: 'Night / early morning', costShare: 700 },
        { category: 'protection', title: 'Botanical & Contact Protection', description: 'Spray Neem Seed Kernel Extract (NSKE 5%) or Copper Oxychloride 50% WP (500 g/acre).', timing: 'On initial pest sighting', costShare: 700 },
        { category: 'soil_intercultural', title: 'Straw Mulching & Moisture Conservation', description: 'Spread crop residue / straw mulch to conserve residual soil moisture.', timing: 'Immediate', costShare: 400 }
      ];
    }
  }

  // ==========================================
  // 2. COTTON ACTIONS
  // ==========================================
  if (crop === 'Cotton') {
    if (strategy === 'high_yield') {
      if (lang === 'hi') {
        return [
          { category: 'nutrition', title: 'पर्णीय पोषण व फूल-बोंड वर्धक', description: isFlowering ? '13-00-45 (2 किग्रा/एकड़) + मैग्नीशियम सल्फेट (1 किग्रा) + प्लैनोफिक्स (4 मिली/15L) का छिड़काव फूल-बोंड झड़ने से रोकता है।' : 'ड्रिप द्वारा यूरिया 25 किग्रा + 19-19-19 (10 किग्रा) + बोरॉन (200 ग्राम) दें।', timing: 'सुबह के समय', costShare: 2800 },
          { category: 'irrigation', title: 'ड्रिप व नियंत्रित रिज-फरो सिंचाई', description: `${isFlowering ? 80 : 55} मिमी पानी 5-7 दिन के अंतराल पर दें, जड़ में जलभराव न होने दें।`, timing: 'सुबह या शाम', costShare: 1800 },
          { category: 'protection', title: 'गुलाबी सुंडी व रसचूसक कीट सुरक्षा कवच', description: '10 फेरोमोन ट्रैप/एकड़ + स्पिनेटोरम 11.7% SC (180 मिली) + डायफेंथियूरॉन 50% WP (250 ग्राम) का छिड़काव।', timing: '48 घंटों के भीतर', costShare: 2400 },
          { category: 'soil_intercultural', title: 'कतारों में जुताई व मिट्टी चढ़ाना', description: 'पौधों की जड़ों पर मिट्टी चढ़ाएं ताकि जल निकास सुगम हो और पौधे मजबूत रहें।', timing: 'पहली टॉप ड्रेसिंग के बाद', costShare: 800 }
        ];
      } else if (lang === 'mr') {
        return [
          { category: 'nutrition', title: 'पातेगळ रोखक व विद्राव्य पोषण', description: isFlowering ? '13-00-45 (2 किलो/एकर) + मॅग्नेशियम सल्फेट (1 किलो) + प्लॅनोफिक्स (4 मिली/15L) पाते व फुले गळ रोखण्यासाठी.' : 'ठिबकद्वारे युरिया 25 किलो + 19-19-19 (10 किलो) + बोरॉन (200 ग्रॅम) द्यावे.', timing: 'सकाळच्या वेळी', costShare: 2800 },
          { category: 'irrigation', title: 'ठिबक / सरी-वरंबा सिंचन', description: `${isFlowering ? 80 : 55} मिमी पाणी देऊन मुळाशी पाणी साचू न देता ओलावा ठेवा.`, timing: 'सकाळी किंवा संध्याकाळी', costShare: 1800 },
          { category: 'protection', title: 'गुलाबी बोंडअळी व रसशोषक कीड नियंत्रण', description: '१० कामगंध सापळे/एकर + स्पिनेटोरम 11.7% SC (180 मिली) + डायाफेन्थिरॉन 50% WP (250 ग्रॅम) फवारणी.', timing: '४८ तासांत', costShare: 2400 },
          { category: 'soil_intercultural', title: 'डवरणी व झाडांना मातीची भर', description: 'आंतरमशागत करून झाडांच्या बुंध्याला माती लावा जेणेकरून अतिरिक्त पाण्याचा निचरा होईल.', timing: 'खताच्या डोसनंतर', costShare: 800 }
        ];
      } else if (lang === 'pa') {
        return [
          { category: 'nutrition', title: 'ਫੁੱਲ-ਗੁੱਲਰ ਡਿੱਗਣ ਤੋਂ ਬਚਾਅ ਤੇ ਖੁਰਾਕ', description: isFlowering ? '13-00-45 (2 ਕਿਲੋ/ਏਕੜ) + ਮੈਗਨੀਸ਼ੀਅਮ ਸਲਫੇਟ (1 ਕਿਲੋ) + ਪਲੈਨੋਫਿਕਸ ਦੀ ਸਪਰੇਅ ਗੁੱਲਰ ਡਿੱਗਣ ਤੋਂ ਬਚਾਉਂਦੀ ਹੈ।' : 'ਯੂਰੀਆ 25 ਕਿਲੋ + 19-19-19 (10 ਕਿਲੋ) + ਬੋਰਾਨ ਦਿਓ।', timing: 'ਸਵੇਰ ਵੇਲੇ', costShare: 2800 },
          { category: 'irrigation', title: 'ਡ੍ਰਿੱਪ / ਖਾਲੀਆਂ ਰਾਹੀਂ ਸਿੰਚਾਈ', description: `${isFlowering ? 80 : 55} ਮਿਲੀਮੀਟਰ ਪਾਣੀ ਲਗਾਓ, ਪਾਣੀ ਖੜ੍ਹਨ ਨਾ ਦਿਓ।`, timing: 'ਸਵੇਰੇ ਜਾਂ ਸ਼ਾਮੀਂ', costShare: 1800 },
          { category: 'protection', title: 'ਗੁਲਾਬੀ ਸੁੰਡੀ ਅਤੇ ਚਿੱਟੀ ਮੱਖੀ ਤੋਂ ਬਚਾਅ', description: '10 ਫੇਰੋਮੋਨ ਟਰੈਪ/ਏਕੜ + ਸਪਿਨੇਟੋਰਮ 11.7% SC (180 ਮਿਲੀ) ਦੀ ਸਪਰੇਅ।', timing: '48 ਘੰਟਿਆਂ ਵਿੱਚ', costShare: 2400 },
          { category: 'soil_intercultural', title: 'ਬੂਟਿਆਂ ਨੂੰ ਮਿੱਟੀ ਲਾਉਣਾ', description: 'ਬੂਟਿਆਂ ਦੀਆਂ ਜੜ੍ਹਾਂ ਤੇ ਮਿੱਟੀ ਚਾੜ੍ਹੋ ਤਾਂ ਜੋ ਬੂਟੇ ਡਿੱਗਣ ਤੋਂ ਬਚੇ ਰਹਿਣ।', timing: 'ਗੋਡੀ ਵੇਲੇ', costShare: 800 }
        ];
      }
      return [
        { category: 'nutrition', title: 'Foliar Nutrients & Flower Retention', description: isFlowering ? 'Foliar spray of 13-00-45 (2 kg/acre) + Magnesium Sulfate (1 kg) + Planofix (4 ml/15L) to prevent boll drop.' : 'Drip fertigation with Urea (25 kg) + 19-19-19 (10 kg) + Boron (200 g/acre).', timing: 'Calm morning weather', costShare: 2800 },
        { category: 'irrigation', title: 'Drip / Ridge-and-Furrow Irrigation', description: `Provide ${isFlowering ? 80 : 55} mm depth avoiding waterlogging in root zone.`, timing: 'Early morning or late afternoon', costShare: 1800 },
        { category: 'protection', title: 'Pink Bollworm & Sucking Pest Shield', description: '10 PBW Pheromone traps/acre + Spray Spinetoram 11.7% SC (180 ml/acre) + Diafenthiuron 50% WP (250 g/acre).', timing: 'Within 48 hours', costShare: 2400 },
        { category: 'soil_intercultural', title: 'Inter-row Cultivation & Earthing Up', description: 'Tractor / bullock-drawn intercultural operation to earth-up plants.', timing: 'After first top-dressing', costShare: 800 }
      ];
    } else if (strategy === 'balanced') {
      if (lang === 'hi') {
        return [
          { category: 'nutrition', title: 'विभाजित उर्वरक व पोटाश पोषण', description: isFlowering ? '2% डीएपी + 1% पोटाश (MOP) का पर्णीय छिड़काव करें।' : 'यूरिया 30 किग्रा + पोटाश 15 किग्रा/एकड़ दें।', timing: 'जड़ों के पास', costShare: 1900 },
          { category: 'irrigation', title: 'एकान्तर कतार (अल्टरनेट फरो) सिंचाई', description: `${isFlowering ? 60 : 42} मिमी पानी एकान्तर कतारों में दें, जिससे 35% पानी की बचत होती है।`, timing: 'सुबह के समय', costShare: 1300 },
          { category: 'protection', title: 'एकीकृत कीट प्रबंधन (IPM)', description: '5 फेरोमोन ट्रैप/एकड़ + नीम तेल 10000 ppm (500 मिली) + ब्युवेरिया बेसियाना जैव कवक का छिड़काव।', timing: '3 से 5 दिनों में', costShare: 1700 },
          { category: 'soil_intercultural', title: 'निराई व धूल मल्चिंग', description: 'हाथ से खरपतवार निकालें और कतारों के बीच हल्की जुताई करें।', timing: '45 दिन पर', costShare: 600 }
        ];
      } else if (lang === 'mr') {
        return [
          { category: 'nutrition', title: 'संतुलित खत व पोटॅश फवारणी', description: isFlowering ? '२% डीएपी + १% पोटॅश (MOP) ची फवारणी पाते अवस्थेत करा.' : 'युरिया 30 किलो + पोटॅश 15 किलो/एकर बांगडी पद्धतीने द्यावे.', timing: 'मुळांजवळ', costShare: 1900 },
          { category: 'irrigation', title: 'एकआड एक सरी सिंचन (अल्टरनेट फरो)', description: `${isFlowering ? 60 : 42} मिमी पाणी एकाआड एक सरीमध्ये देऊन ३५% पाण्याची बचत करा.`, timing: 'सकाळच्या वेळी', costShare: 1300 },
          { category: 'protection', title: 'एकात्मिक कीड व्यवस्थापन (IPM)', description: '५ कामगंध सापळे + निंबोळी अर्क १०००० ppm (५०० मिली) + बिव्हेरिया बॅसियाना जैविक बुरशी.', timing: '३ ते ५ दिवसांत', costShare: 1700 },
          { category: 'soil_intercultural', title: 'खुरपणी व धूळ आच्छादन', description: 'एक खुरपणी करून वरचा मातीचा थर मोकळा करा.', timing: '४५ दिवसांनी', costShare: 600 }
        ];
      } else if (lang === 'pa') {
        return [
          { category: 'nutrition', title: 'ਸੰਤੁਲਿਤ ਖਾਦ ਅਤੇ ਪੋਟਾਸ਼ ਸਪਰੇਅ', description: isFlowering ? '2% ਡੀ.ਏ.ਪੀ. + 1% ਪੋਟਾਸ਼ ਦੀ ਸਪਰੇਅ ਕਰੋ।' : 'ਯੂਰੀਆ 30 ਕਿਲੋ + ਪੋਟਾਸ਼ 15 ਕਿਲੋ/ਏਕੜ ਪਾਓ।', timing: 'ਜੜ੍ਹਾਂ ਦੇ ਨੇੜੇ', costShare: 1900 },
          { category: 'irrigation', title: 'ਖਾਲੀ ਛੱਡ ਕੇ ਸਿੰਚਾਈ', description: `${isFlowering ? 60 : 42} ਮਿਲੀਮੀਟਰ ਪਾਣੀ ਇੱਕ ਖਾਲੀ ਛੱਡ ਕੇ ਲਗਾਓ, 35% ਪਾਣੀ ਬਚਾਓ।`, timing: 'ਸਵੇਰ ਵੇਲੇ', costShare: 1300 },
          { category: 'protection', title: 'ਕੀੜਾ ਰੋਕਥਾਮ (IPM)', description: '5 ਫੇਰੋਮੋਨ ਟਰੈਪ + ਨਿੰਮ ਦਾ ਤੇਲ 10000 ppm (500 ਮਿਲੀ)।', timing: '3 ਤੋਂ 5 ਦਿਨਾਂ ਵਿੱਚ', costShare: 1700 },
          { category: 'soil_intercultural', title: 'ਗੋਡੀ ਤੇ ਨਦੀਨ ਸਫਾਈ', description: 'ਹੱਥੀਂ ਗੋਡੀ ਕਰਕੇ ਨਦੀਨ ਸਾਫ ਕਰੋ।', timing: '45ਵੇਂ ਦਿਨ', costShare: 600 }
        ];
      }
      return [
        { category: 'nutrition', title: 'Split Fertilizer & Foliar Micronutrients', description: isFlowering ? 'Foliar spray of 2% DAP + 1% MOP to supply critical late potassium.' : 'Top-dress Urea @ 30 kg/acre + MOP @ 15 kg/acre.', timing: 'Applied around root perimeter', costShare: 1900 },
        { category: 'irrigation', title: 'Alternate Furrow Irrigation', description: `Supply ${isFlowering ? 60 : 42} mm depth in alternating furrows, saving 35% water.`, timing: 'Morning hours', costShare: 1300 },
        { category: 'protection', title: 'Integrated Pest Management (IPM)', description: 'Install PBW traps (5/acre) + Spray Neem Azadirachtin 10000 ppm @ 500 ml/acre + Beauveria bassiana.', timing: 'Within 3 - 5 days', costShare: 1700 },
        { category: 'soil_intercultural', title: 'Manual Weeding & Soil Mulching', description: 'Single manual weeding followed by dust-mulch formation via shallow sweep.', timing: 'At 45 DAS', costShare: 600 }
      ];
    } else {
      // low_cost
      if (lang === 'hi') {
        return [
          { category: 'nutrition', title: 'जीवामृत व जैविक टॉनिक', description: 'जीवामृत (10% घोल) + 1% यूरिया का छिड़काव किफायती पोषण के रूप में करें।', timing: 'शाम के समय', costShare: 1200 },
          { category: 'irrigation', title: 'सूखा बचाव सुरक्षात्मक सिंचाई', description: `${isFlowering ? 40 : 25} मिमी पानी केवल दोपहर में मुरझाने पर ही दें।`, timing: 'शाम को', costShare: 800 },
          { category: 'protection', title: 'दशपर्णी अर्क व ट्रैप क्रॉप', description: 'खेत की मेड़ पर गेंदा व अरंडी लगाएं; दशपर्णी अर्क (5 लीटर/एकड़) का छिड़काव करें।', timing: 'कीट दिखने पर', costShare: 900 },
          { category: 'soil_intercultural', title: 'जैविक फसल अवशेष आच्छादन', description: 'मूंग या उड़द के अवशेषों को खेत में बिछाकर नमी बचाएं।', timing: 'तुरंत', costShare: 500 }
        ];
      } else if (lang === 'mr') {
        return [
          { category: 'nutrition', title: 'जीवामृत व सेंद्रिय पोषण', description: 'जीवामृत (१०% द्रावण) + १% युरियाची फवारणी पिकाच्या पोषणासाठी करा.', timing: 'संध्याकाळी', costShare: 1200 },
          { category: 'irrigation', title: 'संरक्षक सिंचन व्यवस्थापन', description: `${isFlowering ? 40 : 25} मिमी पाणी पीक सुकू लागल्यास द्यावे.`, timing: 'रात्री किंवा संध्याकाळी', costShare: 800 },
          { category: 'protection', title: 'दशपर्णी अर्क व सापळा पिके', description: 'बांधावर झेंडू व एरंडी लावा; दशपर्णी अर्क (५ लिटर/एकर) फवारा.', timing: 'कीड दिसताच', costShare: 900 },
          { category: 'soil_intercultural', title: 'सेंद्रिय आच्छादन', description: 'कडधान्य पिकांचे अवशेष जमिनीवर पसरवून जमिनीचे तापमान कमी ठेवा.', timing: 'तातडीने', costShare: 500 }
        ];
      } else if (lang === 'pa') {
        return [
          { category: 'nutrition', title: 'ਜੀਵਾਮ੍ਰਿਤ ਅਤੇ ਜੈਵਿਕ ਖੁਰਾਕ', description: 'ਜੀਵਾਮ੍ਰਿਤ (10% ਘੋਲ) ਦੀ ਸਪਰੇਅ ਪੌਦਿਆਂ ਦੇ ਵਾਧੇ ਲਈ ਕਰੋ।', timing: 'ਸ਼ਾਮ ਵੇਲੇ', costShare: 1200 },
          { category: 'irrigation', title: 'ਬਚਾਅ ਸਿੰਚਾਈ', description: `${isFlowering ? 40 : 25} ਮਿਲੀਮੀਟਰ ਪਾਣੀ ਲੋੜ ਵੇਲੇ ਹੀ ਲਗਾਓ।`, timing: 'ਸ਼ਾਮ ਨੂੰ', costShare: 800 },
          { category: 'protection', title: 'ਦੇਸੀ ਕਾੜ੍ਹੇ ਅਤੇ ਟਰੈਪ ਫਸਲਾਂ', description: 'ਖੇਤ ਦੇ ਬੰਨਿਆਂ ਤੇ ਗੇਂਦਾ ਲਗਾਓ; ਨਿੰਮ/ਦੇਸੀ ਕਾੜ੍ਹੇ ਦੀ ਸਪਰੇਅ ਕਰੋ।', timing: 'ਕੀੜੇ ਦਿੱਸਣ ਤੇ', costShare: 900 },
          { category: 'soil_intercultural', title: 'ਜੈਵਿਕ ਮਲਚਿੰਗ', description: 'ਫਸਲੀ ਰਹਿੰਦ-ਖੂੰਹਦ ਵਿਛਾ ਕੇ ਨਮੀ ਬਚਾਓ।', timing: 'ਤੁਰੰਤ', costShare: 500 }
        ];
      }
      return [
        { category: 'nutrition', title: 'Organic Soil Health & Foliar Tonic', description: 'Spray Jeevamrit concoction (10% solution) + 1% Urea as economic nutrition.', timing: 'Late afternoon', costShare: 1200 },
        { category: 'irrigation', title: 'Critical Protective Irrigation', description: `Apply ${isFlowering ? 40 : 25} mm water strictly when crop shows midday wilting.`, timing: 'Evening hours', costShare: 800 },
        { category: 'protection', title: 'Border Trap Crops & Bio-Repellents', description: 'Plant Castor/Marigold border; spray Dashparni Ark (5 L/acre).', timing: 'On pest detection', costShare: 900 },
        { category: 'soil_intercultural', title: 'Organic In-situ Residue Mulch', description: 'Retain intercrop residues on soil surface to conserve moisture.', timing: 'Immediate', costShare: 500 }
      ];
    }
  }

  // ==========================================
  // 3. RICE / PADDY ACTIONS
  // ==========================================
  if (crop === 'Rice') {
    if (strategy === 'high_yield') {
      if (lang === 'hi') {
        return [
          { category: 'nutrition', title: 'सटीक यूरिया व जिंक पोषण', description: isFlowering ? 'बाली निकलते समय 00-52-34 (1.5 किग्रा/एकड़) + बोरॉन (200 ग्राम) का पर्णीय छिड़काव करें।' : 'यूरिया 40 किग्रा + जिंक सल्फेट 21% (10 किग्रा/एकड़) कल्ले फूटते समय डालें।', timing: 'कल्ले फूटने के 25-30 दिन बाद', costShare: 2600 },
          { category: 'irrigation', title: 'नियंत्रित आद्र-शुष्क (AWD) सिंचाई', description: `बाली निकलने तक 4-5 सेमी पानी बनाए रखें (${isFlowering ? 100 : 80} मिमी)।`, timing: 'सतत जल स्तर निगरानी', costShare: 2200 },
          { category: 'protection', title: 'तना छेदक व शीथ ब्लाइट सुरक्षा', description: 'कार्टाप हाइड्रोक्लोराइड 4G (10 किग्रा) या ट्राइसाइक्लाज़ोल 75% WP (120 ग्राम/एकड़) का छिड़काव।', timing: '48 घंटों के भीतर', costShare: 1900 },
          { category: 'soil_intercultural', title: 'कोनोवीडर गुड़ाई व खरपतवार नियंत्रण', description: 'बिस्पायरीबैक सोडियम 10% SC (80 मिली/एकड़) से खरपतवार रोकथाम।', timing: 'रोपाई के 18-22 दिन बाद', costShare: 800 }
        ];
      } else if (lang === 'mr') {
        return [
          { category: 'nutrition', title: 'अचूक युरिया व सूक्ष्म अन्नद्रव्ये', description: isFlowering ? 'ओंबी भरताना 00-52-34 (1.5 किलो/एकर) + बोरॉन (200 ग्रॅम) ची फवारणी करा.' : 'युरिया 40 किलो + झिंक सल्फेट (10 किलो/एकर) फुटवे फुटताना द्यावे.', timing: 'फुटव्यांच्या अवस्थेत', costShare: 2600 },
          { category: 'irrigation', title: 'नियमित पाणी व्यवस्थापन', description: `ओंबी बाहेर पडेपर्यंत शेतात 4-5 सेमी पाणी पातळी ठेवा (${isFlowering ? 100 : 80} मिमी).`, timing: 'सकाळच्या वेळी', costShare: 2200 },
          { category: 'protection', title: 'खोडकिडा व करपा संरक्षण', description: 'ट्रायसायक्लॅझोल 75% WP (120 ग्रॅम) किंवा कार्टाप हायड्रोक्लोराईड 4G (10 किलो/एकर).', timing: '४८ तासांत', costShare: 1900 },
          { category: 'soil_intercultural', title: 'कोनोवीडरने आंतरमशागत', description: 'कोनोवीडर चालवून तण नष्ट करा आणि मुळांना प्राणवायू द्या.', timing: 'पुनर्लागवडीनंतर २० दिवसांनी', costShare: 800 }
        ];
      } else if (lang === 'pa') {
        return [
          { category: 'nutrition', title: 'ਯੂਰੀਆ ਅਤੇ ਜ਼ਿੰਕ ਦਾ ਸਹੀ ਸੰਤੁਲਨ', description: isFlowering ? 'ਨਿਸਰਨ ਵੇਲੇ 00-52-34 (1.5 ਕਿਲੋ/ਏਕੜ) + ਬੋਰਾਨ (200 ਗ੍ਰਾਮ) ਦੀ ਸਪਰੇਅ ਕਰੋ।' : 'ਯੂਰੀਆ 40 ਕਿਲੋ + ਜ਼ਿੰਕ ਸਲਫੇਟ 21% (10 ਕਿਲੋ/ਏਕੜ) ਫੋਟ ਵੇਲੇ ਪਾਓ।', timing: 'ਫੋਟ ਫੁੱਟਣ ਵੇਲੇ', costShare: 2600 },
          { category: 'irrigation', title: 'ਪਾਣੀ ਦੀ ਸੁਚੱਜੀ ਵਰਤੋਂ (AWD)', description: `ਨਿਸਰਨ ਤੱਕ 4-5 ਸੈਂਟੀਮੀਟਰ ਪਾਣੀ ਖੜ੍ਹਾ ਰੱਖੋ (${isFlowering ? 100 : 80} ਮਿਲੀਮੀਟਰ)।`, timing: 'ਨਿਯਮਿਤ ਸਿੰਚਾਈ', costShare: 2200 },
          { category: 'protection', title: 'ਤਣਾ ਛੇਦਕ ਅਤੇ ਝੁਲਸ ਰੋਗ ਤੋਂ ਬਚਾਅ', description: 'ਕਾਰਟਾਪ ਹਾਈਡ੍ਰੋਕਲੋਰਾਈਡ 4G (10 ਕਿਲੋ) ਜਾਂ ਟ੍ਰਾਈਸਾਈਕਲਾਜ਼ੋਲ 75% WP (120 ਗ੍ਰਾਮ)।', timing: '48 ਘੰਟਿਆਂ ਅੰਦਰ', costShare: 1900 },
          { category: 'soil_intercultural', title: 'ਨਦੀਨ ਰੋਕਥਾਮ', description: 'ਬਿਸਪਾਇਰੀਬੈਕ ਸੋਡੀਅਮ 10% SC (80 ਮਿਲੀ/ਏਕੜ) ਨਾਲ ਨਦੀਨਾਂ ਦਾ ਸਫਾਇਆ।', timing: 'ਪਨੀਰੀ ਲਾਉਣ ਤੋਂ 20 ਦਿਨ ਬਾਅਦ', costShare: 800 }
        ];
      }
      return [
        { category: 'nutrition', title: 'Precision Top-Dressing & Foliar Boost', description: isFlowering ? 'Foliar spray of 00-52-34 (1.5 kg/acre) + Boron (200g/acre) at panicle emergence.' : 'Top-dress Urea @ 40 kg/acre + Zinc Sulfate 21% @ 10 kg/acre at active tillering.', timing: '25-30 days after transplanting', costShare: 2600 },
        { category: 'irrigation', title: 'Alternate Wetting & Drying (AWD)', description: `Maintain shallow 4-5 cm water layer during flowering (${isFlowering ? 100 : 80} mm).`, timing: 'Scheduled field depth', costShare: 2200 },
        { category: 'protection', title: 'Stem Borer & Sheath Blight Defense', description: 'Apply Cartap Hydrochloride 4G @ 10 kg/acre or Tricyclazole 75% WP @ 120 g/acre.', timing: 'Within 48 hours', costShare: 1900 },
        { category: 'soil_intercultural', title: 'Cono-Weeder & Weed Management', description: 'Run mechanical cono-weeder to aerate root zone and suppress grassy weeds.', timing: '18-22 DAT', costShare: 800 }
      ];
    } else if (strategy === 'balanced') {
      if (lang === 'hi') {
        return [
          { category: 'nutrition', title: 'विभाजित यूरिया व जैविक पोषण', description: 'नीम लेपित यूरिया 30 किग्रा + पीएसबी जैव खाद का प्रयोग करें।', timing: 'पानी देने से पहले', costShare: 1800 },
          { category: 'irrigation', title: 'किफायती आद्र-शुष्क सिंचाई', description: `${isFlowering ? 80 : 60} मिमी पानी दें, लगातार गहरा पानी न भरें।`, timing: 'दोपहर बाद', costShare: 1500 },
          { category: 'protection', title: 'एकीकृत कीट प्रबंधन (IPM)', description: 'ट्राइकोग्रामा कार्ड (20,000 अंडे/एकड़) + नीम तेल 1500 ppm छिड़काव।', timing: '3 से 5 दिनों में', costShare: 1400 },
          { category: 'soil_intercultural', title: 'हाथ से निराई-गुड़ाई', description: 'रोपाई के 30 दिन बाद हाथ से खरपतवार निकालें।', timing: 'ओट आने पर', costShare: 600 }
        ];
      } else if (lang === 'mr') {
        return [
          { category: 'nutrition', title: 'संतुलित खत मात्रा व सेंद्रिय घटक', description: 'युरिया 30 किलो + पीएसबी जिवाणू खताचा वापर करा.', timing: 'ओलावा असताना', costShare: 1800 },
          { category: 'irrigation', title: 'आवश्यकतेनुसार सिंचन', description: `${isFlowering ? 80 : 60} मिमी पाणी गरजेपुरतेच द्यावे.`, timing: 'संध्याकाळी', costShare: 1500 },
          { category: 'protection', title: 'एकात्मिक कीड नियंत्रण', description: 'ट्रायकोग्रामा कार्ड + निंबोळी अर्क (१५०० ppm) चा वापर.', timing: '३ ते ५ दिवसांत', costShare: 1400 },
          { category: 'soil_intercultural', title: 'खुरपणी व स्वच्छता', description: 'शेतातील तण काढून बांध स्वच्छ ठेवा.', timing: '३० दिवसांनी', costShare: 600 }
        ];
      } else if (lang === 'pa') {
        return [
          { category: 'nutrition', title: 'ਸੰਤੁਲਿਤ ਖਾਦ ਪ੍ਰਬੰਧਨ', description: 'ਯੂਰੀਆ 30 ਕਿਲੋ + ਜੈਵਿਕ ਖਾਦ ਪਾਓ।', timing: 'ਪਾਣੀ ਲਾਉਣ ਤੋਂ ਪਹਿਲਾਂ', costShare: 1800 },
          { category: 'irrigation', title: 'ਸੰਜਮ ਨਾਲ ਸਿੰਚਾਈ', description: `${isFlowering ? 80 : 60} ਮਿਲੀਮੀਟਰ ਪਾਣੀ ਲਗਾਓ, ਵਾਧੂ ਪਾਣੀ ਨਾ ਖੜ੍ਹਾ ਕਰੋ।`, timing: 'ਦੁਪਹਿਰ ਬਾਅਦ', costShare: 1500 },
          { category: 'protection', title: 'ਕੀੜਾ ਰੋਕਥਾਮ (IPM)', description: 'ਟ੍ਰਾਈਕੋਗ੍ਰਾਮਾ ਕਾਰਡ + ਨਿੰਮ ਦਾ ਅਰਕ ਸਪਰੇਅ ਕਰੋ।', timing: '3 ਤੋਂ 5 ਦਿਨਾਂ ਵਿੱਚ', costShare: 1400 },
          { category: 'soil_intercultural', title: 'ਨਦੀਨਾਂ ਦੀ ਹੱਥੀਂ ਗੋਡੀ', description: '30 ਦਿਨਾਂ ਤੇ ਹੱਥੀਂ ਨਦੀਨ ਕੱਢੋ।', timing: 'ਨਮੀ ਵਾਲੇ ਦਿਨ', costShare: 600 }
        ];
      }
      return [
        { category: 'nutrition', title: 'Split Urea & Bio-Fertilizer Blend', description: 'Broadcast Neem-coated Urea @ 30 kg/acre mixed with PSB bio-inoculant.', timing: 'Prior to light irrigation', costShare: 1800 },
        { category: 'irrigation', title: 'Controlled Water Management', description: `Supply ${isFlowering ? 80 : 60} mm depth without prolonged stagnant flooding.`, timing: 'Late afternoon', costShare: 1500 },
        { category: 'protection', title: 'Integrated Pest Management (IPM)', description: 'Release Trichogramma cards (20,000 eggs/acre) + Spray Neem Azadirachtin 1500 ppm.', timing: 'Within 3 - 5 days', costShare: 1400 },
        { category: 'soil_intercultural', title: 'Manual Spot Weeding & Bund Cleanliness', description: 'Remove competitive weeds and trim field levees to curb insect roosting.', timing: 'At 30 DAT', costShare: 600 }
      ];
    } else {
      // low_cost
      if (lang === 'hi') {
        return [
          { category: 'nutrition', title: 'हरित खाद व वर्मीवॉश छिड़काव', description: 'वर्मीवॉश (5 लीटर/एकड़) + 1% यूरिया का सस्ता पर्णीय पोषण दें।', timing: 'सुबह के समय', costShare: 1100 },
          { category: 'irrigation', title: 'बचत वाली जल आपूर्ति', description: `${isFlowering ? 50 : 35} मिमी पानी केवल क्रांतिक अवस्था पर दें।`, timing: 'शाम को', costShare: 1000 },
          { category: 'protection', title: 'नीम काढ़ा व घरेलू घोल', description: 'नीम पत्ती काढ़ा (5%) या कॉपर ऑक्सीक्लोराइड का छिड़काव।', timing: 'लक्षण दिखने पर', costShare: 800 },
          { category: 'soil_intercultural', title: 'खेत की मेड़ पर खरपतवार नियंत्रण', description: 'मेड़ों की घास काटकर कीट आश्रय नष्ट करें।', timing: 'तुरंत', costShare: 400 }
        ];
      } else if (lang === 'mr') {
        return [
          { category: 'nutrition', title: 'सेंद्रिय पोषण व वर्मीवॉश', description: 'वर्मीवॉश (५ लिटर/एकर) + १% युरियाचा फवारा द्या.', timing: 'सकाळी', costShare: 1100 },
          { category: 'irrigation', title: 'काटकसरीचे सिंचन', description: `${isFlowering ? 50 : 35} मिमी पाणी अत्यंत आवश्यकतेनुसार द्यावे.`, timing: 'रात्री', costShare: 1000 },
          { category: 'protection', title: 'वनस्पतीजन्य संरक्षण', description: 'निंबोळी अर्क (५%) किंवा ताक-हिंग द्रावणाचा फवारा.', timing: 'सुरुवातीला', costShare: 800 },
          { category: 'soil_intercultural', title: 'बांध स्वच्छता', description: 'बांध स्वच्छ ठेवून कीड प्रसार रोखा.', timing: 'तातडीने', costShare: 400 }
        ];
      } else if (lang === 'pa') {
        return [
          { category: 'nutrition', title: 'ਦੇਸੀ ਖੁਰਾਕ ਤੇ ਵਰਮੀਵਾਸ਼', description: 'ਵਰਮੀਵਾਸ਼ (5 ਲੀਟਰ/ਏਕੜ) + 1% ਯੂਰੀਆ ਦੀ ਸਪਰੇਅ।', timing: 'ਸਵੇਰ ਵੇਲੇ', costShare: 1100 },
          { category: 'irrigation', title: 'ਬੱਚਤ ਵਾਲਾ ਪਾਣੀ', description: `${isFlowering ? 50 : 35} ਮਿਲੀਮੀਟਰ ਪਾਣੀ ਲੋੜ ਅਨੁਸਾਰ ਹੀ ਦਿਓ।`, timing: 'ਸ਼ਾਮ ਨੂੰ', costShare: 1000 },
          { category: 'protection', title: 'ਦੇਸੀ ਕਾੜ੍ਹੇ ਨਾਲ ਸੁਰੱਖਿਆ', description: 'ਨਿੰਮ ਦਾ ਅਰਕ ਜਾਂ ਕਾਪਰ ਘੋਲ ਸਪਰੇਅ ਕਰੋ।', timing: 'ਲੱਛਣ ਦਿੱਸਣ ਤੇ', costShare: 800 },
          { category: 'soil_intercultural', title: 'ਬੰਨੇ ਸਾਫ ਰੱਖਣਾ', description: 'ਖੇਤ ਦੇ ਬੰਨਿਆਂ ਤੋਂ ਘਾਹ-ਫੂਸ ਸਾਫ ਕਰੋ।', timing: 'ਤੁਰੰਤ', costShare: 400 }
        ];
      }
      return [
        { category: 'nutrition', title: 'Bio-Enriched Foliar Sprays', description: 'Apply Vermiwash (5 L/acre) blended with 1% Urea for economical canopy nutrition.', timing: 'Morning hours', costShare: 1100 },
        { category: 'irrigation', title: 'Deficit Protective Irrigation', description: `Deliver ${isFlowering ? 50 : 35} mm depth strictly at critical moisture stress periods.`, timing: 'Evening hours', costShare: 1000 },
        { category: 'protection', title: 'Botanical Pest Deterrents', description: 'Spray Neem Seed Kernel Extract (5%) or Copper Oxychloride 50% WP.', timing: 'On initial symptoms', costShare: 800 },
        { category: 'soil_intercultural', title: 'Bund Sanitization & Canopy Clearing', description: 'Trim grassy borders to minimize pest harboring reservoirs.', timing: 'Immediate', costShare: 400 }
      ];
    }
  }

  // ==========================================
  // 4. SOYBEAN & MAIZE ACTIONS (Rich Fallbacks)
  // ==========================================
  if (crop === 'Soybean') {
    return CROPS_DATA.Cotton.planTemplates[strategy].getStageActions(stage, context);
  }

  return CROPS_DATA.Wheat.planTemplates[strategy].getStageActions(stage, context);
}

export const CROPS_DATA = {
  Wheat: {
    name: 'Wheat',
    season: 'Rabi (Winter)',
    durationDays: 120,
    idealSoil: ['Alluvial', 'Clay Loam', 'Sandy Loam'],
    baseMarketPricePerQuintal: 2425,
    baseYieldPerAcre: 22,
    priceUnit: 'quintal',
    priceRange: { min: 1600, max: 4000, step: 25 },
    stages: {
      'Sowing / Germination': { stageIndex: 1, daysRange: '0 - 20 DAS', baseWaterDemandMm: 50, criticalStage: false, stageCostPerAcre: { high_yield: 6800, balanced: 4800, low_cost: 3200 } },
      'Vegetative / Tillering': { stageIndex: 2, daysRange: '21 - 45 DAS', baseWaterDemandMm: 65, criticalStage: true, stageCostPerAcre: { high_yield: 5500, balanced: 3900, low_cost: 2600 } },
      'Flowering / Reproductive': { stageIndex: 3, daysRange: '46 - 75 DAS', baseWaterDemandMm: 80, criticalStage: true, stageCostPerAcre: { high_yield: 6200, balanced: 4400, low_cost: 2900 } },
      'Grain Filling / Pod Formation': { stageIndex: 4, daysRange: '76 - 100 DAS', baseWaterDemandMm: 60, criticalStage: true, stageCostPerAcre: { high_yield: 4200, balanced: 3100, low_cost: 2100 } },
      'Maturity / Harvest': { stageIndex: 5, daysRange: '101 - 120 DAS', baseWaterDemandMm: 15, criticalStage: false, stageCostPerAcre: { high_yield: 3500, balanced: 2800, low_cost: 2000 } }
    },
    planTemplates: {
      high_yield: { id: 'wheat_high_yield', strategyType: 'high_yield', waterFactor: 1.15, yieldIndex: 95, yieldMultiplier: 1.15, getStageActions: (st, ctx) => buildActions('Wheat', 'high_yield', st, ctx) },
      balanced: { id: 'wheat_balanced', strategyType: 'balanced', waterFactor: 0.85, yieldIndex: 82, yieldMultiplier: 1.00, getStageActions: (st, ctx) => buildActions('Wheat', 'balanced', st, ctx) },
      low_cost: { id: 'wheat_low_cost', strategyType: 'low_cost', waterFactor: 0.60, yieldIndex: 68, yieldMultiplier: 0.85, getStageActions: (st, ctx) => buildActions('Wheat', 'low_cost', st, ctx) }
    }
  },

  Rice: {
    name: 'Rice',
    season: 'Kharif / Rabi',
    durationDays: 130,
    idealSoil: ['Clay Loam', 'Alluvial', 'Black Cotton'],
    baseMarketPricePerQuintal: 2320,
    baseYieldPerAcre: 28,
    priceUnit: 'quintal',
    priceRange: { min: 1500, max: 4500, step: 25 },
    stages: {
      'Sowing / Germination': { stageIndex: 1, daysRange: '0 - 25 DAS', baseWaterDemandMm: 90, criticalStage: false, stageCostPerAcre: { high_yield: 8200, balanced: 5900, low_cost: 3800 } },
      'Vegetative / Tillering': { stageIndex: 2, daysRange: '26 - 55 DAS', baseWaterDemandMm: 110, criticalStage: true, stageCostPerAcre: { high_yield: 6900, balanced: 4800, low_cost: 3100 } },
      'Flowering / Reproductive': { stageIndex: 3, daysRange: '56 - 90 DAS', baseWaterDemandMm: 130, criticalStage: true, stageCostPerAcre: { high_yield: 7500, balanced: 5300, low_cost: 3400 } },
      'Grain Filling / Pod Formation': { stageIndex: 4, daysRange: '91 - 115 DAS', baseWaterDemandMm: 85, criticalStage: true, stageCostPerAcre: { high_yield: 4800, balanced: 3600, low_cost: 2300 } },
      'Maturity / Harvest': { stageIndex: 5, daysRange: '116 - 135 DAS', baseWaterDemandMm: 20, criticalStage: false, stageCostPerAcre: { high_yield: 3900, balanced: 3000, low_cost: 2100 } }
    },
    planTemplates: {
      high_yield: { id: 'rice_high_yield', strategyType: 'high_yield', waterFactor: 1.20, yieldIndex: 96, yieldMultiplier: 1.15, getStageActions: (st, ctx) => buildActions('Rice', 'high_yield', st, ctx) },
      balanced: { id: 'rice_balanced', strategyType: 'balanced', waterFactor: 0.85, yieldIndex: 84, yieldMultiplier: 1.00, getStageActions: (st, ctx) => buildActions('Rice', 'balanced', st, ctx) },
      low_cost: { id: 'rice_low_cost', strategyType: 'low_cost', waterFactor: 0.60, yieldIndex: 70, yieldMultiplier: 0.85, getStageActions: (st, ctx) => buildActions('Rice', 'low_cost', st, ctx) }
    }
  },

  Cotton: {
    name: 'Cotton',
    season: 'Kharif',
    durationDays: 160,
    idealSoil: ['Black Cotton', 'Clay Loam', 'Alluvial'],
    baseMarketPricePerQuintal: 7120,
    baseYieldPerAcre: 10,
    priceUnit: 'quintal',
    priceRange: { min: 4500, max: 11000, step: 50 },
    stages: {
      'Sowing / Germination': { stageIndex: 1, daysRange: '0 - 30 DAS', baseWaterDemandMm: 45, criticalStage: false, stageCostPerAcre: { high_yield: 7900, balanced: 5400, low_cost: 3500 } },
      'Vegetative / Tillering': { stageIndex: 2, daysRange: '31 - 60 DAS', baseWaterDemandMm: 60, criticalStage: false, stageCostPerAcre: { high_yield: 6200, balanced: 4300, low_cost: 2800 } },
      'Flowering / Reproductive': { stageIndex: 3, daysRange: '61 - 100 DAS', baseWaterDemandMm: 85, criticalStage: true, stageCostPerAcre: { high_yield: 7800, balanced: 5500, low_cost: 3600 } },
      'Grain Filling / Pod Formation': { stageIndex: 4, daysRange: '101 - 135 DAS', baseWaterDemandMm: 55, criticalStage: true, stageCostPerAcre: { high_yield: 5100, balanced: 3700, low_cost: 2400 } },
      'Maturity / Harvest': { stageIndex: 5, daysRange: '136 - 165 DAS', baseWaterDemandMm: 15, criticalStage: false, stageCostPerAcre: { high_yield: 4200, balanced: 3200, low_cost: 2200 } }
    },
    planTemplates: {
      high_yield: { id: 'cotton_high_yield', strategyType: 'high_yield', waterFactor: 1.15, yieldIndex: 94, yieldMultiplier: 1.15, getStageActions: (st, ctx) => buildActions('Cotton', 'high_yield', st, ctx) },
      balanced: { id: 'cotton_balanced', strategyType: 'balanced', waterFactor: 0.85, yieldIndex: 82, yieldMultiplier: 1.00, getStageActions: (st, ctx) => buildActions('Cotton', 'balanced', st, ctx) },
      low_cost: { id: 'cotton_low_cost', strategyType: 'low_cost', waterFactor: 0.60, yieldIndex: 67, yieldMultiplier: 0.85, getStageActions: (st, ctx) => buildActions('Cotton', 'low_cost', st, ctx) }
    }
  },

  Soybean: {
    name: 'Soybean',
    season: 'Kharif',
    durationDays: 100,
    idealSoil: ['Black Cotton', 'Clay Loam', 'Alluvial'],
    baseMarketPricePerQuintal: 4892,
    baseYieldPerAcre: 12,
    priceUnit: 'quintal',
    priceRange: { min: 3000, max: 7500, step: 50 },
    stages: {
      'Sowing / Germination': { stageIndex: 1, daysRange: '0 - 15 DAS', baseWaterDemandMm: 35, criticalStage: false, stageCostPerAcre: { high_yield: 5200, balanced: 3800, low_cost: 2600 } },
      'Vegetative / Tillering': { stageIndex: 2, daysRange: '16 - 35 DAS', baseWaterDemandMm: 50, criticalStage: false, stageCostPerAcre: { high_yield: 4400, balanced: 3200, low_cost: 2200 } },
      'Flowering / Reproductive': { stageIndex: 3, daysRange: '36 - 60 DAS', baseWaterDemandMm: 70, criticalStage: true, stageCostPerAcre: { high_yield: 5600, balanced: 4100, low_cost: 2800 } },
      'Grain Filling / Pod Formation': { stageIndex: 4, daysRange: '61 - 85 DAS', baseWaterDemandMm: 55, criticalStage: true, stageCostPerAcre: { high_yield: 3900, balanced: 2900, low_cost: 1900 } },
      'Maturity / Harvest': { stageIndex: 5, daysRange: '86 - 105 DAS', baseWaterDemandMm: 10, criticalStage: false, stageCostPerAcre: { high_yield: 3200, balanced: 2400, low_cost: 1700 } }
    },
    planTemplates: {
      high_yield: { id: 'soybean_high_yield', strategyType: 'high_yield', waterFactor: 1.10, yieldIndex: 93, yieldMultiplier: 1.15, getStageActions: (st, ctx) => buildActions('Soybean', 'high_yield', st, ctx) },
      balanced: { id: 'soybean_balanced', strategyType: 'balanced', waterFactor: 0.85, yieldIndex: 81, yieldMultiplier: 1.00, getStageActions: (st, ctx) => buildActions('Soybean', 'balanced', st, ctx) },
      low_cost: { id: 'soybean_low_cost', strategyType: 'low_cost', waterFactor: 0.60, yieldIndex: 66, yieldMultiplier: 0.85, getStageActions: (st, ctx) => buildActions('Soybean', 'low_cost', st, ctx) }
    }
  },

  Maize: {
    name: 'Maize (Corn)',
    season: 'Kharif / Rabi / Spring',
    durationDays: 110,
    idealSoil: ['Sandy Loam', 'Clay Loam', 'Alluvial', 'Red Soil'],
    baseMarketPricePerQuintal: 2225,
    baseYieldPerAcre: 25,
    priceUnit: 'quintal',
    priceRange: { min: 1400, max: 3500, step: 25 },
    stages: {
      'Sowing / Germination': { stageIndex: 1, daysRange: '0 - 15 DAS', baseWaterDemandMm: 40, criticalStage: false, stageCostPerAcre: { high_yield: 6100, balanced: 4400, low_cost: 2900 } },
      'Vegetative / Tillering': { stageIndex: 2, daysRange: '16 - 40 DAS', baseWaterDemandMm: 60, criticalStage: false, stageCostPerAcre: { high_yield: 5300, balanced: 3700, low_cost: 2400 } },
      'Flowering / Reproductive': { stageIndex: 3, daysRange: '41 - 70 DAS', baseWaterDemandMm: 85, criticalStage: true, stageCostPerAcre: { high_yield: 6400, balanced: 4600, low_cost: 3000 } },
      'Grain Filling / Pod Formation': { stageIndex: 4, daysRange: '71 - 95 DAS', baseWaterDemandMm: 65, criticalStage: true, stageCostPerAcre: { high_yield: 4400, balanced: 3200, low_cost: 2100 } },
      'Maturity / Harvest': { stageIndex: 5, daysRange: '96 - 115 DAS', baseWaterDemandMm: 15, criticalStage: false, stageCostPerAcre: { high_yield: 3600, balanced: 2700, low_cost: 1900 } }
    },
    planTemplates: {
      high_yield: { id: 'maize_high_yield', strategyType: 'high_yield', waterFactor: 1.15, yieldIndex: 95, yieldMultiplier: 1.15, getStageActions: (st, ctx) => buildActions('Maize', 'high_yield', st, ctx) },
      balanced: { id: 'maize_balanced', strategyType: 'balanced', waterFactor: 0.85, yieldIndex: 83, yieldMultiplier: 1.00, getStageActions: (st, ctx) => buildActions('Maize', 'balanced', st, ctx) },
      low_cost: { id: 'maize_low_cost', strategyType: 'low_cost', waterFactor: 0.60, yieldIndex: 68, yieldMultiplier: 0.85, getStageActions: (st, ctx) => buildActions('Maize', 'low_cost', st, ctx) }
    }
  }
};

/**
 * Calculates dynamic crop economics (Expected Output Yield, Gross Revenue, Plan Cost, Net Profit, Delta)
 * Works for any crop, farm size, strategy yield multiplier, and market price scenario.
 * 
 * @param {Object} plan - Plan object containing estimatedCost and strategyType/yieldMultiplier
 * @param {Object} farmer - Farmer object containing farmSize and crop
 * @param {Object} [priceScenario] - { mode: 'current'|'plus10'|'minus10'|'custom', customPrice: number }
 * @returns {Object} Complete economic projection
 */
export function calculateCropEconomics(plan, farmer, priceScenario = null) {
  const cropKey = farmer?.crop || 'Wheat';
  const cropConfig = CROPS_DATA[cropKey] || CROPS_DATA.Wheat;
  const farmSize = Math.max(0.1, Number(farmer?.farmSize) || 1.0);
  const baseYieldPerAcre = cropConfig.baseYieldPerAcre || 20;
  const basePrice = cropConfig.baseMarketPricePerQuintal || 2400;

  // Determine strategy yield factor
  let yieldMultiplier = plan?.yieldMultiplier;
  if (!yieldMultiplier) {
    if (plan?.strategyType === 'high_yield') yieldMultiplier = 1.15;
    else if (plan?.strategyType === 'low_cost') yieldMultiplier = 0.85;
    else yieldMultiplier = 1.00;
  }

  const expectedYieldQuintals = Math.round(farmSize * baseYieldPerAcre * yieldMultiplier * 10) / 10;

  // Determine scenario price
  let scenarioPrice = basePrice;
  const mode = priceScenario?.mode || 'current';

  if (mode === 'plus10') {
    scenarioPrice = Math.round(basePrice * 1.10);
  } else if (mode === 'minus10') {
    scenarioPrice = Math.round(basePrice * 0.90);
  } else if (mode === 'custom' && priceScenario?.customPrice) {
    scenarioPrice = Math.max(100, Number(priceScenario.customPrice));
  }

  const estimatedCost = plan?.estimatedCost || 0;
  const baselineRevenue = Math.round(expectedYieldQuintals * basePrice);
  const scenarioRevenue = Math.round(expectedYieldQuintals * scenarioPrice);

  const baselineProfit = baselineRevenue - estimatedCost;
  const scenarioProfit = scenarioRevenue - estimatedCost;
  const profitDelta = scenarioProfit - baselineProfit;

  const profitMarginPercent = scenarioRevenue > 0
    ? Math.round((scenarioProfit / scenarioRevenue) * 100)
    : 0;

  const priceChangePercent = basePrice > 0
    ? Math.round(((scenarioPrice - basePrice) / basePrice) * 100)
    : 0;

  return {
    cropName: cropKey,
    farmSize,
    baseMarketPrice: basePrice,
    scenarioPrice,
    priceMode: mode,
    priceChangePercent,
    expectedYieldQuintals,
    baselineRevenue,
    scenarioRevenue,
    estimatedCost,
    baselineProfit,
    scenarioProfit,
    profitDelta,
    profitMarginPercent,
    isProfitable: scenarioProfit > 0
  };
}
