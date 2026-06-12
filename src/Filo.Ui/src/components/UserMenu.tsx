import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { login, logout } from '@/services/auth'

export function UserMenu() {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return (
      <button
        onClick={() => login()}
        className="rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
      >
        Sign In
      </button>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        to="/dashboard"
        className="text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        Dashboard
      </Link>
      <span className="text-sm text-gray-500">{user?.fullName}</span>
      <button
        onClick={logout}
        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Sign Out
      </button>
    </div>
  )
}
