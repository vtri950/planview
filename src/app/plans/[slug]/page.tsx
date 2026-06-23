import { notFound } from 'next/navigation'
import Link from 'next/link'
import * as runtime from 'react/jsx-runtime'
import { compile, run } from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { getPlan } from '@/lib/plans'
import CommentSidebar from '@/components/CommentSidebar'
import ExportButton from '@/components/ExportButton'
import TableOfContents from '@/components/TableOfContents'
import ReadingProgress from '@/components/ReadingProgress'
import { Callout, Tabs, Tab, Steps, Step, Badge, CodeBlock, ModelGuide, DelegationGuide, PreBlock } from '@/components/mdx'

const components = { Callout, Tabs, Tab, Steps, Step, Badge, CodeBlock, ModelGuide, DelegationGuide, pre: PreBlock }

export default async function PlanPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const plan = await getPlan(slug)
  if (!plan) notFound()

  const { source, meta } = plan

  const compiled = await compile(source, {
    outputFormat: 'function-body',
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight],
  })

  const { default: MDXContent } = await run(String(compiled), {
    ...runtime,
    baseUrl: import.meta.url,
  } as Parameters<typeof run>[1])

  return (
    <div className="min-h-screen bg-white">
      <ReadingProgress />
      <header className="no-print sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/" className="text-gray-400 hover:text-gray-700 text-sm shrink-0 flex items-center gap-1">
            ← <span className="font-medium text-gray-500 hover:text-gray-800">planview</span>
          </Link>
          <span className="text-gray-200">/</span>
          <h1 className="text-gray-900 font-semibold truncate">{meta.title}</h1>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <span className="text-xs text-gray-400 hidden sm:block">
            {new Date(meta.lastModified).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <ExportButton />
        </div>
      </header>

      <TableOfContents />

      <main className="max-w-3xl mx-auto px-6 py-10">
        <article className="prose prose-gray max-w-none
          prose-headings:font-semibold prose-headings:tracking-tight
          prose-h1:text-3xl prose-h1:mb-3 prose-h1:mt-0
          prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-b prose-h2:border-gray-100 prose-h2:pb-3
          prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-gray-800
          prose-h4:text-base prose-h4:mt-6 prose-h4:mb-2 prose-h4:text-gray-700
          prose-p:leading-7 prose-p:text-gray-700
          prose-li:text-gray-700 prose-li:leading-7
          prose-strong:text-gray-900
          prose-table:text-sm prose-table:w-full
          prose-thead:bg-gray-50
          prose-th:px-4 prose-th:py-2.5 prose-th:text-left prose-th:font-semibold prose-th:text-gray-700
          prose-td:px-4 prose-td:py-2.5 prose-td:border-b prose-td:border-gray-100
          prose-code:text-blue-700 prose-code:bg-blue-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-medium
          prose-pre:bg-gray-950 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:shadow-sm
          prose-blockquote:border-l-4 prose-blockquote:border-blue-400 prose-blockquote:bg-blue-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic prose-blockquote:rounded-r-lg
          prose-hr:border-gray-100 prose-hr:my-10
          prose-img:rounded-xl prose-img:shadow-sm
        ">
          <MDXContent components={components} />
        </article>
      </main>

      <CommentSidebar slug={slug} />
    </div>
  )
}
