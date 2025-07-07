import Meritage_Logo from "@assets/Meritage Logo.png";

export function Header() {
  return (
    <header 
      className="bg-[#0b2147] text-white shadow-lg"
      style={{ backgroundColor: '#0b2147' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <div className="flex items-center mt-12">
            <a
              href="https://www.meritage-partners.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity flex items-center"
            >
              <img 
                src={Meritage_Logo} 
                alt="Meritage Partners" 
                className="h-10 w-auto"
              />
            </a>
          </div>

          {/* Right-side buttons */}
          <div className="flex gap-3 items-center">
            {/* Add your button components here */}
            {/* Example:
            <button className="btn btn-primary">Valuation Form</button>
            <button className="btn btn-outline">Admin Login</button>
            */}
          </div>

        </div>
      </div>
    </header>
  );
}
