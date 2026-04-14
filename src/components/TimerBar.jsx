import React from 'react'

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/**
 * TimerBar — displays remaining time as MM:SS and a progress bar.
 * Turns red when under 60 seconds.
 */
export default function TimerBar({ timeLeft, totalTime }) {
  const pct = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0
  const warning = timeLeft <= 60
  const expired = timeLeft === 0

  return (
    <div className="flex flex-col gap-1 min-w-[90px]">
      <span
        className={`text-lg sm:text-xl font-bold tabular-nums ${
          expired ? 'text-red-600' : warning ? 'text-red-500' : 'text-gray-800'
        }`}
      >
        {expired ? 'TIME\'S UP' : formatTime(timeLeft)}
      </span>
      <div className="h-1.5 bg-gray-200 rounded-full w-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            warning ? 'bg-red-500' : 'bg-blue-600'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
