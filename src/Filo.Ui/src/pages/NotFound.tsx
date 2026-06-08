import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center p-4">
      <h1 className="mb-2 text-6xl font-bold text-brand-500">404</h1>
      <p className="mb-8 text-lg text-gray-600">
        The page you are looking for does not exist.
      </p>
      <Link to="/">
        <Button>Go Home</Button>
      </Link>
    </div>
  )
}
