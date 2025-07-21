import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Search, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

interface IndustryFormProps {
  form: UseFormReturn<any>;
  onNext: () => void;
  onPrev: () => void;
  onDataChange: (data: any) => void;
}

interface NAICSIndustry {
  code: string;
  title: string;
  sector: string;
  multiplier: number;
  description: string;
}

const sectors = [
  "Agriculture",
  "Mining", 
  "Construction",
  "Manufacturing",
  "Wholesale Trade",
  "Retail Trade",
  "Transportation",
  "Information",
  "Finance and Insurance",
  "Real Estate",
  "Professional Services",
  "Management",
  "Administrative Services",
  "Education",
  "Healthcare",
  "Entertainment",
  "Hospitality",
  "Services"
];

export default function IndustryForm({ form, onNext, onPrev, onDataChange }: IndustryFormProps) {
  const [availableIndustries, setAvailableIndustries] = useState<NAICSIndustry[]>([]);
  const [selectedSector, setSelectedSector] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Simulate NAICS database lookup (in real app, this would be an API call)
  const searchIndustries = async (sector: string, search: string = "") => {
    // Mock industry data for demonstration
    const mockIndustries: NAICSIndustry[] = [
      { code: "311", title: "Food Manufacturing", sector: "Manufacturing", multiplier: 4.2, description: "Processing and packaging food products" },
      { code: "541", title: "Professional Services", sector: "Professional Services", multiplier: 4.7, description: "Consulting, legal, accounting services" },
      { code: "621", title: "Healthcare Services", sector: "Healthcare", multiplier: 4.4, description: "Medical and healthcare services" },
      { code: "722", title: "Food Services", sector: "Hospitality", multiplier: 2.2, description: "Restaurants and food service establishments" },
      { code: "236", title: "Construction", sector: "Construction", multiplier: 2.8, description: "Building construction services" }
    ];

    let filtered = mockIndustries;
    if (sector) {
      filtered = filtered.filter(ind => ind.sector === sector);
    }
    if (search) {
      filtered = filtered.filter(ind => 
        ind.title.toLowerCase().includes(search.toLowerCase()) ||
        ind.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    setAvailableIndustries(filtered);
  };

  useEffect(() => {
    if (selectedSector) {
      searchIndustries(selectedSector, searchTerm);
    }
  }, [selectedSector, searchTerm]);

  const handleSubmit = (data: any) => {
    onDataChange(data);
    onNext();
  };

  const watchedValues = form.watch();
  useEffect(() => {
    onDataChange(watchedValues);
  }, [watchedValues, onDataChange]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-blue-600" />
        </div>
        <CardTitle className="text-2xl text-gray-900">Industry Classification</CardTitle>
        <p className="text-gray-600 mt-2">
          Help us provide industry-specific analysis by identifying your business sector and NAICS code
        </p>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            
            {/* Business Sector Selection */}
            <FormField
              control={form.control}
              name="businessSector"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Primary Business Sector</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedSector(value);
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select your business sector" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sectors.map((sector) => (
                        <SelectItem key={sector} value={sector}>
                          {sector}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Industry Search */}
            {selectedSector && (
              <div className="space-y-4">
                <FormLabel className="text-base font-semibold">Find Your Specific Industry</FormLabel>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search for your specific industry..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>

                {/* NAICS Code Selection */}
                <FormField
                  control={form.control}
                  name="naicsCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NAICS Industry Code</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select your industry classification" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableIndustries.map((industry) => (
                            <SelectItem key={industry.code} value={industry.code}>
                              <div className="flex flex-col">
                                <span className="font-medium">{industry.title}</span>
                                <span className="text-sm text-gray-500">
                                  Code: {industry.code} | Multiplier: {industry.multiplier}x
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Business Description */}
            <FormField
              control={form.control}
              name="businessDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Detailed Business Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your business operations, products/services, target market, and key differentiators..."
                      className="min-h-[120px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-sm text-gray-500">
                    This helps us provide more accurate industry comparisons and insights
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Years in Business */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="yearsInBusiness"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Years in Business</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 5"
                        className="h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numberOfEmployees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Number of Employees</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 25"
                        className="h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Market Position */}
            <FormField
              control={form.control}
              name="marketPosition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Market Position</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="How would you describe your market position?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="market-leader">Market Leader</SelectItem>
                      <SelectItem value="strong-competitor">Strong Competitor</SelectItem>
                      <SelectItem value="established-player">Established Player</SelectItem>
                      <SelectItem value="growing-business">Growing Business</SelectItem>
                      <SelectItem value="new-entrant">New Market Entrant</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Competitive Advantages */}
            <FormField
              control={form.control}
              name="competitiveAdvantages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Key Competitive Advantages</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What sets your business apart from competitors? (e.g., proprietary technology, exclusive contracts, brand recognition, etc.)"
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onPrev}
                className="px-8 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
              >
                Previous
              </Button>
              <Button
                type="submit"
                className="px-8 btn-secondary"
              >
                Continue to EBITDA Analysis
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}