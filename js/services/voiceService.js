/**
 * @file voiceService.js
 * Browser Speech Recognition Service & Natural Language Agronomic Entity Extractor
 * Languages Supported: English (en-IN), Hindi (hi-IN), Marathi (mr-IN), Punjabi (pa-IN)
 */

import { REGIONS_DATA } from '../data/presetsData.js';

export class VoiceService {
  static isSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  /**
   * Starts listening to microphone and streams recognized speech
   * 
   * @param {Object} options
   * @param {string} options.languageCode - 'en' | 'hi' | 'mr' | 'pa'
   * @param {Function} options.onResult - (transcript, isFinal) => void
   * @param {Function} options.onError - (errorMsg) => void
   * @param {Function} options.onEnd - () => void
   * @returns {Object} { stop: Function }
   */
  static startListening({ languageCode = 'en', onResult, onError, onEnd }) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      if (onError) onError('Speech recognition is not supported in this browser. Please use Google Chrome, Edge, or Brave.');
      return { stop: () => {} };
    }

    const recognitionLangMap = {
      en: 'en-IN',
      hi: 'hi-IN',
      mr: 'mr-IN',
      pa: 'pa-IN'
    };

    const targetLang = recognitionLangMap[languageCode] || 'en-IN';
    let recognition;

    try {
      recognition = new SpeechRecognition();
      recognition.lang = targetLang;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece;
          } else {
            interimTranscript += transcriptPiece;
          }
        }

        const fullText = (finalTranscript || interimTranscript).trim();
        if (onResult && fullText) {
          onResult(fullText, !!finalTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech Recognition error event:', event.error);
        let humanMsg = 'Microphone error.';
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          humanMsg = 'Microphone permission was denied. Please allow microphone access in your browser.';
        } else if (event.error === 'no-speech') {
          humanMsg = 'No speech detected. Please speak closer to your microphone.';
        } else if (event.error === 'network') {
          humanMsg = 'Network connection issue for speech recognition.';
        }
        if (onError) onError(humanMsg);
      };

      recognition.onend = () => {
        if (onEnd) onEnd();
      };

      recognition.start();

      return {
        stop: () => {
          try {
            recognition.stop();
          } catch (e) {
            console.warn('Recognition stop error:', e);
          }
        }
      };
    } catch (err) {
      if (onError) onError(err.message || 'Could not initialize speech recognition.');
      return { stop: () => {} };
    }
  }

  /**
   * Natural language agronomic entity parser.
   * Extracts farmerName, state, district, farmSize, budget, crop, cropStage, waterAvailability, and soilCondition
   * from natural spoken sentences across English, Hindi, Marathi, Punjabi, and mixed speech.
   * 
   * @param {string} text - Transcribed speech text
   * @param {string} language - 'en' | 'hi' | 'mr' | 'pa'
   * @returns {Object|null} Extracted structured farm parameters
   */
  static extractEntities(text, language = 'en') {
    if (!text || typeof text !== 'string') return null;
    const cleanText = text.trim();
    const lower = cleanText.toLowerCase();
    const extracted = {};

    // 1. EXTRACT FARMER NAME
    // English: "my name is Ramesh", "I am Ramesh", "this is Ramesh", "name Ramesh"
    // Hindi: "मेरा नाम रमेश है", "मैं रमेश हूँ", "नाम रमेश है"
    // Marathi: "माझं नाव रमेश आहे", "माझे नाव रमेश आहे", "मी रमेश बोलतोय", "नाव रमेश"
    // Punjabi: "ਮੇਰਾ ਨਾਮ ਰਮੇਸ਼ ਹੈ", "ਮੈਂ ਰਮੇਸ਼ ਹਾਂ", "ਮੈਂ ਰਮੇਸ਼ ਬੋਲ ਰਿਹਾ ਹਾਂ", "ਨਾਮ ਰਮੇਸ਼"
    const namePatterns = [
      /(?:my\s+name\s+is|i\s+am|this\s+is|name\s+is)\s+([A-Za-z\u0900-\u097F\u0A00-\u0A7F]+)/i,
      /(?:मेरा\s+नाम|माझं\s+नाव|माझे\s+नाव|ਮੇਰਾ\s+ਨਾਮ|नाव|ਨਾਮ)\s+([A-Za-z\u0900-\u097F\u0A00-\u0A7F]+)/i,
      /(?:मैं|मी|ਮੈਂ)\s+([A-Za-z\u0900-\u097F\u0A00-\u0A7F]+)\s+(?:हूँ|बोलतोय|आहे|ਹਾਂ|ਬੋਲ ਰਿਹਾ)/i
    ];

    for (const pattern of namePatterns) {
      const match = cleanText.match(pattern);
      if (match && match[1]) {
        let extractedName = match[1].trim();
        // Remove common auxiliary words if captured
        extractedName = extractedName.replace(/(?:hai|aahe|haan|hूँ|आहे|ਹੈ|ਹਾਂ|ji|from|boltoy|bol)$/i, '').trim();
        if (extractedName.length >= 2 && !['farmer', 'kisan', 'shekari', 'zamidar', 'my', 'is', 'ahe'].includes(extractedName.toLowerCase())) {
          extracted.farmerName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);
          break;
        }
      }
    }

    // 2. EXTRACT DISTRICT & STATE
    // Check known districts and states across India (Maharashtra, Punjab, Haryana, etc.)
    const districtCatalog = [
      // Maharashtra
      { district: 'Nashik', state: 'Maharashtra', terms: ['nashik', 'nasik', 'नासिक', 'नाशिक', 'ਨਾਸਿਕ'] },
      { district: 'Yavatmal', state: 'Maharashtra', terms: ['yavatmal', 'yeotmal', 'यवतमाळ', 'यवतमाल', 'ਯਵਤਮਾਲ'] },
      { district: 'Pune', state: 'Maharashtra', terms: ['pune', 'poona', 'पुणे', 'ਪੁਣੇ'] },
      { district: 'Nagpur', state: 'Maharashtra', terms: ['nagpur', 'नागपुर', 'नागपूर', 'ਨਾਗਪੁਰ'] },
      { district: 'Jalgaon', state: 'Maharashtra', terms: ['jalgaon', 'जळगाव', 'जलगांव', 'ਜਲਗਾਂਵ'] },
      { district: 'Aurangabad', state: 'Maharashtra', term: ['aurangabad', 'sambhajinagar', 'औरंगाबाद', 'संभाजीनगर'] },
      { district: 'Ahmednagar', state: 'Maharashtra', terms: ['ahmednagar', 'अहमदनगर', 'ਅਹਿਮਦਨਗਰ'] },
      { district: 'Amravati', state: 'Maharashtra', terms: ['amravati', 'अमरावती', 'ਅਮਰਾਵਤੀ'] },
      { district: 'Kolhapur', state: 'Maharashtra', terms: ['kolhapur', 'कोल्हापूर', 'कोल्हापुर'] },
      { district: 'Solapur', state: 'Maharashtra', terms: ['solapur', 'सोलापूर', 'सोलापुर'] },
      { district: 'Akola', state: 'Maharashtra', terms: ['akola', 'अकोला'] },
      { district: 'Wardha', state: 'Maharashtra', terms: ['wardha', 'वर्धा'] },
      { district: 'Satara', state: 'Maharashtra', terms: ['satara', 'सातारा'] },
      { district: 'Sangli', state: 'Maharashtra', terms: ['sangli', 'सांगली'] },
      { district: 'Nanded', state: 'Maharashtra', terms: ['nanded', 'नांदेड'] },

      // Punjab
      { district: 'Ludhiana', state: 'Punjab', terms: ['ludhiana', 'ਲੁਧਿਆਣਾ', 'लुधियाना'] },
      { district: 'Bathinda', state: 'Punjab', terms: ['bathinda', 'bhatinda', 'ਬਠਿੰਡਾ', 'बठिंडा', 'बठिण्डा'] },
      { district: 'Amritsar', state: 'Punjab', terms: ['amritsar', 'ਅੰਮ੍ਰਿਤਸਰ', 'अमृतसर'] },
      { district: 'Patiala', state: 'Punjab', terms: ['patiala', 'ਪਟਿਆਲਾ', 'पटियाला'] },
      { district: 'Sangrur', state: 'Punjab', terms: ['sangrur', 'ਸੰਗਰੂਰ', 'संगरूर'] },
      { district: 'Jalandhar', state: 'Punjab', terms: ['jalandhar', 'ਜਲੰਧਰ', 'जालंधर'] },
      { district: 'Firozpur', state: 'Punjab', terms: ['firozpur', 'ferozepur', 'ਫਿਰੋਜ਼ਪੁਰ', 'फिरोजपुर'] },
      { district: 'Mansa', state: 'Punjab', terms: ['mansa', 'ਮਾਨਸਾ', 'मानसा'] },
      { district: 'Muktsar', state: 'Punjab', terms: ['muktsar', 'ਮੁਕਤਸਰ', 'मुक्तसर'] },
      { district: 'Moga', state: 'Punjab', terms: ['moga', 'ਮੋਗਾ', 'मोगा'] },
      { district: 'Faridkot', state: 'Punjab', terms: ['faridkot', 'ਫਰੀਦਕੋਟ', 'फरीदकोट'] },
      { district: 'Fazilka', state: 'Punjab', terms: ['fazilka', 'ਫਾਜ਼ਿਲਕਾ', 'फाजिल्का'] },
      { district: 'Hoshiarpur', state: 'Punjab', terms: ['hoshiarpur', 'ਹੁਸ਼ਿਆਰਪੁਰ', 'होशियारपुर'] },
      { district: 'Gurdaspur', state: 'Punjab', terms: ['gurdaspur', 'ਗੁਰਦਾਸਪੁਰ', 'गुरदासपुर'] },

      // Haryana
      { district: 'Karnal', state: 'Haryana', terms: ['karnal', 'ਕਰਨਾਲ', 'करनाल'] },
      { district: 'Hisar', state: 'Haryana', terms: ['hisar', 'ਹਿਸਾਰ', 'हिसार'] },
      { district: 'Sirsa', state: 'Haryana', terms: ['sirsa', 'ਸਿਰਸਾ', 'सिरसा'] },
      { district: 'Ambala', state: 'Haryana', terms: ['ambala', 'ਅੰਬਾਲਾ', 'अंबाला'] },

      // Madhya Pradesh
      { district: 'Indore', state: 'Madhya Pradesh', terms: ['indore', 'इंदौर'] },
      { district: 'Ujjain', state: 'Madhya Pradesh', terms: ['ujjain', 'उज्जैन'] },
      { district: 'Bhopal', state: 'Madhya Pradesh', terms: ['bhopal', 'भोपाल'] }
    ];

    // Check for explicit State mention
    if (lower.includes('maharashtra') || lower.includes('महाराष्ट्र') || lower.includes('ਮਹਾਰਾਸ਼ਟਰ')) {
      extracted.state = 'Maharashtra';
    } else if (lower.includes('punjab') || lower.includes('ਪੰਜਾਬ') || lower.includes('पंजाब')) {
      extracted.state = 'Punjab';
    } else if (lower.includes('haryana') || lower.includes('ਹਰਿਆਣਾ') || lower.includes('हरियाणा')) {
      extracted.state = 'Haryana';
    } else if (lower.includes('madhya pradesh') || lower.includes('mp') || lower.includes('मध्य प्रदेश') || lower.includes('ਮੱਧ ਪ੍ਰਦੇਸ਼')) {
      extracted.state = 'Madhya Pradesh';
    }

    // Match District and auto-fill state if not yet set
    for (const item of districtCatalog) {
      if (item.terms && item.terms.some(t => lower.includes(t))) {
        extracted.district = item.district;
        if (!extracted.state) {
          extracted.state = item.state;
        }
        break;
      }
    }

    // 3. EXTRACT CROP
    const cropMatches = [
      { name: 'Cotton', patterns: ['cotton', 'narma', 'kapas', 'kapus', 'rui', 'कपास', 'कापूस', 'ਨਰਮਾ', 'ਕਪਾਹ', 'ਕਪਾਸ'] },
      { name: 'Wheat', patterns: ['wheat', 'kanak', 'gehun', 'gehu', 'gahu', 'ਕਣਕ', 'गेहूं', 'गेहूँ', 'गहू'] },
      { name: 'Rice', patterns: ['rice', 'paddy', 'jhona', 'chawal', 'dhan', 'bhat', 'tandal', 'ਝੋਨਾ', 'चावल', 'धान', 'भात', 'तांदूळ'] },
      { name: 'Soybean', patterns: ['soybean', 'soya', 'soyabean', 'ਸੋਇਆਬੀਨ', 'सोयाबीन', 'सोया'] },
      { name: 'Maize', patterns: ['maize', 'corn', 'makki', 'makka', 'bhutta', 'maka', 'ਮੱਕੀ', 'मक्का', 'मका', 'ਭੁੱਟਾ'] },
      { name: 'Sugarcane', patterns: ['sugarcane', 'ganna', 'us', 'ਊਖ', 'ਗੰਨਾ', 'गन्ना', 'ऊस'] },
      { name: 'Mustard', patterns: ['mustard', 'sarson', 'raya', 'mohari', 'ਸਰ੍ਹੋਂ', 'सरसों', 'मोहरी'] }
    ];

    for (const item of cropMatches) {
      if (item.patterns.some(p => lower.includes(p))) {
        extracted.crop = item.name;
        break;
      }
    }

    // 4. EXTRACT CROP STAGE
    const stageMatches = [
      {
        stage: 'Flowering / Reproductive',
        patterns: ['flowering', 'reproductive', 'flower', 'phool', 'fulora', 'phulora', 'ombhi', 'dodi', 'nisar', 'फूल', 'फूलने', 'फुलोरा', 'बोंड', 'फूल आ रहे', 'बाली', 'निसरन', 'ਫੁੱਲ', 'ਨਿਸਰਨ']
      },
      {
        stage: 'Grain Filling / Pod Formation',
        patterns: ['grain filling', 'pod formation', 'milking', 'dana bhorav', 'doda', 'falli', 'ghad', 'दाना भराव', 'बोंड भरणे', 'शेंगा', 'ਦੁੱਧਾ', 'ਦਾਣਾ ਭਰਨ']
      },
      {
        stage: 'Maturity / Harvest',
        patterns: ['maturity', 'harvest', 'harvesting', 'cutting', 'ripe', 'pakne', 'kapani', 'katai', 'wadhai', 'कटाई', 'पकना', 'कापणी', 'तोडणी', 'ਵਾਢੀ', 'ਪੱਕਣ']
      },
      {
        stage: 'Sowing / Germination',
        patterns: ['sowing', 'germination', 'early stage', 'seeding', 'lagwad', 'bijayi', 'boai', 'bavni', 'पेरणी', 'लागवड', 'उगवण', 'बुवाई', 'बीजाई', 'ਬਿਜਾਈ', 'ਉੱਗਣ']
      },
      {
        stage: 'Vegetative / Tillering',
        patterns: ['vegetative', 'tillering', 'growth stage', 'tillers', 'footve', 'kalle', 'shakhiya', 'कल्ले', 'फुटवे', 'शाकीय अवस्था', 'ਬੜ੍ਹਵਾਰ', 'ਫੋਟ']
      }
    ];

    for (const item of stageMatches) {
      if (item.patterns.some(p => lower.includes(p))) {
        extracted.cropStage = item.stage;
        break;
      }
    }

    // 5. EXTRACT FARM SIZE (ACRES)
    // Map spoken word numbers across Indic languages & English to digits
    const wordNumberMap = {
      'one': 1, 'एक': 1, 'ਇੱਕ': 1, 'ek': 1, 'ikk': 1,
      'two': 2, 'दो': 2, 'दोन': 2, 'ਦੋ': 2, 'do': 2, 'don': 2,
      'three': 3, 'तीन': 3, 'ਤਿੰਨ': 3, 'teen': 3, 'tin': 3, 'tinn': 3,
      'four': 4, 'चार': 4, 'ਚਾਰ': 4, 'char': 4,
      'five': 5, 'पांच': 5, 'पाच': 5, 'ਪੰਜ': 5, 'paanch': 5, 'pach': 5, 'panj': 5,
      'six': 6, 'छह': 6, 'सहा': 6, 'ਛੇ': 6, 'chhe': 6, 'saha': 6, 'che': 6,
      'seven': 7, 'सात': 7, 'ਸੱਤ': 7, 'saat': 7, 'satt': 7,
      'eight': 8, 'आठ': 8, 'ਅੱਠ': 8, 'aath': 8, 'atth': 8,
      'nine': 9, 'नौ': 9, 'नऊ': 9, 'ਨੌਂ': 9, 'nau': 9,
      'ten': 10, 'दस': 10, 'दहा': 10, 'ਦੱਸ': 10, 'das': 10, 'daha': 10, 'dass': 10,
      'half': 0.5, 'aadha': 0.5, 'adhe': 0.5, 'अर्धा': 0.5, 'ਅੱਧਾ': 0.5, 'आधा': 0.5,
      'dedh': 1.5, 'दीड': 1.5, 'ਡੇਢ': 1.5, 'डेढ़': 1.5,
      'dhai': 2.5, 'अडीच': 2.5, 'ਢਾਈ': 2.5, 'ढाई': 2.5
    };

    // First check regex for numerical digits before units (e.g. "2.5 acres", "3 acre", "5 एकड़", "2 एकर", "4 ਏਕੜ", "2 kille")
    const numSizeMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:acres?|acre|kille?|killa|bigha|ਏਕੜ|ਕਿੱਲੇ|ਕਿੱਲਾ|एकड़|एकर|विघे|हेक्टर|hectares?)/i);
    if (numSizeMatch && numSizeMatch[1]) {
      const parsed = parseFloat(numSizeMatch[1]);
      if (parsed > 0 && parsed <= 100) {
        extracted.farmSize = parsed;
      }
    }

    // If no numerical digit matched, check for spoken word numbers before unit terms
    if (!extracted.farmSize) {
      const wordUnits = ['acres?', 'acre', 'kille?', 'killa', 'bigha', 'ਏਕੜ', 'ਕਿੱਲੇ', 'ਕਿੱਲਾ', 'एकड़', 'एकर', 'विघे', 'हेक्टर'];
      for (const [word, numVal] of Object.entries(wordNumberMap)) {
        const regex = new RegExp(`(?:^|\\s)${word}\\s+(?:${wordUnits.join('|')})`, 'i');
        if (regex.test(lower)) {
          extracted.farmSize = numVal;
          break;
        }
      }
    }

    // Direct farm size phrasing (e.g. "माझ्याकडे 2 एकर जमीन आहे", "I have 3 acres")
    if (!extracted.farmSize) {
      for (const [word, numVal] of Object.entries(wordNumberMap)) {
        if (lower.includes(`${word} एकर`) || lower.includes(`${word} एकड़`) || lower.includes(`${word} ਏਕੜ`)) {
          extracted.farmSize = numVal;
          break;
        }
      }
    }

    // 6. EXTRACT BUDGET
    // Matches patterns like "budget 45000", "40 hazar", "50k", "50000 rupees", "₹35000", "40 ਹਜ਼ਾਰ", "40 हजार", "बजेट 50000"
    let budgetMatch = lower.match(/(?:budget|rupees|rs|inr|₹|ਖਰਚਾ|ਰੁਪਏ|ਬਜਟ|बजट|बजेट|रुपये|रुपया)\s*(?:is|of|hai|ahe|ahey)?\s*(\d+[\d,]*)/i);
    if (!budgetMatch) {
      budgetMatch = lower.match(/(\d+[\d,]*)\s*(?:rupees|rs|inr|hazar|thousand|k|lakh|ਰੁਪਏ|ਹਜ਼ਾਰ|हजार|रुपये|लाख)/i);
    }
    if (!budgetMatch) {
      // Look for standalone numbers between 3000 and 500000
      const anyNumbers = lower.match(/\b\d{4,6}\b/g);
      if (anyNumbers && anyNumbers.length > 0) {
        budgetMatch = [null, anyNumbers[0]];
      }
    }

    if (budgetMatch && budgetMatch[1]) {
      let rawNum = budgetMatch[1].replace(/,/g, '');
      let parsedBudget = parseFloat(rawNum);
      if (lower.includes('lakh') || lower.includes('लाख') || lower.includes('ਲਾਖ')) {
        if (parsedBudget < 100) parsedBudget *= 100000;
      } else if (lower.includes('hazar') || lower.includes('thousand') || lower.includes('ਹਜ਼ਾਰ') || lower.includes('हजार') || lower.includes('k')) {
        if (parsedBudget < 1000) parsedBudget *= 1000;
      }
      if (parsedBudget >= 1000 && parsedBudget <= 1000000) {
        extracted.budget = parsedBudget;
      }
    }

    // 7. EXTRACT WATER AVAILABILITY
    if (lower.includes('high water') || lower.includes('lots of water') || lower.includes('sufficient') || lower.includes('ample') || lower.includes('tubewell') || lower.includes('canal') || lower.includes('borewell') || lower.includes('full water') || lower.includes('ਬਹੁਤ ਪਾਣੀ') || lower.includes('ਵੱਧ ਪਾਣੀ') || lower.includes('ਜਿਆਦਾ ਪਾਣੀ') || lower.includes('ਨਹਿਰੀ') || lower.includes('ज्यादा पानी') || lower.includes('भरपूर पानी') || lower.includes('भरपूर पाणी') || lower.includes('जास्त पाणी') || lower.includes('विहीर')) {
      extracted.waterAvailability = 'High';
    } else if (lower.includes('low water') || lower.includes('water shortage') || lower.includes('scarce') || lower.includes('dry') || lower.includes('less water') || lower.includes('rainfed') || lower.includes('stress') || lower.includes('ਕਮੀ') || lower.includes('ਘੱਟ ਪਾਣੀ') || lower.includes('ਪਾਣੀ ਦੀ ਘਾਟ') || lower.includes('ਤੰਗੀ') || lower.includes('ਬਰਾਨੀ') || lower.includes('कम पानी') || lower.includes('पानी की कमी') || lower.includes('सूखा') || lower.includes('कमी पाणी') || lower.includes('कोरडवाहू')) {
      extracted.waterAvailability = 'Low';
    } else if (lower.includes('moderate') || lower.includes('medium water') || lower.includes('medium') || lower.includes('average') || lower.includes('normal') || lower.includes('ਦਰਮਿਆਨਾ') || lower.includes('ਆਮ ਪਾਣੀ') || lower.includes('मध्यम पानी') || lower.includes('मध्यम पाणी') || lower.includes('साधारण पाणी')) {
      extracted.waterAvailability = 'Moderate';
    }

    // 8. EXTRACT SOIL CONDITION
    if (lower.includes('black cotton') || lower.includes('black') || lower.includes('kali') || lower.includes('kaali') || lower.includes('काली') || lower.includes('काळी') || lower.includes('ਕਾਲੀ') || lower.includes('रेगुर')) {
      extracted.soilCondition = 'Black Cotton';
    } else if (lower.includes('clay loam') || lower.includes('clay') || lower.includes('chikni') || lower.includes('chikani') || lower.includes('चिकनी') || lower.includes('ਚੀਕਣੀ') || lower.includes('चिकणी')) {
      extracted.soilCondition = 'Clay Loam';
    } else if (lower.includes('sandy loam') || lower.includes('sandy') || lower.includes('retili') || lower.includes('walookamoy') || lower.includes('रेतीली') || lower.includes('वालुकामय') || lower.includes('ਰੇਤਲੀ') || lower.includes('रेताळ')) {
      extracted.soilCondition = 'Sandy Loam';
    } else if (lower.includes('alluvial') || lower.includes('loam') || lower.includes('lom') || lower.includes('galachi') || lower.includes('domat') || lower.includes('गाळाची') || lower.includes('जलोढ़') || lower.includes('दोमट') || lower.includes('ਦੋਮਟ')) {
      extracted.soilCondition = 'Alluvial';
    } else if (lower.includes('red soil') || lower.includes('red') || lower.includes('lal') || lower.includes('तांबडी') || lower.includes('लाल') || lower.includes('ਲਾਲ')) {
      extracted.soilCondition = 'Red Soil';
    }

    return Object.keys(extracted).length > 0 ? extracted : null;
  }
}

