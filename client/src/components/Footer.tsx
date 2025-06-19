import { Link } from "wouter";
import meritageLogoPath from "@assets/Meritage Logo2.png";

import Meritage_Logo from "@assets/Meritage Logo.png";

export function Footer() {
  return (
    <footer className="bg-[#1e3a5f] text-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-[#0b2147]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img 
                src={Meritage_Logo} 
                alt="Meritage Partners" 
                className="h-10 w-auto"
              />
            </div>
            <p className="text-sm leading-relaxed max-w-md text-[#FFFFFF]">
              Whether you're scaling, preparing to sell, or exploring strategic partnerships—Meritage Partners is here to guide your next move.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#FFFFFF]">Links</h3>
            <div className="space-y-2">
              <a 
                href="https://meritage.partners/privacypolicy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block hover:text-blue-200 transition-colors text-sm text-[#FFFFFF]"
              >
                Privacy Policy
              </a>
              <a 
                href="https://meritage.partners/termsofuse" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-[#FFFFFF] hover:text-blue-200 transition-colors text-sm"
              >
                Terms of Use
              </a>
              <a 
                href="https://meritage.partners/cookies" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-[#FFFFFF] hover:text-blue-200 transition-colors text-sm"
              >
                Cookie Policy
              </a>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#FFFFFF]">Address:</h3>
            <div className="space-y-2 text-[#FFFFFF] text-sm">
              <p>2901 West Coast Highway Suite 200, Newport Beach California 92663</p>
              <p className="font-medium">(949) 522-9121</p>
              <a 
                href="mailto:info@meritage-partners.com" 
                className="text-[#FFFFFF] hover:text-blue-200 transition-colors"
              >
                info@meritage-partners.com
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-600 mt-8 pt-6">
          <p className="text-center text-[#FFFFFF] text-sm">
            © {new Date().getFullYear()}. Meritage Partners. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}