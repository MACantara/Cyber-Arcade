import { Routes, Route } from 'react-router-dom'
import { useInitState } from './hooks/useInitState'
import { useChallenges } from './hooks/useChallenges'
import { Loading } from './components/Loading'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Learn } from './pages/Learn'
import { Challenge } from './pages/Challenge'
import { Profile } from './pages/Profile'
import { Leaderboard } from './pages/Leaderboard'
import { NotFound } from './pages/NotFound'
import { SettingsPage } from './pages/Settings'

export default function App() {
  const init = useInitState()
  const { isLoading } = useChallenges()

  if (!init || isLoading) {
    return <Loading />
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="learn" element={<Learn />} />
        <Route path="challenge/:id" element={<Challenge />} />
        <Route path="profile" element={<Profile />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
