import React, { useState } from 'react'
import MathText from './MathText'
import { gradeModule } from '../utils/validation'
import { getMathScoreRange, formatScoreRange } from '../utils/scoring'

function StatusIcon({ status }) {
  if (status === 'correct') return <span className="text-green-600 font-bold text-lg">✓</span>
  if (status === 'incorrect') return <span className="text-red-500 font-bold text-lg">✗</span>
  return <span className="text-gray-400 text-lg">—</span>
}

function ResultItem({ question, answer, result, index }) {
  const [expanded, setExpanded] = useState(false)

  const bgClass =
    result.status === 'correct'
      ? 'bg-green-50 border-green-200'
      : result.status === 'incorrect'
      ? 'bg-red-50 border-red-200'
      : 'bg-gray-50 border-gray-200'

  const correctDisplay =
    question.type === 'mc'
      ? `${question.answer} — ${question.choices.find((c) => c.label === question.answer)?.text ?? ''}`
      : question.acceptedAnswers?.join(' or ') ?? ''

  return (
    <div className={`rounded-lg border px-4 py-3 ${bgClass}`}>
      <div className="flex items-start gap-3">
        <StatusIcon status={result.status} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Q{index + 1}
            </span>
            <span className="text-xs text-gray-400">
              {question.type === 'mc' ? 'Multiple Choice' : 'Short Answer'}
            </span>
          </div>

          {/* Short question preview (click to expand) */}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-left text-sm font-serif text-gray-800 mt-1 hover:text-blue-700 transition-colors w-full"
          >
            <span className="line-clamp-2">
              <MathText text={question.text} />
            </span>
            <span className="text-xs text-blue-600 ml-1">
              {expanded ? '▲ less' : '▼ more'}
            </span>
          </button>

          {expanded && (
            <div className="mt-2 text-sm font-serif text-gray-700 leading-relaxed">
              <MathText text={question.text} />
            </div>
          )}

          {/* Answer comparison */}
          <div className="mt-2 flex flex-wrap gap-4 text-sm">
            <div>
              <span className="text-xs text-gray-500 font-medium uppercase">Your answer: </span>
              <span className={`font-mono ${result.status === 'correct' ? 'text-green-700' : result.status === 'incorrect' ? 'text-red-600' : 'text-gray-400 italic'}`}>
                {answer !== null && answer !== '' && answer !== undefined ? (
                  question.type === 'mc' ? (
                    <span>{answer} — <MathText text={question.choices.find(c => c.label === answer)?.text ?? ''} /></span>
                  ) : (
                    answer
                  )
                ) : (
                  'No answer'
                )}
              </span>
            </div>
            {result.status !== 'correct' && (
              <div>
                <span className="text-xs text-gray-500 font-medium uppercase">Correct: </span>
                <span className="text-green-700 font-mono">
                  {question.type === 'mc' ? (
                    <span>{question.answer} — <MathText text={question.choices.find(c => c.label === question.answer)?.text ?? ''} /></span>
                  ) : (
                    correctDisplay
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ModuleResults({ moduleNum, questions, answers }) {
  const results = gradeModule(questions, answers)
  const correct = results.filter((r) => r.status === 'correct').length
  const incorrect = results.filter((r) => r.status === 'incorrect').length
  const unanswered = results.filter((r) => r.status === 'unanswered').length

  return (
    <div className="mb-10">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-xl font-bold text-gray-800">Module {moduleNum}</h2>
        <div className="flex gap-3 text-sm">
          <span className="text-green-600 font-semibold">✓ {correct} correct</span>
          <span className="text-red-500 font-semibold">✗ {incorrect} incorrect</span>
          {unanswered > 0 && (
            <span className="text-gray-400 font-semibold">— {unanswered} unanswered</span>
          )}
        </div>
      </div>
      <div className="space-y-2">
        {questions.map((q, i) => (
          <ResultItem
            key={q.id}
            question={q}
            answer={answers[i]}
            result={results[i]}
            index={i}
          />
        ))}
      </div>
    </div>
  )
}

export default function ResultsScreen({
  module1Questions,
  module2Questions,
  module1Answers,
  module2Answers,
  onReset,
}) {
  const m1Results = gradeModule(module1Questions, module1Answers)
  const m2Results = gradeModule(module2Questions, module2Answers)
  const totalCorrect =
    m1Results.filter((r) => r.status === 'correct').length +
    m2Results.filter((r) => r.status === 'correct').length
  const totalQuestions = module1Questions.length + module2Questions.length

  const pct = Math.round((totalCorrect / totalQuestions) * 100)
  const scoreRange = formatScoreRange(getMathScoreRange(totalCorrect))

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Repeat button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={onReset}
            className="flex items-center gap-2 bg-white border-2 border-gray-300 hover:border-blue-500 hover:text-blue-700 text-gray-700 font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
          >
            ↺ Repeat Test
          </button>
        </div>

        {/* Score banner */}
        <div className="bg-blue-800 text-white rounded-2xl p-6 mb-8 shadow-lg text-center">
          <div className="text-sm font-bold uppercase tracking-widest opacity-80 mb-1">
            Final Score
          </div>
          <div className="text-5xl sm:text-6xl font-black mb-1">
            {totalCorrect}
            <span className="text-2xl font-bold opacity-70">/{totalQuestions}</span>
          </div>
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-2xl font-bold">{scoreRange}</span>
            <span className="opacity-40 font-bold">|</span>
            <span className="text-2xl font-bold opacity-90">{pct}%</span>
          </div>
          <div className="flex justify-center gap-6 text-sm opacity-80">
            <span>Module 1: {m1Results.filter((r) => r.status === 'correct').length}/27</span>
            <span>Module 2: {m2Results.filter((r) => r.status === 'correct').length}/27</span>
          </div>
        </div>

        {/* Answer key link */}
        <div className="bg-amber-50 border border-amber-300 rounded-xl px-5 py-3 mb-8 flex items-center justify-between flex-wrap gap-3">
          <span className="text-amber-800 text-sm font-medium">
            View the official answer key for reference
          </span>
          <a
            href="/answer_key.jpeg"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
          >
            Open Answer Key
          </a>
        </div>

        {/* Detailed results */}
        <ModuleResults
          moduleNum={1}
          questions={module1Questions}
          answers={module1Answers}
        />
        <ModuleResults
          moduleNum={2}
          questions={module2Questions}
          answers={module2Answers}
        />
      </div>
    </div>
  )
}
