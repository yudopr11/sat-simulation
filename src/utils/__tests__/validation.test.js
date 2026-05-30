import { describe, it, expect } from 'vitest'
import { validateFR, gradeModule } from '../validation'

describe('validateFR', () => {
  it('returns true for exact match', () => {
    expect(validateFR('8.6', ['8.6', '43/5'])).toBe(true)
  })

  it('returns true for alternate accepted form', () => {
    expect(validateFR('43/5', ['8.6', '43/5'])).toBe(true)
  })

  it('is case-insensitive', () => {
    expect(validateFR('ABC', ['abc'])).toBe(true)
  })

  it('trims whitespace', () => {
    expect(validateFR('  8.6  ', ['8.6'])).toBe(true)
  })

  it('trims and lowercases combined', () => {
    expect(validateFR('  ABC  ', ['abc'])).toBe(true)
  })

  it('returns false for wrong answer', () => {
    expect(validateFR('9.0', ['8.6', '43/5'])).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(validateFR('', ['8.6'])).toBe(false)
  })

  it('returns false for whitespace-only input', () => {
    expect(validateFR('   ', ['8.6'])).toBe(false)
  })

  it('returns false for null input', () => {
    expect(validateFR(null, ['8.6'])).toBe(false)
  })

  it('returns false for null acceptedAnswers', () => {
    expect(validateFR('8.6', null)).toBe(false)
  })

  it('returns false for undefined input', () => {
    expect(validateFR(undefined, ['8.6'])).toBe(false)
  })
})

describe('gradeModule', () => {
  const questions = [
    { type: 'mc', answer: 'B', acceptedAnswers: null },
    { type: 'fr', answer: null, acceptedAnswers: ['8.6', '43/5'] },
    { type: 'mc', answer: 'A', acceptedAnswers: null },
    { type: 'mc', answer: 'C', acceptedAnswers: null },
  ]

  it('grades correct MC answer', () => {
    const results = gradeModule(questions, ['B', null, null, null])
    expect(results[0]).toEqual({ status: 'correct' })
  })

  it('grades incorrect MC answer', () => {
    const results = gradeModule(questions, ['A', null, null, null])
    expect(results[0]).toEqual({ status: 'incorrect' })
  })

  it('grades correct FR answer', () => {
    const results = gradeModule(questions, [null, '8.6', null, null])
    expect(results[1]).toEqual({ status: 'correct' })
  })

  it('grades incorrect FR answer', () => {
    const results = gradeModule(questions, [null, '9.0', null, null])
    expect(results[1]).toEqual({ status: 'incorrect' })
  })

  it('grades unanswered as unanswered', () => {
    const results = gradeModule(questions, [null, null, null, null])
    expect(results[0]).toEqual({ status: 'unanswered' })
    expect(results[1]).toEqual({ status: 'unanswered' })
  })

  it('grades empty string as unanswered', () => {
    const results = gradeModule(questions, ['', '', '', ''])
    expect(results[0]).toEqual({ status: 'unanswered' })
  })

  it('grades all answers correctly', () => {
    const answers = ['B', '43/5', 'A', 'D']
    const results = gradeModule(questions, answers)
    expect(results).toEqual([
      { status: 'correct' },
      { status: 'correct' },
      { status: 'correct' },
      { status: 'incorrect' },
    ])
  })

  it('handles undefined answers', () => {
    const results = gradeModule(questions, [undefined, undefined, undefined, undefined])
    expect(results[0]).toEqual({ status: 'unanswered' })
  })
})
