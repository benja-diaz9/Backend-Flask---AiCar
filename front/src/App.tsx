import { useEffect, useMemo, useRef, useState } from 'react'

function getBackendUrl(): string {
  const envUrl = import.meta.env.VITE_BACKEND_URL as string | undefined
  return (envUrl && envUrl.trim().length > 0) ? envUrl : 'http://localhost:8080'
}

const PROMPT_SUGGESTIONS: string[] = [
  'I need a reliable and fuel-efficient SUV under $30,000.',
  'Looking for a compact city hatchback with low maintenance.',
  'Family sedan for 5 with large trunk and safety features.',
  'An electric car for 60 km daily commute with good support.'
]

// Sell form modal for owners/dealers
type SellFormData = {
  ownerName: string
  email: string
  role: 'owner' | 'dealer'
  make: string
  model: string
  year: string
  mileage: string
  price: string
  fuel: string
  transmission: string
  condition: string
  vin: string
  location: string
  description: string
}

function SellFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState<SellFormData>({
    ownerName: '', email: '', role: 'owner', make: '', model: '', year: '', mileage: '', price: '',
    fuel: '', transmission: '', condition: '', vin: '', location: '', description: ''
  })
  const [files, setFiles] = useState<File[]>([])

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  function onChange<K extends keyof SellFormData>(key: K, value: SellFormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function onFilesSelected(list: FileList | null) {
    if (!list) return
    const next = Array.from(list).filter(f => f.type.startsWith('image/'))
    setFiles(prev => [...prev, ...next].slice(0, 12))
  }

  function onDrop(ev: React.DragEvent<HTMLDivElement>) {
    ev.preventDefault()
    onFilesSelected(ev.dataTransfer.files)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Placeholder submit: preview data in console. Wire to backend later.
    const payload = { ...form, images: files.map(f => ({ name: f.name, size: f.size, type: f.type })) }
    console.log('Sell submission', payload)
    alert('Your car submission has been captured locally. Backend hookup pending.')
    onClose()
    setFiles([])
    setForm({ ownerName: '', email: '', role: 'owner', make: '', model: '', year: '', mileage: '', price: '', fuel: '', transmission: '', condition: '', vin: '', location: '', description: '' })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Sell your car</h3>
          <button className="modal-close" aria-label="Close" onClick={onClose}>×</button>
        </div>
        <form className="sell-form" onSubmit={onSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label>Name</label>
              <input className="input" value={form.ownerName} onChange={e=>onChange('ownerName', e.target.value)} />
            </div>
            <div className="form-field">
              <label>Email</label>
              <input className="input" type="email" value={form.email} onChange={e=>onChange('email', e.target.value)} />
            </div>
            <div className="form-field">
              <label>Role</label>
              <select className="input" value={form.role} onChange={e=>onChange('role', e.target.value as SellFormData['role'])}>
                <option value="owner">Owner</option>
                <option value="dealer">Dealer</option>
              </select>
            </div>
            <div className="form-field">
              <label>Make</label>
              <input className="input" value={form.make} onChange={e=>onChange('make', e.target.value)} />
            </div>
            <div className="form-field">
              <label>Model</label>
              <input className="input" value={form.model} onChange={e=>onChange('model', e.target.value)} />
            </div>
            <div className="form-field">
              <label>Year</label>
              <input className="input" inputMode="numeric" value={form.year} onChange={e=>onChange('year', e.target.value)} />
            </div>
            <div className="form-field">
              <label>Mileage</label>
              <input className="input" inputMode="numeric" value={form.mileage} onChange={e=>onChange('mileage', e.target.value)} />
            </div>
            <div className="form-field">
              <label>Price</label>
              <input className="input" inputMode="numeric" value={form.price} onChange={e=>onChange('price', e.target.value)} />
            </div>
            <div className="form-field">
              <label>Fuel</label>
              <input className="input" value={form.fuel} onChange={e=>onChange('fuel', e.target.value)} />
            </div>
            <div className="form-field">
              <label>Transmission</label>
              <input className="input" value={form.transmission} onChange={e=>onChange('transmission', e.target.value)} />
            </div>
            <div className="form-field">
              <label>Condition</label>
              <input className="input" value={form.condition} onChange={e=>onChange('condition', e.target.value)} />
            </div>
            <div className="form-field">
              <label>VIN (optional)</label>
              <input className="input" value={form.vin} onChange={e=>onChange('vin', e.target.value)} />
            </div>
            <div className="form-field">
              <label>Location</label>
              <input className="input" value={form.location} onChange={e=>onChange('location', e.target.value)} />
            </div>
            <div className="form-field form-span-2">
              <label>Description</label>
              <textarea className="input" rows={3} value={form.description} onChange={e=>onChange('description', e.target.value)} />
            </div>
          </div>

          <div className="form-block">
            <label>Photos</label>
            <div className="dropzone" onDragOver={e=>e.preventDefault()} onDrop={onDrop}>
              <input id="photos" type="file" accept="image/*" multiple onChange={(e)=>onFilesSelected(e.target.files)} hidden />
              <p>Drag and drop images here or <label htmlFor="photos" className="link">browse</label></p>
            </div>
            {files.length > 0 && (
              <div className="thumb-grid">
                {files.map((f, i) => (
                  <div key={i} className="thumb">
                    <img src={URL.createObjectURL(f)} alt={f.name} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="button secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="button">Submit</button>
          </div>
        </form>
      </div>
    </div>
  )
}

type ChatMessage = { role: 'user' | 'assistant'; content: string }

type CarItem = {
  id: string
  name: string
  subtitle: string
  price: string
  miles: string
  image: string
  tags: string[]
}

const CATALOG: CarItem[] = [
  {
    id: 'c1',
    name: 'Toyota RAV4 2022',
    subtitle: '25,000 miles',
    price: '$28,500',
    miles: '25,000 miles',
    image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=1600&q=80',
    tags: ['suv','seguro','viajes largos','espacio','estabilidad']
  },
  {
    id: 'c2',
    name: 'Honda CR-V 2021',
    subtitle: '32,000 miles',
    price: '$27,900',
    miles: '32,000 miles',
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1600&q=80',
    tags: ['suv','familia','confort','económico']
  },
  {
    id: 'c3',
    name: 'Ford Escape 2022',
    subtitle: '18,000 miles',
    price: '$29,200',
    miles: '18,000 miles',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop',
    tags: ['suv','seguro','familia']
  },
  {
    id: 'c4',
    name: 'Mazda CX-5 2022',
    subtitle: '22,000 miles',
    price: '$29,800',
    miles: '22,000 miles',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1600&auto=format&fit=crop',
    tags: ['suv','confort','ruta','silencioso']
  },
  {
    id: 'c5',
    name: 'City Compacto Eco',
    subtitle: 'Urbano, económico',
    price: '$12,500',
    miles: '12,000 miles',
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1600&auto=format&fit=crop',
    tags: ['hatchback','económico','ciudad','compacto','bajo consumo']
  },
  {
    id: 'c6',
    name: 'Sedán Confort Plus',
    subtitle: 'Ruta y familia',
    price: '$17,800',
    miles: '20,100 miles',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop',
    tags: ['sedán','familia','baúl grande','confort','silencioso']
  }
]

function computeRecommendations(query: string, limit = 6): CarItem[] {
  const q = query.toLowerCase()
  const keywords: Record<string,string[]> = {
    playa: ['playa','equipaje','baúl','espacio'],
    ciudad: ['ciudad','urbano','compacto','estacionar'],
    economico: ['econ','barato','ahorro','bajo consumo'],
    familia: ['familia','baúl','espacio','confort'],
    seguro: ['seguro','adas','asistencias','estabilidad'],
    suv: ['suv','crossover','altura'],
    automatico: ['automático','automatico'],
    hibrido: ['híbrido','hibrido'],
    electrico: ['eléctrico','electrico','carga'],
    tierra: ['tierra','offroad','ripio','suspensión'],
    ruta: ['ruta','viajes','silencioso']
  }
  function score(item: CarItem): number {
    let s = 0
    for (const [_, kws] of Object.entries(keywords)) {
      for (const k of kws) if (q.includes(k)) s += item.tags.some(t=>t.includes(k.replace(/í|ì|ï/g,'i')) || t.includes(k)) ? 2 : 1
    }
    for (const t of item.tags) if (q.includes(t)) s += 1
    return s
  }
  const ranked = [...CATALOG]
    .map(it => ({ it, s: score(it) }))
    .sort((a,b)=> b.s - a.s)
    .map(x=>x.it)
  return (ranked[0] && (ranked[0].tags.length>0)) ? ranked.slice(0, limit) : CATALOG.slice(0, limit)
}

export default function App() {
  const backendUrl = useMemo(() => getBackendUrl(), [])
  const [logoSrc, setLogoSrc] = useState<string>('/aicarlogo2.png')

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [threadId, setThreadId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [hasStarted, setHasStarted] = useState(false)
  const [animatingStart, setAnimatingStart] = useState(false)
  const [results, setResults] = useState<CarItem[]>([])
  const [animatingResults, setAnimatingResults] = useState(false)
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0)
  const resultsTimerRef = useRef<number | null>(null)
  const suggestionTimerRef = useRef<number | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const heroInputRef = useRef<HTMLInputElement | null>(null)
  const chatRef = useRef<HTMLDivElement | null>(null)
  const [sellOpen, setSellOpen] = useState(false)

  // autoscroll chat to bottom on new messages
  useEffect(() => {
    if (!chatRef.current) return
    chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages, loading])

  // cycle through search suggestions
  useEffect(() => {
    if (hasStarted) return // stop cycling once chat starts
    
    const cycleSuggestions = () => {
      setCurrentSuggestionIndex((prev) => (prev + 1) % PROMPT_SUGGESTIONS.length)
    }
    
    suggestionTimerRef.current = window.setTimeout(cycleSuggestions, 3000)
    
    return () => {
      if (suggestionTimerRef.current) {
        window.clearTimeout(suggestionTimerRef.current)
      }
    }
  }, [currentSuggestionIndex, hasStarted])

  function autoResize(el: HTMLTextAreaElement) {
    const min = 40
    const max = 220
    el.style.height = 'auto'
    const next = Math.min(max, Math.max(min, el.scrollHeight))
    el.style.height = `${next}px`
  }

  function triggerResultsAnimation() {
    if (resultsTimerRef.current) window.clearTimeout(resultsTimerRef.current)
    setAnimatingResults(true)
    resultsTimerRef.current = window.setTimeout(() => setAnimatingResults(false), 350)
  }

  function handleSellClick() {
    setSellOpen(true)
  }

  function handleLogoClick() {
    setHasStarted(false)
    setMessages([])
    setResults([])
    setMessage('')
    setThreadId(null)
    setError(null)
    setLoading(false)
  }

  async function ensureThread(): Promise<string> {
    if (threadId) return threadId
    const res = await fetch(`${backendUrl}/start`, { method: 'GET' })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || `Error al iniciar la conversación (${res.status})`)
    }
    const data = await res.json()
    if (!data.thread_id) throw new Error('Falta thread_id en la respuesta del backend')
    setThreadId(data.thread_id)
    return data.thread_id as string
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const text = message.trim()
    if (text.length === 0 || loading) return

    setLoading(true)
    try {
      const id = await ensureThread()

      if (!hasStarted) {
        setHasStarted(true)
        setAnimatingStart(true)
        const recs = computeRecommendations(text)
        setResults(recs)
        triggerResultsAnimation()
        window.setTimeout(() => setAnimatingStart(false), 450)
      } else {
        const recs = computeRecommendations(text)
        setResults(recs)
        triggerResultsAnimation()
      }

      setMessages((prev) => [...prev, { role: 'user', content: text }])
      setMessage('')
      requestAnimationFrame(() => {
        if (textareaRef.current) autoResize(textareaRef.current)
      })

      const chatRes = await fetch(`${backendUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thread_id: id, message: text })
      })
      if (!chatRes.ok) {
        const body = await chatRes.json().catch(() => ({}))
        throw new Error(body.error || `Error del chat (${chatRes.status})`)
      }
      const data = await chatRes.json()
      const assistantText = typeof data.response === 'string' ? data.response : JSON.stringify(data)
      setMessages((prev) => [...prev, { role: 'assistant', content: assistantText }])
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      {/* Top bar with nav and sign-in */}
      <div className="topbar topbar-split">
        <div className="brand-wrap">
          <img 
            src={logoSrc} 
            onError={() => setLogoSrc('/logo2.png')} 
            alt="AiCar logo" 
            className="brand-logo" 
            onClick={handleLogoClick}
            style={{ cursor: 'pointer' }}
          />
        </div>
        <nav className="nav">
          <a>Buy</a>
          <a role="button" onClick={handleSellClick}>Sell</a>
          <a>Value</a>
          <a>Research</a>
        </nav>
        <button className="signin">Sign in</button>
      </div>

      {!hasStarted ? (
        <section className="hero" aria-label="Landing">
          <div className="hero-overlay" />
          <div className="hero-content">
            <h1 className="hero-title-xxl">Find your perfect car</h1>
            <p className="hero-sub">Search smarter with AI. Get personalized recommendations and insights to help you find the best car for your needs.</p>
            <form className="searchbar" onSubmit={handleSend}>
              <input
                type="text"
                className="search-input"
                placeholder={PROMPT_SUGGESTIONS[currentSuggestionIndex]}
                value={message}
                ref={heroInputRef}
                onChange={(e)=>setMessage(e.target.value)}
              />
              <button className="search-button" type="submit">Search</button>
            </form>
          </div>
        </section>
      ) : (
        <main className="container">
          <div className={`layout fade-in`}>
            <section className={`pane card left-pane ${animatingStart ? 'from-center' : ''}`} aria-label="Conversation" ref={chatRef}>
              <div className="chat">
                {messages.map((m, idx) => (
                  <div key={idx} className={`bubble ${m.role === 'user' ? 'user' : 'assistant'}`}>
                    <div className="bubble-inner">{m.content}</div>
                  </div>
                ))}
                {loading && (
                  <div className="bubble assistant">
                    <div className="bubble-inner">
                      <div className="dots" aria-label="Typing">
                        <span></span><span></span><span></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <form className="composer-bottom" onSubmit={handleSend}>
                <label htmlFor="message" className="label">Your message</label>
                <textarea
                  id="message"
                  ref={textareaRef}
                  className={`input one-line`}
                  placeholder={'Type your message...'}
                  rows={1}
                  onInput={(e) => autoResize(e.currentTarget)}
                  value={message}
                  onChange={(e) => { setMessage(e.target.value); autoResize(e.target as HTMLTextAreaElement) }}
                />
                <button className="button" type="submit" disabled={loading}>
                  {loading ? 'Sending…' : 'Send'}
                </button>
                {error && <div className="alert error" role="alert">{error}</div>}
              </form>
            </section>

            <aside className={`pane card right-pane ${animatingStart ? 'from-right' : ''}`} aria-label="Personalized results">
              <h2 className="panel-title">Your personalized results</h2>
              <div className={`results-grid ${animatingResults ? 'crossfade' : ''}`}>
                {results.map(item => (
                  <article key={item.id} className="result-card">
                    <div className="result-media">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        onError={(e) => {
                          const img = e.currentTarget
                          img.onerror = null
                          img.src = '/hero.png'
                        }}
                      />
                      <button className="fav" aria-label="Save">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 21s-6.716-4.29-9.428-7.002C-0.14 11.57-.14 7.93 2.572 6.002 4.5 4.644 7.07 5.002 8.5 6.93L12 11l3.5-4.07c1.43-1.928 4-2.286 5.928-.928 2.712 1.928 2.712 5.57 0 7.996C18.716 16.71 12 21 12 21z" fill="currentColor"/>
                        </svg>
                      </button>
                    </div>
                    <h3 className="result-title">{item.name}</h3>
                    <div className="result-meta">
                      <span className="result-miles">{item.miles}</span>
                      <span className="result-price">{item.price}</span>
                    </div>
                  </article>
                ))}
                {results.length === 0 && (
                  <p className="result-empty">No exact matches. Try refining your search.</p>
                )}
              </div>
            </aside>
          </div>
        </main>
      )}

      <footer className="footer">
        <span>Backend: {backendUrl}</span>
      </footer>

      <SellFormModal open={sellOpen} onClose={() => setSellOpen(false)} />
    </div>
  )
}
