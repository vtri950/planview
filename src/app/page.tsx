import Link from 'next/link'
import { getPlans } from '@/lib/plans'

export const dynamic = 'force-dynamic'

const ACCENTS = [
  'border-l-blue-400',
  'border-l-violet-400',
  'border-l-emerald-400',
  'border-l-amber-400',
  'border-l-rose-400',
  'border-l-cyan-400',
  'border-l-orange-400',
  'border-l-teal-400',
]

function accentFor(slug: string) {
  let hash = 0
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0
  return ACCENTS[hash % ACCENTS.length]
}

export default async function HomePage() {
  const plans = await getPlans()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-gray-900 tracking-tight">planview</span>
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-mono">local</span>
        </div>
        <span className="text-sm text-gray-400">{plans.length} doc{plans.length !== 1 ? 's' : ''}</span>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-10">
        {plans.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-4xl mb-4">📄</p>
            <p className="text-lg font-medium text-gray-600 mb-2">No docs found</p>
            <p className="text-sm">
              Run with <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">--dir ./your-docs-folder</code>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {plans.map(plan => (
              <Link key={plan.slug} href={`/plans/${plan.slug}`} className="block group h-full">
                <div className={`h-full flex flex-col bg-white rounded-xl border border-gray-100 border-l-4 ${accentFor(plan.slug)} p-5 shadow-sm group-hover:shadow-md group-hover:-translate-y-0.5 transition-all duration-150`}>
                  <h2 className="font-semibold text-gray-900 mb-2 leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors">
                    {plan.title}
                  </h2>
                  {plan.excerpt && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3 leading-relaxed">{plan.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between mt-auto pt-1">
                    <p className="text-xs text-gray-400 font-mono truncate">{plan.slug}</p>
                    <p className="text-xs text-gray-400 shrink-0 ml-2">
                      {new Date(plan.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
