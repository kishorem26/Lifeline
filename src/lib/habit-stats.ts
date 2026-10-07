import { differenceInCalendarDays, eachDayOfInterval, endOfMonth, isSameDay, max, min, parseISO, startOfMonth, subDays } from 'date-fns'
import { dateKey, type Habit, type Mark } from './habit-store'

type Marks = Record<string, Mark> | undefined

/** First day we should count for this habit (creation date, or earlier if backfilled). */
export function trackingStart(habit: Habit, m: Marks): Date {
  const created = parseISO(habit.createdAt)
  const keys = Object.keys(m ?? {}).sort()
  return keys.length ? min([created, parseISO(keys[0])]) : created
}

export function currentStreak(m: Marks, today: Date): number {
  if (!m) return 0
  let d = today
  const t = m[dateKey(d)]
  if (t === 'miss') return 0
  if (t !== 'done') d = subDays(d, 1) // today still open, don't break the streak
  let n = 0
  while (m[dateKey(d)] === 'done') {
    n++
    d = subDays(d, 1)
  }
  return n
}

export function bestStreak(m: Marks): number {
  if (!m) return 0
  const days = Object.keys(m).filter((k) => m[k] === 'done').sort()
  let best = 0
  let run = 0
  let prev: Date | null = null
  for (const k of days) {
    const d = parseISO(k)
    run = prev && differenceInCalendarDays(d, prev) === 1 ? run + 1 : 1
    best = Math.max(best, run)
    prev = d
  }
  return best
}

export function monthStats(habit: Habit, m: Marks, month: Date, today: Date) {
  const start = max([startOfMonth(month), trackingStart(habit, m)])
  let end = min([endOfMonth(month), today])
  // today only counts once it has been marked
  if (isSameDay(end, today) && !m?.[dateKey(today)]) end = subDays(end, 1)

  if (start > end) return { eligible: 0, done: 0, pct: 0 }

  const days = eachDayOfInterval({ start, end })
  const done = days.filter((d) => m?.[dateKey(d)] === 'done').length
  return { eligible: days.length, done, pct: Math.round((done / days.length) * 100) }
}
