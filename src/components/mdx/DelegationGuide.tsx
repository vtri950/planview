const levels = [
  {
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-500',
    label: 'Safe to delegate with review',
    examples: ['Unit tests', 'Small refactors', 'Docs from code', 'Simple bug fixes', 'Boilerplate', 'Local transformations'],
    role: 'Review diff and tests',
  },
  {
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    dot: 'bg-amber-500',
    label: 'Use as assistant / adviser',
    examples: ['Architecture exploration', 'Design trade-offs', 'Legacy code comprehension', 'Investigation', 'Alternative generation'],
    role: 'Decide and validate',
  },
  {
    color: 'bg-red-100 text-red-800 border-red-200',
    dot: 'bg-red-500',
    label: 'Human-led, AI-assisted only',
    examples: ['Security-sensitive code', 'Production-impacting changes', 'Access-control logic', 'Data handling logic', 'Critical architecture decisions'],
    role: 'Lead implementation · require expert review',
  },
]

export default function DelegationGuide() {
  return (
    <div className="not-prose my-6 space-y-3">
      {levels.map((level, i) => (
        <div key={i} className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
            <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${level.dot}`} />
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${level.color}`}>
              {level.label}
            </span>
            <span className="ml-auto text-xs text-gray-500 font-medium">{level.role}</span>
          </div>
          <div className="px-4 py-3 flex flex-wrap gap-2">
            {level.examples.map((ex, j) => (
              <span key={j} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-gray-50 text-gray-600 border border-gray-200">
                {ex}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
