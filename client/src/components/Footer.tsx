import { Link } from "wouter";
import meritageLogoPath from "@assets/image_1750194261736.png";

import Meritage_Logo from "@assets/Meritage Logo.png";

export function Footer() {
  return (
    <footer className="bg-[#1e3a5f] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-[#0b2147]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img 
                src={Meritage_Logo} 
                alt="Meritage Partners" 
                className="h-8 w-auto"
              />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-md">
              Whether you're scaling, preparing to sell, or exploring strategic partnerships—Meritage Partners is here to guide your next move.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Links</h3>
            <div className="space-y-2">
              <Link href="/privacy" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Terms of Use
              </Link>
              <Link href="/cookies" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Cookie Policy
              </Link>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Address:</h3>
            <div className="space-y-2 text-gray-300 text-sm">
              <p>2901 West Coast Highway Suite 200, Newport Beach California 92663</p>
              <p className="font-medium">(949) 522-9121</p>
              <a 
                href="mailto:info@meritage-partners.com" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                info@meritage-partners.com
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-600 mt-8 pt-6">
          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()}. Meritage Partners. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}