import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, Star, Building2, TrendingUp, DollarSign, FileText, Calculator, Zap } from "lucide-react";
import { useLocation } from "wouter";

function StrategicAssessment() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [selectedSector, setSelectedSector] = useState("");
  const [availableIndustries, setAvailableIndustries] = useState<{code: string, title: string}[]>([]);
  const totalSteps = 6;

  const industryData = {
    "11": [
      {code: "111", title: "Crop Production"},
      {code: "1111", title: "Oilseed and Grain Farming"},
      {code: "1112", title: "Vegetable and Melon Farming"},
      {code: "1113", title: "Fruit and Tree Nut Farming"},
      {code: "1114", title: "Greenhouse, Nursery, and Floriculture Production"},
      {code: "1119", title: "Other Crop Farming"},
      {code: "112", title: "Animal Production and Aquaculture"},
      {code: "1121", title: "Cattle Ranching and Farming"},
      {code: "1122", title: "Hog and Pig Farming"},
      {code: "1123", title: "Poultry and Egg Production"},
      {code: "1124", title: "Sheep and Goat Farming"},
      {code: "1125", title: "Aquaculture"},
      {code: "1129", title: "Other Animal Production"},
      {code: "113", title: "Forestry and Logging"},
      {code: "114", title: "Fishing, Hunting and Trapping"},
      {code: "115", title: "Support Activities for Agriculture and Forestry"}
    ],
    "21": [
      {code: "211", title: "Oil and Gas Extraction"},
      {code: "212", title: "Mining (except Oil and Gas)"},
      {code: "213", title: "Support Activities for Mining"}
    ],
    "22": [
      {code: "221", title: "Utilities"}
    ],
    "23": [
      {code: "236", title: "Construction of Buildings"},
      {code: "237", title: "Heavy and Civil Engineering Construction"},
      {code: "238", title: "Specialty Trade Contractors"}
    ],
    "31-33": [
      {code: "311", title: "Food Manufacturing"},
      {code: "312", title: "Beverage and Tobacco Product Manufacturing"},
      {code: "313", title: "Textile Mills"},
      {code: "314", title: "Textile Product Mills"},
      {code: "315", title: "Apparel Manufacturing"},
      {code: "316", title: "Leather and Allied Product Manufacturing"},
      {code: "321", title: "Wood Product Manufacturing"},
      {code: "322", title: "Paper Manufacturing"},
      {code: "323", title: "Printing and Related Support Activities"},
      {code: "324", title: "Petroleum and Coal Products Manufacturing"},
      {code: "325", title: "Chemical Manufacturing"},
      {code: "326", title: "Plastics and Rubber Products Manufacturing"},
      {code: "327", title: "Nonmetallic Mineral Product Manufacturing"},
      {code: "331", title: "Primary Metal Manufacturing"},
      {code: "332", title: "Fabricated Metal Product Manufacturing"},
      {code: "333", title: "Machinery Manufacturing"},
      {code: "334", title: "Computer and Electronic Product Manufacturing"},
      {code: "335", title: "Electrical Equipment, Appliance, and Component Manufacturing"},
      {code: "336", title: "Transportation Equipment Manufacturing"},
      {code: "337", title: "Furniture and Related Product Manufacturing"},
      {code: "339", title: "Miscellaneous Manufacturing"}
    ],
    "42": [
      {code: "423", title: "Merchant Wholesalers, Durable Goods"},
      {code: "424", title: "Merchant Wholesalers, Nondurable Goods"},
      {code: "425", title: "Wholesale Electronic Markets and Agents and Brokers"}
    ],
    "44-45": [
      {code: "441", title: "Motor Vehicle and Parts Dealers"},
      {code: "442", title: "Furniture and Home Furnishings Stores"},
      {code: "443", title: "Electronics and Appliance Stores"},
      {code: "444", title: "Building Material and Garden Equipment and Supplies Dealers"},
      {code: "445", title: "Food and Beverage Stores"},
      {code: "446", title: "Health and Personal Care Stores"},
      {code: "447", title: "Gasoline Stations"},
      {code: "448", title: "Clothing and Clothing Accessories Stores"},
      {code: "451", title: "Sporting Goods, Hobby, Musical Instrument, and Book Stores"},
      {code: "452", title: "General Merchandise Stores"},
      {code: "453", title: "Miscellaneous Store Retailers"},
      {code: "454", title: "Nonstore Retailers"}
    ],
    "48-49": [
      {code: "481", title: "Air Transportation"},
      {code: "482", title: "Rail Transportation"},
      {code: "483", title: "Water Transportation"},
      {code: "484", title: "Truck Transportation"},
      {code: "485", title: "Transit and Ground Passenger Transportation"},
      {code: "486", title: "Pipeline Transportation"},
      {code: "487", title: "Scenic and Sightseeing Transportation"},
      {code: "488", title: "Support Activities for Transportation"},
      {code: "491", title: "Postal Service"},
      {code: "492", title: "Couriers and Messengers"},
      {code: "493", title: "Warehousing and Storage"}
    ],
    "51": [
      {code: "511", title: "Publishing Industries (except Internet)"},
      {code: "512", title: "Motion Picture and Sound Recording Industries"},
      {code: "515", title: "Broadcasting (except Internet)"},
      {code: "517", title: "Telecommunications"},
      {code: "518", title: "Data Processing, Hosting, and Related Services"},
      {code: "519", title: "Other Information Services"}
    ],
    "52": [
      {code: "521", title: "Monetary Authorities-Central Bank"},
      {code: "522", title: "Credit Intermediation and Related Activities"},
      {code: "523", title: "Securities, Commodity Contracts, and Other Financial Investments"},
      {code: "524", title: "Insurance Carriers and Related Activities"},
      {code: "525", title: "Funds, Trusts, and Other Financial Vehicles"}
    ],
    "53": [
      {code: "531", title: "Real Estate"},
      {code: "532", title: "Rental and Leasing Services"},
      {code: "533", title: "Lessors of Nonfinancial Intangible Assets"}
    ],
    "54": [
      {code: "541", title: "Professional, Scientific, and Technical Services"},
      {code: "5411", title: "Legal Services"},
      {code: "5412", title: "Accounting, Tax Preparation, Bookkeeping, and Payroll Services"},
      {code: "5413", title: "Architectural, Engineering, and Related Services"},
      {code: "5414", title: "Specialized Design Services"},
      {code: "5415", title: "Computer Systems Design and Related Services"},
      {code: "5416", title: "Management, Scientific, and Technical Consulting Services"},
      {code: "5417", title: "Scientific Research and Development Services"},
      {code: "5418", title: "Advertising, Public Relations, and Related Services"},
      {code: "5419", title: "Other Professional, Scientific, and Technical Services"}
    ],
    "55": [
      {code: "551", title: "Management of Companies and Enterprises"}
    ],
    "56": [
      {code: "561", title: "Administrative and Support Services"},
      {code: "562", title: "Waste Management and Remediation Services"}
    ],
    "61": [
      {code: "611", title: "Educational Services"}
    ],
    "62": [
      {code: "621", title: "Ambulatory Health Care Services"},
      {code: "622", title: "Hospitals"},
      {code: "623", title: "Nursing and Residential Care Facilities"},
      {code: "624", title: "Social Assistance"}
    ],
    "71": [
      {code: "711", title: "Performing Arts, Spectator Sports, and Related Industries"},
      {code: "712", title: "Museums, Historical Sites, and Similar Institutions"},
      {code: "713", title: "Amusement, Gambling, and Recreation Industries"}
    ],
    "72": [
      {code: "721", title: "Accommodation"},
      {code: "722", title: "Food Services and Drinking Places"}
    ],
    "81": [
      {code: "811", title: "Repair and Maintenance"},
      {code: "812", title: "Personal and Laundry Services"},
      {code: "813", title: "Religious, Grantmaking, Civic, Professional, and Similar Organizations"}
    ],
    "92": [
      {code: "921", title: "Executive, Legislative, and Other General Government Support"},
      {code: "922", title: "Justice, Public Order, and Safety Activities"},
      {code: "923", title: "Administration of Human Resource Programs"},
      {code: "924", title: "Administration of Environmental Quality Programs"},
      {code: "925", title: "Administration of Housing Programs, Urban Planning, and Community Development"},
      {code: "926", title: "Administration of Economic Programs"},
      {code: "927", title: "Space Research and Technology"},
      {code: "928", title: "National Security and International Affairs"}
    ]
  };

  const filterSpecificIndustries = (sectorCode: string) => {
    setSelectedSector(sectorCode);
    if (sectorCode && industryData[sectorCode as keyof typeof industryData]) {
      setAvailableIndustries(industryData[sectorCode as keyof typeof industryData]);
    } else {
      setAvailableIndustries([]);
    }
  };

  const handleBack = () => {
    setLocation("/");
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderProgressBar = () => {
    const progress = (currentStep / totalSteps) * 100;
    return (
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Contact Information</CardTitle>
              <p className="text-gray-600">Let's start with your basic information</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name *</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name *</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Smith"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email Address *</label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="john@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Company Name *</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Company LLC"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(555) 123-4567"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Industry Classification</CardTitle>
              <p className="text-gray-600">Help us understand your business sector</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Primary Industry Sector *</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedSector}
                  onChange={(e) => filterSpecificIndustries(e.target.value)}
                >
                  <option value="">Select your industry sector</option>
                  <option value="11">Agriculture, Forestry, Fishing and Hunting</option>
                  <option value="21">Mining, Quarrying, and Oil and Gas Extraction</option>
                  <option value="22">Utilities</option>
                  <option value="23">Construction</option>
                  <option value="31-33">Manufacturing</option>
                  <option value="42">Wholesale Trade</option>
                  <option value="44-45">Retail Trade</option>
                  <option value="48-49">Transportation and Warehousing</option>
                  <option value="51">Information</option>
                  <option value="52">Finance and Insurance</option>
                  <option value="53">Real Estate and Rental and Leasing</option>
                  <option value="54">Professional, Scientific, and Technical Services</option>
                  <option value="55">Management of Companies and Enterprises</option>
                  <option value="56">Administrative and Support and Waste Management Services</option>
                  <option value="61">Educational Services</option>
                  <option value="62">Health Care and Social Assistance</option>
                  <option value="71">Arts, Entertainment, and Recreation</option>
                  <option value="72">Accommodation and Food Services</option>
                  <option value="81">Other Services (except Public Administration)</option>
                  <option value="92">Public Administration</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Specific Industry (NAICS Code)</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!selectedSector}
                >
                  {!selectedSector ? (
                    <option value="">First select a primary sector above...</option>
                  ) : (
                    <>
                      <option value="">Select your specific industry...</option>
                      {availableIndustries.map(industry => (
                        <option key={industry.code} value={industry.code}>
                          {industry.code} - {industry.title}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Business Description *</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                  placeholder="Describe your business operations, products/services, and target market..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Years in Business</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Number of Employees</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="25"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-2xl">Financial Information</CardTitle>
              <p className="text-gray-600">Provide your key financial metrics</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Annual Revenue (Last 12 Months) *</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1000000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Cost of Goods Sold (COGS)</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="400000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Total Operating Expenses *</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="350000"
                />
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Calculator className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-900">Calculated EBITDA</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">$250,000</div>
                <p className="text-sm text-blue-700">This will be refined with your adjustments</p>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-orange-600" />
              </div>
              <CardTitle className="text-2xl">EBITDA Adjustments</CardTitle>
              <p className="text-gray-600">Normalize your earnings for valuation</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Owner's Salary Above Market Rate</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="50000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Personal Expenses Run Through Business</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="25000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">One-Time Expenses</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="15000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Other Adjustments</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10000"
                />
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-medium text-green-900">Adjusted EBITDA</span>
                </div>
                <div className="text-2xl font-bold text-green-600">$350,000</div>
                <p className="text-sm text-green-700">Ready for value driver analysis</p>
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-indigo-600" />
              </div>
              <CardTitle className="text-2xl">Strategic Value Drivers</CardTitle>
              <p className="text-gray-600">Rate your business across key value dimensions</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                "Financial Performance",
                "Growth Potential", 
                "Market Position",
                "Management Team",
                "Customer Base",
                "Operational Efficiency",
                "Industry Trends",
                "Competitive Advantage"
              ].map((driver, index) => (
                <div key={index} className="space-y-2">
                  <label className="block text-sm font-medium">{driver}</label>
                  <div className="flex space-x-2">
                    {["A", "B", "C", "D", "F"].map((grade) => (
                      <button
                        key={grade}
                        className="w-12 h-12 rounded-full border-2 border-gray-300 hover:border-blue-500 flex items-center justify-center font-bold transition-colors"
                      >
                        {grade}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Calculator className="w-5 h-5 text-indigo-600 mr-2" />
                  <span className="font-medium text-indigo-900">Multiplier Preview</span>
                </div>
                <div className="text-lg font-bold text-indigo-600">4.2x Industry Multiple</div>
                <p className="text-sm text-indigo-700">Based on your industry and current ratings</p>
              </div>
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl">Complete Your Assessment</CardTitle>
              <p className="text-gray-600">Review and finalize your strategic valuation</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4">Assessment Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Adjusted EBITDA:</span>
                    <div className="font-bold text-lg">$350,000</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Industry Multiple:</span>
                    <div className="font-bold text-lg">4.2x</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Estimated Value:</span>
                    <div className="font-bold text-xl text-green-600">$1,470,000</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Value Range:</span>
                    <div className="font-bold text-lg">$1.2M - $1.7M</div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Additional Comments</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                  placeholder="Any additional information about your business..."
                />
              </div>

              <div className="text-center">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-bold">
                  Generate Strategic Report - $395
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Secure payment processed by Stripe
                </p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-600" />
            <Badge className="bg-green-100 text-green-800">Secure Assessment</Badge>
          </div>
        </div>

        {/* Progress Bar */}
        {renderProgressBar()}

        {/* Step Content */}
        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 max-w-2xl mx-auto">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700 hover:text-blue-700"
          >
            Previous
          </Button>
          
          {currentStep < totalSteps ? (
            <Button
              onClick={nextStep}
              className="px-6 bg-blue-600 hover:bg-blue-700"
            >
              Continue
            </Button>
          ) : (
            <div className="flex items-center text-sm text-gray-500">
              <FileText className="w-4 h-4 mr-1" />
              Complete assessment above
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StrategicAssessment;