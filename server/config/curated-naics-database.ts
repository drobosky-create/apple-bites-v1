// Curated NAICS 6-digit codes by sector
export const curatedNAICSDatabase = {
  "11": [
    {
      "code": "111110",
      "label": "Soybean Farming",
      "multiplier": 2.5
    },
    {
      "code": "111120",
      "label": "Oilseed (except Soybean) Farming",
      "multiplier": 2.5
    }
  ],
  "21": [
    {
      "code": "211120",
      "label": "Crude Petroleum Extraction",
      "multiplier": 4.2
    },
    {
      "code": "212110",
      "label": "Coal Mining",
      "multiplier": 3.1
    }
  ],
  "23": [
    {
      "code": "236110",
      "label": "Residential Building Construction",
      "multiplier": 2.5
    },
    {
      "code": "237210",
      "label": "Land Subdivision",
      "multiplier": 2.5
    }
  ],
  "31": [
    {
      "code": "311810",
      "label": "Bread and Bakery Product Manufacturing",
      "multiplier": 3.2
    }
  ],
  "42": [
    {
      "code": "423610",
      "label": "Electrical Apparatus and Equipment Merchant Wholesalers",
      "multiplier": 2.8
    }
  ],
  "44": [
    {
      "code": "441110",
      "label": "New Car Dealers",
      "multiplier": 2.3
    }
  ],
  "54": [
    {
      "code": "541611",
      "label": "Administrative Management and General Management Consulting Services",
      "multiplier": 3.8
    }
  ],
  "61": [
    {
      "code": "611310",
      "label": "Colleges, Universities, and Professional Schools",
      "multiplier": 2.5
    }
  ],
  "72": [
    {
      "code": "722511",
      "label": "Full-Service Restaurants",
      "multiplier": 2.1
    }
  ]
};

// Get curated 6-digit NAICS codes for a specific 2-digit sector
export function getCuratedNAICsBySector(sectorCode: string): Array<{code: string, label: string, multiplier: number}> {
  return curatedNAICSDatabase[sectorCode as keyof typeof curatedNAICSDatabase] || [];
}

// Get all available sectors from curated database
export function getCuratedSectors(): Array<{code: string, title: string}> {
  const sectorTitles = {
    "11": "Agriculture, Forestry, Fishing and Hunting",
    "21": "Mining, Quarrying, and Oil and Gas Extraction",
    "23": "Construction",
    "31": "Manufacturing",
    "42": "Wholesale Trade",
    "44": "Retail Trade",
    "54": "Professional, Scientific and Technical Services",
    "61": "Educational Services",
    "72": "Accommodation and Food Services"
  };
  
  return Object.keys(curatedNAICSDatabase).map(code => ({
    code,
    title: sectorTitles[code as keyof typeof sectorTitles]
  }));
}

// Get NAICS details by code
export function getCuratedNAICSByCode(code: string): {code: string, label: string, multiplier: number, sectorCode: string} | null {
  for (const [sectorCode, industries] of Object.entries(curatedNAICSDatabase)) {
    const industry = industries.find(ind => ind.code === code);
    if (industry) {
      return {
        ...industry,
        sectorCode
      };
    }
  }
  return null;
}