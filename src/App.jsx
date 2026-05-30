import React, { useReducer, useCallback, useMemo, useEffect } from 'react'
import { module1Questions as m1_10 } from './data/10/module1'
import { module2Questions as m2_10 } from './data/10/module2'
import { module1Questions as m1_11 } from './data/11/module1'
import { module2Questions as m2_11 } from './data/11/module2'
import WelcomeScreen from './components/WelcomeScreen'
import ExamModule from './components/ExamModule'
import TransitionScreen from './components/TransitionScreen'
import ResultsScreen from './components/ResultsScreen'

const SETS = {
  10: { module1: m1_10, module2: m2_10 },
  11: { module1: m1_11, module2: m2_11 },
}

const STORAGE_KEY = 'sat_progress'
const SESSION_MAX_MS = 80 * 60 * 1000
const FULL_DURATION = 2100
const DEV_DURATION = 60

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

const baseInitialState = {
  phase: 'welcome',
  selectedSet: null,
  module1Answers: Array(27).fill(null),
  module2Answers: Array(27).fill(null),
  module1Frozen: false,
  module2Frozen: false,
  sessionStart: null,
  module1StartedAt: null,
  module2StartedAt: null,
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
        selectedSet: action.setId,
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

export default function App() {
  const [state, dispatch] = useReducer(reducer, null, getInitialState)
  const devMode = useMemo(
    () => new URLSearchParams(window.location.search).get('dev') === '1',
    []
  )
  const duration = devMode ? DEV_DURATION : FULL_DURATION

  useEffect(() => {
    if (state.phase !== 'welcome') {
      saveSession(state)
    }
  }, [state])

  const handleFreezeModule1 = useCallback(() => dispatch({ type: 'FREEZE_MODULE1' }), [])
  const handleFreezeModule2 = useCallback(() => dispatch({ type: 'FREEZE_MODULE2' }), [])

  function calcTimeLeft(startedAt) {
    if (!startedAt) return duration
    return Math.max(0, duration - Math.floor((Date.now() - startedAt) / 1000))
  }

  const setId = state.selectedSet
  const questions = setId ? SETS[setId] : null

  switch (state.phase) {
    case 'welcome':
      return (
        <WelcomeScreen
          availableSets={Object.keys(SETS).map(Number)}
          onStart={(id) => dispatch({ type: 'START_MODULE1', setId: id })}
        />
      )

    case 'module1':
      return (
        <ExamModule
          key="module1"
          moduleNumber={1}
          setId={setId}
          questions={questions.module1}
          answers={state.module1Answers}
          frozen={state.module1Frozen}
          onAnswer={(i, v) => dispatch({ type: 'SET_M1_ANSWER', index: i, value: v })}
          onFreeze={handleFreezeModule1}
          devMode={devMode}
          duration={duration}
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
          setId={setId}
          questions={questions.module2}
          answers={state.module2Answers}
          frozen={state.module2Frozen}
          onAnswer={(i, v) => dispatch({ type: 'SET_M2_ANSWER', index: i, value: v })}
          onFreeze={handleFreezeModule2}
          devMode={devMode}
          duration={duration}
          initialTimeLeft={calcTimeLeft(state.module2StartedAt)}
        />
      )

    case 'results':
      return (
        <ResultsScreen
          setId={setId}
          module1Questions={questions.module1}
          module2Questions={questions.module2}
          module1Answers={state.module1Answers}
          module2Answers={state.module2Answers}
          onReset={() => dispatch({ type: 'RESET' })}
        />
      )

    default:
      return null
  }
}
