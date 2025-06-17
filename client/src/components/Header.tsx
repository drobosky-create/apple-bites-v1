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
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="text-2xl font-bold tracking-wide">
                <span className="text-white">MERITAGE</span>
                <div className="text-lg font-medium text-gray-300">PARTNERS</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}