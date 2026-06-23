'use client'
import { useState, useEffect } from 'react'

interface Comment {
  id: string
  anchor: string
  text: string
  createdAt: string
}

interface HistoryItem {
  hash: string
  message: string
}

export default function CommentSidebar({ slug }: { slug: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [activeAnchor, setActiveAnchor] = useState<string | null>(null)
  const [popoverAnchor, setPopoverAnchor] = useState<string | null>(null)
  const [popoverText, setPopoverText] = useState('')
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 })

  // Fetch comments and history on mount
  useEffect(() => {
    fetch(`/api/plans/${slug}/comments`)
      .then(r => r.json())
      .then(setComments)
      .catch(() => {})
    fetch(`/api/plans/${slug}/history`)
      .then(r => r.json())
      .then(setHistory)
      .catch(() => {})
  }, [slug])

  // Attach click handlers to headings after comments load
  useEffect(() => {
    const headings = document.querySelectorAll('article h2, article h3')
    const handlers: Array<{ el: Element; handler: EventListener }> = []

    headings.forEach(heading => {
      const anchor = heading.textContent?.replace(/💬\s*\d+/, '').trim() || ''

      // Remove existing badge
      const existingBadge = heading.querySelector('.comment-badge')
      if (existingBadge) existingBadge.remove()

      // Add badge if comments exist
      const headingComments = comments.filter(c => c.anchor === anchor)
      if (headingComments.length > 0) {
        const badge = document.createElement('span')
        badge.className =
          'comment-badge ml-2 text-sm font-normal cursor-pointer text-blue-500 hover:text-blue-700'
        badge.textContent = `💬 ${headingComments.length}`
        badge.onclick = e => {
          e.stopPropagation()
          setActiveAnchor(anchor)
          setIsOpen(true)
        }
        heading.appendChild(badge)
      }

      const handler = (e: Event) => {
        const target = e.currentTarget as Element
        const rect = target.getBoundingClientRect()
        // fixed positioning is viewport-relative, not document-relative
        const top = Math.min(rect.bottom + 8, window.innerHeight - 200)
        setPopoverPos({ top, left: Math.min(rect.left, window.innerWidth - 300) })
        setPopoverAnchor(anchor)
        setPopoverText('')
      }

      heading.addEventListener('click', handler)
      handlers.push({ el: heading, handler })
    })

    return () => {
      handlers.forEach(({ el, handler }) => el.removeEventListener('click', handler))
    }
  }, [comments])

  const saveComment = async () => {
    if (!popoverAnchor || !popoverText.trim()) return
    const res = await fetch(`/api/plans/${slug}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ anchor: popoverAnchor, text: popoverText }),
    })
    const newComment = await res.json()
    setComments(prev => [...prev, newComment])
    setPopoverAnchor(null)
    setPopoverText('')
  }

  const visibleComments = activeAnchor
    ? comments.filter(c => c.anchor === activeAnchor)
    : comments

  return (
    <>
      {/* Floating popover */}
      {popoverAnchor && (
        <div
          className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-72"
          style={{ top: popoverPos.top, left: popoverPos.left }}
        >
          <p className="text-xs text-gray-500 mb-2 truncate">
            Comment on: <strong>{popoverAnchor}</strong>
          </p>
          <textarea
            autoFocus
            className="w-full border border-gray-200 rounded p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            value={popoverText}
            onChange={e => setPopoverText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                saveComment()
              }
              if (e.key === 'Escape') setPopoverAnchor(null)
            }}
            placeholder="Type a note and press Enter..."
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setPopoverAnchor(null)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={saveComment}
              className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(true)}
        className="no-print fixed right-4 top-4 z-40 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700 shadow-lg"
      >
        💬 {comments.length} Notes
      </button>

      {/* Sidebar drawer */}
      {isOpen && (
        <div className="no-print fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-xl z-40 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800">
              {activeAnchor ? `Comments: ${activeAnchor}` : 'All Notes'}
            </h2>
            <div className="flex gap-2 items-center">
              {activeAnchor && (
                <button
                  onClick={() => setActiveAnchor(null)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  All
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-800 text-xl leading-none"
              >
                &times;
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {visibleComments.length === 0 ? (
              <p className="text-sm text-gray-400">
                No notes yet. Click a heading to add one.
              </p>
            ) : (
              visibleComments.map(c => (
                <div key={c.id} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-blue-600 font-medium mb-1 truncate">{c.anchor}</p>
                  <p className="text-sm text-gray-700">{c.text}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(c.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}

            {/* History section */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">📜 History</h3>
              {history.length === 0 ? (
                <p className="text-xs text-gray-400">No git history found.</p>
              ) : (
                history.map((item, i) => (
                  <div key={i} className="text-xs mb-1">
                    <span className="font-mono text-gray-400">{item.hash}</span>{' '}
                    <span className="text-gray-600">{item.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
