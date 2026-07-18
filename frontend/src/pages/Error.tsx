import { useNavigate } from 'react-router-dom'

export function ErrorPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-6 text-center">
      <h1 className="font-headline text-2xl text-danger mb-4">System Error</h1>
      <p className="text-gray-100 mb-6">Something went wrong while loading the game.</p>
      <div className="flex flex-col sm:flex-row gap-2">
        <button className="btn" onClick={() => window.location.reload()}>
          Reload
        </button>
        <button className="btn btn-ghost" onClick={() => navigate('/')}>
          Go Home
        </button>
      </div>
    </div>
  )
}
