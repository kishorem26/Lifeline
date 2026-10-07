import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { MoreHorizontal, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { NAV } from './nav'
import { cn } from '@/lib/cn'

export function BottomNav() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const primary = NAV.filter((n) => n.primary)
  const secondary = NAV.filter((n) => !n.primary)
  const secondaryActive = secondary.some((n) => location.pathname === n.to || location.pathname.startsWith(n.to + '/'))

  return (
    <>
      {/* More drawer — bottom sheet */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            {/* Sheet */}
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 lg:hidden"
              style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 80px)' }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            >
              <div className="mx-3 rounded-[28px] border border-line bg-surface p-4"
                style={{ background: 'linear-gradient(180deg, #181b20 0%, #0f1114 100%)' }}
              >
                {/* Sheet handle + close */}
                <div className="mb-4 flex items-center justify-between px-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted">More pages</p>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="grid h-8 w-8 place-items-center rounded-full bg-white/[0.07] text-muted"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {secondary.map(({ to, label, icon: Icon }) => {
                    const isActive = location.pathname === to || location.pathname.startsWith(to + '/')
                    return (
                      <NavLink
                        key={to}
                        to={to}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'flex flex-col items-center gap-2 rounded-2xl px-3 py-4 text-xs font-bold transition-colors',
                          isActive ? 'bg-lime/15 text-lime' : 'bg-white/[0.04] text-muted active:bg-white/10',
                        )}
                      >
                        <Icon size={22} aria-hidden />
                        {label}
                      </NavLink>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom bar */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/95 backdrop-blur-xl lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        aria-label="Main navigation"
      >
        <ul className="mx-auto flex max-w-lg items-center justify-around px-1 py-1">
          {primary.map(({ to, label, icon: Icon }) => (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  cn(
                    'relative flex min-h-[56px] w-full flex-col items-center justify-center gap-1 rounded-2xl transition-colors',
                    isActive ? 'text-lime' : 'text-muted active:bg-white/[0.06]',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-x-1 inset-y-1 rounded-xl bg-lime/[0.12]"
                        transition={{ type: 'spring', damping: 26, stiffness: 400 }}
                      />
                    )}
                    <Icon size={22} strokeWidth={isActive ? 2.4 : 1.9} aria-hidden className="relative z-10" />
                    <span className={cn('relative z-10 text-[10px] font-extrabold tracking-wide transition-opacity', isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden')}>
                      {label}
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          ))}

          {/* More button */}
          <li className="flex-1">
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label="More pages"
              className={cn(
                'relative flex min-h-[56px] w-full flex-col items-center justify-center gap-1 rounded-2xl transition-colors',
                (open || secondaryActive) ? 'text-lime' : 'text-muted active:bg-white/[0.06]',
              )}
            >
              {(open || secondaryActive) && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-x-1 inset-y-1 rounded-xl bg-lime/[0.12]"
                  transition={{ type: 'spring', damping: 26, stiffness: 400 }}
                />
              )}
              <MoreHorizontal size={22} strokeWidth={open ? 2.4 : 1.9} aria-hidden className="relative z-10" />
              <span className={cn('relative z-10 text-[10px] font-extrabold tracking-wide transition-opacity', (open || secondaryActive) ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden')}>
                More
              </span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  )
}
