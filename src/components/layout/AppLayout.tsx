import { Outlet } from 'react-router-dom'

export function AppLayout() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8">
      <Outlet />
    </main>
  )
}
