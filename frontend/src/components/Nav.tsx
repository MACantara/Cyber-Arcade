import { Link } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/learn', label: 'Learn' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/profile', label: 'Profile' },
  { to: '/settings', label: 'Settings' },
]

export function Nav() {
  return (
    <nav className="bg-surface border-b-2 border-gray-300 p-4">
      <div className="max-w-7xl mx-auto flex flex-wrap gap-4">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="font-headline text-xs uppercase text-gray-100 hover:text-primary transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
