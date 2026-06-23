'use client'
import { useState } from 'react'

export function Tabs({ labels, children }: { labels: string[]; children: React.ReactNode[] }) {
  const [active, setActive] = useState(0)
  return (
    <div className="not-prose my-4 rounded-lg border border-gray-200 overflow-hidden">
      <div className="flex flex-wrap border-b border-gray-200 bg-gray-50">
        {labels.map((label, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              active === i
                ? 'bg-white border-b-2 border-blue-500 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="p-4 prose prose-sm max-w-none">{children[active]}</div>
    </div>
  )
}

export function Tab({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
