'use client'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { Callout, Tabs, Tab, Steps, Step, Badge, CodeBlock, ModelGuide, DelegationGuide, PreBlock } from '@/components/mdx'

const components = { Callout, Tabs, Tab, Steps, Step, Badge, CodeBlock, ModelGuide, DelegationGuide, pre: PreBlock }

export default function MdxRenderer({ source }: { source: MDXRemoteSerializeResult }) {
  return <MDXRemote {...source} components={components} />
}
