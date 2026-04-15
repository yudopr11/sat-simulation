import React, { useState } from 'react'

/**
 * FigureLink — opens a specific PDF page in a modal overlay.
 */
export default function FigureLink({ pageNumber, label, pdfFile }) {
  const [showModal, setShowModal] = useState(false)

  if (!pageNumber) return null

  const url = `/${pdfFile}#page=${pageNumber}`

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-400 text-amber-800 rounded px-3 py-1.5 text-sm font-medium hover:bg-amber-100 transition-colors"
        aria-label={`View figure: ${label} (PDF page ${pageNumber})`}
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
        View Figure — {label}
      </button>

      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative bg-white rounded-xl overflow-hidden shadow-2xl w-full max-w-4xl flex flex-col"
            style={{ height: '90vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 flex-shrink-0">
              <span className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                {label}
              </span>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-800 text-xl font-bold leading-none"
                aria-label="Close figure"
              >
                ✕
              </button>
            </div>
            <iframe
              src={url}
              className="flex-1 w-full rounded-b-xl"
              title={label}
            />
          </div>
        </div>
      )}
    </>
  )
}
