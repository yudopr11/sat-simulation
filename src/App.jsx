import React, { useReducer, useCallback, useMemo } from 'react'
import { module1Questions } from './data/module1'
import { module2Questions } from './data/module2'
import WelcomeScreen from './components/WelcomeScreen'
import ExamModule from './components/ExamModule'
import TransitionScreen from './components/TransitionScreen'
import ResultsScreen from './components/ResultsScreen'

const initialState = {
  phase: 'welcome', // 'welcome' | 'module1' | 'transition' | 'module2' | 'results'
  module1Answers: Array(27).fill(null),
  module2Answers: Array(27).fill(null),
  module1Frozen: false,
  module2Frozen: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'START_MODULE1':
      return { ...state, phase: 'module1' }
    case 'FREEZE_MODULE1':
      return { ...state, module1Frozen: true, phase: 'transition' }
    case 'START_MODULE2':
      return { ...state, phase: 'module2' }
    case 'FREEZE_MODULE2':
      return { ...state, module2Frozen: true, phase: 'results' }
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
  const [state, dispatch] = useReducer(reducer, initialState)
  const devMode = useMemo(
    () => new URLSearchParams(window.location.search).get('dev') === '1',
    []
  )

  const handleFreezeModule1 = useCallback(() => dispatch({ type: 'FREEZE_MODULE1' }), [])
  const handleFreezeModule2 = useCallback(() => dispatch({ type: 'FREEZE_MODULE2' }), [])

  switch (state.phase) {
    case 'welcome':
      return <WelcomeScreen onStart={() => dispatch({ type: 'START_MODULE1' })} />

    case 'module1':
      return (
        <ExamModule
          moduleNumber={1}
          questions={module1Questions}
          answers={state.module1Answers}
          frozen={state.module1Frozen}
          onAnswer={(i, v) => dispatch({ type: 'SET_M1_ANSWER', index: i, value: v })}
          onFreeze={handleFreezeModule1}
          devMode={devMode}
        />
      )

    case 'transition':
      return <TransitionScreen onContinue={() => dispatch({ type: 'START_MODULE2' })} />

    case 'module2':
      return (
        <ExamModule
          moduleNumber={2}
          questions={module2Questions}
          answers={state.module2Answers}
          frozen={state.module2Frozen}
          onAnswer={(i, v) => dispatch({ type: 'SET_M2_ANSWER', index: i, value: v })}
          onFreeze={handleFreezeModule2}
          devMode={devMode}
        />
      )

    case 'results':
      return (
        <ResultsScreen
          module1Questions={module1Questions}
          module2Questions={module2Questions}
          module1Answers={state.module1Answers}
          module2Answers={state.module2Answers}
        />
      )

    default:
      return null
  }
}
