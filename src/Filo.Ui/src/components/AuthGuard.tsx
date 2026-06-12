import { useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { checkSession, getCurrentUser } from '@/services/auth'
import { LoadingSpinner } from '@/components/LoadingSpinner'

export function AuthGuard() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, isLoading, setUser, setLoading, clearUser } = useAuthStore()

  useEffect(() => {
    async function verifySession() {
      try {
        const claims = await checkSession()
        const user = await getCurrentUser().catch(() => null)
        if (user) {
          setUser({
            ...user,
            avatar: claims['picture']?.[0] ?? '',
          })
        } else {
          const sub = claims['sub']?.[0] ?? ''
          setUser({
            userId: sub,
            identityId: sub,
            email: claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']?.[0] ?? '',
            fullName: claims['name']?.[0] ?? '',
            roles: [],
            permissions: claims['permission'] ?? [],
            avatar: claims['picture']?.[0] ?? '',
          })
        }
      } catch {
        clearUser()
        const returnUrl = location.pathname + location.search
        navigate(`/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`, { replace: true })
      }
    }

    if (!isAuthenticated) {
      verifySession()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated, navigate, location, setUser, setLoading, clearUser])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return isAuthenticated ? <Outlet /> : null
}
