import meritageLogoPath from "@assets/Meritage Logo2.png";

import Meritage_Logo from "@assets/Meritage Logo.png";

export function Header() {
  return (
    <header className="bg-[#1e3a5f] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#0b2147]">
        <div className="flex justify-start items-center h-16 bg-[#0b2147]">
          {/* Logo - Links to Meritage Partners homepage */}
          <div className="flex-shrink-0">
            <a 
              href="https://www.meritage-partners.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <img 
                src={Meritage_Logo} 
                alt="Meritage Partners" 
                className="h-12 w-auto"
              />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}