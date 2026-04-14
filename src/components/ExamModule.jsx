import React, { useState, useEffect, useRef, useCallback } from 'react'
import TimerBar from './TimerBar'
import QuestionNav from './QuestionNav'
import QuestionRenderer from './QuestionRenderer'

const FULL_DURATION = 2100 // 35 minutes in seconds
const DEV_DURATION = 360   // 1 minute for dev/testing mode

/**
 * ExamModule — the main exam screen used for both Module 1 and Module 2.
 *
 * Props:
 *   moduleNumber   — 1 or 2
 *   questions      — array of 27 question objects
 *   answers        — array of 27 answer values (null | string)
 *   frozen         — bool; true when time has expired
 *   onAnswer(i, v) — called with question index and new answer value
 *   onFreeze()     — called when timer reaches 0
 *   devMode        — bool; if true use 60-second timer
 */
export default function ExamModule({
  moduleNumber,
  questions,
  answers,
  frozen,
  onAnswer,
  onFreeze,
  devMode,
  initialTimeLeft,
}) {
  const duration = devMode ? DEV_DURATION : FULL_DURATION
  const [timeLeft, setTimeLeft] = useState(() => initialTimeLeft ?? duration)
  const [activeIndex, setActiveIndex] = useState(0)
  const intervalRef = useRef(null)
  const frozenRef = useRef(frozen)

  // Keep frozenRef in sync so the interval closure can check it
  useEffect(() => {
    frozenRef.current = frozen
  }, [frozen])

  // Stable onFreeze reference
  const handleFreeze = useCallback(() => {
    onFreeze()
  }, [onFreeze])

  useEffect(() => {
    if (frozen) {
      clearInterval(intervalRef.current)
      return
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          // Call onFreeze after state update
          setTimeout(() => {
            if (!frozenRef.current) handleFreeze()
          }, 0)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [frozen, handleFreeze])

  const answeredCount = answers.filter(
    (a) => a !== null && a !== undefined && a !== ''
  ).length

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* ─── Sticky header: timer + nav ─── */}
      <div className="sticky top-0 z-10 bg-white shadow-md">
        {/* Top bar: module info + timer */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wider">
              SAT Math
            </span>
            <span className="bg-gray-800 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
              Module {moduleNumber}
            </span>
            <span className="text-xs text-gray-500 hidden sm:inline">
              {answeredCount}/{questions.length} answered
            </span>
          </div>
          <TimerBar timeLeft={timeLeft} totalTime={duration} />
        </div>

        {/* Question navigation */}
        <QuestionNav
          total={questions.length}
          answers={answers}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
        />
      </div>

      {/* ─── Scrollable question area ─── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <QuestionRenderer
            question={questions[activeIndex]}
            answer={answers[activeIndex]}
            onAnswer={(val) => onAnswer(activeIndex, val)}
            frozen={frozen}
            questionNumber={activeIndex + 1}
            total={questions.length}
            pdfFile={`module_${moduleNumber}.pdf`}
          />

          {/* Previous / Next navigation */}
          <div className="flex justify-between mt-8 gap-4">
            <button
              onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
              disabled={activeIndex === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              ← Previous
            </button>

            <span className="self-center text-sm text-gray-500">
              {activeIndex + 1} / {questions.length}
            </span>

            <button
              onClick={() =>
                setActiveIndex((i) => Math.min(questions.length - 1, i + 1))
              }
              disabled={activeIndex === questions.length - 1}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Dev mode watermark */}
      {devMode && (
        <div className="fixed bottom-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded opacity-80 pointer-events-none">
          DEV MODE
        </div>
      )}
    </div>
  )
}
