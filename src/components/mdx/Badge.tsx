const colors = {
  blue:   'bg-blue-100 text-blue-800 border-blue-200',
  green:  'bg-green-100 text-green-800 border-green-200',
  amber:  'bg-amber-100 text-amber-800 border-amber-200',
  red:    'bg-red-100 text-red-800 border-red-200',
  gray:   'bg-gray-100 text-gray-700 border-gray-200',
  purple: 'bg-purple-100 text-purple-800 border-purple-200',
}

export default function Badge({
  color = 'blue',
  children,
}: {
  color?: keyof typeof colors
  children: React.ReactNode
}) {
  return (
    <span className={`not-prose inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colors[color] ?? colors.blue}`}>
      {children}
    </span>
  )
}
