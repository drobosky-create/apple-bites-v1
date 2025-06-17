import meritageLogoPath from "@assets/image_1750194261736.png";

import Meritage_Logo from "@assets/Meritage Logo.png";

export function Header() {
  return (
    <header className="bg-[#1e3a5f] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-16">
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
                className="h-10 w-auto"
              />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}