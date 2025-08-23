import { useState, useEffect } from "react";
import { motion } from "motion/react";
import svgPaths from "../imports/svg-lh0ecxeb4v";
import imgASleekModernCarParkedOnAScenicRoadWithMountainsInTheBackgroundDuringSunset from "figma:asset/52f59651552a527d7caa04cf128d5756924d97a3.png";
import imgASleekModernCarParkedOnAScenicRoadWithMountainsInTheBackgroundDuringSunset1 from "figma:asset/4d1d9e420b47345c43c28a12faa4a020877bc4eb.png";

// Mock data for car listings
const carListings = [
  { id: 1, name: "2019 Tesla Model 3", description: "Electric, 30,000 miles", tag: "Featured", brand: "Tesla", year: 2019, price: 35000 },
  { id: 2, name: "2018 Ford Mustang", description: "V8, 40,000 miles", tag: "Popular", brand: "Ford", year: 2018, price: 28000 },
  { id: 3, name: "2020 BMW X5", description: "Luxury, 20,000 miles", tag: "New", brand: "BMW", year: 2020, price: 45000 },
  { id: 4, name: "2017 Honda Civic", description: "Sedan, 50,000 miles", tag: "", brand: "Honda", year: 2017, price: 18000 },
  { id: 5, name: "2015 Toyota Camry", description: "Reliable, 60,000 miles", tag: "", brand: "Toyota", year: 2015, price: 16000 },
  { id: 6, name: "2021 Chevrolet Bolt", description: "Electric, 10,000 miles", tag: "", brand: "Chevrolet", year: 2021, price: 25000 },
  { id: 7, name: "2016 Audi A4", description: "Sport, 70,000 miles", tag: "", brand: "Audi", year: 2016, price: 22000 },
  { id: 8, name: "2019 Jeep Wrangler", description: "Off-road, 25,000 miles", tag: "", brand: "Jeep", year: 2019, price: 32000 },
  { id: 9, name: "2018 Mercedes-Benz C-Class", description: "Luxury, 35,000 miles", tag: "", brand: "Mercedes-Benz", year: 2018, price: 38000 },
  { id: 10, name: "2020 Subaru Outback", description: "Crossover, 15,000 miles", tag: "", brand: "Subaru", year: 2020, price: 26000 },
];

function TypingText({ text, speed = 50 }: { text: string; speed?: number }) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className="relative block w-full">
      {/* Invisible placeholder to reserve space for full text */}
      <span className="invisible block w-full" aria-hidden="true">
        {text}
      </span>
      {/* Visible typing text positioned absolutely */}
      <span className="absolute inset-0 w-full">
        {displayText}
        {currentIndex < text.length && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
            className="inline-block"
          >
            |
          </motion.span>
        )}
      </span>
    </span>
  );
}

function Logo() {
  const handleLogoClick = () => {
    window.location.reload();
  };

  return (
    <div className="content-stretch flex gap-2 h-8 items-center justify-start relative shrink-0" data-name="logo">
      <button onClick={handleLogoClick} className="cursor-pointer hover:opacity-70 transition-opacity">
        <div className="font-['Racing_Sans_One:Regular',_sans-serif] leading-[0] lowercase not-italic relative shrink-0 text-[#281d1b] text-[28px] text-nowrap">
          <p className="leading-none whitespace-pre">AICar</p>
        </div>
      </button>
    </div>
  );
}

function Search() {
  return (
    <div className="relative shrink-0 size-6" data-name="search">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="search">
          <path d={svgPaths.p20679400} id="Icon" stroke="var(--stroke-0, #281D1B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function User() {
  return (
    <div className="relative shrink-0 size-6" data-name="user">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="user">
          <path d={svgPaths.p2e0e8900} id="Icon" stroke="var(--stroke-0, #281D1B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function ShoppingBag() {
  return (
    <div className="relative shrink-0 size-6" data-name="shopping-bag">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="shopping-bag">
          <path d={svgPaths.p13cfd080} id="Icon" stroke="var(--stroke-0, #281D1B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Icons() {
  return (
    <div className="content-stretch flex gap-6 items-end justify-start relative shrink-0" data-name="icons">
      <button className="cursor-pointer hover:opacity-70 transition-opacity">
        <Search />
      </button>
      <button className="cursor-pointer hover:opacity-70 transition-opacity">
        <User />
      </button>
      <button className="cursor-pointer hover:opacity-70 transition-opacity">
        <ShoppingBag />
      </button>
    </div>
  );
}

function ChevronDown() {
  return (
    <div className="relative shrink-0 size-4" data-name="chevron-down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="chevron-down">
          <path d="M4 6L8 10L12 6" id="Icon" stroke="var(--stroke-0, #281D1B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function PageLink({ title }: { title: string }) {
  return (
    <div className="content-stretch flex gap-1 items-center justify-start relative shrink-0" data-name="pageLink">
      <button className="cursor-pointer hover:opacity-70 transition-opacity">
        <div className="font-['Outfit:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#281d1b] text-[15px] text-nowrap">
          <p className="leading-[20px] whitespace-pre">{title}</p>
        </div>
      </button>
      <ChevronDown />
    </div>
  );
}

function PageLinks() {
  return (
    <div className="absolute content-stretch flex gap-8 items-start justify-start left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="pageLinks">
      <PageLink title="Home" />
      <PageLink title="About Us" />
      <PageLink title="Listings" />
      <PageLink title="Contact" />
      <PageLink title="Support" />
    </div>
  );
}

function StoreHeaderNavBarWithPromotion({ showPromo, onClosePromo }: { showPromo: boolean; onClosePromo: () => void }) {
  return (
    <div className="bg-[#ff5733] box-border content-stretch flex items-center justify-between overflow-clip px-12 py-4 relative shrink-0 w-full z-[3]" data-name="Store - header nav bar/horizontal">
      <Logo />
      <Icons />
      <PageLinks />
    </div>
  );
}

function ASleekModernCarParkedOnAScenicRoadWithMountainsInTheBackgroundDuringSunset() {
  return (
    <div className="bg-center bg-cover bg-no-repeat h-[672px] relative rounded-[28px] shrink-0 w-full" data-name="A sleek, modern car parked on a scenic road with mountains in the background during sunset." style={{ backgroundImage: `url('${imgASleekModernCarParkedOnAScenicRoadWithMountainsInTheBackgroundDuringSunset}')` }}>
      <div aria-hidden="true" className="absolute border-[1.5px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[28px]" />
    </div>
  );
}

function InputStandard({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <div className="basis-0 bg-[#fffbfa] grow min-h-px min-w-px relative rounded-lg self-stretch shrink-0" data-name="inputStandard">
      <div aria-hidden="true" className="absolute border-[1.5px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-lg" />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex gap-2 items-center justify-start px-4 py-2 relative size-full">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="basis-0 font-['Outfit:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[20px] text-[#281d1b] bg-transparent border-none outline-none placeholder:text-[rgba(46,24,20,0.4)]"
          />
        </div>
      </div>
    </div>
  );
}

function ButtonLarge({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className="bg-[#ff5733] box-border content-stretch flex items-center justify-center px-6 py-3 relative rounded-lg shrink-0 cursor-pointer hover:bg-[#e94c28] transition-colors" 
      data-name="buttonLarge"
    >
      <div className="font-['Outfit:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#050100] text-[20px] text-nowrap">
        <p className="leading-[24px] whitespace-pre">{children}</p>
      </div>
    </button>
  );
}

function Frame({ searchQuery, setSearchQuery, onSearch }: { searchQuery: string; setSearchQuery: (value: string) => void; onSearch: () => void }) {
  return (
    <div className="content-stretch flex gap-3 items-start justify-start relative shrink-0 w-[600px]" data-name="Frame">
      <InputStandard 
        value={searchQuery} 
        onChange={setSearchQuery} 
        placeholder="Type your car search prompt here..." 
      />
      <ButtonLarge onClick={onSearch}>Search</ButtonLarge>
    </div>
  );
}

function LandingPageHeroWithTaglineAndImage({ searchQuery, setSearchQuery, onSearch, showSearchForm }: { searchQuery: string; setSearchQuery: (value: string) => void; onSearch: () => void; showSearchForm: boolean }) {
  return (
    <div className="bg-[#fffbfa] box-border content-stretch flex flex-col gap-12 items-center justify-start px-0 py-24 relative shrink-0 w-full z-[4]" data-name="Landing Page Hero With Tagline and Image">
      <div className="font-['Outfit:Bold',_sans-serif] font-bold leading-[0] relative shrink-0 text-[#281d1b] text-[120px] text-center w-full z-[6]">
        <p className="leading-[120px]">
          <TypingText text="Find Your Perfect Ride with AI-Powered Search" speed={80} />
        </p>
      </div>
      <div className="relative w-full z-[5]">
        <ASleekModernCarParkedOnAScenicRoadWithMountainsInTheBackgroundDuringSunset />
        
        {/* Search box overlay */}
        {showSearchForm && (
          <motion.div
            initial={{ opacity: 0, y: 200 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center z-[7]"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
              <div className="mb-6">
                <div className="font-['Outfit:Bold',_sans-serif] font-bold text-[#281d1b] text-[32px] text-center">
                  <p>Enter your car search prompt:</p>
                </div>
              </div>
              <Frame searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={onSearch} />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function LandingPageTextSection() {
  return (
    <div className="bg-[#fffbfa] box-border content-stretch flex gap-24 items-start justify-start px-0 py-24 relative shrink-0 w-full z-[2]" data-name="Landing Page Text Section">
      <div className="basis-0 box-border content-stretch flex gap-24 grow items-start justify-start min-h-px min-w-px px-0 py-12 relative shrink-0" data-name="Container">
        <div className="basis-0 font-['Outfit:Bold',_sans-serif] font-bold grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#281d1b] text-[48px]">
          <p className="leading-[52px]">AI-Driven Car Search</p>
        </div>
        <div className="basis-0 box-border content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px pb-0 pt-2 px-0 relative shrink-0" data-name="div">
          <div className="font-['Outfit:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#281d1b] text-[24px] w-full">
            <p className="leading-[32px]">Experience the future of car buying with our AI-powered search tool that helps you find the best deals on used cars.</p>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 h-0 left-[-96px] right-[-96px]" data-name="divider">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <g id="divider"></g>
        </svg>
      </div>
    </div>
  );
}

function Filter({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`box-border content-stretch flex gap-2 items-center justify-center pl-4 pr-3 py-2 relative rounded-lg shrink-0 cursor-pointer transition-colors ${
        isActive ? 'bg-[#ff5733] text-white' : 'bg-[#fffbfa] hover:bg-gray-50'
      }`} 
      data-name="filter"
    >
      <div aria-hidden="true" className={`absolute border-[1.5px] border-solid inset-0 pointer-events-none rounded-lg ${
        isActive ? 'border-[#ff5733]' : 'border-[rgba(110,80,73,0.2)]'
      }`} />
      <div className={`font-['Outfit:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[15px] text-nowrap ${
        isActive ? 'text-white' : 'text-[#281d1b]'
      }`}>
        <p className="leading-[20px] whitespace-pre">{label}</p>
      </div>
      <ChevronDown />
    </button>
  );
}

function FilterCategories({ activeFilters, toggleFilter }: { activeFilters: Set<string>; toggleFilter: (filter: string) => void }) {
  return (
    <div className="content-stretch flex gap-3 items-start justify-start relative shrink-0" data-name="Filter Categories">
      <Filter label="Brand" isActive={activeFilters.has('brand')} onClick={() => toggleFilter('brand')} />
      <Filter label="Price Range" isActive={activeFilters.has('price')} onClick={() => toggleFilter('price')} />
      <Filter label="Year" isActive={activeFilters.has('year')} onClick={() => toggleFilter('year')} />
    </div>
  );
}

function TextSearchResult({ car }: { car: typeof carListings[0] }) {
  return (
    <div className="bg-[#fffbfa] box-border content-stretch flex flex-col gap-4 items-center justify-center px-0 py-4 relative shrink-0 w-full hover:bg-gray-50 transition-colors cursor-pointer" data-name="textSearchResult">
      <div className="content-stretch flex gap-6 items-center justify-start max-w-[900px] relative shrink-0 w-full" data-name="Container">
        <div className="basis-0 content-stretch flex flex-col gap-2 grow items-start justify-start leading-[0] min-h-px min-w-px relative shrink-0" data-name="Container">
          <div className="content-stretch flex flex-col gap-1 items-start justify-start relative shrink-0 text-[#281d1b] w-full" data-name="Container">
            <div className="font-['Outfit:Bold',_sans-serif] font-bold relative shrink-0 text-[17px] w-full">
              <p className="leading-[24px]">{car.name}</p>
            </div>
            <div className="-webkit-box css-z77ek9 font-['Outfit:Regular',_sans-serif] font-normal overflow-ellipsis overflow-hidden relative shrink-0 text-[15px] w-full">
              <p className="leading-[20px]">{car.description}</p>
            </div>
          </div>
          {car.tag && (
            <div className="font-['Outfit:Medium',_sans-serif] font-medium relative shrink-0 text-[13px] text-[rgba(46,25,20,0.62)] w-full">
              <p className="leading-[16px]">{car.tag}</p>
            </div>
          )}
        </div>
        <div className="font-['Outfit:Bold',_sans-serif] font-bold text-[#ff5733] text-[18px]">
          ${car.price.toLocaleString()}
        </div>
      </div>
    </div>
  );
}

function Page({ number, isActive, onClick }: { number: number; isActive: boolean; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`box-border content-stretch flex items-center justify-center p-[8px] relative rounded-lg shrink-0 cursor-pointer transition-colors ${
        isActive ? 'bg-[#ff5733]' : 'hover:bg-gray-100'
      }`} 
      data-name="page"
    >
      <div className={`font-['Outfit:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[15px] text-center w-5 ${
        isActive ? 'text-[#050100]' : 'text-[rgba(46,25,20,0.62)]'
      }`}>
        <p className="leading-[20px]">{number}</p>
      </div>
    </button>
  );
}

function Next({ onClick }: { onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="bg-[#fffbfa] box-border content-stretch flex items-center justify-center p-[8px] relative rounded-lg shrink-0 cursor-pointer hover:bg-gray-100 transition-colors" 
      data-name="next"
    >
      <div className="relative shrink-0 size-5" data-name="div">
        <div className="absolute left-1/2 size-6 top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="chevron-right">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
            <g id="chevron-right">
              <path d="M9 19L16 12L9 5" id="Icon" stroke="var(--stroke-0, #281D1B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </g>
          </svg>
        </div>
      </div>
    </button>
  );
}

function Pagination({ currentPage, setCurrentPage }: { currentPage: number; setCurrentPage: (page: number) => void }) {
  return (
    <div className="content-stretch flex items-start justify-start max-w-[900px] relative shrink-0 w-full" data-name="pagination">
      {[1, 2, 3, 4, 5].map((page) => (
        <Page 
          key={page} 
          number={page} 
          isActive={currentPage === page} 
          onClick={() => setCurrentPage(page)} 
        />
      ))}
      <Next onClick={() => setCurrentPage(Math.min(currentPage + 1, 5))} />
    </div>
  );
}

function TextSearchResultsWithFilters({ activeFilters, toggleFilter, filteredCars, currentPage, setCurrentPage }: { 
  activeFilters: Set<string>; 
  toggleFilter: (filter: string) => void; 
  filteredCars: typeof carListings;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}) {
  return (
    <div className="bg-[#fffbfa] box-border content-stretch flex flex-col gap-8 items-center justify-start px-0 py-6 relative shrink-0 w-full z-[1]" data-name="textSearchResultsWithFilters">
      <div className="content-stretch flex flex-col gap-4 items-center justify-start relative shrink-0 w-full" data-name="Main container">
        <div className="content-stretch flex flex-col gap-2 items-center justify-start max-w-[900px] overflow-clip relative shrink-0 w-full" data-name="Filters container">
          <div className="bg-[#fffbfa] content-stretch flex flex-col gap-6 items-start justify-center overflow-clip relative shrink-0 w-full" data-name="Filters">
            <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Header">
              <FilterCategories activeFilters={activeFilters} toggleFilter={toggleFilter} />
            </div>
          </div>
          <div className="absolute bg-gradient-to-l from-[#fffbfa] from-[24.781%] right-0 size-9 to-[#fffbfa00] top-1/2 translate-y-[-50%]" data-name="bleed" />
        </div>
        <div className="content-stretch flex flex-col items-start justify-start relative shrink-0 w-full" data-name="Results container">
          {filteredCars.map((car) => (
            <TextSearchResult key={car.id} car={car} />
          ))}
        </div>
      </div>
      <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
}

function MainContent({ 
  searchQuery, 
  setSearchQuery, 
  onSearch, 
  activeFilters, 
  toggleFilter, 
  filteredCars,
  currentPage,
  setCurrentPage,
  showSearchForm,
  showContent
}: { 
  searchQuery: string; 
  setSearchQuery: (value: string) => void; 
  onSearch: () => void;
  activeFilters: Set<string>; 
  toggleFilter: (filter: string) => void; 
  filteredCars: typeof carListings;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  showSearchForm: boolean;
  showContent: boolean;
}) {
  return (
    <div className="basis-0 content-stretch flex flex-col grow isolate items-start justify-start min-h-px min-w-px relative shrink-0 z-[1]" data-name="Main Content">
      {/* Hero section - always visible, only text has typing animation */}
      <LandingPageHeroWithTaglineAndImage 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onSearch={onSearch} 
        showSearchForm={showSearchForm} 
      />
      
      {/* Rest of content - appears after search form */}
      {showContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full"
        >
          <LandingPageTextSection />
          <TextSearchResultsWithFilters 
            activeFilters={activeFilters} 
            toggleFilter={toggleFilter} 
            filteredCars={filteredCars}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </motion.div>
      )}
    </div>
  );
}

function StoreFooter({ email, setEmail, onSubscribe }: { email: string; setEmail: (value: string) => void; onSubscribe: () => void }) {
  return (
    <div className="bg-[#fffbfa] box-border content-stretch flex flex-col gap-4 items-start justify-start px-0 py-12 relative shrink-0 w-full z-[1]" data-name="Store Footer">
      <div className="h-2 relative shrink-0 w-full" data-name="Container">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1344 8">
          <g id="Container">
            <g id="divider"></g>
          </g>
        </svg>
      </div>
      <div className="content-stretch flex gap-12 items-start justify-start relative shrink-0 w-full" data-name="pageLinks">
        <div className="basis-0 content-stretch flex flex-col gap-3 grow items-start justify-start min-h-px min-w-px relative shrink-0" data-name="logos">
          <Logo />
          <div className="content-stretch flex gap-3 items-start justify-start relative shrink-0" data-name="socials">
            <button className="cursor-pointer hover:opacity-70 transition-opacity">
              <div className="relative shrink-0 size-6" data-name="facebook">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                  <g id="facebook">
                    <path d={svgPaths.p6a67100} fill="var(--fill-0, #2E1914)" fillOpacity="0.62" id="Vector" />
                  </g>
                </svg>
              </div>
            </button>
            <button className="cursor-pointer hover:opacity-70 transition-opacity">
              <div className="relative shrink-0 size-6" data-name="instagram">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                  <g id="instagram">
                    <path d={svgPaths.p39559c70} fill="var(--fill-0, #2E1914)" fillOpacity="0.62" id="Vector" />
                  </g>
                </svg>
              </div>
            </button>
            <button className="cursor-pointer hover:opacity-70 transition-opacity">
              <div className="relative shrink-0 size-6" data-name="twitter">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                  <g id="twitter">
                    <path d={svgPaths.p20e7b7c0} fill="var(--fill-0, #2E1914)" fillOpacity="0.62" id="Vector" />
                  </g>
                </svg>
              </div>
            </button>
          </div>
        </div>
        <div className="content-stretch flex flex-col font-['Outfit:Medium',_sans-serif] font-medium gap-2 items-start justify-center leading-[0] relative shrink-0 text-[15px] w-[200px]" data-name="footerLinkColumn">
          <div className="relative shrink-0 text-[#281d1b] w-full">
            <p className="leading-[20px]">Company</p>
          </div>
          {["About Us", "Careers", "Press", "Blog"].map((link, index) => (
            <button key={index} className="relative shrink-0 text-[rgba(46,25,20,0.62)] w-full cursor-pointer hover:text-[#281d1b] transition-colors text-left">
              <p className="leading-[20px]">{link}</p>
            </button>
          ))}
        </div>
        <div className="content-stretch flex flex-col font-['Outfit:Medium',_sans-serif] font-medium gap-2 items-start justify-center leading-[0] relative shrink-0 text-[15px] w-[200px]" data-name="footerLinkColumn">
          <div className="relative shrink-0 text-[#281d1b] w-full">
            <p className="leading-[20px]">Support</p>
          </div>
          {["Contact", "FAQs", "Privacy Policy", "Terms of Service"].map((link, index) => (
            <button key={index} className="relative shrink-0 text-[rgba(46,25,20,0.62)] w-full cursor-pointer hover:text-[#281d1b] transition-colors text-left">
              <p className="leading-[20px]">{link}</p>
            </button>
          ))}
        </div>
        <div className="content-stretch flex flex-col gap-4 items-start justify-center relative shrink-0 w-[400px]" data-name="newsletter">
          <div className="content-stretch flex flex-col gap-1 items-start justify-start leading-[0] relative shrink-0 text-[#281d1b] text-[15px] w-full" data-name="Container">
            <div className="font-['Outfit:Bold',_sans-serif] font-bold relative shrink-0 text-nowrap">
              <p className="leading-[20px] whitespace-pre">Newsletter</p>
            </div>
            <div className="font-['Outfit:Regular',_sans-serif] font-normal min-w-full relative shrink-0" style={{ width: "min-content" }}>
              <p className="leading-[20px]">Subscribe for the latest deals and updates</p>
            </div>
          </div>
          <div className="content-stretch flex gap-3 items-start justify-start relative shrink-0 w-full" data-name="Container">
            <div className="basis-0 bg-[rgba(126,53,37,0.09)] grow min-h-px min-w-px relative rounded-lg shrink-0" data-name="inputStandard">
              <div aria-hidden="true" className="absolute border-[1.5px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-lg" />
              <div className="flex flex-row items-center relative size-full">
                <div className="box-border content-stretch flex gap-2 items-center justify-start px-3 py-2 relative w-full">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="basis-0 font-['Outfit:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[15px] text-[#281d1b] bg-transparent border-none outline-none placeholder:text-[rgba(46,25,20,0.4)]"
                  />
                </div>
              </div>
            </div>
            <button 
              onClick={onSubscribe}
              className="box-border content-stretch flex items-center justify-center px-4 py-2 relative rounded-lg shrink-0 cursor-pointer hover:bg-gray-50 transition-colors" 
              data-name="buttonOutlinedStandard"
            >
              <div aria-hidden="true" className="absolute border-[1.5px] border-[rgba(110,80,73,0.2)] border-solid inset-0 pointer-events-none rounded-lg" />
              <div className="font-['Outfit:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#281d1b] text-[15px] text-nowrap">
                <p className="leading-[20px] whitespace-pre">Subscribe</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AICar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [filteredCars, setFilteredCars] = useState(carListings);
  const [currentPage, setCurrentPage] = useState(1);
  const [email, setEmail] = useState("");
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Animation sequence
  useEffect(() => {
    // Show search form after 0.5 seconds
    const searchFormTimer = setTimeout(() => {
      setShowSearchForm(true);
    }, 500);

    // Show rest of content after search form appears
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 1500);

    return () => {
      clearTimeout(searchFormTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  const toggleFilter = (filter: string) => {
    const newFilters = new Set(activeFilters);
    if (newFilters.has(filter)) {
      newFilters.delete(filter);
    } else {
      newFilters.add(filter);
    }
    setActiveFilters(newFilters);
  };

  const onSearch = () => {
    if (searchQuery.trim()) {
      // Filter cars based on search query
      const filtered = carListings.filter(car => 
        car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCars(filtered);
    } else {
      setFilteredCars(carListings);
    }
    setCurrentPage(1);
  };

  const onSubscribe = () => {
    if (email.trim()) {
      alert(`Thanks for subscribing with email: ${email}`);
      setEmail("");
    }
  };

  return (
    <div
      className="bg-[#fffbfa] relative size-full"
      data-name="AICar - Used Car AI Search Platform"
    >
      <div className="min-h-inherit relative size-full">
        <StoreHeaderNavBarWithPromotion showPromo={false} onClosePromo={() => {}} />
        <div className="box-border content-stretch flex flex-col isolate items-start justify-start min-h-inherit px-12 py-0 relative size-full">
          <div className="box-border content-stretch flex isolate items-start justify-start px-0 py-12 relative shrink-0 w-full z-[2]" data-name="Container">
            <MainContent 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
              onSearch={onSearch}
              activeFilters={activeFilters} 
              toggleFilter={toggleFilter} 
              filteredCars={filteredCars}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              showSearchForm={showSearchForm}
              showContent={showContent}
            />
          </div>
          <StoreFooter email={email} setEmail={setEmail} onSubscribe={onSubscribe} />
        </div>
      </div>
    </div>
  );
}