import React from 'react'

/**
 * QuestionNav — 27 numbered buttons.
 * Colours: answered = blue, active = amber ring, default = white border.
 */
export default function QuestionNav({ total, answers, activeIndex, onSelect }) {
  return (
    <div className="flex flex-wrap gap-1 px-3 py-2">
      {Array.from({ length: total }, (_, i) => {
        const isActive = i === activeIndex
        const isAnswered = answers[i] !== null && answers[i] !== undefined && answers[i] !== ''

        let btnClass =
          'w-8 h-8 text-xs sm:w-9 sm:h-9 sm:text-sm rounded font-semibold border transition-colors duration-150 focus:outline-none '

        if (isActive) {
          btnClass += isAnswered
            ? 'bg-blue-700 text-white border-blue-700 ring-2 ring-amber-400 ring-offset-1'
            : 'bg-white text-gray-800 border-gray-400 ring-2 ring-amber-400 ring-offset-1'
        } else if (isAnswered) {
          btnClass += 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
        } else {
          btnClass += 'bg-white text-gray-700 border-gray-400 hover:bg-gray-100'
        }

        return (
          <button
            key={i}
            className={btnClass}
            onClick={() => onSelect(i)}
            aria-label={`Go to question ${i + 1}${isAnswered ? ' (answered)' : ''}`}
            aria-current={isActive ? 'true' : undefined}
          >
            {i + 1}
          </button>
        )
      })}
    </div>
  )
}
