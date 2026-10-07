import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface MetricsState {
  steps: number
  water: number
  sleep: number // in minutes
  workout: number // in minutes
  protein: number
  calories: number
  reading: number
  mind: number
  study: number

  increment: (key: keyof Omit<MetricsState, 'increment'>, val: number) => void
}

export const useMetricsStore = create<MetricsState>()(
  persist(
    (set) => ({
      steps: 0,
      water: 0,
      sleep: 0,
      workout: 0,
      protein: 0,
      calories: 0,
      reading: 0,
      mind: 0,
      study: 0,

      increment: (key, val) => set((s) => ({ ...s, [key]: (s[key] as number) + val })),
    }),
    { name: 'lifeline-metrics', version: 2 }
  )
)
