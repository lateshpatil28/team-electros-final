/**
 * @file explanations.js
 * Dynamic, Context-Aware Multilingual Reason Generator for FarmWise Decision Engine
 * Supports: English (en), Hindi (hi), Marathi (mr), Punjabi (pa)
 */

import { calculateEffectiveWaterCapacity } from './feasibility.js';
import { i18n } from '../i18n/i18n.js';

/**
 * Generates 3 to 5 deterministic, context-specific reasons in the active UI language explaining why a plan was
 * scored and recommended.
 * 
 * @param {Object} planData
 * @param {import('../types.js').FeasibilityEvaluation} feasibility
 * @param {import('../types.js').SuitabilityScoreBreakdown} score
 * @param {import('../types.js').FarmContext} context
 * @param {Object} cropConfig
 * @returns {string[]} List of dynamically generated natural language reasons
 */
export function generatePlanReasons(planData, feasibility, score, context, cropConfig) {
  const lang = i18n ? i18n.getLanguage() : 'en';
  const { name, strategyType, estimatedCost, costPerAcre, waterRequirementMm, waterRequirementM3 } = planData;
  const { farmer, weather, cropHealthRisk, riskFactorReason } = context;
  const reasons = [];

  const effectiveWaterCapacityMm = calculateEffectiveWaterCapacity(context);
  const budgetBuffer = farmer.budget - estimatedCost;
  const cropTranslated = i18n.translateCrop(farmer.crop);
  const soilTranslated = i18n.translateSoil(farmer.soilCondition);
  const stageTranslated = i18n.translateStage(farmer.cropStage);
  const waterTranslated = i18n.translateWater(farmer.waterAvailability);

  // =========================================================================
  // ENGLISH (en)
  // =========================================================================
  if (lang === 'en') {
    // 1. Budget Context
    if (feasibility.budgetFit) {
      if (budgetBuffer > 0) {
        const bufferPercent = Math.round((budgetBuffer / farmer.budget) * 100);
        reasons.push(
          `💰 **Financial Safety**: Total estimated cost of ₹${estimatedCost.toLocaleString('en-IN')} (₹${costPerAcre.toLocaleString('en-IN')}/acre for ${farmer.farmSize} acres) fits within your ₹${farmer.budget.toLocaleString('en-IN')} budget, preserving a ₹${budgetBuffer.toLocaleString('en-IN')} (${bufferPercent}%) safety buffer.`
        );
      } else {
        reasons.push(
          `💰 **Budget Match**: Fully utilizes available ₹${farmer.budget.toLocaleString('en-IN')} capital to maximize field inputs without requiring external credit.`
        );
      }
    } else {
      reasons.push(
        `⚠️ **Budget Shortfall**: Plan requires ₹${estimatedCost.toLocaleString('en-IN')}, exceeding your ₹${farmer.budget.toLocaleString('en-IN')} budget by ₹${Math.abs(budgetBuffer).toLocaleString('en-IN')}.`
      );
    }

    // 2. Water Context
    if (feasibility.waterFit) {
      if (farmer.waterAvailability === 'High') {
        reasons.push(
          `💧 **Irrigation Optimization**: Fully leverages your High water availability with a stage demand of ${waterRequirementMm} mm (${waterRequirementM3.toLocaleString('en-IN')} m³ total), ensuring zero water stress during key growth.`
        );
      } else if (farmer.waterAvailability === 'Moderate') {
        reasons.push(
          `💧 **Water Balancing**: Aligns with your Moderate canal/well rotation (${effectiveWaterCapacityMm} mm capacity vs ${waterRequirementMm} mm demand), preventing crop water deficit.`
        );
      } else {
        reasons.push(
          `💧 **Drought Resilience**: Conserves limited moisture via deficit irrigation (${waterRequirementMm} mm vs ${effectiveWaterCapacityMm} mm effective pool), safeguarded by existing ${farmer.soilMoisturePercent}% soil moisture.`
        );
      }
    } else {
      reasons.push(
        `⚠️ **Water Deficit**: Demands ${waterRequirementMm} mm water depth which exceeds your ${farmer.waterAvailability} supply capacity (${effectiveWaterCapacityMm} mm).`
      );
    }

    // 3. Stage Agronomy
    if (farmer.cropStage.includes('Flowering') || farmer.cropStage.includes('Reproductive')) {
      reasons.push(
        `🌾 **Critical Flowering Protection**: Focuses nutrition and moisture directly on anthesis & pollen fertility, mitigating flower drop risk.`
      );
    } else if (farmer.cropStage.includes('Tillering') || farmer.cropStage.includes('Vegetative')) {
      reasons.push(
        `🌾 **Vegetative Vigour**: Delivers stage-specific nitrogen splits and root-zone aeration tailored to ${farmer.crop} canopy establishment.`
      );
    } else if (farmer.cropStage.includes('Grain Filling') || farmer.cropStage.includes('Pod Formation')) {
      reasons.push(
        `🌾 **Grain Filling Efficiency**: Delivers targeted potassium/foliar boosters to prevent terminal shriveling and boost test weight.`
      );
    } else {
      reasons.push(
        `🌾 **Stand Establishment**: Provides balanced basal fertilizer and early root stimulation for uniform emergence.`
      );
    }

    // 4. Soil Match
    const idealSoils = cropConfig.idealSoil || [];
    if (idealSoils.includes(farmer.soilCondition)) {
      reasons.push(
        `🌱 **Soil Synergy**: Specially calibrated for ${farmer.soilCondition} soil in ${farmer.state} to optimize nutrient uptake and moisture retention.`
      );
    } else {
      reasons.push(
        `🌱 **Soil Amendment**: Adjusts application depth and input placement to compensate for ${farmer.soilCondition} drainage properties.`
      );
    }

    // 5. Risk Defense
    if (cropHealthRisk === 'Critical' || cropHealthRisk === 'High') {
      reasons.push(
        `🛡️ **Active Pest Defense**: Intervenes against elevated ${cropHealthRisk} risk (${riskFactorReason || 'active field pressure'}) with fast-acting, targeted solutions.`
      );
    } else {
      reasons.push(
        `🛡️ **Preventative Care**: Maintains low disease risk with cost-effective monitoring and beneficial bio-agents.`
      );
    }
  }

  // =========================================================================
  // HINDI (hi)
  // =========================================================================
  else if (lang === 'hi') {
    // 1. Budget
    if (feasibility.budgetFit) {
      if (budgetBuffer > 0) {
        const bufferPercent = Math.round((budgetBuffer / farmer.budget) * 100);
        reasons.push(
          `💰 **वित्तीय सुरक्षा**: कुल अनुमानित लागत ₹${estimatedCost.toLocaleString('en-IN')} (₹${costPerAcre.toLocaleString('en-IN')}/एकड़, ${farmer.farmSize} एकड़ के लिए) आपके ₹${farmer.budget.toLocaleString('en-IN')} के बजट में बिल्कुल सही बैठती है और ₹${budgetBuffer.toLocaleString('en-IN')} (${bufferPercent}%) का सुरक्षा मार्जिन बचाती है।`
        );
      } else {
        reasons.push(
          `💰 **बजट का पूरा उपयोग**: उपलब्ध ₹${farmer.budget.toLocaleString('en-IN')} पूंजी का अधिकतम उपयोग करके बिना किसी कर्ज के सर्वोत्तम फसल पोषण सुनिश्चित करता है।`
        );
      }
    } else {
      reasons.push(
        `⚠️ **बजट की कमी**: इस योजना के लिए ₹${estimatedCost.toLocaleString('en-IN')} की आवश्यकता है, जो आपके ₹${farmer.budget.toLocaleString('en-IN')} के बजट से ₹${Math.abs(budgetBuffer).toLocaleString('en-IN')} अधिक है।`
      );
    }

    // 2. Water
    if (feasibility.waterFit) {
      if (farmer.waterAvailability === 'High') {
        reasons.push(
          `💧 **जल अनुकूलन**: आपके पास प्रचुर जल आपूर्ति का पूरा लाभ उठाते हुए ${waterRequirementMm} मिमी पानी (${waterRequirementM3.toLocaleString('en-IN')} मी³ कुल) की सटीक सिंचाई सुनिश्चित करता है, जिससे फसल पर कोई तनाव नहीं रहता।`
        );
      } else if (farmer.waterAvailability === 'Moderate') {
        reasons.push(
          `💧 **जल संतुलन**: आपकी मध्यम जल आपूर्ति (${effectiveWaterCapacityMm} मिमी क्षमता बनाम ${waterRequirementMm} मिमी मांग) के साथ पूर्ण संतुलन बनाकर पानी की कमी से बचाता है।`
        );
      } else {
        reasons.push(
          `💧 **सूखा सहनशीलता**: सीमित जल संसाधनों को ध्यान में रखते हुए कम पानी वाली सूक्ष्म सिंचाई (${waterRequirementMm} मिमी) अपनाता है, जिसे मिट्टी की मौजूदा ${farmer.soilMoisturePercent}% नमी का सहारा मिलता है।`
        );
      }
    } else {
      reasons.push(
        `⚠️ **पानी की कमी**: इस योजना में ${waterRequirementMm} मिमी पानी की आवश्यकता है जो आपकी उपलब्ध क्षमता (${effectiveWaterCapacityMm} मिमी) से अधिक है।`
      );
    }

    // 3. Stage
    if (farmer.cropStage.includes('Flowering') || farmer.cropStage.includes('Reproductive')) {
      reasons.push(
        `🌾 **फूल अवस्था में विशेष पोषण**: परागण और फूल झड़ने से रोकने के लिए सीधे बोरॉन व पोटाश का पर्णीय छिड़काव सुनिश्चित करता है।`
      );
    } else if (farmer.cropStage.includes('Tillering') || farmer.cropStage.includes('Vegetative')) {
      reasons.push(
        `🌾 **वानस्पतिक बढ़वार**: ${cropTranslated} के पौधों में अधिक कल्ले फूटने के लिए समय पर नाइट्रोजन और जिंक की खुराक देता है।`
      );
    } else if (farmer.cropStage.includes('Grain Filling') || farmer.cropStage.includes('Pod Formation')) {
      reasons.push(
        `🌾 **दाने भरने में सहायक**: दानों को सुडौल और भारी बनाने के लिए लक्षित पोटैशियम छिड़काव प्रदान करता है।`
      );
    } else {
      reasons.push(
        `🌾 **सटीक फसल प्रबंधन**: फसल की वर्तमान अवस्था के अनुसार सही समय पर संतुलित उर्वरक अनुप्रयोग प्रदान करता है।`
      );
    }

    // 4. Soil
    reasons.push(
      `🌱 **मिट्टी अनुकूलता**: ${farmer.state} की ${soilTranslated} के अनुसार पोषक तत्वों का अवशोषण और जल धारण क्षमता को अनुकूलित करता है।`
    );

    // 5. Risk
    if (cropHealthRisk === 'Critical' || cropHealthRisk === 'High') {
      reasons.push(
        `🛡️ **सक्रिय कीट सुरक्षा**: वर्तमान ${cropHealthRisk === 'Critical' ? 'गंभीर' : 'उच्च'} कीट/रोग खतरे (${riskFactorReason || 'खेत में कीट प्रकोप'}) से बचाव के लिए असरदार समाधान देता है।`
      );
    } else {
      reasons.push(
        `🛡️ **निवारक देखभाल**: कम खर्च में जैविक व अनुशंसित उपायों द्वारा खेत को कीटों और बीमारियों से सुरक्षित रखता है।`
      );
    }
  }

  // =========================================================================
  // MARATHI (mr)
  // =========================================================================
  else if (lang === 'mr') {
    // 1. Budget
    if (feasibility.budgetFit) {
      if (budgetBuffer > 0) {
        const bufferPercent = Math.round((budgetBuffer / farmer.budget) * 100);
        reasons.push(
          `💰 **आर्थिक सुरक्षितता**: एकूण अंदाजे खर्च ₹${estimatedCost.toLocaleString('en-IN')} (₹${costPerAcre.toLocaleString('en-IN')}/एकर, ${farmer.farmSize} एकरासाठी) तुमच्या ₹${farmer.budget.toLocaleString('en-IN')} बजेटमध्ये बसतो आणि ₹${budgetBuffer.toLocaleString('en-IN')} (${bufferPercent}%) सुरक्षित निधी शिल्लक ठेवतो.`
        );
      } else {
        reasons.push(
          `💰 **बजेटचा पुरेपूर वापर**: उपलब्ध ₹${farmer.budget.toLocaleString('en-IN')} भांडवलाचा जास्तीत जास्त वापर करून पीक उत्पादकता वाढवतो.`
        );
      }
    } else {
      reasons.push(
        `⚠️ **बजेट कमतरता**: या योजनेसाठी ₹${estimatedCost.toLocaleString('en-IN')} लागतील, जे तुमच्या ₹${farmer.budget.toLocaleString('en-IN')} बजेटपेक्षा ₹${Math.abs(budgetBuffer).toLocaleString('en-IN')} जास्त आहेत.`
      );
    }

    // 2. Water
    if (feasibility.waterFit) {
      if (farmer.waterAvailability === 'High') {
        reasons.push(
          `💧 **पाण्याचे योग्य नियोजन**: भरपूर पाणी उपलब्धतेचा फायदा घेऊन ${waterRequirementMm} मिमी सिंचन पुरवठा करतो, ज्यामुळे पिकावर पाण्याचा कोणताही ताण पडत नाही.`
        );
      } else if (farmer.waterAvailability === 'Moderate') {
        reasons.push(
          `💧 **जल समतोल**: उपलब्ध पाण्याच्या पाळीनुसार (${effectiveWaterCapacityMm} मिमी क्षमता विरूद्ध ${waterRequirementMm} मिमी मागणी) समतोल राखून पिकाची पाण्याची गरज भागवतो.`
        );
      } else {
        reasons.push(
          `💧 **दुष्काळ प्रतिकारकता**: मर्यादित पाणी साठा लक्षात घेऊन कमी पाण्याचे काटेकोर सिंचन (${waterRequirementMm} मिमी) वापरतो, ज्याला जमिनीतील ${farmer.soilMoisturePercent}% ओलाव्याची साथ मिळते.`
        );
      }
    } else {
      reasons.push(
        `⚠️ **पाणी तूट**: या योजनेला ${waterRequirementMm} मिमी पाण्याची गरज आहे, जी उपलब्ध क्षमतेपेक्षा जास्त आहे.`
      );
    }

    // 3. Stage
    if (farmer.cropStage.includes('Flowering') || farmer.cropStage.includes('Reproductive')) {
      reasons.push(
        `🌾 **फुलधारणा संरक्षण**: पाते व फुले गळणे रोखण्यासाठी आणि परागीभवन सुधारण्यासाठी बोरॉन व पोटॅशियमची फवारणी देतो.`
      );
    } else if (farmer.cropStage.includes('Tillering') || farmer.cropStage.includes('Vegetative')) {
      reasons.push(
        `🌾 **शाकीय वाढ**: ${cropTranslated} पिकाला योग्य वेळी नत्र आणि झिंक देऊन जोमदार वाढीस मदत करतो.`
      );
    } else {
      reasons.push(
        `🌾 **अचूक पीक वाढ**: पिकाच्या सद्य अवस्थेनुसार आवश्यक पोषण आणि आंतरमशागत सुनिश्चित करतो.`
      );
    }

    // 4. Soil
    reasons.push(
      `🌱 **माती अनुकूलता**: ${farmer.state} मधील ${soilTranslated} मातीसाठी अन्नद्रव्यांचे शोषण आणि ओलावा टिकवून ठेवण्यासाठी योग्य नियोजन.`
    );

    // 5. Risk
    if (cropHealthRisk === 'Critical' || cropHealthRisk === 'High') {
      reasons.push(
        `🛡️ **कीड नियंत्रण**: सध्याच्या वाढत्या किडीच्या प्रादुर्भावावर (${riskFactorReason || 'शेतातील कीड धोका'}) त्वरित व प्रभावी उपाययोजना करतो.`
      );
    } else {
      reasons.push(
        `🛡️ **प्रतिबंधात्मक काळजी**: कमी खर्चात एकात्मिक कीड व्यवस्थापन (IPM) करून पिकाचे रक्षण करतो.`
      );
    }
  }

  // =========================================================================
  // PUNJABI (pa)
  // =========================================================================
  else {
    // 1. Budget
    if (feasibility.budgetFit) {
      if (budgetBuffer > 0) {
        const bufferPercent = Math.round((budgetBuffer / farmer.budget) * 100);
        reasons.push(
          `💰 **ਵਿੱਤੀ ਸੁਰੱਖਿਆ**: ਕੁੱਲ ਅੰਦਾਜ਼ਨ ਖਰਚਾ ₹${estimatedCost.toLocaleString('en-IN')} (₹${costPerAcre.toLocaleString('en-IN')}/ਏਕੜ, ${farmer.farmSize} ਏਕੜ ਲਈ) ਤੁਹਾਡੇ ₹${farmer.budget.toLocaleString('en-IN')} ਬਜਟ ਵਿੱਚ ਪੂਰਾ ਆਉਂਦਾ ਹੈ ਅਤੇ ₹${budgetBuffer.toLocaleString('en-IN')} (${bufferPercent}%) ਸੁਰੱਖਿਆ ਫੰਡ ਬਚਾਉਂਦਾ ਹੈ।`
        );
      } else {
        reasons.push(
          `💰 **ਬਜਟ ਦੀ ਪੂਰੀ ਵਰਤੋਂ**: ਉਪਲਬਧ ₹${farmer.budget.toLocaleString('en-IN')} ਸਰਮਾਏ ਦੀ ਸਹੀ ਵਰਤੋਂ ਕਰਕੇ ਵਧੀਆ ਝਾੜ ਯਕੀਨੀ ਬਣਾਉਂਦਾ ਹੈ।`
        );
      }
    } else {
      reasons.push(
        `⚠️ **ਬਜਟ ਦੀ ਘਾਟ**: ਇਸ ਯੋਜਨਾ ਲਈ ₹${estimatedCost.toLocaleString('en-IN')} ਚਾਹੀਦੇ ਹਨ, ਜੋ ਤੁਹਾਡੇ ₹${farmer.budget.toLocaleString('en-IN')} ਬਜਟ ਨਾਲੋਂ ₹${Math.abs(budgetBuffer).toLocaleString('en-IN')} ਵੱਧ ਹਨ।`
      );
    }

    // 2. Water
    if (feasibility.waterFit) {
      if (farmer.waterAvailability === 'High') {
        reasons.push(
          `💧 **ਸਿੰਚਾਈ ਪ੍ਰਬੰਧਨ**: ਟਿਊਬਵੈੱਲ/ਨਹਿਰੀ ਪਾਣੀ ਦੀ ਭਰਪੂਰ ਸਹੂਲਤ ਦਾ ਪੂਰਾ ਲਾਭ ਲੈਂਦੇ ਹੋਏ ${waterRequirementMm} ਮਿਲੀਮੀਟਰ ਪਾਣੀ ਦੀ ਸਹੀ ਸਪਲਾਈ ਯਕੀਨੀ ਬਣਾਉਂਦਾ ਹੈ।`
        );
      } else if (farmer.waterAvailability === 'Moderate') {
        reasons.push(
          `💧 **ਪਾਣੀ ਦਾ ਸੰਤੁਲਨ**: ਉਪਲਬਧ ਪਾਣੀ ਦੀ ਵਾਰੀ ਅਨੁਸਾਰ (${effectiveWaterCapacityMm} ਮਿਲੀਮੀਟਰ ਸਮਰੱਥਾ ਬਨਾਮ ${waterRequirementMm} ਮਿਲੀਮੀਟਰ ਲੋੜ) ਸੰਤੁਲਨ ਬਣਾ ਕੇ ਫਸਲ ਨੂੰ ਪਿਆਸੀ ਨਹੀਂ ਰਹਿਣ ਦਿੰਦਾ।`
        );
      } else {
        reasons.push(
          `💧 **ਪਾਣੀ ਦੀ ਬੱਚਤ**: ਘੱਟ ਪਾਣੀ ਵਾਲੀ ਸਥਿਤੀ ਵਿੱਚ ਸੀਮਤ ਸਿੰਚਾਈ (${waterRequirementMm} ਮਿਲੀਮੀਟਰ) ਵਰਤਦਾ ਹੈ ਜਿਸ ਨੂੰ ਜ਼ਮੀਨ ਦੀ ${farmer.soilMoisturePercent}% ਨਮੀ ਦਾ ਸਹਾਰਾ ਮਿਲਦਾ ਹੈ।`
        );
      }
    } else {
      reasons.push(
        `⚠️ **ਪਾਣੀ ਦੀ ਕਮੀ**: ਇਸ ਯੋਜਨਾ ਵਿੱਚ ${waterRequirementMm} ਮਿਲੀਮੀਟਰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ ਜੋ ਤੁਹਾਡੀ ਸਮਰੱਥਾ ਤੋਂ ਵੱਧ ਹੈ।`
      );
    }

    // 3. Stage
    if (farmer.cropStage.includes('Flowering') || farmer.cropStage.includes('Reproductive')) {
      reasons.push(
        `🌾 **ਗੋਭ/ਫੁੱਲ ਪੈਣ ਵੇਲੇ ਸੁਰੱਖਿਆ**: ਫੁੱਲ ਕਿਰਨ ਤੋਂ ਰੋਕਣ ਅਤੇ ਦਾਣਿਆਂ ਦੀ ਗਿਣਤੀ ਵਧਾਉਣ ਲਈ ਬੋਰਾਨ ਅਤੇ ਪੋਟਾਸ਼ ਦੀ ਸਪਰੇਅ ਯਕੀਨੀ ਬਣਾਉਂਦਾ ਹੈ।`
      );
    } else if (farmer.cropStage.includes('Tillering') || farmer.cropStage.includes('Vegetative')) {
      reasons.push(
        `🌾 **ਫੁਟਾਰੇ ਵਿੱਚ ਵਾਧਾ**: ${cropTranslated} ਦੇ ਬੂਟਿਆਂ ਦੇ ਚੰਗੇ ਫੁਟਾਰੇ ਲਈ ਸਮੇਂ ਸਿਰ ਯੂਰੀਆ ਅਤੇ ਜ਼ਿੰਕ ਦੀ ਖੁਰਾਕ ਦਿੰਦਾ ਹੈ।`
      );
    } else {
      reasons.push(
        `🌾 **ਸਹੀ ਖੇਤੀ ਕਾਰਵਾਈਆਂ**: ਫਸਲ ਦੇ ਮੌਜੂਦਾ ਪੜਾਅ ਮੁਤਾਬਕ ਸਹੀ ਖਾਦ ਅਤੇ ਦੇਖਭਾਲ ਯਕੀਨੀ ਬਣਾਉਂਦਾ ਹੈ।`
      );
    }

    // 4. Soil
    reasons.push(
      `🌱 **ਜ਼ਮੀਨ ਅਨੁਕੂਲਤਾ**: ${farmer.state} ਦੀ ${soilTranslated} ਜ਼ਮੀਨ ਮੁਤਾਬਕ ਖੁਰਾਕੀ ਤੱਤਾਂ ਦੀ ਸਹੀ ਪਹੁੰਚ ਯਕੀਨੀ ਬਣਾਉਂਦਾ ਹੈ।`
    );

    // 5. Risk
    if (cropHealthRisk === 'Critical' || cropHealthRisk === 'High') {
      reasons.push(
        `🛡️ **ਕੀੜਿਆਂ ਤੋਂ ਬਚਾਅ**: ਮੌਜੂਦਾ ${cropHealthRisk === 'Critical' ? 'ਗੰਭੀਰ' : 'ਵੱਧ'} ਖਤਰੇ (${riskFactorReason || 'ਖੇਤ ਵਿੱਚ ਕੀੜਿਆਂ ਦਾ ਹਮਲਾ'}) ਤੋਂ ਬਚਾਅ ਲਈ ਤੁਰੰਤ ਕਾਰਗਰ ਹੱਲ ਦਿੰਦਾ ਹੈ।`
      );
    } else {
      reasons.push(
        `🛡️ **ਰੋਕਥਾਮ ਵਾਲੀ ਦੇਖਭਾਲ**: ਘੱਟ ਖਰਚੇ ਵਿੱਚ ਕੀੜਿਆਂ ਅਤੇ ਬਿਮਾਰੀਆਂ ਤੋਂ ਫਸਲ ਦੀ ਰਾਖੀ ਕਰਦਾ ਹੈ।`
      );
    }
  }

  return reasons;
}
