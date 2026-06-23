'use client'
import { useState } from 'react'

export default function CodeBlock({ language, children }: { language?: string; children: React.ReactNode }) {
  const [copied, setCopied] = useState(false)

  const text = typeof children === 'string' ? children : ''

  const copy = () => {
    navigator.clipboard.writeText(text.trim())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="not-prose my-4 rounded-lg border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-xs text-gray-400 font-mono">{language ?? 'code'}</span>
        <button
          onClick={copy}
          className="text-xs text-gray-400 hover:text-white transition-colors"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className="bg-gray-900 text-gray-100 text-sm p-4 overflow-x-auto font-mono leading-relaxed">
        <code>{children}</code>
      </pre>
    </div>
  )
}
