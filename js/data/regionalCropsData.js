/**
 * @file regionalCropsData.js
 * Comprehensive Regional Crop Database for Punjab and Maharashtra
 * Includes agronomics, growth stages, water demands, risk factors, and sowing advisory.
 */

export const REGIONAL_CROPS_DATABASE = {
  Punjab: {
    stateName: 'Punjab',
    nativeName: 'ਪੰਜਾਬ',
    districts: ['Ludhiana', 'Bhatinda', 'Amritsar', 'Patiala', 'Jalandhar', 'Sangrur', 'Firozpur'],
    defaultSoil: 'Alluvial',
    climateZone: 'Semi-Arid Sub-Tropical (Indo-Gangetic Plain)',
    crops: [
      {
        id: 'punjab_wheat',
        cropName: 'Wheat',
        nativeName: 'ਕਣਕ (Wheat)',
        season: 'Rabi (Oct - Apr)',
        sowingWindow: 'October 25 - November 15 (Optimal)',
        soilType: 'Loamy to Clay Loam (Alluvial)',
        waterRequirementMm: '350 - 450 mm',
        yieldPotential: '20 - 24 Quintals / Acre',
        recommendedVarieties: ['PBW 824', 'HD 3086', 'PBW 725', 'DBW 187 (Karan Vandana)', 'Unnat PBW 343'],
        stages: [
          { name: 'Crown Root Initiation (CRI)', days: '20-25 DAS', waterNeed: 'Critical (50-60 mm)', notes: 'First and most critical irrigation stage.' },
          { name: 'Tillering', days: '40-45 DAS', waterNeed: 'Moderate (50 mm)', notes: 'Nitrogen top-dressing and weed management.' },
          { name: 'Jointing / Stem Elongation', days: '60-65 DAS', waterNeed: 'Moderate (55 mm)', notes: 'Avoid waterlogging; ensure zinc sufficiency.' },
          { name: 'Flowering / Booting', days: '80-85 DAS', waterNeed: 'Critical (65 mm)', notes: 'Watch for Yellow Rust and Aphid infestations.' },
          { name: 'Grain Filling (Milking & Dough)', days: '100-115 DAS', waterNeed: 'High (60 mm)', notes: 'Avoid terminal heat stress with potassium spray.' },
          { name: 'Maturity / Harvest', days: '130-145 DAS', waterNeed: 'None', notes: 'Stop irrigation 15 days before harvest.' }
        ],
        commonRisks: [
          { pest: 'Yellow Rust (Puccinia striiformis)', symptom: 'Yellow stripes of uredinia on leaves', management: 'Spray Propiconazole 25% EC (Tilt) @ 200ml/acre' },
          { pest: 'Wheat Aphid (Sitobion avenae)', symptom: 'Sucking sap from ears, honey-dew secretion', management: 'Spray Thiamethoxam 25% WG @ 50g/acre when crossing 5 aphids/ear' },
          { pest: 'Pink Stem Borer', symptom: 'Dead hearts in seedlings', management: 'Apply Chlorantraniliprole 18.5% SC @ 60ml/acre' },
          { pest: 'Terminal Heat Stress', symptom: 'Premature drying of grain, shriveled kernels', management: 'Foliar spray of 0.2% Potassium Nitrate (13:0:45) at heading' }
        ],
        advisory: 'Punjab agricultural department recommends laser land leveling to save 20-25% irrigation water and applying happy seeder for zero-tillage straw management.'
      },
      {
        id: 'punjab_rice',
        cropName: 'Rice',
        nativeName: 'ਝੋਨਾ (Paddy / Basmati)',
        season: 'Kharif (Jun - Nov)',
        sowingWindow: 'June 15 - June 30 (Transplanting)',
        soilType: 'Heavy Clay Loam / Alluvial with hardpan',
        waterRequirementMm: '1200 - 1500 mm',
        yieldPotential: '28 - 34 Quintals / Acre (PR varieties), 18-22 Q/Ac (Basmati)',
        recommendedVarieties: ['PR 126', 'PR 131', 'Pusa Basmati 1121', 'Pusa Basmati 1509', 'PR 121'],
        stages: [
          { name: 'Nursery & Transplanting', days: '0-30 DAS', waterNeed: 'Submerged (50 mm depth)', notes: 'Maintain 2-3 cm standing water for 15 days.' },
          { name: 'Active Tillering', days: '30-55 DAS', waterNeed: 'High (100 mm)', notes: 'Alternate wetting and drying (AWD) to save groundwater.' },
          { name: 'Panicle Initiation', days: '55-75 DAS', waterNeed: 'Critical (90 mm)', notes: 'Do not allow water stress; zinc deficiency check.' },
          { name: 'Flowering / Anthesis', days: '75-95 DAS', waterNeed: 'Critical (80 mm)', notes: 'Monitor for Stem Borer and False Smut.' },
          { name: 'Grain Filling', days: '95-120 DAS', waterNeed: 'Moderate (70 mm)', notes: 'Maintain saturated soil; drain 10 days before harvest.' }
        ],
        commonRisks: [
          { pest: 'Yellow Stem Borer (Scirpophaga incertulas)', symptom: 'Dead hearts in vegetative, white ears in reproductive', management: 'Cartap Hydrochloride 4G @ 10kg/acre or Chlorantraniliprole 0.4% G' },
          { pest: 'Bacterial Leaf Blight (BLB)', symptom: 'Wavy margins on leaves turning translucent yellow', management: 'Spray Streptocycline @ 6g + Copper Oxychloride @ 500g in 200L water' },
          { pest: 'Brown Plant Hopper (BPH)', symptom: 'Hopper burn circular patches', management: 'Spray Pymetrozine 50% WDG @ 120g/acre targeting stem base' },
          { pest: 'Sheath Blight (Rhizoctonia solani)', symptom: 'Serpentine greenish-gray lesions on leaf sheath', management: 'Spray Hexaconazole 5% EC @ 400ml/acre' }
        ],
        advisory: 'Adopt Direct Seeded Rice (DSR) or short-duration varieties like PR 126 to curb Punjab groundwater depletion and reduce stubble burning window pressure.'
      },
      {
        id: 'punjab_cotton',
        cropName: 'Cotton',
        nativeName: 'ਨਰਮਾ (Bt Cotton)',
        season: 'Kharif (Apr - Nov)',
        sowingWindow: 'April 15 - May 15',
        soilType: 'Deep Alluvial / Sandy Loam with good drainage',
        waterRequirementMm: '650 - 750 mm',
        yieldPotential: '9 - 13 Quintals / Acre',
        recommendedVarieties: ['RCH 773 BGII', 'Bhakti BGII', 'Ankur 3028', 'PAU Bt 1'],
        stages: [
          { name: 'Germination & Seedling', days: '0-25 DAS', waterNeed: 'Moderate (40 mm)', notes: 'Thinning to single plant per hill; pre-emergence weed control.' },
          { name: 'Square Formation', days: '40-60 DAS', waterNeed: 'High (60 mm)', notes: 'Monitor for sucking pests (Whitefly, Thrips, Jassids).' },
          { name: 'Flowering & Boll Setting', days: '60-100 DAS', waterNeed: 'Critical (80 mm)', notes: 'Install pheromone traps for Pink Bollworm.' },
          { name: 'Boll Development & Bursting', days: '100-140 DAS', waterNeed: 'Moderate (50 mm)', notes: 'Avoid excessive nitrogen to prevent vegetative overshoot.' }
        ],
        commonRisks: [
          { pest: 'Whitefly (Bemisia tabaci)', symptom: 'Yellow mosaic transmission, sootymold on leaves', management: 'Spray Pyriproxyfen 10% EC @ 500ml/acre or Afidopyropen 50g/L' },
          { pest: 'Pink Bollworm (Pectinophora gossypiella)', symptom: 'Rosetted flowers, double seeds inside bolls', management: 'Spray Emamectin Benzoate 5% SG @ 100g/acre or Chlorpyrifos 20% EC' },
          { pest: 'Cotton Leaf Curl Virus (CLCuV)', symptom: 'Upward leaf curling, thickening of veins, enation', management: 'Strictly control whitefly vectors and sow resistant hybrids' }
        ],
        advisory: 'In Bathinda, Mansa and Muktsar belt, regular weekly surveillance of pheromone traps is mandatory for early PBW intervention.'
      },
      {
        id: 'punjab_maize',
        cropName: 'Maize',
        nativeName: 'ਮੱਕੀ (Kharif/Spring Maize)',
        season: 'Kharif & Spring',
        sowingWindow: 'June 10 - June 30 (Kharif), Feb 1 - Feb 20 (Spring)',
        soilType: 'Well-drained Alluvial Loam rich in organic matter',
        waterRequirementMm: '450 - 550 mm',
        yieldPotential: '24 - 30 Quintals / Acre',
        recommendedVarieties: ['PMH 1', 'PMH 13', 'DKC 9108', 'Pioneer P3396'],
        stages: [
          { name: 'Seedling & Early Growth', days: '0-20 DAS', waterNeed: 'Moderate (35 mm)', notes: 'Scout for Fall Armyworm whorl damage.' },
          { name: 'Knee-High Stage', days: '25-40 DAS', waterNeed: 'Moderate (50 mm)', notes: 'Side-dress Urea and earthing up.' },
          { name: 'Tasseling & Silking', days: '45-65 DAS', waterNeed: 'Critical (70 mm)', notes: 'Moisture stress during silking causes poor kernel setting.' },
          { name: 'Grain Filling & Maturity', days: '65-95 DAS', waterNeed: 'Moderate (55 mm)', notes: 'Maintain adequate moisture until black layer formation.' }
        ],
        commonRisks: [
          { pest: 'Fall Armyworm (Spodoptera frugiperda)', symptom: 'Window paning in whorls, large holes, sawdust frass', management: 'Whorl application of Chlorantraniliprole 18.5% SC @ 0.4ml/L or Emamectin Benzoate' },
          { pest: 'Banded Leaf and Sheath Blight', symptom: 'Concentric bleached bands on sheath', management: 'Spray Validamycin 3% L @ 2.5ml/L or Azoxystrobin @ 1ml/L' }
        ],
        advisory: 'Excellent crop diversification substitute for paddy in Punjab under the state Crop Diversification Mission.'
      },
      {
        id: 'punjab_mustard',
        cropName: 'Mustard',
        nativeName: 'ਸਰ੍ਹੋਂ (Raya / Sarson)',
        season: 'Rabi (Oct - Mar)',
        sowingWindow: 'October 1 - October 20',
        soilType: 'Light to Medium Loam with moderate salinity tolerance',
        waterRequirementMm: '200 - 280 mm',
        yieldPotential: '8 - 11 Quintals / Acre',
        recommendedVarieties: ['Giriraj', 'RLC 3', 'PBR 357', 'RH 749'],
        stages: [
          { name: 'Seedling & Rosette', days: '0-30 DAS', waterNeed: 'Low (30 mm)', notes: 'First irrigation at 28-35 DAS; thinning.' },
          { name: 'Flowering & Pod Formation', days: '40-75 DAS', waterNeed: 'Critical (50 mm)', notes: 'Monitor for Mustard Aphid colonies on inflorescence.' },
          { name: 'Seed Development', days: '75-110 DAS', waterNeed: 'Moderate (40 mm)', notes: 'Avoid heavy irrigation during frost warnings.' }
        ],
        commonRisks: [
          { pest: 'Mustard Aphid (Lipaphis erysimi)', symptom: 'Clusters of greenish aphids curling pods and twigs', management: 'Spray Dimethoate 30% EC @ 250ml/acre or Thiamethoxam 25% WG' },
          { pest: 'White Rust (Albugo candida)', symptom: 'White pustules on lower leaf surface, staghead malformation', management: 'Spray Metalaxyl + Mancozeb (Ridomil MZ) @ 2g/L' }
        ],
        advisory: 'Low water requirement makes mustard ideal for South-Western districts of Punjab facing declining water tables.'
      },
      {
        id: 'punjab_potato',
        cropName: 'Potato',
        nativeName: 'ਆਲੂ (Autumn Potato)',
        season: 'Rabi (Oct - Feb)',
        sowingWindow: 'October 1 - October 15',
        soilType: 'Sandy Loam rich in organic matter (Jalandhar / Hoshiarpur belt)',
        waterRequirementMm: '350 - 450 mm',
        yieldPotential: '120 - 150 Quintals / Acre',
        recommendedVarieties: ['Kufri Pukhraj', 'Kufri Jyoti', 'Kufri Chipsona 1', 'Kufri Surya'],
        stages: [
          { name: 'Sprouting & Emergence', days: '0-20 DAP', waterNeed: 'Moderate (40 mm)', notes: 'Light pre-emergence irrigation.' },
          { name: 'Stolonization & Tuber Initiation', days: '25-45 DAP', waterNeed: 'Critical (60 mm)', notes: 'Earthing up, N top-dressing, avoid water stress.' },
          { name: 'Tuber Bulking', days: '45-80 DAP', waterNeed: 'High (65 mm)', notes: 'Maintain 70-80% field capacity; scout for Late Blight.' },
          { name: 'Maturity & Dehaulming', days: '80-100 DAP', waterNeed: 'Low', notes: 'Cut foliage 10-12 days prior to harvest for skin hardening.' }
        ],
        commonRisks: [
          { pest: 'Late Blight (Phytophthora infestans)', symptom: 'Water-soaked black lesions on leaves with white cottony mold underneath', management: 'Prophylactic spray of Mancozeb 75% WP @ 2.5g/L; Curative: Cymoxanil + Mancozeb (Curzate) @ 3g/L' },
          { pest: 'Early Blight (Alternaria solani)', symptom: 'Target board concentric dark spots', management: 'Spray Chlorothalonil @ 2g/L' }
        ],
        advisory: 'Punjab is the national hub for seed potato production (Kufri Jyoti & Pukhraj) with advanced aeroponics in Doaba region.'
      }
    ]
  },
  Maharashtra: {
    stateName: 'Maharashtra',
    nativeName: 'महाराष्ट्र',
    districts: ['Yavatmal', 'Nagpur', 'Amravati', 'Aurangabad', 'Nashik', 'Kolhapur', 'Akola'],
    defaultSoil: 'Black Cotton',
    climateZone: 'Tropical Wet and Dry (Deccan Plateau)',
    crops: [
      {
        id: 'mh_cotton',
        cropName: 'Cotton',
        nativeName: 'कापूस (Bt Cotton)',
        season: 'Kharif (Jun - Jan)',
        sowingWindow: 'June 15 - July 5 (With onset of Monsoon)',
        soilType: 'Deep Black Cotton Soil (Regur)',
        waterRequirementMm: '600 - 750 mm',
        yieldPotential: '8 - 12 Quintals / Acre',
        recommendedVarieties: ['Ajeet 155', 'Rasi 659 BGII', 'Mallika BGII', 'Kaveri Jadoo'],
        stages: [
          { name: 'Vegetative Growth', days: '0-45 DAS', waterNeed: 'Moderate (45 mm)', notes: 'Interculture operations to preserve soil moisture.' },
          { name: 'Square & Flowering', days: '45-80 DAS', waterNeed: 'Critical (75 mm)', notes: 'Install delta sticky traps and PBW lures.' },
          { name: 'Boll Development', days: '80-120 DAS', waterNeed: 'High (70 mm)', notes: 'Foliar spray of 19:19:19 and micronutrients.' },
          { name: 'Bursting & Picking', days: '120-160 DAS', waterNeed: 'Low', notes: 'First picking when 50% bolls burst cleanly.' }
        ],
        commonRisks: [
          { pest: 'Pink Bollworm (PBW)', symptom: 'Rosette flowers, exit holes in bolls, stained lint', management: 'Apply Profenofos 50% EC @ 400ml/acre or Emamectin Benzoate 5% SG' },
          { pest: 'Sucking Pest Complex (Thrips & Jassids)', symptom: 'Downward cupping, bronzing, hopper burn', management: 'Spray Flonicamid 50% WG @ 80g/acre or Diafenthiuron 50% WP' }
        ],
        advisory: 'Vidarbha and Marathwada cotton farmers should maintain farm ponds (Shet Tale) for life-saving protective irrigation during prolonged dry spells.'
      },
      {
        id: 'mh_soybean',
        cropName: 'Soybean',
        nativeName: 'सोयाबीन (Soybean)',
        season: 'Kharif (Jun - Oct)',
        sowingWindow: 'June 20 - July 10',
        soilType: 'Medium to Deep Black Soil with neutral pH',
        waterRequirementMm: '450 - 550 mm',
        yieldPotential: '10 - 14 Quintals / Acre',
        recommendedVarieties: ['JS 335', 'JS 9305', 'JS 9560', 'KDS 726 (Phule Sangam)', 'MAUS 71'],
        stages: [
          { name: 'Germination & Emergence', days: '0-15 DAS', waterNeed: 'Moderate (35 mm)', notes: 'Ensure 75-100 mm rainfall before sowing; seed treatment with Rhizobium.' },
          { name: 'Vegetative Branching', days: '15-35 DAS', waterNeed: 'Moderate (45 mm)', notes: 'Weed management critical within 20-30 DAS.' },
          { name: 'Flowering', days: '35-55 DAS', waterNeed: 'Critical (65 mm)', notes: 'Critical water stage; stress causes floral drop.' },
          { name: 'Pod Filling & Development', days: '55-80 DAS', waterNeed: 'Critical (70 mm)', notes: 'Spray 00:52:34 @ 10g/L + Boron @ 1g/L for seed boldness.' }
        ],
        commonRisks: [
          { pest: 'Girdle Beetle (Obereopsis brevis)', symptom: 'Ring cut on stem and petiole, withering of leaves', management: 'Spray Chlorantraniliprole 18.5% SC @ 60ml/acre' },
          { pest: 'Spodoptera Defoliator', symptom: 'Skeletonized leaves', management: 'Spray Novaluron 10% EC @ 300ml/acre' },
          { pest: 'Yellow Mosaic Virus (YMV)', symptom: 'Irregular yellow and green patches on leaves', management: 'Vector control (Whitefly) using Thiamethoxam 25% WG' }
        ],
        advisory: 'Phule Sangam (KDS 726) has demonstrated superior rust resistance and heavy branching potential across Western Maharashtra and Vidarbha.'
      },
      {
        id: 'mh_sugarcane',
        cropName: 'Sugarcane',
        nativeName: 'ऊस (Sugarcane / Adsali / Pre-Seasonal)',
        season: 'Annual / Perennial',
        sowingWindow: 'July - August (Adsali), Oct - Nov (Pre-seasonal), Jan - Feb (Suru)',
        soilType: 'Deep Well-drained Black Soil with high clay loam content',
        waterRequirementMm: '1800 - 2200 mm',
        yieldPotential: '45 - 65 Tonnes / Acre (Suru), 80-100 Tonnes / Acre (Adsali)',
        recommendedVarieties: ['Co 86032 (Nira)', 'CoM 0265 (Phule 265)', 'Co 09057', 'VSI 08005'],
        stages: [
          { name: 'Germination Phase', days: '0-45 DAP', waterNeed: 'High (100 mm)', notes: 'Frequent light irrigations; two-bud setts treatment.' },
          { name: 'Formative / Tillering', days: '45-120 DAP', waterNeed: 'High (150 mm)', notes: 'Earthing up at 90 days; urea splitting.' },
          { name: 'Grand Growth Phase', days: '120-270 DAP', waterNeed: 'Critical (250 mm)', notes: 'Maximum water demand; trash mulching between rows.' },
          { name: 'Ripening & Maturation', days: '270-360 DAP', waterNeed: 'Moderate (80 mm)', notes: 'Withhold water 20 days prior to harvest to concentrate Brix.' }
        ],
        commonRisks: [
          { pest: 'Early Shoot Borer (Chilo infuscatellus)', symptom: 'Dead hearts in young shoots with offensive odor', management: 'Soil application of Fipronil 0.3% G @ 10kg/acre or Chlorantraniliprole drenching' },
          { pest: 'White Grub (Holotrichia serrata)', symptom: 'Roots eaten away, lodging, yellowing and drying', management: 'Metarhizium anisopliae @ 2kg/acre or Chlorpyrifos 20% EC drenching' },
          { pest: 'Red Rot (Colletotrichum falcatum)', symptom: 'Third or fourth leaf drying, red internal pith with white cross bands', management: 'Sett treatment with Carbendazim 50% WP @ 1g/L and crop rotation' }
        ],
        advisory: 'Adoption of Drip Irrigation (Subsurface or Inline) reduces water usage by 40-50% while increasing cane yield by 20-30% in Kolhapur, Pune, and Ahmednagar sugar belts.'
      },
      {
        id: 'mh_wheat',
        cropName: 'Wheat',
        nativeName: 'गहू (Wheat - Sharbati / Durum)',
        season: 'Rabi (Nov - Mar)',
        sowingWindow: 'November 1 - November 20',
        soilType: 'Medium to Heavy Black Cotton Soil',
        waterRequirementMm: '300 - 400 mm',
        yieldPotential: '16 - 20 Quintals / Acre',
        recommendedVarieties: ['MACS 6222', 'MACS 6478', 'NIAW 301 (Trimbak)', 'Phule Samadhan (NIAW 1994)', 'GW 322'],
        stages: [
          { name: 'CRI Stage', days: '18-22 DAS', waterNeed: 'Critical (50 mm)', notes: 'Mandatory first irrigation.' },
          { name: 'Tillering & Jointing', days: '35-55 DAS', waterNeed: 'Moderate (50 mm)', notes: 'Second and third irrigation.' },
          { name: 'Flowering & Grain Filling', days: '65-85 DAS', waterNeed: 'High (60 mm)', notes: 'Protect against sudden temperature rises.' }
        ],
        commonRisks: [
          { pest: 'Stem & Leaf Rust (Puccinia graminis)', symptom: 'Reddish-brown elongated pustules on stem and leaves', management: 'Spray Tebuconazole 25.9% EC @ 1ml/L' },
          { pest: 'Termites & Shoot Fly', symptom: 'Drying of seedlings at ground level', management: 'Chlorpyrifos seed treatment @ 4ml/kg' }
        ],
        advisory: 'Under limited water conditions in Maharashtra, MACS 6478 requires only 3-4 irrigations while maintaining high grain protein.'
      },
      {
        id: 'mh_gram',
        cropName: 'Gram (Chana / Chickpea)',
        nativeName: 'हरभरा (Chickpea / Chana)',
        season: 'Rabi (Oct - Feb)',
        sowingWindow: 'October 15 - November 10',
        soilType: 'Well-drained Medium to Heavy Black Soil',
        waterRequirementMm: '200 - 300 mm',
        yieldPotential: '9 - 13 Quintals / Acre',
        recommendedVarieties: ['Digvijay', 'Phule Vikram', 'Vijay', 'JAKI 9218', 'Vishwaraj'],
        stages: [
          { name: 'Seedling & Branching', days: '0-30 DAS', waterNeed: 'Low (30 mm)', notes: 'Nipping of terminal buds at 30 DAS to induce lateral branching.' },
          { name: 'Pre-Flowering', days: '40-50 DAS', waterNeed: 'Moderate (40 mm)', notes: 'Do NOT irrigate during peak flowering (causes flower drop).' },
          { name: 'Pod Development', days: '65-85 DAS', waterNeed: 'Critical (45 mm)', notes: 'Install bird perches @ 15-20/acre for Helicoverpa control.' }
        ],
        commonRisks: [
          { pest: 'Pod Borer (Helicoverpa armigera)', symptom: 'Round holes in pods with caterpillar feeding with head inside', management: 'Spray Chlorantraniliprole 18.5% SC @ 60ml/acre or Emamectin Benzoate 5% SG' },
          { pest: 'Fusarium Wilt (Fusarium oxysporum f. sp. ciceris)', symptom: 'Drooping of leaves, dark brown discoloration of xylem vessels', management: 'Seed treatment with Trichoderma viride @ 5g/kg + Carboxin' }
        ],
        advisory: 'Phule Vikram is specially bred for mechanized combine harvesting with high pod clearance above the ground.'
      },
      {
        id: 'mh_onion',
        cropName: 'Onion',
        nativeName: 'कांदा (Kharif / Rangda / Late Rabi Onion)',
        season: 'Tri-Season (Kharif, Rangda, Rabi)',
        sowingWindow: 'Rabi Nursery: Oct-Nov, Transplanting: Dec-Jan (Nashik belt)',
        soilType: 'Friable Sandy Loam to Clay Loam with pH 6.5 - 7.5',
        waterRequirementMm: '400 - 550 mm',
        yieldPotential: '100 - 140 Quintals / Acre',
        recommendedVarieties: ['Bhima Super', 'Bhima Shakti', 'Phule Samarth', 'Agri Found Light Red (ALR)'],
        stages: [
          { name: 'Nursery & Establishment', days: '0-45 DAS', waterNeed: 'Frequent light (35 mm)', notes: 'Treat seedlings with Carbendazim before transplanting.' },
          { name: 'Vegetative Canopy', days: '45-80 DAP', waterNeed: 'Moderate (50 mm)', notes: 'Sulphur application @ 15 kg/acre for pungency and storage life.' },
          { name: 'Bulb Initiation & Development', days: '80-120 DAP', waterNeed: 'High (60 mm)', notes: 'Micro-sprinkler or drip irrigation prevents bulb cracking.' },
          { name: 'Neck Fall & Curing', days: '120-140 DAP', waterNeed: 'None', notes: 'Stop irrigation when 50% tops fall down; field cure for 3-5 days.' }
        ],
        commonRisks: [
          { pest: 'Onion Thrips (Thrips tabaci)', symptom: 'Silver patches on leaves, distortion and drying of tips', management: 'Spray Fipronil 5% SC @ 1.5ml/L or Spinetoram 11.7% SC' },
          { pest: 'Purple Blotch (Alternaria porri)', symptom: 'Purplish-brown sunken spots with yellow halo', management: 'Spray Tebuconazole + Trifloxystrobin (Nativo) @ 0.7g/L' }
        ],
        advisory: 'Nashik and Dindori belt farmers utilize ventilated chawls with proper humidity control to store Rabi onion for up to 6 months.'
      }
    ]
  }
};
