import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LogOut, User } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { logout } from '@/services/auth'

export function DashboardTopbar() {
  const { user, isAuthenticated } = useAuthStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onMouseDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', onMouseDown)
    }
  }, [])

  return (
    <header className="flex h-16 items-center justify-between border-b border-hairline bg-canvas px-6">
      <div className="flex items-center gap-2">
        <div className="h-4 w-24 rounded-[3px] bg-soft-stone" />
      </div>

      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <div ref={ref} className="relative">
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="flex items-center gap-2.5 rounded-xs px-2 py-1.5 transition-colors hover:bg-soft-stone"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-soft-stone">
                  <span className="text-button text-muted">
                    {user?.fullName?.charAt(0)?.toUpperCase() ?? 'U'}
                  </span>
                </div>
              )}
              <span className="text-caption text-ink">{user?.fullName ?? 'User'}</span>
            </button>

            {open && (
              <div className="absolute right-0 top-full mt-1.5 w-56 animate-fade-up rounded-sm border border-hairline bg-canvas">
                <div className="border-b border-hairline px-4 py-3">
                  <p className="text-button text-ink">{user?.fullName}</p>
                  <p className="text-micro text-muted">{user?.email}</p>
                </div>

                <div className="py-1">
                  <Link
                    to="/dashboard/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-caption text-ink transition-colors hover:bg-soft-stone"
                  >
                    <User className="h-4 w-4 text-muted" />
                    Profile
                  </Link>
                </div>

                <div className="border-t border-hairline py-1">
                  <button
                    onClick={logout}
                    className="flex w-full items-center gap-2.5 px-4 py-2 text-caption text-ink transition-colors hover:bg-soft-stone"
                  >
                    <LogOut className="h-4 w-4 text-muted" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-soft-stone">
            <div className="h-3.5 w-3.5 rounded-[3px] bg-muted/30" />
          </div>
        )}
      </div>
    </header>
  )
}
