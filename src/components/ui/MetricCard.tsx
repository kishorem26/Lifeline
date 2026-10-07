import type { LucideIcon } from 'lucide-react'
import { ArrowRightCircle, Flame } from 'lucide-react'
import { motion } from 'framer-motion'
import { ProgressBar, type BarVariant } from './ProgressBar'
import { cn } from '@/lib/cn'

interface Props {
  icon: LucideIcon
  label: string
  caption?: string
  value: string
  unit?: string
  target: string
  progress: number
  color: string // css color / var
  streak?: number
  variant?: BarVariant
  blocks?: number
  wide?: boolean
  onClick?: () => void
}

export function MetricCard({ icon: Icon, label, caption, value, unit, target, progress, color, streak, variant = 'solid', blocks, wide, onClick }: Props) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn('relative flex min-h-[170px] w-full flex-col overflow-hidden rounded-[1.75rem] border border-white/[0.08] p-5 text-left sm:min-h-[190px] sm:p-[22px]', wide && 'col-span-2')}
      style={{
        background: `linear-gradient(180deg, #0d0e10 0%, color-mix(in srgb, ${color} 40%, #0d0e10) 100%)`,
        boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.06), 0 22px 40px -28px rgb(0 0 0 / 0.9)',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-base font-bold sm:text-lg">
          <Icon size={22} strokeWidth={2} style={{ color }} aria-hidden />
          {label}
        </div>
        {streak ? (
          <span className="flex items-center gap-1 text-sm font-bold text-white/60" aria-label={`${streak} day streak`}>
            <Flame size={15} aria-hidden /> {streak}
          </span>
        ) : null}
      </div>

      {caption && <div className="mt-0.5 text-sm font-semibold text-white/55 sm:text-[15px]">{caption}</div>}

      <div className="mt-auto flex items-baseline justify-between gap-3">
        <div className="text-[34px] font-bold leading-none tracking-tight sm:text-[42px]">
          {value}
          {unit && <span className="ml-1 text-sm font-semibold text-white/55 sm:text-lg">{unit}</span>}
        </div>
        {target ? (
          <div className="flex items-center gap-1.5 text-sm font-bold text-white/60 sm:text-base" aria-label={`Target ${target}`}>
            <ArrowRightCircle size={15} aria-hidden />
            <span className="text-xs uppercase tracking-widest opacity-80 mt-0.5">Goal</span>
            {target}
          </div>
        ) : null}
      </div>

      <div className="mt-4">
        <ProgressBar value={progress} color={color} variant={variant} blocks={blocks} label={`${label} progress`} />
      </div>
    </motion.button>
  )
}
