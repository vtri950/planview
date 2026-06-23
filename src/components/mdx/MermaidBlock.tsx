'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

export default function MermaidBlock({ code }: { code: string }) {
  const [error, setError] = useState<string | null>(null)
  const [svg, setSvg] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  // zoom + pan state
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const dragging = useRef(false)
  const dragStart = useRef({ mx: 0, my: 0, ox: 0, oy: 0 })
  const diagramRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const mermaid = (await import('mermaid')).default
        mermaid.initialize({ startOnLoad: false, theme: 'neutral' })
        const id = `mermaid-${Math.random().toString(36).slice(2)}`
        const { svg } = await mermaid.render(id, code.trim())
        if (!cancelled) setSvg(svg)
      } catch (e) {
        if (!cancelled) setError(String(e))
      }
    })()
    return () => { cancelled = true }
  }, [code])

  const resetView = useCallback(() => { setScale(1); setOffset({ x: 0, y: 0 }) }, [])

  const closeModal = useCallback(() => { setOpen(false); resetView() }, [resetView])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, closeModal])

  // wheel zoom centered on cursor position
  function onWheel(e: React.WheelEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    const rect = diagramRef.current?.getBoundingClientRect()
    if (!rect) return
    const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15
    setScale(s => {
      const next = Math.min(Math.max(s * factor, 0.3), 20)
      // shift offset so cursor position stays fixed
      const cursorX = e.clientX - rect.left - rect.width / 2
      const cursorY = e.clientY - rect.top - rect.height / 2
      const scaleDelta = next - s
      setOffset(o => ({
        x: o.x - cursorX * (scaleDelta / s),
        y: o.y - cursorY * (scaleDelta / s),
      }))
      return next
    })
  }

  function onMouseDown(e: React.MouseEvent) {
    if (e.button !== 0) return
    dragging.current = true
    dragStart.current = { mx: e.clientX, my: e.clientY, ox: offset.x, oy: offset.y }
    e.currentTarget.setAttribute('data-dragging', 'true')
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!dragging.current) return
    setOffset({
      x: dragStart.current.ox + (e.clientX - dragStart.current.mx),
      y: dragStart.current.oy + (e.clientY - dragStart.current.my),
    })
  }

  function onMouseUp(e: React.MouseEvent) {
    dragging.current = false
    e.currentTarget.removeAttribute('data-dragging')
  }

  if (error) {
    return (
      <pre className="text-xs text-red-600 bg-red-50 p-3 rounded overflow-auto">
        Mermaid error: {error}{'\n\n'}{code}
      </pre>
    )
  }

  if (!svg) {
    return <div className="my-8 h-24 rounded-xl bg-gray-50 animate-pulse" />
  }

  return (
    <>
      <div
        className="not-prose group relative my-8 overflow-x-auto rounded-xl border border-gray-100 bg-gray-50 px-6 py-8 shadow-sm cursor-zoom-in [&>svg]:max-w-full [&>svg]:mx-auto [&>svg]:block [&>svg]:h-auto"
        onClick={() => setOpen(true)}
        title="Click to expand"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <p className="not-prose -mt-6 mb-6 text-center text-xs text-gray-400 select-none">
        click to expand · scroll to zoom
      </p>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={closeModal}
        >
          {/* toolbar */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={e => { e.stopPropagation(); setScale(s => Math.min(s * 1.3, 20)) }}
              className="w-8 h-8 rounded-full bg-white/90 text-gray-700 hover:bg-white shadow text-lg font-bold flex items-center justify-center"
              title="Zoom in"
            >+</button>
            <button
              onClick={e => { e.stopPropagation(); resetView() }}
              className="px-3 h-8 rounded-full bg-white/90 text-gray-700 hover:bg-white shadow text-xs font-medium flex items-center"
              title="Reset zoom"
            >{Math.round(scale * 100)}%</button>
            <button
              onClick={e => { e.stopPropagation(); setScale(s => Math.max(s / 1.3, 0.3)) }}
              className="w-8 h-8 rounded-full bg-white/90 text-gray-700 hover:bg-white shadow text-lg font-bold flex items-center justify-center"
              title="Zoom out"
            >−</button>
            <button
              onClick={e => { e.stopPropagation(); closeModal() }}
              className="px-3 h-8 rounded-full bg-white/90 text-gray-700 hover:bg-white shadow text-xs font-medium flex items-center"
            >✕ close</button>
          </div>

          {/* zoom/pan surface */}
          <div
            ref={diagramRef}
            className="w-full h-full overflow-hidden flex items-center justify-center"
            onClick={e => e.stopPropagation()}
            onWheel={onWheel}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            style={{ cursor: dragging.current ? 'grabbing' : scale > 1 ? 'grab' : 'default' }}
          >
            <div
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                transformOrigin: 'center center',
                transition: dragging.current ? 'none' : 'transform 0.05s ease-out',
              }}
              className="bg-white rounded-xl p-8 shadow-2xl [&>svg]:block [&>svg]:max-w-[80vw] [&>svg]:h-auto"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </div>

          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/50 select-none pointer-events-none">
            scroll to zoom · drag to pan · Esc to close
          </p>
        </div>
      )}
    </>
  )
}
