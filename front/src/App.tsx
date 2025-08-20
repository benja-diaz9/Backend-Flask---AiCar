import { useEffect, useMemo, useRef, useState } from 'react'

/* ===================== Helpers ===================== */

function getBackendUrl(): string {
  const envUrl = import.meta.env.VITE_BACKEND_URL as string | undefined
  return (envUrl && envUrl.trim().length > 0) ? envUrl : 'http://127.0.0.1:5000'
}

function log(...args: any[]) {
  // eslint-disable-next-line no-console
  console.log('[AiCar]', ...args)
}

// Tipos inline
type AiCarMeta = {
  normalization_applied?: boolean
  assumptions?: string[]
  issues?: string[]
  next_questions?: string[]
}
type AiCarResponse = {
  ui_text?: string
  filters?: Record<string, unknown>
  sql_where_mysql?: string
  meta?: AiCarMeta
}
type ChatMessage = { role: 'user' | 'assistant'; content: string; suggestions?: string[] }
type CarItem = { id: string; name: string; subtitle: string; price?: string; tags: string[]; image?: string }

/* ===================== Parseo robusto del payload del backend ===================== */

function extractJson(text: string): any | null {
  try {
    const cleaned = text.trim().replace(/^```(?:json)?/i, '').replace(/```$/,'').trim()
    return JSON.parse(cleaned)
  } catch {
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if (start >= 0 && end > start) {
      try { return JSON.parse(text.slice(start, end + 1)) } catch { return null }
    }
    return null
  }
}

function toAssistantPayload(data: any): {
  uiText: string; suggestions: string[]; where: string; filters?: Record<string, unknown>
} {
  const payload = data?.response ?? data
  if (typeof payload === 'string') {
    const asJson = extractJson(payload)
    if (asJson && typeof asJson === 'object') {
      return {
        uiText: asJson.ui_text ?? payload,
        suggestions: asJson.meta?.next_questions ?? [],
        where: asJson.sql_where_mysql ?? "",
        filters: asJson.filters ?? undefined
      }
    }
    return { uiText: payload, suggestions: [], where: "", filters: undefined }
  }
  if (payload && typeof payload === 'object') {
    const obj = payload as AiCarResponse
    return {
      uiText: obj.ui_text ?? JSON.stringify(obj),
      suggestions: obj.meta?.next_questions ?? [],
      where: obj.sql_where_mysql ?? "",
      filters: obj.filters as any
    }
  }
  return { uiText: 'No pude interpretar la respuesta del asistente.', suggestions: [], where: "", filters: undefined }
}

/* ===================== Imagen: normalización de URL ===================== */

function isLikelyImageUrl(u: string): boolean {
  const clean = u.split('?')[0].toLowerCase()
  return ['.jpg','.jpeg','.png','.webp','.gif'].some(ext => clean.endsWith(ext))
}

function unwrapGoogleUrl(u: string): string | null {
  try {
    const url = new URL(u)
    if (!/google\./i.test(url.hostname)) return null
    // En enlaces de Google Images suele venir imgurl=; en otros, url=
    const imgurl = url.searchParams.get('imgurl') || url.searchParams.get('url')
    if (imgurl && isLikelyImageUrl(imgurl)) return imgurl
    return null
  } catch { return null }
}

function normalizeImageUrl(input?: string | null): string {
  if (!input) return ''
  const trimmed = input.trim()
  if (isLikelyImageUrl(trimmed)) return trimmed
  const unwrapped = unwrapGoogleUrl(trimmed)
  if (unwrapped) return unwrapped
  // No es una URL directa de imagen → devolvemos vacío para ocultar la <img>
  return ''
}

/* ===================== Componente principal ===================== */

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
  const [lastWhere, setLastWhere] = useState<string>('')

  const resultsTimerRef = useRef<number | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const chatRef = useRef<HTMLDivElement | null>(null)
  const startRequested = useRef(false) // evita dobles /start en dev

  // Pre-crea thread al montar (una sola vez)
  useEffect(() => {
    if (startRequested.current) return
    startRequested.current = true
    ;(async () => {
      try {
        log('GET /start …')
        const res = await fetch(`${backendUrl}/start`, { method: 'GET' })
        if (!res.ok) throw new Error(`start ${res.status}`)
        const data = await res.json()
        if (!data.thread_id) throw new Error('start sin thread_id')
        setThreadId(data.thread_id)
        log('Thread precreado:', data.thread_id)
      } catch (e) {
        log('Error precreando thread', e)
      }
    })()
  }, [backendUrl])

  // autoscroll chat a bottom
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
    log('Solicitando /start…')
    const res = await fetch(`${backendUrl}/start`, { method: 'GET' })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || `Error al iniciar la conversación (${res.status})`)
    }
    const data = await res.json()
    if (!data.thread_id) throw new Error('Falta thread_id en la respuesta del backend')
    setThreadId(data.thread_id)
    log('Thread listo:', data.thread_id)
    return data.thread_id as string
  }

  function mapRowToCard(row: any): CarItem {
    const name = [row.marca, row.modelo, row.version].filter(Boolean).join(' ')
    const subtitleParts = [
      row.anio,
      row.tipo_carroceria,
      row.transmision,
      row.tipo_combustible,
      row.consumo ? `${row.consumo} km/l` : null
    ].filter(Boolean)
    const tags = [
      row.sistema_traccion,
      row.pais_fabricacion,
      row.apple_carplay ? 'CarPlay' : null,
      row.android_auto ? 'Android Auto' : null
    ].filter(Boolean)
    return {
      id: String(row.id ?? name),
      name,
      subtitle: subtitleParts.join(' • '),
      price: '', // no hay precio en la tabla actual
      tags: tags as string[],
      image: normalizeImageUrl(row.imagen_url)
    }
  }

  async function searchWithWhere(where: string, filters?: Record<string, unknown>) {
    try {
      log('POST /search_sql WHERE:', where)
      const res = await fetch(`${backendUrl}/search_sql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ where, filters, limit: 6 })
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `Error en búsqueda SQL (${res.status})`)
      }
      const data = await res.json()
      log('Resultados SQL:', data)
      const mapped: CarItem[] = (data.items ?? []).map(mapRowToCard)
      setResults(mapped.slice(0, 6))  // si vienen menos de 6, mostramos esos
      triggerResultsAnimation()
      // si backend devolvió where normalizado, úsalo
      if (typeof data.where_used === 'string' && data.where_used.trim().length > 0) {
        setLastWhere(data.where_used)
      }
    } catch (e) {
      setResults([])
      triggerResultsAnimation()
      const msg = e instanceof Error ? e.message : 'Error en búsqueda'
      setError(msg)
      log('Error en /search_sql:', msg)
    }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const text = message.trim()
    if (text.length === 0 || loading) return

    setLoading(true)
    log('Submit:', text)
    try {
      // pasa a vista de chat inmediatamente
      if (!hasStarted) {
        setHasStarted(true)
        setAnimatingStart(true)
        window.setTimeout(() => setAnimatingStart(false), 450)
      }

      const id = await ensureThread()

      // burbuja del usuario
      setMessages((prev) => [...prev, { role: 'user', content: text }])
      setMessage('')
      requestAnimationFrame(() => {
        if (textareaRef.current) autoResize(textareaRef.current)
      })

      // llamada al backend de chat
      log('POST /chat …')
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
      log('Respuesta /chat:', data)

      // ui_text + sugerencias + WHERE + filters
      const { uiText, suggestions, where, filters } = toAssistantPayload(data)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: uiText, suggestions }
      ])
      setLastWhere(where || '')

      // consulta MySQL con el WHERE del asistente
      if (where && where.trim().length > 0) {
        await searchWithWhere(where, filters)
      } else {
        log('Sin WHERE → limpio panel derecho')
        setResults([])
        triggerResultsAnimation()
      }

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      setError(msg)
      log('Error en handleSend:', msg)
    } finally {
      setLoading(false)
    }
  }

  function handleSuggestionClick(s: string) {
    setMessage(s)
    textareaRef.current?.focus()
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
                  <div key={idx}>
                    <div className={`bubble ${m.role === 'user' ? 'user' : 'assistant'}`}>
                      <div className="bubble-inner">{m.content}</div>
                    </div>
                    {m.role === 'assistant' && m.suggestions && m.suggestions.length > 0 && (
                      <div className="suggestions right">
                        {m.suggestions.map((q, i) => (
                          <button
                            key={i}
                            className="suggestion-chip"
                            onClick={() => handleSuggestionClick(q)}
                            title="Usar sugerencia"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    )}
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

              {lastWhere && (
                <div className="sql-debug">
                  <div className="sql-debug-title">SQL (WHERE) dev</div>
                  <code>{lastWhere}</code>
                </div>
              )}

              <div className={`results-grid ${animatingResults ? 'crossfade' : ''}`}>
                {results.map(item => (
                  <article key={item.id} className="result-card">
                    {item.image ? (
                      <img
                        className="result-img"
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          // si falla, oculta la imagen
                          (e.currentTarget as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    ) : null}
                    <div className="result-head">
                      <h3 className="result-title">{item.name}</h3>
                      {item.price ? <span className="result-price">{item.price}</span> : null}
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
                  <p className="result-empty">No se encontraron resultados.</p>
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