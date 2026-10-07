import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { NAV } from './nav'
import { cn } from '@/lib/cn'

export function BottomNav() {
  const [open, setOpen] = useState(false)
  const primary = NAV.filter((n) => n.primary)
  const secondary = NAV.filter((n) => !n.primary)

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-black/60 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.div
              className="card fixed inset-x-3 bottom-24 z-50 grid grid-cols-3 gap-2 p-3 lg:hidden"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
            >
              {secondary.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} onClick={() => setOpen(false)} className="flex flex-col items-center gap-1.5 rounded-xl p-3 text-xs font-medium text-muted hover:bg-white/5 hover:text-white">
                  <Icon size={20} aria-hidden />
                  {label}
                </NavLink>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/90 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden" aria-label="Main">
        <ul className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
          {primary.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink to={to} end={to === '/'} className={({ isActive }) => cn('flex min-h-12 min-w-14 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-bold', isActive ? 'text-lime' : 'text-muted')}>
                <Icon size={22} aria-hidden />
                {label}
              </NavLink>
            </li>
          ))}
          <li>
            <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex min-h-12 min-w-14 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-bold text-muted">
              <MoreHorizontal size={22} aria-hidden />
              More
            </button>
          </li>
        </ul>
      </nav>
    </>
  )
}
