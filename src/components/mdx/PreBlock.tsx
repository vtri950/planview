import MermaidBlock from './MermaidBlock'
import React from 'react'

function extractText(node: React.ReactNode): string {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode }
    return extractText(props.children)
  }
  return ''
}

export default function PreBlock({
  children,
  ...rest
}: React.HTMLAttributes<HTMLPreElement> & { children?: React.ReactNode }) {
  if (React.isValidElement(children)) {
    const childProps = children.props as { className?: string; children?: React.ReactNode }
    if (childProps.className?.includes('language-mermaid')) {
      return <MermaidBlock code={extractText(childProps.children)} />
    }
    // rehype-highlight adds hljs classes — render with dark styling
    const isHighlighted = childProps.className?.includes('hljs') || childProps.className?.includes('language-')
    if (isHighlighted) {
      return (
        <pre
          {...rest}
          className="not-prose my-6 overflow-x-auto rounded-xl bg-gray-950 p-5 text-sm leading-relaxed shadow-sm"
        >
          {children}
        </pre>
      )
    }
  }
  return <pre {...rest}>{children}</pre>
}
