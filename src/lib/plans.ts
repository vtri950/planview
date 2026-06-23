import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export function getPlansDir(): string {
  const envDir = process.env.PLANS_DIR || '../coe.agentic-engineering-playbook/docs/brainstorming'
  return path.isAbsolute(envDir) ? envDir : path.resolve(process.cwd(), envDir)
}

export interface PlanMeta {
  slug: string
  title: string
  lastModified: string
  excerpt: string
}

export async function getPlans(): Promise<PlanMeta[]> {
  const plansDir = getPlansDir()
  if (!fs.existsSync(plansDir)) return []

  const files = fs.readdirSync(plansDir).filter(f => f.endsWith('.mdx'))
  const plans: PlanMeta[] = []

  for (const file of files) {
    const filePath = path.join(plansDir, file)
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(raw)
    const stat = fs.statSync(filePath)
    const slug = file.replace(/\.(mdx|md)$/, '')

    const titleMatch = !data.title && content.match(/^#\s+(.+)/m)
    const title = data.title || (titleMatch ? titleMatch[1] : slug)

    // First non-empty non-heading line as excerpt — strip markdown syntax
    const excerptMatch = content.match(/^(?!#)[^\n<]{20,}/m)
    const excerpt = excerptMatch
      ? excerptMatch[0]
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [text](url) → text
          .replace(/\*\*([^*]+)\*\*/g, '$1')        // **bold** → bold
          .replace(/\*([^*]+)\*/g, '$1')             // *italic* → italic
          .replace(/`[^`]+`/g, '')                   // `code` → remove
          .replace(/\s+/g, ' ')
          .slice(0, 120)
          .trim()
      : ''

    plans.push({ slug, title, lastModified: stat.mtime.toISOString(), excerpt })
  }

  return plans.sort((a, b) => b.lastModified.localeCompare(a.lastModified))
}

export async function getPlan(slug: string): Promise<{ source: string; meta: PlanMeta } | null> {
  const plansDir = getPlansDir()

  const mdxPath = path.join(plansDir, `${slug}.mdx`)
  const filePath = fs.existsSync(mdxPath) ? mdxPath : null
  if (!filePath) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { content, data } = matter(raw)
  const stat = fs.statSync(filePath)

  const titleMatch = !data.title && content.match(/^#\s+(.+)/m)
  const title = data.title || (titleMatch ? titleMatch[1] : slug)

  return {
    source: content,
    meta: { slug, title, lastModified: stat.mtime.toISOString(), excerpt: '' },
  }
}

export function getPlanCommentsPath(slug: string): string {
  return path.join(getPlansDir(), `${slug}.comments.json`)
}
