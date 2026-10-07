import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { format } from 'date-fns'

export type Mark = 'done' | 'miss'

export interface Habit {
  id: string
  name: string
  color: string
  createdAt: string // yyyy-MM-dd
}

export const HABIT_COLORS = [
  { name: 'Cyan', hex: '#22b8e6' },
  { name: 'Green', hex: '#19c37d' },
  { name: 'Lime', hex: '#7ed30f' },
  { name: 'Amber', hex: '#ffb020' },
  { name: 'Orange', hex: '#ff7a1a' },
  { name: 'Red', hex: '#ff3b4a' },
  { name: 'Pink', hex: '#ff3d8b' },
  { name: 'Purple', hex: '#9a5cff' },
  { name: 'Blue', hex: '#2f7bff' },
]

export const dateKey = (d: Date) => format(d, 'yyyy-MM-dd')

const today = () => dateKey(new Date())

const DEFAULTS: [string, string][] = [
  ['Workout', '#ff3b4a'],
  ['10K steps', '#19c37d'],
  ['Healthy diet', '#ffb020'],
  ['3 L water', '#22b8e6'],
  ['Read', '#7ed30f'],
  ['Study', '#2f7bff'],
  ['No junk food', '#ff7a1a'],
  ['Low screen time', '#9a5cff'],
  ['Meditate', '#ff3d8b'],
  ['Journal', '#22b8e6'],
]

interface HabitState {
  habits: Habit[]
  marks: Record<string, Record<string, Mark>> // habitId -> yyyy-MM-dd -> mark
  addHabit: (name: string, color: string) => void
  renameHabit: (id: string, name: string) => void
  recolorHabit: (id: string, color: string) => void
  removeHabit: (id: string) => void
  cycleMark: (id: string, key: string) => void
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set) => ({
      habits: DEFAULTS.map(([name, color], i) => ({
        id: `seed-${i}`,
        name,
        color,
        createdAt: today(),
      })),
      marks: {},

      addHabit: (name, color) =>
        set((s) => ({
          habits: [...s.habits, { id: crypto.randomUUID(), name, color, createdAt: today() }],
        })),

      renameHabit: (id, name) =>
        set((s) => ({ habits: s.habits.map((h) => (h.id === id ? { ...h, name } : h)) })),

      recolorHabit: (id, color) =>
        set((s) => ({ habits: s.habits.map((h) => (h.id === id ? { ...h, color } : h)) })),

      removeHabit: (id) =>
        set((s) => {
          const marks = { ...s.marks }
          delete marks[id]
          return { habits: s.habits.filter((h) => h.id !== id), marks }
        }),

      // empty -> done -> miss -> empty
      cycleMark: (id, key) =>
        set((s) => {
          const current = s.marks[id]?.[key]
          const habitMarks = { ...(s.marks[id] ?? {}) }
          if (!current) habitMarks[key] = 'done'
          else if (current === 'done') habitMarks[key] = 'miss'
          else delete habitMarks[key]
          return { marks: { ...s.marks, [id]: habitMarks } }
        }),
    }),
    { name: 'lifeline-habits', version: 1 },
  ),
)
