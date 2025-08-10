import { useEffect, useMemo, useRef, useState } from 'react'

function getBackendUrl(): string {
  const envUrl = import.meta.env.VITE_BACKEND_URL as string | undefined
  return (envUrl && envUrl.trim().length > 0) ? envUrl : 'http://localhost:8080'
}

const PROMPT_SUGGESTIONS: string[] = [
  'Quiero un auto para irme a la playa, cómodo y con buen espacio para equipaje.',
  'Me gustaría un auto económico, fácil de manejar y seguro para ciudad.',
  'Busco un hatchback compacto con bajo consumo para trayectos urbanos.',
  'Necesito un sedán cómodo para familia de 5, con buen baúl y bajo mantenimiento.',
  'Recomiéndame un SUV para viajes largos con buena estabilidad y seguridad.',
  'Quiero un auto automático, económico y confiable con presupuesto medio.',
  'Busco un auto híbrido para uso diario, autonomía y costo de mantenimiento razonable.',
  'Necesito un auto para caminos de tierra ocasionales, suspensión confortable.',
  'Quiero un auto eléctrico para 60 km diarios, buen servicio postventa.',
  'Me interesa un auto pequeño para estacionar fácil, bajo seguro y repuestos accesibles.',
  'Recomendá un auto para uso en ruta, silencioso y con asistencias ADAS.',
  'Quiero un auto con buena distancia al suelo y consumo moderado para ciudad y ruta.'
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

type Featured = { title: string; subtitle: string; details: string }
const FEATURED_CARS: Featured[] = [
  {
    title: 'City Compacto Eco',
    subtitle: 'Económico, fácil de manejar',
    details: 'Hatchback urbano con bajo consumo, ideal para trayectos diarios y estacionamiento sencillo.'
  },
  {
    title: 'SUV Familiar Ruta+ ',
    subtitle: 'Espacio y seguridad',
    details: 'SUV confortable para viajes largos, buen baúl y asistencias de conducción para mayor seguridad.'
  },
  {
    title: 'Sedán Confort Plus',
    subtitle: 'Equilibrio y mantenimiento bajo',
    details: 'Sedán amplio para 5 pasajeros, silencioso en ruta y costos de mantenimiento contenidos.'
  }
]

export default function App() {
  const backendUrl = useMemo(() => getBackendUrl(), [])
  // Add logo2.png with fallback to logo.png
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

  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  const [phStage, setPhStage] = useState<'none'|'out'|'in'>('none')
  const phIntervalRef = useRef<number | null>(null)
  const phTimeoutRef = useRef<number | null>(null)
  const placeholder = hasStarted ? 'Escribe tu mensaje...' : `Ejemplo: ${PROMPT_SUGGESTIONS[placeholderIdx]}`

  // rotate examples only before chat starts and while input is empty, with fade-out then fade-in
  useEffect(() => {
    if (hasStarted || message.trim().length > 0) return
    const tick = () => {
      setPhStage('out')
      if (phTimeoutRef.current) window.clearTimeout(phTimeoutRef.current)
      phTimeoutRef.current = window.setTimeout(() => {
        setPlaceholderIdx(i => (i + 1) % PROMPT_SUGGESTIONS.length)
        setPhStage('in')
        phTimeoutRef.current = window.setTimeout(() => setPhStage('none'), 250)
      }, 200)
    }
    tick() // start immediately
    phIntervalRef.current = window.setInterval(tick, 4000)
    return () => {
      if (phIntervalRef.current) window.clearInterval(phIntervalRef.current)
      if (phTimeoutRef.current) window.clearTimeout(phTimeoutRef.current)
    }
  }, [hasStarted, message])

  // autoscroll chat to bottom on new messages
  useEffect(() => {
    if (!chatRef.current) return
    chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages, loading])

  // Auto-resize helper for the bottom composer
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

  function useSuggestion(text: string) {
    setMessage(text)
    requestAnimationFrame(() => {
      if (textareaRef.current) autoResize(textareaRef.current)
      textareaRef.current?.focus()
    })
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

      // First-time transition and compute recommendations
      if (!hasStarted) {
        setHasStarted(true)
        setAnimatingStart(true)
        const recs = computeRecommendations(text)
        setResults(recs)
        triggerResultsAnimation()
        window.setTimeout(() => setAnimatingStart(false), 450)
      } else {
        // Update results heuristically on each new user message
        const recs = computeRecommendations(text)
        setResults(recs)
        triggerResultsAnimation()
      }

      // Optimistically append user message
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

  const showGhost = !hasStarted && message.trim().length === 0

  return (
    <div className="page">
      {/* Top banner */}
      <div className="topbar">
        <div className="brand-wrap">
          <img
            src={logoSrc}
            onError={() => setLogoSrc('/logo.png')}
            alt="AiCar logo"
            className="brand-logo"
          />
          <div className="brand">AiCar</div>
        </div>
      </div>

      <main className="container">
        {/* Landing hero + composer */}
        {!hasStarted ? (
          <section className="card" aria-label="Primer mensaje">
            <h1 className="hero-title">Encuentra tu próximo auto</h1>
            <form onSubmit={handleSend} className={`composer-top`}>
              <div className="field">
                {showGhost && (
                  <span className={`ghost ${phStage==='out' ? 'out' : phStage==='in' ? 'in' : ''}`}>{placeholder}</span>
                )}
                <textarea
                  id="message"
                  ref={textareaRef}
                  className={`input`}
                  placeholder={showGhost ? '' : placeholder}
                  rows={10}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <button className="button" type="submit" disabled={loading}>
                {loading ? 'Enviando…' : 'Empezar y enviar'}
              </button>
              {error && <div className="alert error" role="alert">{error}</div>}
            </form>
          </section>
        ) : (
          <div className={`layout fade-in`}>
            <section className={`pane card left-pane ${animatingStart ? 'from-center' : ''}`} aria-label="Conversación" ref={chatRef}>
              <div className="chat">
                {messages.map((m, idx) => (
                  <div key={idx} className={`bubble ${m.role === 'user' ? 'user' : 'assistant'}`}>
                    <div className="bubble-inner">{m.content}</div>
                  </div>
                ))}
                {loading && (
                  <div className="bubble assistant"><div className="bubble-inner">Escribiendo…</div></div>
                )}
              </div>

              <form className="composer-bottom" onSubmit={handleSend}>
                <label htmlFor="message" className="label">Tu mensaje</label>
                <textarea
                  id="message"
                  ref={textareaRef}
                  className={`input one-line`}
                  placeholder={placeholder}
                  rows={1}
                  onInput={(e) => autoResize(e.currentTarget)}
                  value={message}
                  onChange={(e) => { setMessage(e.target.value); autoResize(e.target as HTMLTextAreaElement) }}
                />
                <button className="button" type="submit" disabled={loading}>
                  {loading ? 'Enviando…' : 'Enviar'}
                </button>
                {error && <div className="alert error" role="alert">{error}</div>}
              </form>
            </section>

            <aside className={`pane card right-pane ${animatingStart ? 'from-right' : ''}`} aria-label="Publicaciones recomendadas">
              <h2 className="label">Publicaciones que encajan</h2>
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
                      Usar como punto de partida
                    </button>
                  </article>
                ))}
                {results.length === 0 && (
                  <p className="result-empty">No hay coincidencias exactas. Ajusta tu búsqueda.</p>
                )}
              </div>
            </aside>
          </div>
        )}

        {/* Featured posts (solo en landing) */}
        {!hasStarted && (
          <section className="featured card" aria-label="Publicaciones destacadas">
            <h2 className="label">Publicaciones destacadas</h2>
            <div className="featured-grid">
              {FEATURED_CARS.map((item, idx) => (
                <article key={idx} className="featured-card">
                  <h3 className="featured-title">{item.title}</h3>
                  <p className="featured-subtitle">{item.subtitle}</p>
                  <p className="featured-desc">{item.details}</p>
                  <button
                    type="button"
                    className="chip"
                    onClick={() => setMessage(`Estoy buscando algo como: ${item.title}. ${item.details}`)}
                  >
                    Usar como punto de partida
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <span>Backend: {backendUrl}</span>
      </footer>
    </div>
  )
}
