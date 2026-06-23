'use client'
import { useEffect, useState } from 'react'

interface TocItem {
  id: string
  text: string
  level: number
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
}

export default function TableOfContents() {
  const [items, setItems] = useState<TocItem[]>([])
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll('article h2, article h3'))
    const tocItems: TocItem[] = headings.map(h => {
      const text = h.textContent?.replace(/💬\s*\d+/, '').trim() || ''
      const id = slugify(text)
      if (!h.id) h.id = id
      return { id, text, level: parseInt(h.tagName[1]) }
    })
    setItems(tocItems)

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length > 0) setActive(visible[0].target.id)
      },
      { rootMargin: '-20% 0% -70% 0%' }
    )
    headings.forEach(h => observer.observe(h))
    return () => observer.disconnect()
  }, [])

  if (items.length < 2) return null

  return (
    <nav className="no-print hidden xl:block fixed left-6 top-20 w-56 max-h-[calc(100vh-6rem)] overflow-y-auto">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">On this page</p>
      <ul className="space-y-1">
        {items.map(item => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block text-sm leading-snug transition-colors py-0.5 ${
                item.level === 3 ? 'pl-3' : ''
              } ${
                active === item.id
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              onClick={e => {
                e.preventDefault()
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
