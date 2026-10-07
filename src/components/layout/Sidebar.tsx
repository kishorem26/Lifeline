import { NavLink } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { NAV } from './nav'
import { cn } from '@/lib/cn'

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-line bg-bg p-5 lg:flex">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="grid h-[38px] w-[38px] place-items-center rounded-xl bg-lime text-black"><Zap size={20} strokeWidth={2.5} /></div>
        <span className="text-xl font-extrabold tracking-tight">Lifeline</span>
      </div>
      <nav className="flex flex-col gap-1" aria-label="Main">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex h-[46px] items-center gap-3 rounded-[14px] px-3.5 text-[15px] font-semibold transition-colors',
                isActive ? 'bg-white/[0.08] text-white' : 'text-[#9aa0ab] hover:bg-white/[0.04] hover:text-white',
              )
            }
          >
            <Icon size={20} aria-hidden />
            {label}
          </NavLink>
        ))}
      </nav>
      <div
        className="mt-auto rounded-[22px] border border-white/[0.07] p-[18px]"
        style={{ background: 'linear-gradient(180deg,#0d0e10 0%,color-mix(in srgb,#c6f432 16%,#0d0e10) 100%)' }}
      >
        <p className="label">Motto</p>
        <p className="mt-1.5 text-[17px] font-bold leading-snug">Be 1% better every day.</p>
      </div>
    </aside>
  )
}
