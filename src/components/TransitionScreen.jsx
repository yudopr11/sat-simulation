import React, { useState, useEffect } from 'react'

const COUNTDOWN = 5 // seconds before "Begin Module 2" button enables

export default function TransitionScreen({ onContinue }) {
  const [countdown, setCountdown] = useState(COUNTDOWN)

  useEffect(() => {
    if (countdown <= 0) return
    const id = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(id)
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const ready = countdown === 0

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Icon */}
        <div className="text-6xl mb-6">✅</div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Module 1 Complete
        </h1>
        <p className="text-gray-600 text-base mb-8 leading-relaxed">
          Your answers for Module 1 have been submitted.
          <br />
          You may now proceed to Module 2.
        </p>

        {/* Module 2 info */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-8 shadow-sm text-left">
          <div className="font-bold text-gray-800 mb-2">Module 2 — Math</div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 27 questions</li>
            <li>• 35 minutes</li>
            <li>• Answers auto-submit at the end of time</li>
          </ul>
        </div>

        {/* Button with countdown */}
        <button
          onClick={onContinue}
          disabled={!ready}
          className={`font-bold text-lg px-10 py-3.5 rounded-xl shadow-md transition-all duration-200
            ${
              ready
                ? 'bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
        >
          {ready ? 'Begin Module 2' : `Begin Module 2 (${countdown})`}
        </button>

        {!ready && (
          <p className="text-xs text-gray-400 mt-3">
            Please wait a moment before continuing…
          </p>
        )}

      </div>
    </div>
  )
}
