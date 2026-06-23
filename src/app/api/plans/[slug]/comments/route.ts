import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import { getPlanCommentsPath } from '@/lib/plans'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const commentsPath = getPlanCommentsPath(slug)
  if (!fs.existsSync(commentsPath)) {
    return NextResponse.json([])
  }
  const comments = JSON.parse(fs.readFileSync(commentsPath, 'utf-8'))
  return NextResponse.json(comments)
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const body = await req.json()
  const { anchor, text } = body
  const commentsPath = getPlanCommentsPath(slug)

  let comments: unknown[] = []
  if (fs.existsSync(commentsPath)) {
    comments = JSON.parse(fs.readFileSync(commentsPath, 'utf-8'))
  }

  const newComment = {
    id: Date.now().toString(),
    anchor,
    text,
    createdAt: new Date().toISOString(),
  }

  comments.push(newComment)
  fs.writeFileSync(commentsPath, JSON.stringify(comments, null, 2))
  return NextResponse.json(newComment, { status: 201 })
}
