import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, TrendingUp, Users, Shield } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Apple Bites Business Valuation
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Professional business valuation platform designed for business owners, entrepreneurs, and advisors. 
            Get accurate valuations with comprehensive financial analysis and AI-powered insights.
          </p>
          <div className="space-x-4">
            <Button 
              size="lg"
              onClick={() => window.location.href = '/api/login'}
              className="bg-[#1a2332] hover:bg-[#2d3748] text-white px-8 py-3"
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.location.href = '/api/login'}
              className="border-[#1a2332] text-[#1a2332] hover:bg-[#1a2332] hover:text-white px-8 py-3"
            >
              Sign In
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-slate-900">
                Free Assessment
              </CardTitle>
              <CardDescription className="text-slate-600">
                Get started with our comprehensive business valuation tool
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-slate-600">Basic financial analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-slate-600">Value driver assessment</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-slate-600">PDF report generation</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-slate-900">
                Growth & Exit Assessment
              </CardTitle>
              <CardDescription className="text-slate-600">
                Advanced assessment with industry-specific insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-slate-600">Industry-specific multipliers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-slate-600">AI-powered financial coaching</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-slate-600">Enhanced professional reports</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-slate-900">
                Secure & Professional
              </CardTitle>
              <CardDescription className="text-slate-600">
                Enterprise-grade security and professional reporting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-slate-600">Encrypted data protection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-slate-600">Professional-grade reports</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-slate-600">Confidential processing</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-slate-600 mb-4">
            Trusted by business owners and financial professionals
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = '/api/login'}
            className="bg-[#1a2332] hover:bg-[#2d3748] text-white px-8 py-3"
          >
            Start Your Valuation
          </Button>
        </div>
      </div>
    </div>
  );
}