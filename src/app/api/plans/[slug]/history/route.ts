import { NextRequest, NextResponse } from 'next/server'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const plansDir = process.env.PLANS_DIR || '../coe.agentic-engineering-playbook/docs/brainstorming'
  const absPlansDir = path.isAbsolute(plansDir)
    ? plansDir
    : path.resolve(process.cwd(), plansDir)
  const planFile = path.join(absPlansDir, `${slug}.mdx`)

  try {
    const output = execSync(`git log --follow --oneline -- "${planFile}"`, {
      cwd: path.dirname(absPlansDir),
      encoding: 'utf-8',
    })
    const lines = output
      .trim()
      .split('\n')
      .filter(Boolean)
      .map(line => {
        const [hash, ...rest] = line.split(' ')
        return { hash, message: rest.join(' ') }
      })
    return NextResponse.json(lines)
  } catch {
    return NextResponse.json([])
  }
}
