import { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import { routes } from '@/routes'
import { SessionProvider } from '@/components/SessionProvider'

export function App() {
  const element = useRoutes(routes)
  return (
    <SessionProvider>
      <Suspense fallback={null}>{element}</Suspense>
    </SessionProvider>
  )
}
