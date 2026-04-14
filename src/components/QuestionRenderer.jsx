import React from 'react'
import MathText from './MathText'
import FigureLink from './FigureLink'

/** Renders an HTML table from tableData: { headers, rows } */
function QuestionTable({ data }) {
  return (
    <div className="overflow-x-auto my-4">
      <table className="border-collapse text-sm sm:text-base">
        <thead>
          <tr>
            {data.headers.map((h, i) => (
              <th
                key={i}
                className="border border-gray-400 bg-gray-100 px-4 py-2 text-left font-semibold"
              >
                <MathText text={h} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {row.map((cell, ci) => (
                <td key={ci} className="border border-gray-400 px-4 py-2">
                  <MathText text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Multiple-choice option buttons */
function MCChoices({ choices, selected, onSelect, frozen }) {
  return (
    <div className="space-y-3 mt-5">
      {choices.map(({ label, text }) => {
        const isSelected = selected === label
        return (
          <button
            key={label}
            onClick={() => !frozen && onSelect(label)}
            disabled={frozen}
            className={`w-full text-left flex items-start gap-3 px-4 py-3 rounded-lg border-2 transition-colors duration-100 text-sm sm:text-base font-serif
              ${
                isSelected
                  ? 'bg-blue-50 border-blue-600 text-blue-900'
                  : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50 hover:border-gray-400'
              }
              ${frozen ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
          >
            <span
              className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full border-2 font-bold text-sm
                ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-400 text-gray-600'}`}
            >
              {label}
            </span>
            <span className="pt-0.5">
              <MathText text={text} />
            </span>
          </button>
        )
      })}
    </div>
  )
}

/** Free-response text input */
function FRInput({ value, onChange, frozen }) {
  return (
    <div className="mt-5">
      <input
        type="text"
        value={value}
        onChange={(e) => !frozen && onChange(e.target.value)}
        readOnly={frozen}
        maxLength={20}
        placeholder="Enter your answer"
        inputMode="decimal"
        className={`w-full sm:w-56 border-2 rounded-lg px-3 py-2.5 font-mono text-base
          ${
            frozen
              ? 'bg-gray-100 border-gray-300 cursor-not-allowed text-gray-500'
              : 'bg-white border-gray-400 focus:border-blue-500 focus:outline-none'
          }`}
        aria-label="Free-response answer"
      />
      <p className="text-xs text-gray-500 mt-1.5">
        Accepted formats: integer, decimal, or fraction (e.g. <span className="font-mono">3/4</span> or <span className="font-mono">1.5</span>)
      </p>
    </div>
  )
}

/**
 * QuestionRenderer — renders a single SAT question with its answer input.
 *
 * Props:
 *   question       — question object from module data
 *   answer         — current answer (null | string)
 *   onAnswer(val)  — called when student changes their answer
 *   frozen         — bool; if true, inputs are disabled
 *   questionNumber — 1-based display index
 *   total          — total questions in module (27)
 */
export default function QuestionRenderer({
  question,
  answer,
  onAnswer,
  frozen,
  questionNumber,
  total,
  pdfFile,
}) {
  return (
    <div>
      {/* Header row: question number badge + figure link */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <span className="bg-gray-800 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full">
          Question {questionNumber} of {total}
        </span>
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
          {question.type === 'mc' ? 'Multiple Choice' : 'Short Answer'}
        </span>
        {question.hasFigure && (
          <FigureLink
            pageNumber={question.figurePagePdf}
            label={question.figureLabel}
            pdfFile={pdfFile}
          />
        )}
      </div>

      {/* Question text */}
      <div className="text-base sm:text-lg leading-relaxed font-serif text-gray-900 mb-1">
        <MathText text={question.text} />
      </div>

      {/* Optional table */}
      {question.tableData && <QuestionTable data={question.tableData} />}

      {/* Frozen overlay notice */}
      {frozen && (
        <div className="mt-4 mb-2 px-3 py-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          Time has expired. This module is now locked.
        </div>
      )}

      {/* Answer area */}
      {question.type === 'mc' ? (
        <MCChoices
          choices={question.choices}
          selected={answer}
          onSelect={onAnswer}
          frozen={frozen}
        />
      ) : (
        <FRInput value={answer || ''} onChange={onAnswer} frozen={frozen} />
      )}
    </div>
  )
}
