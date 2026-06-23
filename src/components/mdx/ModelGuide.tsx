const tiers = {
  mini:    { label: 'Mini model',      color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  coding:  { label: 'Coding model',    color: 'bg-blue-100 text-blue-800 border-blue-200' },
  strong:  { label: 'Strong model',    color: 'bg-purple-100 text-purple-800 border-purple-200' },
  human:   { label: 'Human-led',       color: 'bg-red-100 text-red-800 border-red-200' },
}

const rows = [
  {
    task: 'Explanation · summarisation · one-file edits · boilerplate · simple tests',
    model: 'mini' as const,
    reasoning: 'No / low',
    mode: 'Ask mode if no edits needed',
    escalate: 'Answer wrong, incomplete, or needs broader codebase reasoning',
  },
  {
    task: 'Normal implementation with known files',
    model: 'coding' as const,
    reasoning: 'Low / medium',
    mode: 'Agent Mode',
    escalate: 'Task spans several modules or needs iterative tool use',
  },
  {
    task: 'Failing-test fixes · non-trivial debugging',
    model: 'coding' as const,
    reasoning: 'Medium',
    mode: 'Agent Mode · focused context',
    escalate: 'Failure is subtle, cross-module, or production-impacting',
  },
  {
    task: 'Architecture exploration · migration planning · complex design trade-offs',
    model: 'strong' as const,
    reasoning: 'Medium / high',
    mode: 'Plan mode first',
    escalate: 'Decision is high-impact or constraints are unclear',
  },
  {
    task: 'Security-sensitive or production-critical implementation',
    model: 'human' as const,
    reasoning: '—',
    mode: 'AI as adviser / reviewer / test assistant only',
    escalate: 'Do not delegate blindly — require expert review',
  },
]

export default function ModelGuide() {
  return (
    <div className="not-prose my-6 space-y-3">
      {rows.map((row, i) => {
        const tier = tiers[row.model]
        return (
          <div key={i} className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            <div className="flex items-start gap-4 p-4">
              {/* Step number */}
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                {/* Task */}
                <p className="text-sm font-medium text-gray-900 mb-2">{row.task}</p>
                {/* Badges row */}
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${tier.color}`}>
                    {tier.label}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-gray-50 text-gray-600 border-gray-200">
                    {row.reasoning} reasoning
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-slate-50 text-slate-600 border-slate-200">
                    {row.mode}
                  </span>
                </div>
                {/* Escalate hint */}
                <p className="text-xs text-gray-400">
                  <span className="font-medium text-gray-500">Escalate when: </span>
                  {row.escalate}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
