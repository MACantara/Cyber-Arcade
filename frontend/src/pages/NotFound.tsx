import { useNavigate } from 'react-router-dom'

export function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-6 text-center">
      <h1 className="font-headline text-2xl text-danger mb-4">404 — Page Not Found</h1>
      <p className="text-gray-100 mb-6">That route does not exist in the arcade.</p>
      <button className="btn" onClick={() => navigate('/')}>
        Go Home
      </button>
    </div>
  )
}
