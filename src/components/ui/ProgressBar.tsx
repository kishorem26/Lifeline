import { motion } from 'framer-motion'

export type BarVariant = 'solid' | 'ticks' | 'blocks'

interface Props {
  value: number
  color?: string
  height?: number
  variant?: BarVariant
  blocks?: number
  label?: string
}

export function ProgressBar({ value, color = 'var(--color-lime)', height = 10, variant = 'solid', blocks = 8, label }: Props) {
  const pct = Math.min(Math.max(value, 0), 100)
  const aria = { role: 'progressbar', 'aria-valuenow': Math.round(pct), 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-label': label } as const

  if (variant === 'blocks') {
    const filled = Math.round((pct / 100) * blocks)
    return (
      <div className="flex gap-[5px]" {...aria}>
        {Array.from({ length: blocks }).map((_, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-[4px]"
            style={{ height: height + 2 }}
            initial={{ background: 'rgb(255 255 255 / 0.12)' }}
            animate={{ background: i < filled ? color : 'rgb(255 255 255 / 0.12)' }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
          />
        ))}
      </div>
    )
  }

  const track =
    variant === 'ticks'
      ? 'repeating-linear-gradient(90deg, rgb(255 255 255 / 0.28) 0 2px, transparent 2px 7px)'
      : 'rgb(255 255 255 / 0.09)'

  return (
    <div className="w-full overflow-hidden rounded-full" style={{ height, background: track }} {...aria}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  )
}
