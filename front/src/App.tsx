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
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [response, setResponse] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  const rotatingPlaceholder = `Ejemplo: ${PROMPT_SUGGESTIONS[placeholderIdx]}`

  useEffect(() => {
    if (message.trim().length > 0) return
    const id = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PROMPT_SUGGESTIONS.length)
    }, 4000)
    return () => clearInterval(id)
  }, [message])

  function useSuggestion(text: string) {
    setMessage(text)
    requestAnimationFrame(() => textareaRef.current?.focus())
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setResponse(null)

    const text = message.trim()
    if (text.length === 0) return

    setLoading(true)
    try {
      const startRes = await fetch(`${backendUrl}/start`, { method: 'GET' })
      if (!startRes.ok) {
        const body = await startRes.json().catch(() => ({}))
        throw new Error(body.error || `Error al iniciar la conversación (${startRes.status})`)
      }
      const { thread_id } = await startRes.json()
      if (!thread_id) throw new Error('Falta thread_id en la respuesta del backend')

      const chatRes = await fetch(`${backendUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thread_id, message: text })
      })
      if (!chatRes.ok) {
        const body = await chatRes.json().catch(() => ({}))
        throw new Error(body.error || `Error del chat (${chatRes.status})`)
      }
      const data = await chatRes.json()
      setResponse(typeof data.response === 'string' ? data.response : JSON.stringify(data))
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <header className="header">
        <h1 style={{fontSize: "40px"}}>AiCar</h1>
        <p className="subtitle">Interfaz minimalista para iniciar una conversación</p>
      </header>

      <main className="container">
        <form className="card" onSubmit={handleSend}>
          <label htmlFor="message" className="label">Tu primer mensaje</label>

          <textarea
            id="message"
            ref={textareaRef}
            className="input"
            placeholder={rotatingPlaceholder}
            rows={10}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="button" type="submit" disabled={loading}>
            {loading ? 'Enviando…' : 'Enviar'}
          </button>
          {error && <div className="alert error" role="alert">{error}</div>}
        </form>

        {response && (
          <section className="card response">
            <h2 className="label">Respuesta de la IA</h2>
            <div className="response-text">{response}</div>
          </section>
        )}

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
                  onClick={() => useSuggestion(`Estoy buscando algo como: ${item.title}. ${item.details}`)}
                >
                  Usar como punto de partida
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>Backend: {backendUrl}</span>
      </footer>
    </div>
  )
}
