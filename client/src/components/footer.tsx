import { ExternalLink, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Meritage Partners</h3>
                <p className="text-slate-300 text-sm">M&A Advisory & Business Valuation</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Professional middle-market M&A advisory services with comprehensive business valuation expertise. 
              Helping business owners navigate strategic transactions and maximize value.
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact Information</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-blue-400" />
                <a 
                  href="tel:(949)522-9121" 
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  (949) 522-9121
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-blue-400" />
                <a 
                  href="mailto:info@meritage-partners.com" 
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  info@meritage-partners.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="text-slate-300">Orange County, California</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Get Started</h4>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                size="sm"
                className="w-full text-white border-slate-600 hover:bg-slate-700/50 hover:border-slate-500"
                onClick={() => window.open('https://meritage.partners/contact', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Schedule Consultation
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full text-slate-300 hover:text-white hover:bg-slate-700/50"
                onClick={() => window.open('https://meritage.partners', '_blank')}
              >
                Visit Main Website
              </Button>
            </div>
            <div className="pt-2">
              <p className="text-xs text-slate-400">
                Confidential business valuations with professional M&A advisory expertise
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-slate-400">
              © 2025 Meritage Partners. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-slate-400">
              <a 
                href="https://meritage.partners/privacy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a 
                href="https://meritage.partners/terms" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}