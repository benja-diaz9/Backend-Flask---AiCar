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

type ChatMessage = { role: 'user' | 'assistant'; content: string }

type CarItem = { id: string; name: string; subtitle: string; price: string; tags: string[] }

const CATALOG: CarItem[] = [
  { id: 'c1', name: 'City Compacto Eco', subtitle: 'Urbano, económico', price: 'US$ 12.500', tags: ['hatchback','económico','ciudad','compacto','bajo consumo'] },
  { id: 'c2', name: 'Sedán Confort Plus', subtitle: 'Ruta y familia', price: 'US$ 17.800', tags: ['sedán','familia','baúl grande','confort','silencioso'] },
  { id: 'c3', name: 'SUV Familiar Ruta+', subtitle: 'Espacio y seguridad', price: 'US$ 22.900', tags: ['suv','seguro','viajes largos','espacio','estabilidad'] },
  { id: 'c4', name: 'Híbrido Diario', subtitle: 'Bajo consumo mixto', price: 'US$ 24.200', tags: ['híbrido','económico','ciudad','ruta','silencioso'] },
  { id: 'c5', name: 'Eléctrico Urbano', subtitle: 'Autonomía 300 km', price: 'US$ 28.000', tags: ['eléctrico','carga rápida','ciudad','bajo mantenimiento'] },
  { id: 'c6', name: 'Crossover Playa', subtitle: 'Espacio y altura', price: 'US$ 19.900', tags: ['playa','baúl grande','altura al suelo','familiar'] },
  { id: 'c7', name: 'Compacto Automático', subtitle: 'Fácil de manejar', price: 'US$ 14.900', tags: ['automático','compacto','económico','seguro'] },
  { id: 'c8', name: 'Offroad Ligero', subtitle: 'Tierra ocasional', price: 'US$ 21.300', tags: ['tierra','suspensión','altura al suelo','tracción'] },
  { id: 'c9', name: 'Ruta Silenciosa ADAS', subtitle: 'Asistencias y confort', price: 'US$ 26.400', tags: ['ruta','adas','silencioso','seguro'] }
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
  const [logoSrc, setLogoSrc] = useState<string>('/logo2.png')

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [threadId, setThreadId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [hasStarted, setHasStarted] = useState(false)
  const [animatingStart, setAnimatingStart] = useState(false)
  const [results, setResults] = useState<CarItem[]>([])
  const [animatingResults, setAnimatingResults] = useState(false)
  const resultsTimerRef = useRef<number | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const chatRef = useRef<HTMLDivElement | null>(null)

  // autoscroll chat to bottom on new messages
  useEffect(() => {
    if (!chatRef.current) return
    chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages, loading])

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
          <img src={logoSrc} onError={() => setLogoSrc('/logo.png')} alt="AiCar logo" className="brand-logo" />
          <div className="brand">AiCar</div>
        </div>
        <nav className="nav">
          <a>Buy</a>
          <a>Sell</a>
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
                placeholder="Search by make, model, or keyword"
                value={message}
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
                    <div className="result-head">
                      <h3 className="result-title">{item.name}</h3>
                      <span className="result-price">{item.price}</span>
                    </div>
                    <p className="result-sub">{item.subtitle}</p>
                    <div className="result-tags">
                      {item.tags.slice(0,5).map((t, i) => (
                        <span key={i} className="chip tag">{t}</span>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="chip"
                      onClick={() => setMessage(`Estoy considerando ${item.name}. ¿Qué opinas para mi caso?`)}
                    >
                      Use as a starting point
                    </button>
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
    </div>
  )
}
