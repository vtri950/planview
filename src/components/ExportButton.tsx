'use client'

export default function ExportButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md border border-gray-300"
    >
      Export HTML
    </button>
  )
}
