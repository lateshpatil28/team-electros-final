/**
 * @file knowledgeData.js
 * Multilingual Audio + Text Knowledge Base for FarmWise
 * Categories: Crops, Soil Health, Water Management, Pest & Disease, Weather, Sustainable Practices
 * Supported Languages: English (en), Punjabi (pa), Hindi (hi), Marathi (mr)
 */

export const KNOWLEDGE_CATEGORIES = [
  { id: 'all', icon: '🌾' },
  { id: 'crops', icon: '🌱' },
  { id: 'soil', icon: '🪨' },
  { id: 'water', icon: '💧' },
  { id: 'pests', icon: '🐛' },
  { id: 'weather', icon: '⛅' },
  { id: 'practices', icon: '🚜' }
];

export const KNOWLEDGE_ARTICLES = [
  {
    id: 'kb_wheat_punjab',
    category: 'crops',
    icon: '🌾',
    tags: ['Wheat', 'Punjab', 'Rabi', 'PBW Varieties'],
    title: {
      en: 'Optimal Wheat Sowing & Water Management in Punjab',
      pa: 'ਪੰਜਾਬ ਵਿੱਚ ਕਣਕ ਦੀ ਸੁਚੱਜੀ ਬਿਜਾਈ ਅਤੇ ਪਾਣੀ ਪ੍ਰਬੰਧਨ',
      hi: 'पंजाब में गेहूं की सही बुवाई और जल प्रबंधन',
      mr: 'गहू लागवड व पाणी व्यवस्थापनाच्या आधुनिक पद्धती'
    },
    summary: {
      en: 'Essential agronomic guidelines for maximizing Punjab wheat yield using laser leveling and timed irrigation.',
      pa: 'ਲੇਜ਼ਰ ਲੈਵਲਿੰਗ ਅਤੇ ਸਹੀ ਸਮੇਂ ਤੇ ਸਿੰਚਾਈ ਨਾਲ ਪੰਜਾਬ ਵਿੱਚ ਕਣਕ ਦਾ ਵੱਧ ਝਾੜ ਲੈਣ ਲਈ ਜ਼ਰੂਰੀ ਨੁਕਤੇ।',
      hi: 'लेजर लेवलिंग और समय पर सिंचाई से गेहूं की बंपर पैदावार प्राप्त करने के मुख्य सुझाव।',
      mr: 'कमी पाण्यात गव्हाचे दर्जेदार उत्पादन घेण्यासाठी योग्य वेळ व खत व्यवस्थापन.'
    },
    content: {
      en: `
### Wheat Production Strategy in Punjab
1. **Sowing Window**: The first fortnight of November (Oct 25 to Nov 15) is the golden window. Yield decreases by 1.5 quintals per acre for every week delayed beyond November 20.
2. **Critical Irrigation Stages**:
   - **Crown Root Initiation (CRI)**: 20-25 days after sowing. Never delay this first irrigation.
   - **Tillering Stage**: 40-45 days.
   - **Booting / Heading**: 80-85 days.
   - **Grain Milking**: 100-105 days.
3. **Yellow Rust Warning**: Check leaves regularly for powdery yellow pustules. If detected, spray Tilt 25% EC (Propiconazole) @ 200 ml per acre in 200 liters of water.
4. **Residue Management**: Use Super Seeder or Smart Seeder to sow directly into paddy stubble, saving fuel and improving soil organic carbon.
      `,
      pa: `
### ਪੰਜਾਬ ਵਿੱਚ ਕਣਕ ਦੀ ਵੱਧ ਪੈਦਾਵਾਰ ਲਈ ਸੁਝਾਅ
1. **ਬਿਜਾਈ ਦਾ ਢੁਕਵਾਂ ਸਮਾਂ**: 25 ਅਕਤੂਬਰ ਤੋਂ 15 ਨਵੰਬਰ ਦਾ ਸਮਾਂ ਸਭ ਤੋਂ ਉੱਤਮ ਹੈ। 20 ਨਵੰਬਰ ਤੋਂ ਬਾਅਦ ਹਰ ਹਫ਼ਤੇ ਦੀ ਦੇਰੀ ਨਾਲ ਪ੍ਰਤੀ ਏਕੜ ਡੇਢ ਕੁਇੰਟਲ ਝਾੜ ਘਟਦਾ ਹੈ।
2. **ਸਿੰਚਾਈ ਦੇ ਨਾਜ਼ੁਕ ਪੜਾਅ**:
   - **ਤਾਜ ਜੜ੍ਹਾਂ ਨਿਕਲਣ ਵੇਲੇ (CRI)**: ਬਿਜਾਈ ਤੋਂ 20-25 ਦਿਨ ਬਾਅਦ। ਇਹ ਪਹਿਲਾ ਪਾਣੀ ਬਹੁਤ ਜ਼ਰੂਰੀ ਹੈ।
   - **ਫੁਟਾਰਾ ਪੜਾਅ**: 40-45 ਦਿਨ ਬਾਅਦ।
   - **ਗੋਭ / ਨਿਸਰਣ ਵੇਲੇ**: 80-85 ਦਿਨ ਬਾਅਦ।
   - **ਦੋਧੀ ਦਾਣਾ ਬਣਨ ਵੇਲੇ**: 100-105 ਦਿਨ ਬਾਅਦ।
3. **ਪੀਲੀ ਕੁੰਗੀ ਦੀ ਰੋਕਥਾਮ**: ਪੱਤਿਆਂ 'ਤੇ ਪੀਲੀਆਂ ਧਾਰੀਆਂ ਦਿਖਣ 'ਤੇ ਪ੍ਰੋਪੀਕੋਨਾਜ਼ੋਲ 25% ਈ.ਸੀ. (ਟਿਲਟ) 200 ਮਿ.ਲੀ. ਪ੍ਰਤੀ ਏਕੜ 200 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਛਿੜਕੋ।
4. **ਪਰਾਲੀ ਪ੍ਰਬੰਧਨ**: ਸੁਪਰ ਸੀਡਰ ਜਾਂ ਸਮਾਰਟ ਸੀਡਰ ਨਾਲ ਸਿੱਧੀ ਬਿਜਾਈ ਕਰਕੇ ਡੀਜ਼ਲ ਬਚਾਓ ਅਤੇ ਜ਼ਮੀਨ ਦੀ ਉਪਜਾਊ ਸ਼ਕਤੀ ਵਧਾਓ।
      `,
      hi: `
### पंजाब और उत्तर भारत में गेहूं की उन्नत खेती
1. **बुवाई का समय**: 25 अक्टूबर से 15 नवंबर का समय सर्वोत्तम है। 20 नवंबर के बाद देरी होने पर प्रति सप्ताह 1.5 क्विंटल प्रति एकड़ उपज घटती है।
2. **मुख्य सिंचाई चरण**:
   - **ताज जड़ें निकलने पर (CRI)**: बुवाई के 20-25 दिन बाद पहला पानी जरूर दें।
   - **कल्ले फूटने पर**: 40-45 दिन बाद।
   - **बालियां निकलने पर**: 80-85 दिन बाद।
   - **दूधिया अवस्था**: 100-105 दिन बाद।
3. **पीला रतुआ (Yellow Rust)**: पत्तियों पर पीले पाउडर की धारियां दिखने पर प्रोपिकोनाजोल 25% EC @ 200 मिली प्रति एकड़ 200 लीटर पानी में मिलाकर छिड़कें।
      `,
      mr: `
### गहू पिकाचे सुधारित व्यवस्थापन
1. **पेरणीची वेळ**: नोव्हेंबरचा पहिला पंधरवडा सर्वोत्तम.
2. **पाणी देण्याच्या नाजूक अवस्था**:
   - मुकुट मुळे फुटताना (CRI): पेरणीनंतर २१ दिवसांनी.
   - कांडी धरताना: ४०-४५ दिवसांनी.
   - फुलोरा अवस्था: ६०-६५ दिवसांनी.
   - दाणे भरताना: ८०-८५ दिवसांनी.
3. **तांबेरा रोग नियंत्रण**: पाने पिवळी पडल्यास किंवा तांबेरा दिसल्यास प्रोपिकोनाझोल २५% ईसी २० मिली प्रति १० लिटर पाण्यात मिसळून फवारावे.
      `
    }
  },
  {
    id: 'kb_pink_bollworm',
    category: 'pests',
    icon: '🐛',
    tags: ['Cotton', 'Pink Bollworm', 'IPM', 'Vidarbha', 'Punjab'],
    title: {
      en: 'Integrated Management of Pink Bollworm in Cotton',
      pa: 'ਨਰਮੇ ਵਿੱਚ ਗੁਲਾਬੀ ਸੁੰਡੀ ਦੀ ਏਕੀਕ੍ਰਿਤ ਰੋਕਥਾਮ',
      hi: 'कपास में गुलाबी सुंडी (Pink Bollworm) का समग्र नियंत्रण',
      mr: 'कापूस पिकातील गुलाबी बोंडअळीचे एकात्मिक नियंत्रण'
    },
    summary: {
      en: 'Crucial biological, cultural, and chemical tactics to stop Pink Bollworm damage in flowers and bolls.',
      pa: 'ਫੁੱਲਾਂ ਅਤੇ ਟੀਂਡਿਆਂ ਵਿੱਚ ਗੁਲਾਬੀ ਸੁੰਡੀ ਦੇ ਨੁਕਸਾਨ ਨੂੰ ਰੋਕਣ ਲਈ ਜੈਵਿਕ ਅਤੇ ਰਸਾਇਣਕ ਨੁਕਤੇ।',
      hi: 'कपास की फसल में गुलाबी सुंडी से होने वाले नुकसान से बचाव के सटीक उपाय।',
      mr: 'गुलाबी बोंडअळीमुळे होणारे नुकसान टाळण्यासाठी कामगंध सापळे व योग्य फवारणी तंत्र.'
    },
    content: {
      en: `
### Pink Bollworm (PBW) Management Protocol
1. **Early Surveillance**: Install 5-8 Pheromone Traps per acre at 45 days after sowing. The trap threshold is 8 moths per trap for 3 consecutive nights.
2. **Rosette Flower Scouting**: Scout 20 plants across the field. If 5% or more flowers are rosetted (petals twisted into rosette shape), initiate immediate action.
3. **Biological Control**: Release *Trichogramma bactrae* egg parasitoids @ 60,000/acre at 7-10 day intervals starting at 60 DAS.
4. **Chemical Spray Sequence**:
   - At ETL crossing (early stage): Spray Profenofos 50% EC @ 400 ml/acre or Chlorpyrifos 20% EC @ 500 ml/acre.
   - During peak boll development: Spray Emamectin Benzoate 5% SG @ 100g/acre or Spinetoram 11.7% SC @ 170 ml/acre.
      `,
      pa: `
### ਗੁਲਾਬੀ ਸੁੰਡੀ ਦੀ ਰੋਕਥਾਮ ਲਈ ਜ਼ਰੂਰੀ ਕਦਮ
1. **ਟਰੈਪ ਲਗਾਉਣਾ**: ਬਿਜਾਈ ਤੋਂ 45 ਦਿਨ ਬਾਅਦ ਪ੍ਰਤੀ ਏਕੜ 5-8 ਫੇਰੋਮੋਨ ਟਰੈਪ ਲਗਾਓ। ਜੇਕਰ ਲਗਾਤਾਰ 3 ਰਾਤਾਂ 8 ਪਤੰਗੇ ਪ੍ਰਤੀ ਟਰੈਪ ਆਉਣ ਤਾਂ ਤੁਰੰਤ ਕਾਰਵਾਈ ਕਰੋ।
2. **ਗੁਲਾਬੀ ਫੁੱਲਾਂ ਦੀ ਜਾਂਚ**: ਖੇਤ ਵਿੱਚੋਂ 20 ਬੂਟੇ ਦੇਖੋ। ਜੇਕਰ 5% ਤੋਂ ਵੱਧ ਫੁੱਲ ਗੁਲਾਬ ਵਾਂਗ ਬੰਨ੍ਹੇ ਹੋਏ ਦਿਖਣ ਤਾਂ ਸੁੰਡੀ ਅੰਦਰ ਵੜ ਚੁੱਕੀ ਹੈ।
3. **ਕੈਮੀਕਲ ਛਿੜਕਾਅ**:
   - ਸ਼ੁਰੂਆਤੀ ਹਮਲੇ ਵੇਲੇ: ਪ੍ਰੋਫੇਨੋਫੋਸ 50% ਈ.ਸੀ. 400 ਮਿ.ਲੀ. ਪ੍ਰਤੀ ਏਕੜ ਜਾਂ ਕਲੋਰਪਾਈਰੀਫਾਸ 20% ਈ.ਸੀ. 500 ਮਿ.ਲੀ. ਛਿੜਕੋ।
   - ਟੀਂਡੇ ਬਣਨ ਵੇਲੇ: ਐਮਾਮੈਕਟਿਨ ਬੈਂਜੋਏਟ 5% ਐਸ.ਜੀ. 100 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਏਕੜ 150 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਛਿੜਕੋ।
      `,
      hi: `
### गुलाबी सुंडी (PBW) रोकथाम की संपूर्ण विधि
1. **फेरोमोन ट्रैप**: बुवाई के 45 दिन बाद प्रति एकड़ 5-8 ट्रैप लगाएं। 8 पतंगे प्रति ट्रैप लगातार 3 दिन दिखने पर तुरंत उपाय करें।
2. **गुलाब जैसे फूल**: यदि 5% से अधिक फूल मुड़े हुए दिखें तो समझें कि इल्ली प्रवेश कर चुकी है।
3. **कीटनाशक छिड़काव**:
   - शुरुआत में: प्रोफेनोफॉस 50% EC @ 400 मिली प्रति एकड़ छिड़कें।
   - बोंड बनने पर: इमामेक्टिन बेंजोएट 5% SG @ 100 ग्राम प्रति एकड़ 150 लीटर पानी में छिड़कें।
      `,
      mr: `
### गुलाबी बोंडअळीचे एकात्मिक व्यवस्थापन
1. **कामगंध सापळे**: पेरणीनंतर ४५ दिवसांनी एकरी ५ सापळे लावावेत. सलग ३ दिवस प्रति सापळा ८ पतंग आढळल्यास आर्थिक नुकसान पातळी ओलांडली समजावी.
2. **डोमकळ्या वेचून नष्ट करणे**: कीडग्रस्त डोमकळ्या (गुलाबी फुले) तोडून नष्ट कराव्यात.
3. **रासायनिक फवारणी**:
   - पहिली फवारणी: प्रोफेनोफॉस ५०% ईसी ३० मिली प्रति १० लिटर पाणी.
   - बोंडे धरताना: इमामेक्टिन बेन्झोएट ५% एसजी ४ ग्रॅम प्रति १० लिटर पाणी.
      `
    }
  },
  {
    id: 'kb_soil_health',
    category: 'soil',
    icon: '🪨',
    tags: ['Soil Health', 'Organic Carbon', 'Green Manuring', 'Punjab', 'Maharashtra'],
    title: {
      en: 'Restoring Soil Organic Carbon with Green Manuring & Residue',
      pa: 'ਜੰਤਰ (ਹਰੀ ਖਾਦ) ਅਤੇ ਪਰਾਲੀ ਨਾਲ ਜ਼ਮੀਨ ਦੀ ਸਿਹਤ ਸੁਧਾਰੋ',
      hi: 'हरी खाद और फसल अवशेष से मिट्टी की उर्वरा शक्ति बढ़ाएं',
      mr: 'हिरवळीची खते व सेंद्रिय कर्ब वाढवण्याचे उपाय'
    },
    summary: {
      en: 'How growing Dhaincha (Sesbania) and retaining crop residues elevates organic carbon from 0.4% to >0.8%.',
      pa: 'ਢੈਂਚਾ (ਜੰਤਰ) ਬੀਜ ਕੇ ਅਤੇ ਪਰਾਲੀ ਜ਼ਮੀਨ ਵਿੱਚ ਰਲਾ ਕੇ ਜੈਵਿਕ ਕਾਰਬਨ ਵਧਾਉਣ ਦਾ ਸਹੀ ਤਰੀਕਾ।',
      hi: 'ढैंचा और फसल अवशेषों को मिट्टी में दबाकर जैविक कार्बन बढ़ाने का वैज्ञानिक तरीका।',
      mr: 'ताग व धैंचाच्या साहाय्याने जमिनीचा सेंद्रिय कर्ब वाढवून सुपीकता टिकवा.'
    },
    content: {
      en: `
### Soil Health Rejuvenation Guide
1. **The Organic Carbon Crisis**: Intensive cropping has reduced soil organic carbon (SOC) in many regions to under 0.4%. Target should be >0.75%.
2. **Green Manuring with Dhaincha (Sesbania aculeata)**:
   - Sow Dhaincha @ 20 kg seed per acre immediately after wheat harvest in May.
   - Ploughed in-situ at 45-50 days when succulent and before stem hardening.
   - Adds 10-15 tonnes of organic biomass and fixes 25-30 kg of atmospheric Nitrogen per acre.
3. **Zinc and Micronutrient Application**: Apply 10 kg Zinc Sulphate (21%) or 6.5 kg Zinc Sulphate (33% monohydrate) per acre to avoid khaira disease in paddy and stunted wheat tillering.
      `,
      pa: `
### ਜ਼ਮੀਨ ਦੀ ਸਿਹਤ ਅਤੇ ਜੈਵਿਕ ਕਾਰਬਨ ਵਧਾਉਣ ਦੇ ਨੁਕਤੇ
1. **ਜੈਵਿਕ ਕਾਰਬਨ ਦੀ ਘਾਟ**: ਲਗਾਤਾਰ ਫਸਲੀ ਚੱਕਰ ਕਾਰਨ ਜ਼ਮੀਨ ਵਿੱਚ ਜੈਵਿਕ ਕਾਰਬਨ 0.4% ਤੋਂ ਵੀ ਘੱਟ ਰਹਿ ਗਿਆ ਹੈ, ਜਦਕਿ ਇਹ 0.8% ਤੋਂ ਵੱਧ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।
2. **ਜੰਤਰ (ਢੈਂਚਾ) ਦੀ ਹਰੀ ਖਾਦ**:
   - ਕਣਕ ਵੱਢਣ ਤੋਂ ਬਾਅਦ ਮਈ ਵਿੱਚ 20 ਕਿੱਲੋ ਢੈਂਚੇ ਦਾ ਬੀਜ ਪ੍ਰਤੀ ਏਕੜ ਛੱਟਾ ਦਿਓ।
   - 45-50 ਦਿਨਾਂ ਬਾਅਦ ਜਦੋਂ ਫਸਲ ਨਰਮ ਹੋਵੇ, ਇਸਨੂੰ ਰੋਟਾਵੇਟਰ ਜਾਂ ਹੱਲਾਂ ਨਾਲ ਜ਼ਮੀਨ ਵਿੱਚ ਵਾਹ ਦਿਓ।
   - ਇਹ ਪ੍ਰਤੀ ਏਕੜ 10-15 ਟਨ ਜੈਵਿਕ ਮਾਦਾ ਅਤੇ 25-30 ਕਿੱਲੋ ਨਾਈਟ੍ਰੋਜਨ ਜ਼ਮੀਨ ਨੂੰ ਦਿੰਦਾ ਹੈ।
3. **ਜ਼ਿੰਕ ਦੀ ਵਰਤੋਂ**: ਝੋਨੇ ਜਾਂ ਕਣਕ ਵਿੱਚ ਪ੍ਰਤੀ ਏਕੜ 10 ਕਿੱਲੋ ਜ਼ਿੰਕ ਸਲਫੇਟ (21%) ਜ਼ਰੂਰ ਪਾਓ।
      `,
      hi: `
### मिट्टी का स्वास्थ्य और जैविक कार्बन सुधार
1. **जैविक कार्बन बढ़ाएं**: मिट्टी की जांच करवाएं। यदि जैविक कार्बन 0.5% से कम है, तो ढैंचा हरी खाद सबसे सस्ता और असरदार उपाय है।
2. **ढैंचा (हरी खाद) की विधि**:
   - गेहूं की कटाई के बाद 20 किग्रा ढैंचा प्रति एकड़ बोएं।
   - 45-50 दिन बाद खेत में रोटावेटर चलाकर मिट्टी में मिला दें।
   - इससे खेत को 25-30 किग्रा प्राकृतिक नाइट्रोजन मिलती है और यूरिया की बचत होती है।
3. **जिंक की मात्रा**: प्रति एकड़ 10 किग्रा जिंक सल्फेट (21%) जरूर डालें।
      `,
      mr: `
### जमिनीची सुपीकता व सेंद्रिय कर्ब वाढीचे उपाय
1. **ताग व धैंचा हिरवळीची खते**: मुख्य पिकाच्या आधी ताग किंवा धैंचा २५ किलो प्रति एकर पेरून ४५ व्या दिवशी जमिनीत गाडावा.
2. **सेंद्रिय कर्ब फायदा**: यामुळे जमिनीची पाणी धरून ठेवण्याची क्षमता वाढते व उपयुक्त जिवाणूंची संख्या कित्येक पटीने वाढते.
3. **सूक्ष्म अन्नद्रव्ये**: जमिनीत झिंक, फेरस आणि बोरॉनची कमतरता असल्यास माती परीक्षणानुसार पूर्तता करावी.
      `
    }
  },
  {
    id: 'kb_water_conservation',
    category: 'water',
    icon: '💧',
    tags: ['Water Conservation', 'Drip Irrigation', 'AWD', 'Groundwater'],
    title: {
      en: 'Water Conservation Technologies: AWD & Drip Irrigation',
      pa: 'ਪਾਣੀ ਦੀ ਬੱਚਤ: ਝੋਨੇ ਵਿੱਚ ਔੜ ਪਾ ਕੇ ਪਾਣੀ ਲਾਉਣਾ ਅਤੇ ਤੁਪਕਾ ਸਿੰਚਾਈ',
      hi: 'जल संरक्षण तकनीक: एकांतर जल प्रबंधन (AWD) और ड्रिप सिंचाई',
      mr: 'पाणी बचत तंत्रज्ञान: ठिबक व तुषार सिंचन पद्धती'
    },
    summary: {
      en: 'Save 30-40% groundwater in paddy and row crops using Alternate Wetting & Drying and inline drip tubes.',
      pa: 'ਝੋਨੇ ਵਿੱਚ ਬਦਲਵੀਂ ਸਿੰਚਾਈ (AWD) ਅਤੇ ਤੁਪਕਾ ਪ੍ਰਣਾਲੀ ਨਾਲ 30-40% ਧਰਤੀ ਹੇਠਲਾ ਪਾਣੀ ਬਚਾਓ।',
      hi: 'धान में रुक-रुक कर पानी देने (AWD) और ड्रिप से 35% भूजल व बिजली की बचत करें।',
      mr: 'ठिबक सिंचनाने ४०-५०% पाण्याची बचत आणि खतांचा कार्यक्षम वापर.'
    },
    content: {
      en: `
### Precision Water Management in Indian Agriculture
1. **Alternate Wetting & Drying (AWD) in Paddy**:
   - Do NOT keep fields continuously flooded after the first 15 days of transplanting.
   - Apply 5 cm water only when the water from previous irrigation has fully infiltrated and small hairline surface cracks begin to appear (usually 2-3 days gap).
   - Saves 25-35% irrigation water and reduces diesel/electricity pumping costs without reducing yield.
2. **Drip Fertigation in Cotton & Sugarcane**:
   - Delivers water directly to root zones at 90%+ application efficiency compared to 40% in flood irrigation.
   - Dissolves water-soluble fertilizers (19:19:19, 0:52:34) directly through venture injectors.
3. **Laser Land Leveling**: Level fields reduce runoff losses and ensure uniform water distribution across every corner of the acre.
      `,
      pa: `
### ਪਾਣੀ ਬਚਾਉਣ ਦੀਆਂ ਆਧੁਨਿਕ ਤਕਨੀਕਾਂ
1. **ਝੋਨੇ ਵਿੱਚ ਔੜ ਪਾ ਕੇ ਸਿੰਚਾਈ (AWD ਤਕਨੀਕ)**:
   - ਪਨੀਰੀ ਲਾਉਣ ਦੇ 15 ਦਿਨਾਂ ਬਾਅਦ ਖੇਤ ਵਿੱਚ ਲਗਾਤਾਰ ਪਾਣੀ ਖੜ੍ਹਾ ਨਾ ਰੱਖੋ।
   - ਪਾਣੀ ਜੀਰਨ ਤੋਂ 2 ਦਿਨ ਬਾਅਦ ਅਗਲਾ ਪਾਣੀ ਲਾਓ।
   - ਇਸ ਨਾਲ 30% ਪਾਣੀ ਅਤੇ ਬਿਜਲੀ ਦੀ ਬੱਚਤ ਹੁੰਦੀ ਹੈ ਅਤੇ ਬੂਟੇ ਦੀਆਂ ਜੜ੍ਹਾਂ ਡੂੰਘੀਆਂ ਜਾਂਦੀਆਂ ਹਨ।
2. **ਨਰਮੇ ਅਤੇ ਮੱਕੀ ਵਿੱਚ ਤੁਪਕਾ ਸਿੰਚਾਈ**:
   - ਤੁਪਕਾ ਪ੍ਰਣਾਲੀ ਨਾਲ ਪਾਣੀ ਸਿੱਧਾ ਜੜ੍ਹਾਂ ਵਿੱਚ ਜਾਂਦਾ ਹੈ, ਜਿਸ ਨਾਲ 40-50% ਪਾਣੀ ਦੀ ਬੱਚਤ ਹੁੰਦੀ ਹੈ।
3. **ਲੇਜ਼ਰ ਕਰਾਹ (Laser Leveler)**: ਬਿਜਾਈ ਤੋਂ ਪਹਿਲਾਂ ਲੇਜ਼ਰ ਕਰਾਹ ਲਗਾਉਣ ਨਾਲ ਖੇਤ ਵਿੱਚ ਪਾਣੀ ਇੱਕਸਾਰ ਲੱਗਦਾ ਹੈ।
      `,
      hi: `
### आधुनिक जल प्रबंधन तकनीक
1. **धान में रुक-रुक कर सिंचाई (AWD)**:
   - रोपाई के 15 दिन बाद हमेशा खेत में पानी भरकर न रखें।
   - पानी सूखने के 2 दिन बाद दोबारा 5 सेमी पानी दें। इससे 30% पानी की बचत होती है और कल्ले अधिक निकलते हैं।
2. **ड्रिप (टपक) सिंचाई**:
   - कपास, मक्का और गन्ने में ड्रिप से पानी और घुलनशील खाद देने पर 40% तक उपज बढ़ती है।
3. **खेत का लेजर समतलीकरण**: लेजर लेवलर से समतल खेत में पानी 25% कम लगता है।
      `,
      mr: `
### सूक्ष्म सिंचन व जलसंधारण
1. **ठिबक सिंचन (Drip Irrigation)**:
   - ऊस आणि कापूस पिकात ठिबक पद्धतीचा वापर केल्यास पाण्याचा प्रत्येक थेंब कार्यक्षमतेने वापरला जातो.
   - विद्राव्य खते ठिबकद्वारे दिल्याने ३०% खतांची बचत होते.
2. **मल्चिंग (आच्छादन)**: उन्हाळ्यात पिकाच्या ओळींमध्ये पाचट किंवा प्लास्टिक मल्चिंग केल्याने पाण्याचे बाष्पीभवन थांबते.
      `
    }
  },
  {
    id: 'kb_weather_advisory',
    category: 'weather',
    icon: '⛅',
    tags: ['Weather Forecast', 'Rainfall', 'Heat Wave', 'Advisory'],
    title: {
      en: 'Agrometeorological Decision Making: Timing Sprays & Irrigations',
      pa: 'ਮੌਸਮ ਅਨੁਸਾਰ ਖੇਤੀ ਫੈਸਲੇ: ਛਿੜਕਾਅ ਅਤੇ ਪਾਣੀ ਲਾਉਣ ਦਾ ਸਹੀ ਸਮਾਂ',
      hi: 'मौसम आधारित कृषि सलाह: छिड़काव और सिंचाई का सही समय',
      mr: 'हवामानावर आधारित शेतीचे नियोजन'
    },
    summary: {
      en: 'How to use rainfall probability and wind speed to avoid pesticide wash-off and lodging.',
      pa: 'ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਅਤੇ ਹਵਾ ਦੀ ਰਫ਼ਤਾਰ ਦੇਖ ਕੇ ਕੀਟਨਾਸ਼ਕਾਂ ਦੇ ਨੁਕਸਾਨ ਅਤੇ ਫਸਲ ਡਿੱਗਣ ਤੋਂ ਬਚੋ।',
      hi: 'वर्षा पूर्वानुमान और हवा की गति को देखकर कीटनाशक छिड़काव और सिंचाई की योजना बनाएं।',
      mr: 'पावसाचा अंदाज घेऊन फवारणी व खत व्यवस्थापन केल्यास होणारे नुकसान टाळता येते.'
    },
    content: {
      en: `
### Weather-Smart Farm Actions
1. **Pesticide Spray Rules**:
   - Never spray if rain probability is >50% within the next 4 hours. Rain wash-off wastes chemical cost and pollutes runoff.
   - Spray during calm morning hours (7 AM - 10 AM) or late afternoon (4 PM - 6:30 PM). Wind speeds >15 km/h cause drift away from targets.
2. **High Wind Warning & Lodging**:
   - Never irrigate tall crops (mature wheat, maize, sugarcane) when forecast winds exceed 20 km/h. Wet loose soil combined with heavy canopy causes catastrophic crop lodging.
3. **Terminal Heat Shock Mitigation**:
   - If March temperature suddenly crosses 33°C in wheat, apply light sprinkler irrigation or spray 0.2% Potassium Nitrate (13:0:45) to protect grain filling.
      `,
      pa: `
### ਮੌਸਮ ਅਨੁਕੂਲ ਖੇਤੀ ਦੇ ਸੁਨਹਿਰੀ ਨਿਯਮ
1. **ਛਿੜਕਾਅ ਦਾ ਸਹੀ ਸਮਾਂ**:
   - ਜੇਕਰ ਅਗਲੇ 4 ਘੰਟਿਆਂ ਵਿੱਚ ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ 50% ਤੋਂ ਵੱਧ ਹੋਵੇ ਤਾਂ ਕੋਈ ਵੀ ਸਪਰੇਅ ਨਾ ਕਰੋ।
   - ਸਪਰੇਅ ਹਮੇਸ਼ਾ ਸਵੇਰੇ 7 ਤੋਂ 10 ਵਜੇ ਜਾਂ ਸ਼ਾਮ ਨੂੰ 4 ਵਜੇ ਤੋਂ ਬਾਅਦ ਕਰੋ। ਤੇਜ਼ ਹਵਾ (15 ਕਿਲੋਮੀਟਰ/ਘੰਟਾ ਤੋਂ ਵੱਧ) ਵਿੱਚ ਸਪਰੇਅ ਉੱਡ ਜਾਂਦੀ ਹੈ।
2. **ਤੇਜ਼ ਹਵਾ ਅਤੇ ਫਸਲ ਡਿੱਗਣ ਤੋਂ ਬਚਾਅ**:
   - ਜੇਕਰ ਤੇਜ਼ ਹਵਾਵਾਂ ਦੀ ਚੇਤਾਵਨੀ ਹੋਵੇ ਤਾਂ ਪੱਕਣ ਵਾਲੀ ਕਣਕ ਜਾਂ ਮੱਕੀ ਨੂੰ ਪਾਣੀ ਨਾ ਲਾਓ। ਗਿੱਲੀ ਜ਼ਮੀਨ ਕਾਰਨ ਫਸਲ ਧਰਤੀ 'ਤੇ ਵਿਛ ਜਾਂਦੀ ਹੈ।
3. **ਗਰਮੀ ਦੀ ਮਾਰ ਤੋਂ ਬਚਾਅ**:
   - ਮਾਰਚ ਵਿੱਚ ਕਣਕ ਪੱਕਣ ਵੇਲੇ ਜੇ ਤਾਪਮਾਨ ਅਚਾਨਕ ਵਧੇ ਤਾਂ ਪੋਟਾਸ਼ੀਅਮ ਨਾਈਟ੍ਰੇਟ (13:0:45) ਦਾ 0.2% ਛਿੜਕਾਅ ਕਰੋ।
      `,
      hi: `
### मौसम आधारित सावधानियां
1. **दवा छिड़काव के नियम**:
   - यदि अगले 4 घंटे में बारिश की 50% संभावना हो, तो छिड़काव टाल दें।
   - छिड़काव सुबह या शांत शाम के समय करें। तेज धूप और हवा में दवा उड़ जाती है।
2. **फसल को गिरने से बचाएं**:
   - तेज हवा की चेतावनी होने पर पकी हुई गेहूं, मक्का या गन्ने में भारी सिंचाई न करें।
3. **अचानक तापमान वृद्धि**:
   - गेहूं में दाना भरते समय पोटाश (13:0:45) का छिड़काव करने से गर्मी का असर कम होता है।
      `,
      mr: `
### हवामान अंदाज आणि शेती
1. **फवारणी नियोजन**: ढगाळ वातावरण किंवा पावसाची शक्यता असताना आंतरप्रवाही बुरशीनाशकांचा वापर करावा व स्टिकर (स्प्रेडर) नक्की वापरावे.
2. **वादळी वारे व पाणी**: सोसाट्याचा वारा सुटण्याची शक्यता असताना उभ्या पिकाला भारी पाणी देणे टाळावे, अन्यथा पीक भुईसपाट होते.
      `
    }
  },
  {
    id: 'kb_sustainable_practices',
    category: 'practices',
    icon: '🚜',
    tags: ['Sustainable Agriculture', 'Biofertilizers', 'IPM', 'Direct Seeded Rice'],
    title: {
      en: 'Cost-Reduction via Biofertilizers & Direct Seeded Rice (DSR)',
      pa: 'ਖਰਚਾ ਘਟਾਉਣ ਦੇ ਤਰੀਕੇ: ਜੈਵਿਕ ਖਾਦਾਂ ਅਤੇ ਤਰ-ਵੱਤਰ ਝੋਨੇ ਦੀ ਸਿੱਧੀ ਬਿਜਾਈ',
      hi: 'लागत कम करने के उपाय: जैव उर्वरक और धान की सीधी बुवाई (DSR)',
      mr: 'उत्पादन खर्च कमी करण्याचे सेंद्रिय व सुधारित उपाय'
    },
    summary: {
      en: 'Cut cultivation cost by ₹3,000 - ₹4,500 per acre with tar-wattar DSR and Azotobacter/PSB seed inoculation.',
      pa: 'ਝੋਨੇ ਦੀ ਸਿੱਧੀ ਬਿਜਾਈ ਅਤੇ ਜੈਵਿਕ ਟੀਕਿਆਂ ਨਾਲ ਪ੍ਰਤੀ ਏਕੜ 3000-4500 ਰੁਪਏ ਖਰਚਾ ਘਟਾਓ।',
      hi: 'डीएसआर तकनीक और राइजोबियम/पीएसबी कल्चर से प्रति एकड़ 4000 रुपये तक की बचत करें।',
      mr: 'जैविक खतांचा वापर आणि बीजप्रक्रिया करून उत्पादन खर्चात लक्षणीय बचत करा.'
    },
    content: {
      en: `
### Low-Cost High-Efficiency Farming Practices
1. **Tar-Wattar Direct Seeded Rice (DSR)**:
   - Direct seeding of rice using Lucky Seed Drill in field with optimum moisture (tar-wattar).
   - Eliminates nursery raising and puddling costs, saving ₹3,500 - ₹4,500 per acre in labor and fuel.
   - Weed control: Spray Pendimethalin 30% EC @ 1 liter/acre within 24 hours of sowing followed by Bispyribac Sodium 10% SC @ 100 ml at 20-25 days.
2. **Biofertilizer Seed Inoculation**:
   - Treat wheat/maize seed with *Azotobacter* and *Phosphorus Solubilizing Bacteria (PSB)* cultures @ 250g per 10 kg seed.
   - Costs under ₹100 per acre and allows cutting chemical Phosphate and Nitrogen by 20-25%.
3. **Pheromone Traps & Yellow Sticky Cards**:
   - Deploy 6-8 yellow sticky cards per acre to trap whiteflies and aphids, minimizing chemical pesticide sprays.
      `,
      pa: `
### ਖੇਤੀ ਲਾਗਤ ਘਟਾਉਣ ਦੇ ਪ੍ਰਮਾਣਿਤ ਤਰੀਕੇ
1. **ਤਰ-ਵੱਤਰ ਝੋਨੇ ਦੀ ਸਿੱਧੀ ਬਿਜਾਈ (DSR)**:
   - ਕੱਦੂ ਕੀਤੇ ਬਿਨਾਂ ਤਰ-ਵੱਤਰ ਖੇਤ ਵਿੱਚ ਲੱਕੀ ਸੀਡ ਡਰਿੱਲ ਨਾਲ ਸਿੱਧੀ ਬਿਜਾਈ ਕਰੋ।
   - ਇਸ ਨਾਲ ਲੇਬਰ, ਟਰੈਕਟਰ ਡੀਜ਼ਲ ਅਤੇ ਪਨੀਰੀ ਦਾ 3500-4500 ਰੁਪਏ ਪ੍ਰਤੀ ਏਕੜ ਖਰਚਾ ਬਚਦਾ ਹੈ।
   - ਨਦੀਨ ਰੋਕਥਾਮ: ਬਿਜਾਈ ਦੇ 24 ਘੰਟਿਆਂ ਅੰਦਰ ਸਟੌਂਪ (ਪੈਂਡੀਮੈਥਾਲਿਨ) 1 ਲੀਟਰ ਪ੍ਰਤੀ ਏਕੜ ਛਿੜਕੋ।
2. **ਜੀਵਾਣੂ ਟੀਕੇ (ਬਾਇਓ-ਫਰਟੀਲਾਈਜ਼ਰ)**:
   - ਬੀਜ ਨੂੰ ਅਜ਼ੋਟੋਬੈਕਟਰ ਅਤੇ ਪੀ.ਐਸ.ਬੀ. (PSB) ਦੇ ਟੀਕੇ ਨਾਲ ਸੋਧ ਕੇ ਬੀਜੋ। ਸਿਰਫ 50-100 ਰੁਪਏ ਦੇ ਖਰਚੇ ਨਾਲ ਡੀ.ਏ.ਪੀ. ਅਤੇ ਯੂਰੀਆ ਦੀ 20% ਬੱਚਤ ਹੁੰਦੀ ਹੈ।
3. **ਪੀਲੇ ਕਾਰਡ**: ਖੇਤ ਵਿੱਚ ਪੀਲੇ ਚਿਪਚਿਪੇ ਕਾਰਡ ਲਗਾ ਕੇ ਚਿੱਟੀ ਮੱਖੀ ਅਤੇ ਤੇਲੇ ਨੂੰ ਬਿਨਾਂ ਦਵਾਈ ਤੋਂ ਕਾਬੂ ਕਰੋ।
      `,
      hi: `
### कम लागत में अधिक लाभ के उपाय
1. **धान की सीधी बुवाई (DSR)**:
   - तर-वत्तर अवस्था में सीधी बिजाई करने से रोपाई का भारी खर्च और कद्दू करने का डीजल बचता है।
   - खरपतवार नियंत्रण के लिए बुवाई के 24 घंटे के भीतर पेंडीमेथालिन 30% EC का छिड़काव करें।
2. **बीज उपचार**:
   - गेहूं, सोयाबीन और मक्का में राइजोबियम और पीएसबी कल्चर से बीज उपचार करें। इससे 25% तक रासायनिक खाद की बचत होती है।
3. **पीले और नीले चिपचिपे ट्रैप**:
   - रसचूसक कीटों (सफेद मक्खी, थ्रिप्स) के लिए 6-8 स्टिकी ट्रैप प्रति एकड़ लगाएं।
      `,
      mr: `
### कमी खर्चात शाश्वत शेती तंत्रज्ञान
1. **बीजप्रक्रिया (Seed Treatment)**:
   - पेरणीपूर्वी बियाण्याला ट्रायकोडर्मा ५ ग्रॅम आणि पीएसबी २५ ग्रॅम प्रति किलो चोळावे. यामुळे पिकाची प्रतिकारशक्ती वाढते आणि सुरुवातीचा खर्च वाचतो.
2. **कामगंध व चिकट सापळे**:
   - रासायनिक कीटकनाशकांवर होणारा मोठा खर्च वाचवण्यासाठी एकरी ५ पिवळे व ५ निळे चिकट सापळे लावावेत.
3. **सेंद्रिय खतांचा वापर**: शेणखत किंवा गांडूळ खताचा नियमित वापर रासायनिक खतांवरील अवलंबित्व कमी करतो.
      `
    }
  }
];
