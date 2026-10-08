
import {
  Footprints, Droplets, Moon, Dumbbell, BookOpen, Leaf, Egg, Zap, GraduationCap,
  Plus, UtensilsCrossed, Check, Laugh, Smile, Meh, Frown, Angry,
} from 'lucide-react'
import { format, startOfWeek, addDays, isToday } from 'date-fns'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { MetricCard } from '@/components/ui/MetricCard'
import type { BarVariant } from '@/components/ui/ProgressBar'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useMetricsStore } from '@/lib/metrics-store'
import { useLocalStorage } from '@/hooks/useLocalStorage'

const MOODS = [
  { icon: Laugh, label: 'Great' },
  { icon: Smile, label: 'Good' },
  { icon: Meh, label: 'Okay' },
  { icon: Frown, label: 'Low' },
  { icon: Angry, label: 'Bad' },
]


function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

interface CardData {
  key: string
  icon: LucideIcon
  label: string
  caption: string
  value: string
  unit?: string
  target: string
  progress: number
  color: string
  streak?: number
  variant?: BarVariant
  blocks?: number
  wide?: boolean
}

export default function Home() {
  const todayKey = format(new Date(), 'yyyy-MM-dd')
  
  const [mood, setMood] = useLocalStorage<number | null>(`lifeline_mood_${todayKey}`, null)

  const handleMood = (i: number) => setMood(i)

  const metrics = useMetricsStore()

  const [profile] = useLocalStorage('lifeline_profile', {
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    height: '',
    weight: '',
    bio: '',
  })

  const name = profile?.name || ''
  
  let targetProtein = 100
  let targetCalories = 2100
  
  if (profile?.weight) {
    const w = parseFloat(profile.weight)
    if (!isNaN(w)) targetProtein = Math.round(w * 1.6)
  }
  if (profile?.weight && profile?.height) {
    const w = parseFloat(profile.weight)
    const h = parseFloat(profile.height)
    if (!isNaN(w) && !isNaN(h)) {
      // Basic Mifflin-St Jeor formula (assuming age 25, male)
      const bmr = (10 * w) + (6.25 * h) - (5 * 25) + 5
      targetCalories = Math.round(bmr * 1.2) // apply activity multiplier
    }
  }

  const QUICK = [
    { icon: Droplets, label: 'Water', onClick: () => metrics.increment('water', 1) },
    { icon: UtensilsCrossed, label: 'Food', onClick: () => { metrics.increment('protein', 15); metrics.increment('calories', 350) } },
    { icon: Dumbbell, label: 'Workout', onClick: () => metrics.increment('workout', 15) },
    { icon: Footprints, label: 'Steps', onClick: () => metrics.increment('steps', 500) },
    { icon: BookOpen, label: 'Reading', onClick: () => metrics.increment('reading', 10) },
    { icon: Check, label: 'Habit', onClick: () => {} },
  ]

  const BREAKDOWN = [
    { label: 'Sleep', score: Math.min(20, Math.floor((metrics.sleep/480)*20)), max: 20, color: 'var(--color-sleep)' },
    { label: 'Activity', score: Math.min(20, Math.floor((metrics.steps/10000)*20)), max: 20, color: 'var(--color-steps)' },
    { label: 'Nutrition', score: Math.min(20, Math.floor((metrics.calories/targetCalories)*20)), max: 20, color: 'var(--color-calories)' },
    { label: 'Hydration', score: Math.min(20, Math.floor((metrics.water/8)*20)), max: 20, color: 'var(--color-water)' },
    { label: 'Habits', score: 10, max: 10, color: 'var(--color-study)' },
    { label: 'Recovery', score: 8, max: 10, color: 'var(--color-reading)' },
  ]

  const formatHrsMins = (mins: number) => {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    if (h > 0) return m > 0 ? `${h}h ${m}m` : `${h}h`
    return `${m}m`
  }

  const CARDS: CardData[] = [
    { key: 'steps', icon: Footprints, label: 'Steps', caption: 'Walk', value: metrics.steps.toLocaleString(), target: '10,000', progress: (metrics.steps/10000)*100, color: 'var(--color-steps)', streak: 5, wide: true },
    { key: 'water', icon: Droplets, label: 'Water', caption: 'Glasses', value: String(metrics.water), unit: 'of 8', target: '2.5 L', progress: (metrics.water/8)*100, color: 'var(--color-water)', streak: 12, variant: 'blocks', blocks: 8 },
    { key: 'sleep', icon: Moon, label: 'Sleep', caption: 'Last night', value: formatHrsMins(metrics.sleep), target: '8h', progress: (metrics.sleep/480)*100, color: 'var(--color-sleep)' },
    { key: 'reading', icon: BookOpen, label: 'Reading', caption: 'Time', value: String(metrics.reading), unit: 'min', target: '30', progress: (metrics.reading/30)*100, color: 'var(--color-reading)', streak: 9, variant: 'ticks', wide: true },
    { key: 'workout', icon: Dumbbell, label: 'Workout', caption: 'Time', value: String(metrics.workout), unit: 'min', target: '60', progress: (metrics.workout/60)*100, color: 'var(--color-workout)', streak: 7, variant: 'ticks', wide: true },
    { key: 'protein', icon: Egg, label: 'Protein Target', caption: 'Daily intake', value: String(targetProtein), unit: 'g', target: '', progress: 100, color: 'var(--color-protein)', variant: 'solid' },
    { key: 'calories', icon: Zap, label: 'Calorie Target', caption: 'To burn', value: targetCalories.toLocaleString(), target: '', progress: 100, color: 'var(--color-calories)' },
    { key: 'mind', icon: Leaf, label: 'Meditate', caption: 'Time', value: String(metrics.mind), unit: 'min', target: '15', progress: (metrics.mind/15)*100, color: 'var(--color-mind)', streak: 3, variant: 'ticks' },
    { key: 'study', icon: GraduationCap, label: 'Study', caption: 'Hours', value: String(metrics.study), unit: 'h', target: '5', progress: (metrics.study/5)*100, color: 'var(--color-study)', streak: 4, variant: 'blocks', blocks: 10 },
  ]

  const monday = startOfWeek(new Date(), { weekStartsOn: 1 })
  const week = Array.from({ length: 7 }, (_, i) => addDays(monday, i))
  const score = 82

  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <p className="label">{format(new Date(), 'EEEE · d MMMM')}</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-4xl capitalize">
            {greeting()}{name ? `, ${name}` : ''}
          </h1>
        </div>
        {/* Today's score badge */}
        <div
          className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl border border-lime/30 bg-lime/10 sm:hidden"
          aria-label={`Today's score: ${score}`}
        >
          <span className="text-xl font-extrabold leading-none text-lime">{score}</span>
          <span className="text-[9px] font-bold tracking-wider text-lime/70 uppercase">Score</span>
        </div>
      </header>

      {/* Week strip — scrollable + snapping */}
      <div
        role="group"
        aria-label="Week"
        className="flex gap-2 overflow-x-auto pb-1 snap-x-mandatory scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {week.map((d) => (
          <button
            key={d.toISOString()}
            type="button"
            className={cn(
              'snap-start flex h-[68px] w-[60px] shrink-0 flex-col items-center justify-center gap-1 rounded-[20px] border transition active:scale-95',
              isToday(d) ? 'border-lime bg-lime text-black' : 'border-line bg-white/[0.04] active:bg-white/[0.08]',
            )}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">{format(d, 'EEE')}</span>
            <span className="text-xl font-extrabold">{format(d, 'd')}</span>
          </button>
        ))}
      </div>

      {/* Score + Mood — stacked on mobile, side-by-side on lg */}
      <section className="grid gap-4 lg:grid-cols-3">
        {/* Score card */}
        <div className="card p-5 sm:p-7 lg:col-span-2">
          {/* Mobile: compact score row */}
          <div className="flex items-center gap-5 sm:hidden">
            <ProgressRing value={score} size={100} stroke={10} gradient={['#d9ff55', '#19c37d']} label="Today's score">
              <div className="text-center">
                <div className="text-[36px] font-extrabold leading-none tracking-tight">{score}</div>
                <div className="label mt-0.5">/ 100</div>
              </div>
            </ProgressRing>
            <div className="flex-1">
              <p className="text-lg font-extrabold tracking-tight">You're doing great!</p>
              <p className="mt-1 text-sm text-muted">Finish 60-min workout. 18 min left.</p>
            </div>
          </div>

          {/* Desktop: full layout */}
          <div className="hidden sm:flex flex-wrap items-center gap-7">
            <ProgressRing value={score} size={176} stroke={14} gradient={['#d9ff55', '#19c37d']} label="Today's score">
              <div className="text-center">
                <div className="text-[56px] font-extrabold leading-none tracking-tight">{score}</div>
                <div className="label mt-1">of 100</div>
              </div>
            </ProgressRing>
            <div className="min-w-[260px] flex-1">
              <p className="label">Today's score</p>
              <p className="mt-1.5 text-2xl font-extrabold tracking-tight">You're doing great today.</p>
              <p className="mt-1.5 text-[15px] text-muted">Next up: finish your 60-min workout. 18 min to go.</p>
              <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-3.5 sm:grid-cols-3">
                {BREAKDOWN.map((b) => (
                  <div key={b.label}>
                    <div className="flex justify-between text-[13px] font-semibold text-muted">
                      <span>{b.label}</span>
                      <span className="text-white">{b.score}/{b.max}</span>
                    </div>
                    <div className="mt-1.5">
                      <ProgressBar value={(b.score / b.max) * 100} color={b.color} height={6} label={`${b.label} score`} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted">A wellness indicator, not medical advice.</p>
            </div>
          </div>

          {/* Mobile score breakdown — 2-col compact */}
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 sm:hidden">
            {BREAKDOWN.map((b) => (
              <div key={b.label}>
                <div className="flex justify-between text-xs font-semibold text-muted">
                  <span>{b.label}</span>
                  <span className="text-white">{b.score}/{b.max}</span>
                </div>
                <div className="mt-1">
                  <ProgressBar value={(b.score / b.max) * 100} color={b.color} height={5} label={`${b.label} score`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mood card */}
        <div className="card flex flex-col justify-between gap-4 p-5 sm:p-7">
          <div>
            <p className="label">How are you feeling?</p>
            <p className="mt-1.5 text-xl font-extrabold tracking-tight">{mood !== null ? MOODS[mood].label : 'Tap to log'}</p>
          </div>
          <div className="flex justify-between gap-1" role="group" aria-label="Mood">
            {MOODS.map(({ icon: Icon, label }, i) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                aria-pressed={mood === i}
                onClick={() => handleMood(i)}
                className={cn(
                  'grid h-14 flex-1 place-items-center rounded-[18px] transition active:scale-90',
                  mood === i ? 'bg-lime/15 text-lime ring-[1.5px] ring-lime' : 'bg-white/[0.05] text-white/60 active:bg-white/10',
                )}
              >
                <Icon size={26} strokeWidth={1.7} aria-hidden />
              </button>
            ))}
          </div>
          <p className="text-[13px] text-muted">One tap to log. Edit anytime.</p>
        </div>
      </section>

      {/* Quick add — full-width scrollable pills */}
      <section aria-label="Quick add" className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {QUICK.map(({ icon: Icon, label, onClick }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            className="flex h-12 shrink-0 items-center gap-2.5 rounded-full border border-white/[0.09] bg-white/[0.04] pl-2.5 pr-5 text-sm font-bold transition active:scale-95 active:bg-white/[0.08]"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-lime text-black shrink-0">
              <Plus size={15} strokeWidth={2.8} aria-hidden />
            </span>
            <Icon size={17} aria-hidden />
            {label}
          </button>
        ))}
      </section>

      {/* Metric cards — 1-col on xs, 2-col sm, 4-col lg */}
      <section aria-label="Today's metrics" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {CARDS.map(({ key, ...c }) => (
          <MetricCard key={key} {...c} />
        ))}
      </section>
    </div>
  )
}
