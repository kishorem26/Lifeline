import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppShell } from '@/components/layout/AppShell'
import { Placeholder } from '@/components/ui/Placeholder'
import Home from '@/pages/Home'

// Habits pulls in Recharts, so load it only when the page is opened
const Habits = lazy(() => import('@/pages/Habits'))
const Profile = lazy(() => import('@/pages/Profile'))

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, retry: 1 } } })

const Loading = () => <div className="card grid min-h-[40vh] place-items-center p-10 text-muted">Loading…</div>

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Home />} />
            <Route path="today" element={<Placeholder title="Today" phase="Step 3" />} />
            <Route path="health" element={<Placeholder title="Health" phase="Step 3" />} />
            <Route path="activity" element={<Placeholder title="Activity" phase="Step 3" />} />
            <Route
              path="habits"
              element={
                <Suspense fallback={<Loading />}>
                  <Habits />
                </Suspense>
              }
            />
            <Route path="progress" element={<Placeholder title="Progress" phase="Step 5" />} />
            <Route path="goals" element={<Placeholder title="Goals" phase="Step 4" />} />
            <Route path="journal" element={<Placeholder title="Journal" phase="Step 5" />} />
            <Route
              path="profile"
              element={
                <Suspense fallback={<Loading />}>
                  <Profile />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
