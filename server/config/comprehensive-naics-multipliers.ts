// Comprehensive NAICS 6-digit multiplier database based on U.S. private company valuation data
// Source: EBITDA Multiples by 6-Digit NAICS Code (U.S. Private Companies)

export interface ComprehensiveNAICSMultiplier {
  code: string;
  label: string;
  sectorCode: string;
  minMultiplier: number;
  maxMultiplier: number;
  avgMultiplier: number;
}

export const comprehensiveNAICSMultipliers: ComprehensiveNAICSMultiplier[] = [
  // NAICS 11: Agriculture, Forestry, Fishing and Hunting
  { code: "111110", label: "Soybean Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111120", label: "Oilseed (except Soybean) Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111130", label: "Dry Pea and Bean Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111140", label: "Wheat Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111150", label: "Corn Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111160", label: "Rice Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111191", label: "Oilseed and Grain Combination Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111199", label: "All Other Grain Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111211", label: "Potato Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111219", label: "Other Vegetable & Melon Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111310", label: "Orange Groves", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111320", label: "Citrus (except Orange) Groves", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111331", label: "Apple Orchards", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111332", label: "Grape Vineyards", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111333", label: "Strawberry Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111334", label: "Berry (except Strawberry) Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111335", label: "Tree Nut Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111336", label: "Fruit & Tree Nut Combination Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111339", label: "Other Noncitrus Fruit Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111411", label: "Mushroom Production", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111419", label: "Other Food Crops Grown Under Cover", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111421", label: "Nursery and Tree Production", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111422", label: "Floriculture Production", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111910", label: "Tobacco Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111920", label: "Cotton Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111930", label: "Sugarcane Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111940", label: "Hay Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111991", label: "Sugar Beet Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111992", label: "Peanut Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111998", label: "All Other Misc. Crop Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112111", label: "Beef Cattle Ranching & Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112112", label: "Cattle Feedlots", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112120", label: "Dairy Cattle and Milk Production", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112130", label: "Dual-Purpose Cattle Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112210", label: "Hog and Pig Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112310", label: "Chicken Egg Production", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112320", label: "Broilers and Other Meat Chicken Production", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112330", label: "Turkey Production", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112340", label: "Poultry Hatcheries", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112390", label: "Other Poultry Production", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112410", label: "Sheep Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112420", label: "Goat Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112511", label: "Finfish Farming and Fish Hatcheries", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112512", label: "Shellfish Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112519", label: "Other Aquaculture", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112910", label: "Apiculture (Beekeeping)", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112920", label: "Horses and Other Equine Production", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112930", label: "Fur-Bearing Animal and Rabbit Production", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112990", label: "All Other Animal Production", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "113110", label: "Timber Tract Operations", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "113210", label: "Forest Nurseries and Gathering Forest Products", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "113310", label: "Logging", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "114111", label: "Finfish Fishing", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "114112", label: "Shellfish Fishing", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "114119", label: "Other Marine Fishing", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "114210", label: "Hunting and Trapping", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "115111", label: "Cotton Ginning", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "115112", label: "Soil Preparation, Planting, Cultivating", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "115113", label: "Crop Harvesting, Primarily by Machine", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "115114", label: "Postharvest Crop Activities (exc. Cotton Ginning)", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "115115", label: "Farm Labor Contractors and Crew Leaders", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "115116", label: "Farm Management Services", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "115210", label: "Support Activities for Animal Production", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "115310", label: "Support Activities for Forestry", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },

  // NAICS 21: Mining, Quarrying, and Oil & Gas Extraction
  { code: "211120", label: "Crude Petroleum Extraction", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "211130", label: "Natural Gas Extraction", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "212114", label: "Surface Coal Mining", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "212115", label: "Underground Coal Mining", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "212210", label: "Iron Ore Mining", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "212220", label: "Gold & Silver Ore Mining", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "212230", label: "Copper, Nickel, Lead & Zinc Mining", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "212290", label: "Other Metal Ore Mining", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "212311", label: "Dimension Stone Mining & Quarrying", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "212312", label: "Crushed & Broken Limestone Mining", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "212313", label: "Crushed & Broken Granite Mining", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "212319", label: "Other Crushed & Broken Stone Mining", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "212321", label: "Construction Sand & Gravel Mining", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "212322", label: "Industrial Sand Mining", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "212323", label: "Kaolin, Clay, Refractory Minerals Mining", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "212390", label: "Other Nonmetallic Mineral Mining", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "213111", label: "Drilling Oil and Gas Wells (Support)", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "213112", label: "Support Activities for Oil & Gas Operations", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "213113", label: "Support Activities for Coal Mining", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "213114", label: "Support Activities for Metal Mining", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "213115", label: "Support Activities for Nonmetallic Mining", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },

  // NAICS 22: Utilities
  { code: "221111", label: "Hydroelectric Power Generation", sectorCode: "22", minMultiplier: 7.0, avgMultiplier: 9.0, maxMultiplier: 10.0 },
  { code: "221112", label: "Fossil Fuel Electric Power Generation", sectorCode: "22", minMultiplier: 7.0, avgMultiplier: 9.0, maxMultiplier: 10.0 },
  { code: "221113", label: "Nuclear Electric Power Generation", sectorCode: "22", minMultiplier: 7.0, avgMultiplier: 9.0, maxMultiplier: 10.0 },
  { code: "221114", label: "Solar Electric Power Generation", sectorCode: "22", minMultiplier: 7.0, avgMultiplier: 9.0, maxMultiplier: 10.0 },
  { code: "221115", label: "Wind Electric Power Generation", sectorCode: "22", minMultiplier: 7.0, avgMultiplier: 9.0, maxMultiplier: 10.0 },
  { code: "221116", label: "Geothermal Electric Power Generation", sectorCode: "22", minMultiplier: 7.0, avgMultiplier: 9.0, maxMultiplier: 10.0 },
  { code: "221117", label: "Biomass Electric Power Generation", sectorCode: "22", minMultiplier: 7.0, avgMultiplier: 9.0, maxMultiplier: 10.0 },
  { code: "221118", label: "Other Electric Power Generation", sectorCode: "22", minMultiplier: 7.0, avgMultiplier: 9.0, maxMultiplier: 10.0 },
  { code: "221121", label: "Electric Bulk Power Transmission & Control", sectorCode: "22", minMultiplier: 7.0, avgMultiplier: 9.0, maxMultiplier: 10.0 },
  { code: "221122", label: "Electric Power Distribution", sectorCode: "22", minMultiplier: 7.0, avgMultiplier: 9.0, maxMultiplier: 10.0 },
  { code: "221210", label: "Natural Gas Distribution", sectorCode: "22", minMultiplier: 7.0, avgMultiplier: 9.0, maxMultiplier: 10.0 },
  { code: "221310", label: "Water Supply and Irrigation Systems", sectorCode: "22", minMultiplier: 7.0, avgMultiplier: 9.0, maxMultiplier: 10.0 },
  { code: "221320", label: "Sewage Treatment Facilities", sectorCode: "22", minMultiplier: 7.0, avgMultiplier: 9.0, maxMultiplier: 10.0 },
  { code: "221330", label: "Steam and Air-Conditioning Supply", sectorCode: "22", minMultiplier: 7.0, avgMultiplier: 9.0, maxMultiplier: 10.0 },

  // NAICS 23: Construction  
  { code: "236115", label: "New Single-Family Housing Construction (non-Builder)", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "236116", label: "New Multifamily Housing Construction (non-Builder)", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "236117", label: "New Housing For-Sale Builders", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "236118", label: "Residential Remodelers", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "236210", label: "Industrial Building Construction", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "236220", label: "Commercial and Institutional Building Construction", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "237110", label: "Water and Sewer Line Construction", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "237120", label: "Oil and Gas Pipeline Construction", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "237130", label: "Power and Communication Line Construction", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "237210", label: "Land Subdivision", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "237310", label: "Highway, Street, and Bridge Construction", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "237990", label: "Other Heavy and Civil Engineering Construction", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "238110", label: "Poured Concrete Foundation Contractors", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "238120", label: "Structural Steel & Precast Concrete Contractors", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "238130", label: "Framing Contractors", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "238140", label: "Masonry Contractors", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "238150", label: "Glass and Glazing Contractors", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "238160", label: "Roofing Contractors", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "238170", label: "Siding Contractors", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "238190", label: "Other Foundation/Exterior Contractors", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "238210", label: "Electrical Contractors", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "238220", label: "Plumbing, Heating, A/C Contractors", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "238290", label: "Other Building Equipment Contractors", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "238310", label: "Drywall and Insulation Contractors", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "238320", label: "Painting and Wall Covering Contractors", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "238330", label: "Flooring Contractors", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "238340", label: "Tile and Terrazzo Contractors", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "238350", label: "Finish Carpentry Contractors", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "238390", label: "Other Building Finishing Contractors", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "238910", label: "Site Preparation Contractors", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 }
];

// Helper functions for the comprehensive database
export function getComprehensiveNAICSByCode(code: string): ComprehensiveNAICSMultiplier | null {
  return comprehensiveNAICSMultipliers.find(item => item.code === code) || null;
}

export function getComprehensiveNAICsBySector(sectorCode: string): ComprehensiveNAICSMultiplier[] {
  return comprehensiveNAICSMultipliers.filter(item => item.sectorCode === sectorCode);
}

export function getAllComprehensiveSectors(): Array<{code: string, title: string}> {
  const sectorTitles: {[key: string]: string} = {
    "11": "Agriculture, Forestry, Fishing and Hunting",
    "21": "Mining, Quarrying, and Oil and Gas Extraction", 
    "22": "Utilities",
    "23": "Construction"
  };
  
  const sectors = comprehensiveNAICSMultipliers.map(item => item.sectorCode);
  const uniqueSectors = sectors.filter((code, index) => sectors.indexOf(code) === index);
  return uniqueSectors.map(code => ({
    code,
    title: sectorTitles[code] || `Sector ${code}`
  }));
}

// Calculate multiplier based on grade using comprehensive data
export function calculateComprehensiveMultiplierFromGrade(
  multiplierData: ComprehensiveNAICSMultiplier,
  grade: string | number
): number {
  // Convert grade to numeric score if it's a letter grade
  let score: number;
  if (typeof grade === 'string') {
    const gradeMap: {[key: string]: number} = {
      'A': 95, 'A+': 100, 'A-': 90,
      'B': 85, 'B+': 88, 'B-': 82,
      'C': 75, 'C+': 78, 'C-': 72,
      'D': 65, 'D+': 68, 'D-': 62,
      'F': 50
    };
    score = gradeMap[grade.toUpperCase()] || 75;
  } else {
    score = grade;
  }

  // Map score to multiplier range
  if (score >= 90) {
    // A grades get max multiplier
    return multiplierData.maxMultiplier;
  } else if (score >= 80) {
    // B grades get high-end multiplier
    return multiplierData.avgMultiplier + (multiplierData.maxMultiplier - multiplierData.avgMultiplier) * 0.7;
  } else if (score >= 70) {
    // C grades get average multiplier
    return multiplierData.avgMultiplier;
  } else if (score >= 60) {
    // D grades get below average
    return multiplierData.avgMultiplier - (multiplierData.avgMultiplier - multiplierData.minMultiplier) * 0.5;
  } else {
    // F grades get minimum multiplier
    return multiplierData.minMultiplier;
  }
}