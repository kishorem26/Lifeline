import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'

export function AppShell() {
  return (
    <div className="min-h-full">
      <Sidebar />
      <main className="mx-auto max-w-6xl px-4 pb-32 pt-4 sm:px-6 sm:pt-6 lg:ml-64 lg:max-w-none lg:px-10 lg:pb-12">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
