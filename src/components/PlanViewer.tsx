'use client'
// PlanViewer is a thin client wrapper used to scope heading interaction.
// The actual MDX rendering is done server-side in the plan page; this component
// can be extended with additional client-side behaviour around the article content.

import { ReactNode } from 'react'

interface PlanViewerProps {
  children: ReactNode
}

export default function PlanViewer({ children }: PlanViewerProps) {
  return <>{children}</>
}
