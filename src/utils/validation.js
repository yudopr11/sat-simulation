/**
 * Validates a student's free-response answer against the accepted answers.
 *
 * Comparison is case-insensitive and whitespace-trimmed.
 * acceptedAnswers is an array of strings (raw forms, e.g. ['8.6', '43/5']).
 * The student must type an answer that exactly matches one of these forms
 * (after normalizing whitespace and case).
 *
 * @param {string|null} rawInput - The student's raw text input.
 * @param {string[]} acceptedAnswers - Array of accepted answer strings.
 * @returns {boolean}
 */
export function validateFR(rawInput, acceptedAnswers) {
  if (!rawInput || !acceptedAnswers) return false
  const normalized = rawInput.trim().toLowerCase()
  if (normalized === '') return false
  return acceptedAnswers.some(
    (a) => a.trim().toLowerCase() === normalized
  )
}

/**
 * Grades all answers for a module.
 * Returns an array of result objects: { status: 'correct'|'incorrect'|'unanswered' }
 */
export function gradeModule(questions, answers) {
  return questions.map((q, i) => {
    const raw = answers[i]
    if (raw === null || raw === undefined || raw === '') {
      return { status: 'unanswered' }
    }
    let correct
    if (q.type === 'mc') {
      correct = raw === q.answer
    } else {
      correct = validateFR(raw, q.acceptedAnswers)
    }
    return { status: correct ? 'correct' : 'incorrect' }
  })
}
