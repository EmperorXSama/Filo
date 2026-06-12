import { useAuthStore } from '@/store/authStore'

export function Dashboard() {
  const { user } = useAuthStore()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Welcome, {user?.fullName ?? 'User'}!
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
          <dl className="mt-4 space-y-2">
            <div>
              <dt className="text-sm text-gray-500">Email</dt>
              <dd className="text-sm text-gray-900">{user?.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Roles</dt>
              <dd className="text-sm text-gray-900">
                {user?.roles?.join(', ') ?? 'None'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
