export default function Steps({ children }: { children: React.ReactNode }) {
  return (
    <ol className="not-prose my-4 space-y-3 list-none pl-0">
      {children}
    </ol>
  )
}

export function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3 items-start">
      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center mt-0.5">
        {n}
      </span>
      <div className="prose prose-sm max-w-none pt-0.5">{children}</div>
    </li>
  )
}
