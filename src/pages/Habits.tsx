import { useMemo, useState, type FormEvent } from 'react'
import {
  addMonths, eachDayOfInterval, endOfMonth, format, isAfter, isSameDay, isSameMonth, startOfDay, startOfMonth,
} from 'date-fns'
import { z } from 'zod'
import { Check, ChevronLeft, ChevronRight, Flame, Pencil, Plus, Trash2, X } from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { HABIT_COLORS, dateKey, useHabitStore, type Mark } from '@/lib/habit-store'
import { bestStreak, currentStreak, monthStats, trackingStart } from '@/lib/habit-stats'
import { cn } from '@/lib/cn'
import { ColorWheel } from '@/components/ui/ColorWheel'

const WEEK_COLORS = ['#22b8e6', '#7ed30f', '#ff3d8b', '#ffb020', '#9a5cff', '#2f7bff']
const nameSchema = z.string().trim().min(1, 'Give your habit a name.').max(40, 'Keep it under 40 characters.')

function NameEditor({ id, name }: { id: string; name: string }) {
  const rename = useHabitStore((s) => s.renameHabit)
  const [value, setValue] = useState(name)

  const commit = () => {
    const r = nameSchema.safeParse(value)
    if (r.success) rename(id, r.data)
    else setValue(name)
  }

  return (
    <input
      value={value}
      maxLength={40}
      aria-label="Habit name"
      onChange={(e) => setValue(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
      className="min-w-0 flex-1 rounded-lg border border-line bg-white/[0.05] px-2 py-1 text-sm font-semibold outline-none focus:border-lime"
    />
  )
}

export default function Habits() {
  const { habits, marks, addHabit, recolorHabit, removeHabit, cycleMark } = useHabitStore()
  const today = startOfDay(new Date())

  const [month, setMonth] = useState(() => startOfMonth(new Date()))
  const [editing, setEditing] = useState(false)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [color, setColor] = useState(HABIT_COLORS[0].hex)
  const [error, setError] = useState('')

  const days = useMemo(() => eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) }), [month])

  // Real calendar weeks (Monday start), clipped to this month
  const weeks = useMemo(() => {
    const out: { count: number }[] = []
    days.forEach((d, i) => {
      if (i === 0 || d.getDay() === 1) out.push({ count: 1 })
      else out[out.length - 1].count++
    })
    return out
  }, [days])

  const stats = useMemo(
    () =>
      habits.map((h) => {
        const m = marks[h.id]
        return { habit: h, ...monthStats(h, m, month, today), streak: currentStreak(m, today), best: bestStreak(m) }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [habits, marks, month],
  )

  const totals = useMemo(() => {
    const eligible = stats.reduce((a, s) => a + s.eligible, 0)
    const done = stats.reduce((a, s) => a + s.done, 0)
    return {
      eligible,
      done,
      missed: eligible - done,
      pct: eligible ? Math.round((done / eligible) * 100) : 0,
      best: stats.reduce((a, s) => Math.max(a, s.best), 0),
    }
  }, [stats])

  const chart = useMemo(
    () =>
      days
        .filter((d) => !isAfter(d, today))
        .map((d) => {
          const key = dateKey(d)
          const active = habits.filter((h) => trackingStart(h, marks[h.id]) <= d)
          const done = active.filter((h) => marks[h.id]?.[key] === 'done').length
          return { day: format(d, 'd'), pct: active.length ? Math.round((done / active.length) * 100) : 0 }
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [days, habits, marks],
  )

  const top = useMemo(() => [...stats].filter((s) => s.eligible > 0).sort((a, b) => b.pct - a.pct).slice(0, 3), [stats])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const r = nameSchema.safeParse(name)
    if (!r.success) return setError(r.error.issues[0].message)
    if (habits.some((h) => h.name.toLowerCase() === r.data.toLowerCase())) return setError('You already track that habit.')
    addHabit(r.data, color)
    setName('')
    setError('')
  }

  const isThisMonth = isSameMonth(month, new Date())
  const labelCol = editing ? 230 : 168

  return (
    <div className="space-y-5">
      <header className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="label">Habits · Monthly view</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-4xl">Be 1% better every day</h1>
          </div>
          {/* Month navigator */}
          <div className="flex items-center gap-1 rounded-[18px] border border-line bg-white/[0.04] p-1">
            <button type="button" aria-label="Previous month" onClick={() => setMonth((m) => addMonths(m, -1))} className="grid h-10 w-10 place-items-center rounded-xl active:bg-white/10">
              <ChevronLeft size={18} />
            </button>
            <div className="w-[110px] text-center text-sm font-extrabold sm:w-[140px] sm:text-base">{format(month, 'MMM yyyy')}</div>
            <button type="button" aria-label="Next month" onClick={() => setMonth((m) => addMonths(m, 1))} className="grid h-10 w-10 place-items-center rounded-xl active:bg-white/10">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        {!isThisMonth && (
          <button type="button" onClick={() => setMonth(startOfMonth(new Date()))} className="h-10 w-full rounded-xl border border-line bg-white/[0.04] text-sm font-bold active:bg-white/[0.08] sm:w-auto sm:px-4">
            Back to this month
          </button>
        )}
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="card flex items-center gap-5 p-6">
          <ProgressRing value={totals.pct} size={120} stroke={11} gradient={['#d9ff55', '#19c37d']} label="Overall progress">
            <span className="text-3xl font-extrabold tracking-tight">{totals.pct}%</span>
          </ProgressRing>
          <div>
            <p className="label">Overall progress</p>
            <p className="mt-1.5 text-lg font-extrabold leading-tight">{format(month, 'MMMM')}</p>
            <p className="mt-1 text-[13px] text-muted">Today counts once you mark it.</p>
          </div>
        </div>

        <div className="card min-w-0 p-6 lg:col-span-2">
          <div className="flex items-baseline justify-between">
            <p className="text-base font-extrabold">Daily progress</p>
            <p className="text-xs font-bold text-muted">Share of habits completed</p>
          </div>
          <div className="mt-2 h-[150px]">
            {chart.length === 0 ? (
              <div className="grid h-full place-items-center text-sm text-muted">Nothing to chart for this month yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chart} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="habitArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#c6f432" stopOpacity={0.32} />
                      <stop offset="1" stopColor="#c6f432" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tickLine={false} axisLine={false} interval={4} tick={{ fill: '#8d93a0', fontSize: 11, fontWeight: 700 }} />
                  <Tooltip
                    cursor={{ stroke: 'rgb(255 255 255 / 0.15)' }}
                    contentStyle={{ background: '#181b20', border: '1px solid rgb(255 255 255 / 0.1)', borderRadius: 12, fontSize: 12 }}
                    formatter={(v) => [`${v}%`, 'Completed']}
                    labelFormatter={(l) => `Day ${l}`}
                  />
                  <Area type="monotone" dataKey="pct" stroke="#c6f432" strokeWidth={3} fill="url(#habitArea)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" aria-label="Month summary">
        {[
          { label: 'Best streak', value: totals.best, unit: 'days', color: '#ff7a1a' },
          { label: 'Completed', value: totals.done, unit: 'check-ins', color: '#19c37d' },
          { label: 'Missed', value: totals.missed, unit: 'check-ins', color: '#ff3b4a' },
          { label: 'Habits tracked', value: habits.length, unit: 'active', color: '#2f7bff' },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-3xl border border-white/[0.08] p-4 sm:p-5"
            style={{ background: `linear-gradient(180deg, #0d0e10 0%, color-mix(in srgb, ${s.color} 36%, #0d0e10) 100%)` }}
          >
            <p className="label !text-white/60">{s.label}</p>
            <p className="mt-2 text-[26px] font-extrabold leading-none tracking-tight sm:text-[34px]">
              {s.value}
              <span className="ml-1 text-[13px] font-semibold text-white/55 sm:ml-1.5 sm:text-[15px]">{s.unit}</span>
            </p>
          </div>
        ))}
      </section>

      <section className="card space-y-4 p-5 sm:p-6" style={{ background: "var(--color-surface)" }} aria-label="Daily habit grid">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-lg font-extrabold">Daily habits</p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-muted">
            <span>Tap a day: done → missed → clear</span>
            <button
              type="button"
              onClick={() => { setEditing((e) => !e); setConfirmId(null) }}
              className={cn('flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-bold transition', editing ? 'border-lime bg-lime text-black' : 'border-line bg-white/[0.04] text-white hover:bg-white/[0.08]')}
            >
              {editing ? <Check size={16} /> : <Pencil size={16} />}
              {editing ? 'Done' : 'Edit habits'}
            </button>
          </div>
        </div>

        {/* Add habit */}
        <form onSubmit={submit} className="space-y-3 rounded-2xl border border-line bg-white/[0.03] p-3">
          <div className="flex gap-2">
            <input
              value={name}
              maxLength={40}
              onChange={(e) => { setName(e.target.value); setError('') }}
              placeholder="New habit, e.g. Cold shower"
              aria-label="New habit name"
              className="h-12 flex-1 rounded-xl border border-line bg-white/[0.05] px-4 text-sm font-semibold outline-none placeholder:text-muted focus:border-lime"
            />
            <button type="submit" className="flex h-12 shrink-0 items-center gap-2 rounded-xl bg-lime px-4 text-sm font-extrabold text-black active:scale-95">
              <Plus size={16} strokeWidth={2.8} /> Add
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-6 py-2 px-1">
            <ColorWheel 
              color={color} 
              onChange={setColor} 
              className="w-24 h-24 shrink-0" 
            />
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold tracking-wide text-muted uppercase">Selected Color</span>
              <div className="flex items-center gap-3">
                <div 
                  className="h-10 w-10 rounded-full shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)] ring-2 ring-white/10" 
                  style={{ background: color }} 
                />
              </div>
            </div>
          </div>
          {error && <p role="alert" className="text-[13px] font-semibold text-workout">{error}</p>}
        </form>

        {habits.length === 0 ? (
          <div className="grid place-items-center rounded-2xl border border-dashed border-line p-10 text-center">
            <div>
              <p className="text-lg font-extrabold">No habits yet.</p>
              <p className="mt-1 text-sm text-muted">Add your first habit above to start tracking your month.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto pb-2">
            <div
              className="grid items-center"
              style={{
                gridTemplateColumns: `${labelCol}px repeat(${days.length}, 38px) 140px`,
                columnGap: 4,
                rowGap: 6,
                minWidth: labelCol + days.length * 42 + 140,
              }}
            >
              {/* Week headers */}
              <div className="sticky left-0 z-10" style={{ background: "var(--color-surface)" }} />
              {weeks.map((w, i) => (
                <div
                  key={i}
                  className="rounded-lg py-1.5 text-center text-[11px] font-extrabold uppercase tracking-wider"
                  style={{ gridColumn: `span ${w.count}`, color: WEEK_COLORS[i % WEEK_COLORS.length], background: `color-mix(in srgb, ${WEEK_COLORS[i % WEEK_COLORS.length]} 14%, transparent)` }}
                >
                  {w.count >= 3 ? `Week ${i + 1}` : `W${i + 1}`}
                </div>
              ))}
              <div />

              {/* Day headers: real weekday + date */}
              <div className="sticky left-0 z-10 text-xs font-bold text-muted" style={{ background: "var(--color-surface)" }}>Habit</div>
              {days.map((d) => {
                const isToday = isSameDay(d, today)
                const weekend = d.getDay() === 0 || d.getDay() === 6
                return (
                  <div
                    key={d.toISOString()}
                    className={cn('rounded-lg py-1 text-center leading-tight', isToday ? 'bg-lime text-black' : weekend ? 'text-muted/60' : 'text-muted')}
                  >
                    <div className="text-[10px] font-bold uppercase">{format(d, 'EEEEE')}</div>
                    <div className="text-xs font-extrabold">{format(d, 'd')}</div>
                  </div>
                )
              })}
              <div className="text-right text-xs font-bold text-muted">Progress · Streak</div>

              {/* Habit rows */}
              {stats.map(({ habit: h, pct, streak }) => (
                <HabitRow
                  key={h.id}
                  h={h}
                  pct={pct}
                  streak={streak}
                  days={days}
                  today={today}
                  editing={editing}
                  mark={(key) => marks[h.id]?.[key]}
                  onCycle={(key) => cycleMark(h.id, key)}
                  onRecolor={() => {
                    const i = HABIT_COLORS.findIndex((c) => c.hex === h.color)
                    recolorHabit(h.id, HABIT_COLORS[(i + 1) % HABIT_COLORS.length].hex)
                  }}
                  confirming={confirmId === h.id}
                  onAskDelete={() => setConfirmId(h.id)}
                  onDelete={() => { removeHabit(h.id); setConfirmId(null) }}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="card space-y-4 p-5 sm:p-6" aria-label="Top habits">
        <p className="text-lg font-extrabold">Top habits this month</p>
        {top.length === 0 ? (
          <p className="text-sm text-muted">Mark a few days and your best habits will show up here.</p>
        ) : (
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-3">
            {top.map((t) => (
              <div
                key={t.habit.id}
                className="rounded-[22px] border border-white/[0.08] p-4 sm:p-5"
                style={{ background: `linear-gradient(180deg, #0d0e10 0%, color-mix(in srgb, ${t.habit.color} 28%, #0d0e10) 100%)` }}
              >
                <div className="flex items-center justify-between text-sm font-bold sm:text-base">
                  <span className="truncate">{t.habit.name}</span>
                  <span className="ml-2 shrink-0">{t.pct}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.09] sm:h-2.5 sm:mt-3.5">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${t.pct}%`, background: t.habit.color }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

interface RowProps {
  h: { id: string; name: string; color: string }
  pct: number
  streak: number
  days: Date[]
  today: Date
  editing: boolean
  mark: (key: string) => Mark | undefined
  onCycle: (key: string) => void
  onRecolor: () => void
  confirming: boolean
  onAskDelete: () => void
  onDelete: () => void
}

function HabitRow({ h, pct, streak, days, today, editing, mark, onCycle, onRecolor, confirming, onAskDelete, onDelete }: RowProps) {
  return (
    <>
      <div className="sticky left-0 z-10 flex items-center gap-2 pr-2" style={{ background: "var(--color-surface)" }}>
        {editing ? (
          <>
            <button type="button" aria-label={`Change color of ${h.name}`} onClick={onRecolor} className="h-5 w-5 shrink-0 rounded-md" style={{ background: h.color }} />
            <NameEditor id={h.id} name={h.name} />
            {confirming ? (
              <button type="button" onClick={onDelete} className="shrink-0 rounded-lg bg-workout px-2 py-1 text-xs font-extrabold text-black">Delete?</button>
            ) : (
              <button type="button" aria-label={`Delete ${h.name}`} onClick={onAskDelete} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted hover:bg-white/10 hover:text-workout">
                <Trash2 size={16} />
              </button>
            )}
          </>
        ) : (
          <>
            <span className="h-2.5 w-2.5 shrink-0 rounded-[4px]" style={{ background: h.color }} aria-hidden />
            <span className="truncate text-sm font-semibold">{h.name}</span>
          </>
        )}
      </div>

      {days.map((d) => {
        const key = dateKey(d)
        const m = mark(key)
        const future = isAfter(d, today)
        const isToday = isSameDay(d, today)
        const state = m === 'done' ? 'done' : m === 'miss' ? 'missed' : 'empty'
        return (
          <button
            key={key}
            type="button"
            disabled={future}
            onClick={() => onCycle(key)}
            aria-label={`${h.name}, ${format(d, 'EEEE d MMMM')}: ${state}`}
            className={cn(
              'grid h-[34px] w-[34px] place-items-center justify-self-center rounded-[10px] border-[1.5px] transition active:scale-90',
              future && 'cursor-not-allowed border-transparent bg-white/[0.04]',
              !future && !m && (isToday ? 'border-dashed' : 'border-white/[0.12] hover:border-white/30'),
              m === 'miss' && 'border-white/30 text-white/70',
              m === 'done' && 'border-transparent text-black',
            )}
            style={{
              ...(m === 'done' ? { background: h.color } : {}),
              ...(!future && !m && isToday ? { borderColor: h.color } : {}),
            }}
          >
            {m === 'done' && <Check size={16} strokeWidth={3.4} aria-hidden />}
            {m === 'miss' && <X size={14} strokeWidth={3} aria-hidden />}
          </button>
        )
      })}

      <div className="flex items-center justify-end gap-2 pl-1.5">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
          <div className="h-full rounded-full bg-lime transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <span className="w-9 text-right text-xs font-bold">{pct}%</span>
        <span className="flex w-8 items-center justify-end gap-0.5 text-xs font-bold text-white/65" aria-label={`${streak} day streak`}>
          <Flame size={12} aria-hidden />{streak}
        </span>
      </div>
    </>
  )
}
