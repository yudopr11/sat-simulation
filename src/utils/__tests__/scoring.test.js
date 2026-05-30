import { describe, it, expect } from 'vitest'
import { getMathScoreRange, formatScoreRange } from '../scoring'

describe('getMathScoreRange', () => {
  it('returns 200-200 for raw score 0', () => {
    expect(getMathScoreRange(0)).toEqual({ lower: 200, upper: 200 })
  })

  it('returns correct range for raw score 1', () => {
    expect(getMathScoreRange(1)).toEqual({ lower: 210, upper: 220 })
  })

  it('returns correct range for raw score 27 (mid)', () => {
    expect(getMathScoreRange(27)).toEqual({ lower: 440, upper: 480 })
  })

  it('returns 790-800 for max raw score 54', () => {
    expect(getMathScoreRange(54)).toEqual({ lower: 790, upper: 800 })
  })

  it('clamps negative score to 0', () => {
    expect(getMathScoreRange(-5)).toEqual({ lower: 200, upper: 200 })
  })

  it('clamps score above max to last entry', () => {
    expect(getMathScoreRange(100)).toEqual({ lower: 790, upper: 800 })
  })

  it('returns 200-800 range for all valid scores', () => {
    for (let i = 0; i <= 54; i++) {
      const { lower, upper } = getMathScoreRange(i)
      expect(lower).toBeGreaterThanOrEqual(200)
      expect(upper).toBeLessThanOrEqual(800)
      expect(lower).toBeLessThanOrEqual(upper)
    }
  })
})

describe('formatScoreRange', () => {
  it('formats range with dash', () => {
    expect(formatScoreRange({ lower: 640, upper: 700 })).toBe('640–700')
  })

  it('formats single value when lower === upper', () => {
    expect(formatScoreRange({ lower: 800, upper: 800 })).toBe('800')
  })

  it('formats minimum score', () => {
    expect(formatScoreRange({ lower: 200, upper: 200 })).toBe('200')
  })
})
