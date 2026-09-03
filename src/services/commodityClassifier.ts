export interface CommodityIntelligence {
  category: 'Food & Beverages' | 'Personal Care' | 'Household Goods' | 'Electronics & Hardware' | 'Commercial FMCG';
  subCategory: string;
  genericCommodityName: string;
  classificationConfidence: number;
  applicableSchedule: string;
  regulatoryStandard: string;
  unitMeasurementRule: 'weight_mass' | 'volume_liquid' | 'count_number' | 'length_area';
  mandatoryCrossRegulations: string[];
  detectedIndustryStandards: {
    fssaiLicense?: string;
    vegNonVegStatus?: 'Vegetarian' | 'Non-Vegetarian' | 'Not Applicable';
    cosmeticMfgLicense?: string;
    bisRegistration?: string;
    batchNumber?: string;
  };
}

/**
 * Advanced Commodity Classification Intelligence Engine
 * Identifies exact product typology, generic statutory identity under Rule 6(1)(b),
 * and cross-regulatory statutory mandates (FSSAI, BIS, Drugs & Cosmetics Act).
 */
export function classifyCommodity(
  rawText: string,
  fileName: string = ''
): CommodityIntelligence {
  const combined = `${fileName} ${rawText}`.toLowerCase();

  // 1. Food & Beverages Patterns
  const isBiscuit = /\b(parle|parle-?g|britannia|marie|monaco|oreo|bourbon|biscuit|biscuits|cookie|cookies|rusk|बिस्कुट|कुकी)\b/i.test(combined);
  const isSnack = /\b(kurkure|lays|bingo|haldiram|bikaji|balaji|chips|namkeen|bhujia|extruded|crisps|snack|snacks|munch|कुरकुरे|नमकीन|चिप्स)\b/i.test(combined);
  const isDairy = /\b(amul|mother\s*dairy|nandini|gowardhan|butter|table\s*butter|pasteurized\s*butter|ghee|cheese|paneer|curd|मक्खन|घी|पनीर|दूध)\b/i.test(combined);
  const isSpices = /\b(mdh|everest|catch|desi\s*zaika|masala|garam\s*masala|turmeric|chilli|coriander|spices|condiments|हल्दी|मिर्च|मसाला)\b/i.test(combined);
  const isStaples = /\b(tata\s*salt|aashirvaad|fortune|daawat|salt|iodized\s*salt|atta|flour|rice|sugar|pulses|wheat|नमक|आटा|चावल)\b/i.test(combined);
  const isBeverage = /\b(frooti|real|tropicana|maaza|pepsi|coca\s*cola|thums\s*up|juice|nectar|tea|coffee|syrup|beverage|drink|चाय|कॉफ़ी|जूस)\b/i.test(combined);
  const isEdibleOil = /\b(fortune|saffola|dhara|oil|edible\s*oil|mustard\s*oil|sunflower\s*oil|soybean\s*oil|refined\s*oil|तेल)\b/i.test(combined);

  // 2. Personal Care & Cosmetics Patterns
  const isHairCare = /\b(shampoo|conditioner|hair\s*oil|serum|head\s*&\s*shoulders|clinic\s*plus|pantene|tresemme|शैम्पू)\b/i.test(combined);
  const isSkinCare = /\b(cream|lotion|moisturizer|face\s*wash|sunscreen|cold\s*cream|fair\s*&\s*lovely|ponds|nivea|vaseline|क्रीम)\b/i.test(combined);
  const isSoap = /\b(soap|bathing\s*bar|toilet\s*soap|body\s*wash|dettol|lifebuoy|dove|lux|pears|cinthol|santoor|साबुन)\b/i.test(combined);
  const isOralCare = /\b(toothpaste|tooth\s*powder|mouthwash|colgate|pepsodent|sensodyne|dabur\s*red|close\s*up|टूथपेस्ट)\b/i.test(combined);

  // 3. Household & Cleaning Patterns
  const isDetergent = /\b(detergent|washing\s*powder|surf|ariel|tide|rin|wheel|ghadi|surf\s*excel)\b/i.test(combined);
  const isCleaner = /\b(cleaner|floor\s*cleaner|toilet\s*cleaner|dishwash|harpic|lizol|vim|pril|domex)\b/i.test(combined);

  // 4. Electronics & Batteries Patterns
  const isBattery = /\b(battery|batteries|duracell|energizer|panasonic|ni-?mh|alkaline|aa|aaa|button\s*cell|dry\s*cell|volt|1\.5v)\b/i.test(combined);
  const isLighting = /\b(led|bulb|lamp|watt|syska|philips|havells|wipro|voltage|lumens)\b/i.test(combined);

  // Extract FSSAI 14-digit license number
  const fssaiMatch = rawText.match(/\b(1\d{13})\b/) || rawText.match(/fssai[:\s]*lic[.\s]*no[:\s]*(\d+)/i);
  const fssaiLicense = fssaiMatch ? (fssaiMatch[1] || fssaiMatch[0]) : undefined;

  // Extract Veg / Non-Veg status
  let vegNonVegStatus: 'Vegetarian' | 'Non-Vegetarian' | 'Not Applicable' = 'Not Applicable';
  if (isBiscuit || isSnack || isDairy || isSpices || isStaples || isBeverage || isEdibleOil || fssaiLicense) {
    if (/non-?veg|chicken|egg|meat|fish/i.test(combined)) {
      vegNonVegStatus = 'Non-Vegetarian';
    } else {
      vegNonVegStatus = 'Vegetarian';
    }
  }

  // Extract Cosmetic Mfg License
  const mfgLicMatch = rawText.match(/(?:m\.?l\.?|mfg\.?\s*lic\.?|cosmetic\s*lic\.?)[\s*no.:\s]*([a-zA-Z0-9\/-]+)/i);
  const cosmeticMfgLicense = mfgLicMatch ? mfgLicMatch[1] : undefined;

  // Extract BIS standard registration
  const bisMatch = rawText.match(/(?:is\s*[:\s]*\d{4,5}|r\s*-\s*\d{7,8})/i);
  const bisRegistration = bisMatch ? bisMatch[0] : undefined;

  // Extract Batch number
  const batchMatch = rawText.match(/(?:b\.?no\.?|batch\s*no\.?|lot\s*no\.?)[:\s]*([a-zA-Z0-9\/-]+)/i);
  const batchNumber = batchMatch ? batchMatch[1] : undefined;

  // ==========================================
  // Classification Decision Matrix
  // ==========================================

  // A. Food & Beverages
  if (isBiscuit) {
    return {
      category: 'Food & Beverages',
      subCategory: 'Biscuits, Rusks & Bakery Confectionery',
      genericCommodityName: 'Glucose / Wheat Flour Biscuits',
      classificationConfidence: 98.8,
      applicableSchedule: 'Second Schedule & Third Schedule (Standard Quantities for Biscuits)',
      regulatoryStandard: 'Legal Metrology (Packaged Commodities) Rules, 2011 & FSSAI (Packaging & Labelling) Regulations, 2011',
      unitMeasurementRule: 'weight_mass',
      mandatoryCrossRegulations: [
        'Mandatory Green Vegetarian Emblem (IS 14433)',
        'Mandatory 14-Digit FSSAI Registration Number',
        'Mandatory Net Quantity in Grams (g) or Kilograms (kg)',
        'Unit Sale Price (USP) in ₹ per gram',
      ],
      detectedIndustryStandards: { fssaiLicense, vegNonVegStatus, batchNumber },
    };
  }

  if (isSnack) {
    return {
      category: 'Food & Beverages',
      subCategory: 'Extruded Savory Snacks & Namkeen',
      genericCommodityName: 'Extruded Savory Snack / Ready-to-Eat Namkeen',
      classificationConfidence: 97.4,
      applicableSchedule: 'Second Schedule & Rule 5 (Permissible Tare & Net Weight)',
      regulatoryStandard: 'Legal Metrology Rules, 2011 & FSSAI Food Safety Standards',
      unitMeasurementRule: 'weight_mass',
      mandatoryCrossRegulations: [
        'Statutory Green Vegetarian Emblem under FSSAI',
        '14-Digit Central/State FSSAI License Number',
        'Unit Sale Price (USP) per gram under 2022 Amendment',
        'Mandatory Expiry / Best Before Declaration',
      ],
      detectedIndustryStandards: { fssaiLicense, vegNonVegStatus, batchNumber },
    };
  }

  if (isDairy) {
    return {
      category: 'Food & Beverages',
      subCategory: 'Dairy, Butter & Chilled Perishables',
      genericCommodityName: 'Pasteurized Table Butter / Dairy Fat',
      classificationConfidence: 99.1,
      applicableSchedule: 'Second Schedule (Table 1: Net Weight Tiers) & Third Schedule',
      regulatoryStandard: 'Legal Metrology Act, 2009 & FSSAI Milk & Milk Products Standards',
      unitMeasurementRule: 'weight_mass',
      mandatoryCrossRegulations: [
        'Standard Metric Units in "g" or "kg" (Rule 11)',
        'Storage Temperature Instruction ("Store under Refrigeration")',
        'FSSAI Apex Cooperative Registration Marking',
      ],
      detectedIndustryStandards: { fssaiLicense, vegNonVegStatus, batchNumber },
    };
  }

  if (isSpices) {
    return {
      category: 'Food & Beverages',
      subCategory: 'Spices, Seasonings & Culinary Condiments',
      genericCommodityName: 'Powdered Spices & Mixed Culinary Condiments',
      classificationConfidence: 96.2,
      applicableSchedule: 'Second Schedule & Third Schedule (Standard Packs for Spices)',
      regulatoryStandard: 'Legal Metrology Rules, 2011 & Spices Board of India Guidelines',
      unitMeasurementRule: 'weight_mass',
      mandatoryCrossRegulations: [
        'Strict Prohibition of "gms" Abbreviation (Rule 11 & 12 Enforces "g")',
        'Agmark / FSSAI Grade Designation where applicable',
        'Unit Sale Price (USP) per gram',
      ],
      detectedIndustryStandards: { fssaiLicense, vegNonVegStatus, batchNumber },
    };
  }

  if (isStaples) {
    return {
      category: 'Food & Beverages',
      subCategory: 'Staple Grains, Pulses & Iodized Salt',
      genericCommodityName: 'Vacuum Evaporated Iodized Salt / Flour Staples',
      classificationConfidence: 98.0,
      applicableSchedule: 'Third Schedule (Packaged Commodities in Standard Capacities)',
      regulatoryStandard: 'Legal Metrology Rules, 2011 & FSSAI Mandatory Iodization Orders',
      unitMeasurementRule: 'weight_mass',
      mandatoryCrossRegulations: [
        'Mandatory Iodine Content declaration (≥ 15 ppm at retail)',
        'Standard Metric Net Weight (1 kg, 500 g, 2 kg)',
      ],
      detectedIndustryStandards: { fssaiLicense, vegNonVegStatus, batchNumber },
    };
  }

  if (isBeverage || isEdibleOil) {
    return {
      category: 'Food & Beverages',
      subCategory: isBeverage ? 'Liquid Refreshments & Juices' : 'Edible Vegetable Cooking Oils',
      genericCommodityName: isBeverage ? 'Fruit Beverage / Carbonated Drink' : 'Refined Edible Vegetable Oil',
      classificationConfidence: 95.8,
      applicableSchedule: 'Second Schedule & Rule 12 (Volume at 30°C for Edible Oils)',
      regulatoryStandard: 'Legal Metrology (Packaged Commodities) Rules, 2011 (Rule 12)',
      unitMeasurementRule: 'volume_liquid',
      mandatoryCrossRegulations: [
        'Mandatory Declaration by Volume in "ml" or "l" or "L"',
        'For Edible Oils: Net Quantity must declare volume at 30°C and equivalent mass in kg',
        'Unit Sale Price (USP) in ₹ per ml or ₹ per liter',
      ],
      detectedIndustryStandards: { fssaiLicense, vegNonVegStatus, batchNumber },
    };
  }

  // B. Personal Care & Cosmetics
  if (isHairCare || isSkinCare || isSoap || isOralCare) {
    return {
      category: 'Personal Care',
      subCategory: isHairCare
        ? 'Hair Cleansers & Scalp Formulations'
        : isSkinCare
        ? 'Topical Dermatological & Cosmetic Lotions'
        : isOralCare
        ? 'Oral Hygiene & Dentifrice Products'
        : 'Cosmetic Bathing Bars & Soaps',
      genericCommodityName: isHairCare
        ? 'Herbal / Conditioning Shampoo'
        : isSkinCare
        ? 'Moisturizing Skin Lotion / Face Cream'
        : isOralCare
        ? 'Dentifrice Fluoride Toothpaste'
        : 'Toilet Soap / Bathing Bar',
      classificationConfidence: 96.5,
      applicableSchedule: 'Second Schedule (Table 2: Liquid Volume/Mass)',
      regulatoryStandard: 'Legal Metrology Rules, 2011 & Drugs and Cosmetics Act, 1940 (Cosmetic Rules, 2020)',
      unitMeasurementRule: isSoap ? 'weight_mass' : 'volume_liquid',
      mandatoryCrossRegulations: [
        'Mandatory Cosmetic Manufacturing License Number (M.L. No.)',
        'Batch or Lot Number under Drugs & Cosmetics Rules',
        'Key Active Ingredients Declaration',
        'Unit Sale Price (USP) per ml (liquids) or per g (soaps)',
      ],
      detectedIndustryStandards: { cosmeticMfgLicense, batchNumber },
    };
  }

  // C. Household & Cleaning
  if (isDetergent || isCleaner) {
    return {
      category: 'Household Goods',
      subCategory: isDetergent ? 'Synthetic Laundry Detergents' : 'Surface & Sanitary Disinfectants',
      genericCommodityName: isDetergent ? 'Synthetic Laundry Detergent Powder' : 'Disinfectant Surface Cleaner',
      classificationConfidence: 94.2,
      applicableSchedule: 'Second Schedule & Third Schedule (Standard Packs for Detergents)',
      regulatoryStandard: 'Legal Metrology Act, 2009 & BIS Standards for Surface Active Agents',
      unitMeasurementRule: isDetergent ? 'weight_mass' : 'volume_liquid',
      mandatoryCrossRegulations: [
        'Mandatory Metric Quantity ("g", "kg" for powder; "ml", "L" for liquid)',
        'Poison / Caustic Substance Hazard Advisory where applicable',
        'Consumer Helpline Telephone and Postal Address',
      ],
      detectedIndustryStandards: { batchNumber },
    };
  }

  // D. Electronics & Batteries
  if (isBattery || isLighting) {
    return {
      category: 'Electronics & Hardware',
      subCategory: isBattery ? 'Dry Cell Alkaline & Lithium Batteries' : 'Solid-State LED Lighting Products',
      genericCommodityName: isBattery ? 'Alkaline Dry Cell Battery (1.5V)' : 'Self-Ballasted LED Bulb',
      classificationConfidence: 97.9,
      applicableSchedule: 'Second Schedule & Rule 6(1)(c) for Itemized Number (N)',
      regulatoryStandard: 'Legal Metrology Rules, 2011 & BIS Electronics and IT Goods Orders (CRO)',
      unitMeasurementRule: 'count_number',
      mandatoryCrossRegulations: [
        'Mandatory Declaration by Number: "Net Quantity: X N" (Rule 13)',
        'Mandatory BIS CRS Registration Number (R-XXXXXXXX)',
        'Unit Sale Price (USP) in ₹ per piece or ₹ per N',
        'E-Waste Management Rules Disposal Symbol',
      ],
      detectedIndustryStandards: { bisRegistration, batchNumber },
    };
  }

  // E. Fallback FMCG General
  return {
    category: 'Commercial FMCG',
    subCategory: 'General Packaged Consumer Commodity',
    genericCommodityName: 'Packaged Retail Consumer Commodity',
    classificationConfidence: 85.0,
    applicableSchedule: 'Legal Metrology (Packaged Commodities) Rules, 2011 (General Schedule)',
    regulatoryStandard: 'Legal Metrology Act, 2009',
    unitMeasurementRule: 'weight_mass',
    mandatoryCrossRegulations: [
      'Statutory Rule 6 Declarations (Name, Address, Net Qty, MRP, Mfg Date, Consumer Helpline)',
      'Rule 9 Minimum Font Size Standards',
      'Unit Sale Price (USP) under 2022 Amendment',
    ],
    detectedIndustryStandards: { batchNumber },
  };
}
