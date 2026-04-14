import React from 'react'

export default function WelcomeScreen({ onStart }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-blue-800 text-white text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
            Practice Test
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            SAT Math Section
          </h1>
          <p className="text-gray-500 text-base">Digital Format Simulation</p>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: '📐', label: 'Section', value: 'Math Only' },
            { icon: '🗂️', label: 'Modules', value: '2 Modules' },
            { icon: '⏱️', label: 'Time', value: '35 min each' },
          ].map(({ icon, label, value }) => (
            <div
              key={label}
              className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm"
            >
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                {label}
              </div>
              <div className="text-base font-bold text-gray-800 mt-0.5">{value}</div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-3 text-base">Instructions</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold flex-shrink-0">•</span>
              You may view all 27 questions in each module and answer them in any order.
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold flex-shrink-0">•</span>
              Use the numbered navigation bar to jump between questions.
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold flex-shrink-0">•</span>
              Answers are automatically submitted when the timer reaches 0:00.
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold flex-shrink-0">•</span>
              Module 2 begins only after Module 1 time has fully elapsed.
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold flex-shrink-0">•</span>
              For questions with figures, click <strong>View Figure</strong> to open
              the reference PDF.
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold flex-shrink-0">•</span>
              Short-answer format: enter an integer, decimal, or fraction (e.g.{' '}
              <code className="bg-gray-100 px-1 rounded">3/4</code>).
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold flex-shrink-0">•</span>
              Use of a calculator is permitted for all questions.
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold flex-shrink-0">•</span>
              Do not close the browser because it will reset your progress.
            </li>
          </ul>
        </div>

        {/* Start button */}
        <div className="text-center">
          <button
            onClick={onStart}
            className="bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-bold text-lg px-10 py-3.5 rounded-xl shadow-md transition-colors duration-150"
          >
            Begin Module 1
          </button>
          {/* <p className="text-xs text-gray-400 mt-3">
            Add <code>?dev=1</code> to the URL for 60-second timers (testing mode)
          </p> */}
        </div>
      </div>
    </div>
  )
}
