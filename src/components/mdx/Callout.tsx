'use client'

const styles = {
  info:    { border: 'border-blue-300',  bg: 'bg-blue-50',   icon: 'ℹ️',  label: 'text-blue-800' },
  warning: { border: 'border-amber-300', bg: 'bg-amber-50',  icon: '⚠️',  label: 'text-amber-800' },
  tip:     { border: 'border-green-300', bg: 'bg-green-50',  icon: '💡', label: 'text-green-800' },
  danger:  { border: 'border-red-300',   bg: 'bg-red-50',    icon: '🚨', label: 'text-red-800' },
}

export default function Callout({
  type = 'info',
  title,
  children,
}: {
  type?: keyof typeof styles
  title?: string
  children: React.ReactNode
}) {
  const s = styles[type] ?? styles.info
  return (
    <div className={`not-prose my-4 rounded-lg border ${s.border} ${s.bg} px-4 py-3`}>
      <p className={`text-sm font-semibold mb-1 ${s.label}`}>
        {s.icon} {title ?? type.charAt(0).toUpperCase() + type.slice(1)}
      </p>
      <div className={`text-sm ${s.label} [&>p]:m-0`}>{children}</div>
    </div>
  )
}
