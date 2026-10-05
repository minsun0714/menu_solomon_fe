import { Outlet } from 'react-router-dom'

export function AppLayout() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <Outlet />
    </main>
  )
}
