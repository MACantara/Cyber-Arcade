import { Outlet } from 'react-router-dom'
import { HudBar } from './HudBar'
import { Nav } from './Nav'

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <HudBar />
      <Nav />
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  )
}
