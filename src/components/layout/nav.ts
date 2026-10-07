import { Home, CalendarCheck, HeartPulse, Activity, ListChecks, TrendingUp, Target, BookOpen, User, type LucideIcon } from 'lucide-react'

export interface NavItem { to: string; label: string; icon: LucideIcon; primary?: boolean }

export const NAV: NavItem[] = [
  { to: '/', label: 'Home', icon: Home, primary: true },
  { to: '/today', label: 'Today', icon: CalendarCheck, primary: true },
  { to: '/habits', label: 'Habits', icon: ListChecks, primary: true },
  { to: '/progress', label: 'Progress', icon: TrendingUp, primary: true },
  { to: '/health', label: 'Health', icon: HeartPulse },
  { to: '/activity', label: 'Activity', icon: Activity },
  { to: '/goals', label: 'Goals', icon: Target },
  { to: '/journal', label: 'Journal', icon: BookOpen },
  { to: '/profile', label: 'Profile', icon: User },
]
