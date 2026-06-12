import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { login } from '@/services/auth'

export function Login() {
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const returnUrl = searchParams.get('returnUrl') ?? undefined
    login(returnUrl)
  }, [searchParams])

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-gray-500">Redirecting to login...</p>
    </div>
  )
}
