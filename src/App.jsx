import React, { useReducer, useCallback, useMemo, useEffect } from 'react'
import { module1Questions } from './data/module1'
import { module2Questions } from './data/module2'
import WelcomeScreen from './components/WelcomeScreen'
import ExamModule from './components/ExamModule'
import TransitionScreen from './components/TransitionScreen'
import ResultsScreen from './components/ResultsScreen'

const STORAGE_KEY = 'sat_progress'
const SESSION_MAX_MS = 80 * 60 * 1000 // 80 minutes
const FULL_DURATION = 2100 // 35 min in seconds
const DEV_DURATION = 60

// ─── Session persistence ───────────────────────────────────────────────────
// localStorage survives tab close, new tabs, and browser restarts.
// Progress is discarded only when the 70-minute TTL has elapsed.

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data.sessionStart) return null
    if (Date.now() - data.sessionStart > SESSION_MAX_MS) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return data
  } catch {
    return null
  }
}

function saveSession(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

// ─── State ────────────────────────────────────────────────────────────────

const baseInitialState = {
  phase: 'welcome', // 'welcome' | 'module1' | 'transition' | 'module2' | 'results'
  module1Answers: Array(27).fill(null),
  module2Answers: Array(27).fill(null),
  module1Frozen: false,
  module2Frozen: false,
  sessionStart: null,     // ms timestamp — when the exam session began
  module1StartedAt: null, // ms timestamp — when Module 1 timer started
  module2StartedAt: null, // ms timestamp — when Module 2 timer started
}

function getInitialState() {
  const saved = loadSession()
  return saved ?? baseInitialState
}

function reducer(state, action) {
  switch (action.type) {
    case 'START_MODULE1':
      return {
        ...state,
        phase: 'module1',
        sessionStart: state.sessionStart ?? Date.now(),
        module1StartedAt: Date.now(),
      }
    case 'FREEZE_MODULE1':
      return { ...state, module1Frozen: true, phase: 'transition' }
    case 'START_MODULE2':
      return { ...state, phase: 'module2', module2StartedAt: Date.now() }
    case 'FREEZE_MODULE2':
      return { ...state, module2Frozen: true, phase: 'results' }
    case 'RESET':
      localStorage.removeItem(STORAGE_KEY)
      return { ...baseInitialState }
    case 'SET_M1_ANSWER': {
      if (state.module1Frozen) return state
      const m1 = [...state.module1Answers]
      m1[action.index] = action.value
      return { ...state, module1Answers: m1 }
    }
    case 'SET_M2_ANSWER': {
      if (state.module2Frozen) return state
      const m2 = [...state.module2Answers]
      m2[action.index] = action.value
      return { ...state, module2Answers: m2 }
    }
    default:
      return state
  }
}

// ─── App ──────────────────────────────────────────────────────────────────

export default function App() {
  const [state, dispatch] = useReducer(reducer, null, getInitialState)
  const devMode = useMemo(
    () => new URLSearchParams(window.location.search).get('dev') === '1',
    []
  )
  const duration = devMode ? DEV_DURATION : FULL_DURATION

  // Persist every state change to sessionStorage (skip welcome — nothing to save yet)
  useEffect(() => {
    if (state.phase !== 'welcome') {
      saveSession(state)
    }
  }, [state])

  const handleFreezeModule1 = useCallback(() => dispatch({ type: 'FREEZE_MODULE1' }), [])
  const handleFreezeModule2 = useCallback(() => dispatch({ type: 'FREEZE_MODULE2' }), [])

  // Compute remaining seconds for each module, accounting for time elapsed since startedAt.
  // If the stored startedAt shows time has fully run out, initialTimeLeft will be 0,
  // which causes ExamModule to freeze on its first timer tick.
  function calcTimeLeft(startedAt) {
    if (!startedAt) return duration
    return Math.max(0, duration - Math.floor((Date.now() - startedAt) / 1000))
  }

  switch (state.phase) {
    case 'welcome':
      return <WelcomeScreen onStart={() => dispatch({ type: 'START_MODULE1' })} />

    case 'module1':
      return (
        <ExamModule
          key="module1"
          moduleNumber={1}
          questions={module1Questions}
          answers={state.module1Answers}
          frozen={state.module1Frozen}
          onAnswer={(i, v) => dispatch({ type: 'SET_M1_ANSWER', index: i, value: v })}
          onFreeze={handleFreezeModule1}
          devMode={devMode}
          initialTimeLeft={calcTimeLeft(state.module1StartedAt)}
        />
      )

    case 'transition':
      return <TransitionScreen onContinue={() => dispatch({ type: 'START_MODULE2' })} />

    case 'module2':
      return (
        <ExamModule
          key="module2"
          moduleNumber={2}
          questions={module2Questions}
          answers={state.module2Answers}
          frozen={state.module2Frozen}
          onAnswer={(i, v) => dispatch({ type: 'SET_M2_ANSWER', index: i, value: v })}
          onFreeze={handleFreezeModule2}
          devMode={devMode}
          initialTimeLeft={calcTimeLeft(state.module2StartedAt)}
        />
      )

    case 'results':
      return (
        <ResultsScreen
          module1Questions={module1Questions}
          module2Questions={module2Questions}
          module1Answers={state.module1Answers}
          module2Answers={state.module2Answers}
          onReset={() => dispatch({ type: 'RESET' })}
        />
      )

    default:
      return null
  }
}
