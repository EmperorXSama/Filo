import { useEffect, type ReactNode } from 'react'
import { useAuthStore } from '@/store/authStore'
import { checkSession, getCurrentUser } from '@/services/auth'

export function SessionProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, setUser, setLoading, clearUser } = useAuthStore()

  useEffect(() => {
    async function init() {
      try {
        const claims = await checkSession()
        const user = await getCurrentUser().catch(() => null)
        if (user) {
          setUser({
            ...user,
            avatar: claims['picture']?.[0] ?? '',
          })
        } else {
          setUser({
            userId: claims['sub']?.[0] ?? '',
            identityId: claims['sub']?.[0] ?? '',
            email: claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']?.[0] ?? '',
            fullName: claims['name']?.[0] ?? '',
            roles: [],
            permissions: claims['permission'] ?? [],
            avatar: claims['picture']?.[0] ?? '',
          })
        }
      } catch {
        clearUser()
      }
    }
    if (!isAuthenticated) {
      init()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated, setUser, setLoading, clearUser])

  return children
}
