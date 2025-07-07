import meritageLogoPath from "@assets/Meritage Logo2.png";

import Meritage_Logo from "@assets/Meritage Logo.png";

export function Header() {
  return (
    <header 
      className="bg-[#0b2147] text-white shadow-lg" 
      style={{ 
        backgroundColor: '#0b2147'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-start items-center h-16">
          {/* Logo - Links to Meritage Partners homepage */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <a 
              href="https://www.meritage-partners.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity flex items-center justify-center"
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