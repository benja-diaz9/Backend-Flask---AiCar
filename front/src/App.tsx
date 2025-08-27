import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import svgPaths from "./imports/svg-lh0ecxeb4v";
import imgASleekModernCarParkedOnAScenicRoadWithMountainsInTheBackgroundDuringSunset from "./assets/52f59651552a527d7caa04cf128d5756924d97a3.png";

// Types for backend integration
type ChatMessage = { role: 'user' | 'assistant'; content: string }

type CarItem = {
  id: string | number
  marca: string
  modelo: string
  version?: string
  anio: number
  tipo_carroceria?: string
  tipo_combustible?: string
  transmision?: string
  potencia?: number
  consumo?: number
  kilometros?: number
  imagen_url?: string
}

type BackendCarItem = {
  id: number
  marca: string
  modelo: string
  version: string
  anio: number
  tipo_carroceria: string
  tipo_combustible: string
  transmision: string
  sistema_traccion: string
  potencia: number
  torque: number
  consumo: number
  autonomia_estimada: number
  kilometros: number
  imagen_url: string
  // ... other fields
}

function getBackendUrl(): string {
  const envUrl = import.meta.env.VITE_BACKEND_URL as string | undefined
  return (envUrl && envUrl.trim().length > 0) ? envUrl : 'http://localhost:5000'
}

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
      <span className="invisible block w-full" aria-hidden="true">
        {text}
      </span>
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
    <div className="flex gap-2 h-8 items-center justify-start relative" data-name="logo">
      <button onClick={handleLogoClick} className="cursor-pointer hover:opacity-70 transition-opacity">
        <div className="font-racing text-[28px] text-[#281d1b] lowercase">
          <p className="leading-none">AICar</p>
        </div>
      </button>
    </div>
  );
}

function Search() {
  return (
    <div className="relative size-6" data-name="search">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="search">
          <path d={svgPaths.p20679400} id="Icon" stroke="#281D1B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function User() {
  return (
    <div className="relative size-6" data-name="user">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="user">
          <path d={svgPaths.p2e0e8900} id="Icon" stroke="#281D1B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function ShoppingBag() {
  return (
    <div className="relative size-6" data-name="shopping-bag">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="shopping-bag">
          <path d={svgPaths.p13cfd080} id="Icon" stroke="#281D1B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Icons() {
  return (
    <div className="flex gap-6 items-end justify-start relative" data-name="icons">
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
    <div className="relative size-4" data-name="chevron-down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="chevron-down">
          <path d="M4 6L8 10L12 6" id="Icon" stroke="#281D1B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function PageLink({ title }: { title: string }) {
  return (
    <div className="flex gap-1 items-center justify-start relative" data-name="pageLink">
      <button className="cursor-pointer hover:opacity-70 transition-opacity">
        <div className="font-outfit font-medium text-[15px] text-[#281d1b]">
          <p className="leading-[20px]">{title}</p>
        </div>
      </button>
      <ChevronDown />
    </div>
  );
}

function PageLinks() {
  return (
    <div className="absolute flex gap-8 items-start justify-start left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" data-name="pageLinks">
      <PageLink title="Home" />
      <PageLink title="About Us" />
      <PageLink title="Listings" />
      <PageLink title="Contact" />
      <PageLink title="Support" />
    </div>
  );
}

function StoreHeaderNavBar() {
  return (
    <div className="bg-[#ff5733] box-border flex items-center justify-between overflow-hidden px-12 py-4 relative w-full z-[3]" data-name="Store - header nav bar">
      <Logo />
      <Icons />
      <PageLinks />
    </div>
  );
}

function ASleekModernCarParkedOnAScenicRoadWithMountainsInTheBackgroundDuringSunset() {
  return (
    <div 
      className="bg-center bg-cover bg-no-repeat h-[672px] relative rounded-[28px] w-full" 
      data-name="Car hero image" 
      style={{ backgroundImage: `url('${imgASleekModernCarParkedOnAScenicRoadWithMountainsInTheBackgroundDuringSunset}')` }}
    >
      <div className="absolute border-[1.5px] border-transparent inset-0 pointer-events-none rounded-[28px]" />
    </div>
  );
}

function InputStandard({ value, onChange, placeholder, onKeyDown }: { 
  value: string; 
  onChange: (value: string) => void; 
  placeholder: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}) {
  return (
    <div className="flex-1 bg-[#fffbfa] min-h-[48px] relative rounded-lg" data-name="inputStandard">
      <div className="absolute border-[1.5px] border-transparent inset-0 pointer-events-none rounded-lg" />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border flex gap-2 items-center justify-start px-4 py-2 relative size-full">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className="flex-1 font-outfit font-normal text-[20px] text-[#281d1b] bg-transparent border-none outline-none placeholder:text-[rgba(46,24,20,0.4)]"
          />
        </div>
      </div>
    </div>
  );
}

function ButtonLarge({ onClick, children, disabled = false }: { 
  onClick: () => void; 
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#ff5733] hover:bg-[#e94c28] cursor-pointer'} box-border flex items-center justify-center px-6 py-3 relative rounded-lg transition-colors`}
      data-name="buttonLarge"
    >
      <div className="font-outfit font-medium text-[20px] text-[#050100]">
        <p className="leading-[24px]">{children}</p>
      </div>
    </button>
  );
}

function SearchFrame({ searchQuery, setSearchQuery, onSearch, isLoading }: { 
  searchQuery: string; 
  setSearchQuery: (value: string) => void; 
  onSearch: () => void;
  isLoading: boolean;
}) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      onSearch();
    }
  };

  return (
    <div className="flex gap-3 items-start justify-start relative w-[600px]" data-name="SearchFrame">
      <InputStandard 
        value={searchQuery} 
        onChange={setSearchQuery} 
        placeholder="Type your car search prompt here..." 
        onKeyDown={handleKeyDown}
      />
      <ButtonLarge onClick={onSearch} disabled={isLoading}>
        {isLoading ? 'Searching...' : 'Search'}
      </ButtonLarge>
    </div>
  );
}

function LandingPageHero({ searchQuery, setSearchQuery, onSearch, showSearchForm, isLoading }: { 
  searchQuery: string; 
  setSearchQuery: (value: string) => void; 
  onSearch: () => void; 
  showSearchForm: boolean;
  isLoading: boolean;
}) {
  return (
    <div className="bg-[#fffbfa] box-border flex flex-col gap-12 items-center justify-start px-0 py-24 relative w-full z-[4]" data-name="Landing Page Hero">
      <div className="font-outfit font-bold text-[120px] text-[#281d1b] text-center w-full z-[6]">
        <p className="leading-[120px]">
          <TypingText text="Find Your Perfect Ride with AI-Powered Search" speed={80} />
        </p>
      </div>
      <div className="relative w-full z-[5]">
        <ASleekModernCarParkedOnAScenicRoadWithMountainsInTheBackgroundDuringSunset />
        
        {showSearchForm && (
          <motion.div
            initial={{ opacity: 0, y: 200 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center z-[7]"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
              <div className="mb-6">
                <div className="font-outfit font-bold text-[#281d1b] text-[32px] text-center">
                  <p>Enter your car search prompt:</p>
                </div>
              </div>
              <SearchFrame 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                onSearch={onSearch} 
                isLoading={isLoading}
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function ChatMessage({ message, isUser }: { message: string; isUser: boolean }) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] p-4 rounded-xl ${
        isUser 
          ? 'bg-[#ff5733] text-white' 
          : 'bg-gray-100 text-[#281d1b]'
      }`}>
        <p className="font-outfit text-[14px] leading-[20px]">{message}</p>
      </div>
    </div>
  );
}

function CarResultCard({ car }: { car: CarItem }) {
  const getCarImage = () => {
    if (car.imagen_url && car.imagen_url !== '') {
      return car.imagen_url;
    }
    // Fallback to a default car image
    return imgASleekModernCarParkedOnAScenicRoadWithMountainsInTheBackgroundDuringSunset;
  };

  const formatPrice = (car: CarItem) => {
    // Since we don't have price in MySQL, we'll estimate based on year and other factors
    const basePrice = Math.max(5000, 50000 - (2024 - car.anio) * 2000);
    return `$${basePrice.toLocaleString()}`;
  };

  const formatKilometers = (km?: number) => {
    if (!km) return 'N/A';
    return `${km.toLocaleString()} km`;
  };

  return (
    <div className="bg-[#fffbfa] border border-gray-200 rounded-xl p-4 flex flex-col gap-3 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="relative h-48 rounded-lg overflow-hidden bg-gray-100">
        <img
          src={getCarImage()}
          alt={`${car.marca} ${car.modelo}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            const img = e.currentTarget;
            img.onerror = null;
            img.src = imgASleekModernCarParkedOnAScenicRoadWithMountainsInTheBackgroundDuringSunset;
          }}
        />
        <button className="absolute top-2 right-2 bg-white border border-gray-200 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center hover:text-red-500 hover:border-gray-300 transition-colors">
          ♥
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-outfit font-bold text-[17px] text-[#281d1b]">
          {car.marca} {car.modelo} {car.version && `${car.version}`}
        </h3>
        <div className="font-outfit text-[15px] text-gray-600">
          {car.anio} • {car.tipo_carroceria} • {car.transmision} • {car.tipo_combustible}
          {car.consumo && ` • ${car.consumo} L/100km`}
        </div>
        <div className="flex items-center justify-between">
          <span className="font-outfit text-[13px] text-gray-500">
            {formatKilometers(car.kilometros)}
          </span>
          <span className="font-outfit font-bold text-[18px] text-[#ff5733]">
            {formatPrice(car)}
          </span>
        </div>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff5733]"></div>
    </div>
  );
}

export default function AICar() {
  const backendUrl = useMemo(() => getBackendUrl(), []);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [cars, setCars] = useState<CarItem[]>([]);
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Animation sequence
  useEffect(() => {
    const searchFormTimer = setTimeout(() => {
      setShowSearchForm(true);
    }, 500);

    return () => {
      clearTimeout(searchFormTimer);
    };
  }, []);

  const ensureThread = async (): Promise<string> => {
    if (threadId) return threadId;
    
    const response = await fetch(`${backendUrl}/start`, { method: 'GET' });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error || `Error starting conversation (${response.status})`);
    }
    
    const data = await response.json();
    if (!data.thread_id) throw new Error('Missing thread_id in backend response');
    
    setThreadId(data.thread_id);
    return data.thread_id as string;
  };

  const searchCars = async (whereClause?: string) => {
    try {
      const requestBody: any = { limit: 6 };
      if (whereClause) {
        requestBody.where = whereClause;
      }

      const response = await fetch(`${backendUrl}/search_sql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Search failed (${response.status})`);
      }

      const data = await response.json();
      const backendCars: BackendCarItem[] = data.items || [];
      
      // Transform backend cars to our CarItem format
      const transformedCars: CarItem[] = backendCars.map(car => ({
        id: car.id,
        marca: car.marca,
        modelo: car.modelo,
        version: car.version,
        anio: car.anio,
        tipo_carroceria: car.tipo_carroceria,
        tipo_combustible: car.tipo_combustible,
        transmision: car.transmision,
        potencia: car.potencia,
        consumo: car.consumo,
        kilometros: car.kilometros,
        imagen_url: car.imagen_url
      }));

      setCars(transformedCars);
    } catch (error) {
      console.error('Error searching cars:', error);
      setCars([]); // Show empty results on error
    }
  };

  const onSearch = async () => {
    if (!searchQuery.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      // Start chat if not already started
      if (!hasStarted) {
        setHasStarted(true);
      }

      // Ensure we have a thread
      const currentThreadId = await ensureThread();

      // Add user message to chat
      setMessages(prev => [...prev, { role: 'user', content: searchQuery }]);

      // Send message to backend
      const chatResponse = await fetch(`${backendUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thread_id: currentThreadId, message: searchQuery })
      });

      if (!chatResponse.ok) {
        const body = await chatResponse.json().catch(() => ({}));
        throw new Error(body.error || `Chat error (${chatResponse.status})`);
      }

      const chatData = await chatResponse.json();
      let assistantResponse = chatData.response;

      // Add assistant response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: assistantResponse }]);

      // Try to parse JSON response to extract SQL WHERE clause
      let whereClause = null;
      try {
        // Look for JSON in the response
        const jsonMatch = assistantResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsedResponse = JSON.parse(jsonMatch[0]);
          whereClause = parsedResponse.sql_where_mysql;
        }
      } catch (parseError) {
        console.log('Could not parse JSON from assistant response, searching without WHERE clause');
      }

      // Search for cars
      await searchCars(whereClause);

      // Clear search query
      setSearchQuery("");

    } catch (error) {
      console.error('Search error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasStarted) {
    return (
      <div className="bg-[#fffbfa] relative size-full min-h-screen">
        <div className="relative size-full min-h-screen">
          <StoreHeaderNavBar />
          <div className="box-border flex flex-col items-start justify-start min-h-[calc(100vh-72px)] px-12 py-0 relative size-full">
            <div className="box-border flex items-start justify-start px-0 py-12 relative w-full z-[2]">
              <div className="flex-1 flex flex-col items-start justify-start relative">
                <LandingPageHero 
                  searchQuery={searchQuery} 
                  setSearchQuery={setSearchQuery} 
                  onSearch={onSearch}
                  showSearchForm={showSearchForm}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fffbfa] relative size-full min-h-screen">
      <div className="relative size-full min-h-screen">
        <StoreHeaderNavBar />
        <div className="box-border flex flex-col items-start justify-start min-h-[calc(100vh-72px)] px-12 py-0 relative size-full">
          
          {/* Chat and Results Layout */}
          <div className="flex gap-8 w-full py-8">
            
            {/* Left Side - Chat */}
            <div className="w-1/2 bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
              <h2 className="font-outfit font-bold text-[24px] text-[#281d1b] mb-6">Chat with AI Assistant</h2>
              
              {/* Messages */}
              <div className="h-96 overflow-y-auto mb-4 border border-gray-100 rounded-lg p-4">
                {messages.map((message, index) => (
                  <ChatMessage 
                    key={index} 
                    message={message.content} 
                    isUser={message.role === 'user'} 
                  />
                ))}
                
                {isLoading && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-gray-100 p-4 rounded-xl">
                      <LoadingSpinner />
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="flex gap-3">
                <InputStandard 
                  value={searchQuery} 
                  onChange={setSearchQuery} 
                  placeholder="Type your message..."
                  onKeyDown={(e) => e.key === 'Enter' && !isLoading && onSearch()}
                />
                <ButtonLarge onClick={onSearch} disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send'}
                </ButtonLarge>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Right Side - Results */}
            <div className="w-1/2 bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
              <h2 className="font-outfit font-bold text-[24px] text-[#281d1b] mb-6">Search Results</h2>
              
              {cars.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
                  {cars.map((car) => (
                    <CarResultCard key={car.id} car={car} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <p className="font-outfit text-center">
                    {isLoading ? 'Searching for cars...' : 'Start a search to see results here'}
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}