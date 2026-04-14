import React from 'react'

/**
 * FigureLink — links to a specific PDF page containing the question figure.
 * Opens in a new browser tab using the native PDF viewer's #page=N fragment.
 */
export default function FigureLink({ pageNumber, label, pdfFile }) {
  if (!pageNumber) return null

  const url = `/${pdfFile}#page=${pageNumber}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-400 text-amber-800 rounded px-3 py-1.5 text-sm font-medium hover:bg-amber-100 transition-colors"
      aria-label={`View figure: ${label} (opens PDF page ${pageNumber})`}
    >
      <svg
        className="w-4 h-4 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
      View Figure — {label} <span className="text-amber-600">(PDF p.{pageNumber})</span>
    </a>
  )
}
