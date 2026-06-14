import { useAuthStore } from '@/store/authStore'
import { cn } from '@/utils/cn'

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-hairline py-3 last:border-0">
      <span className="text-caption text-muted">{label}</span>
      <span className="text-caption text-ink text-right">{value}</span>
    </div>
  )
}

function SectionHeading({ children }: { children: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <div className="h-px flex-1 bg-hairline" />
      <span className="text-micro font-medium tracking-wider text-muted">{children}</span>
      <div className="h-px flex-1 bg-hairline" />
    </div>
  )
}

export function Profile() {
  const { user } = useAuthStore()

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <p className="text-caption text-muted">Sign in to view your profile.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg p-6">
      <div className="rounded-sm border border-hairline bg-soft-stone p-6">
        <div className="flex flex-col items-center gap-4">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt=""
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-canvas">
              <span className="text-section-heading text-muted">
                {user.fullName?.charAt(0)?.toUpperCase() ?? 'U'}
              </span>
            </div>
          )}
          <div className="text-center">
            <h1 className="text-feature-heading text-ink">{user.fullName}</h1>
            <p className="text-caption text-muted">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-sm border border-hairline bg-canvas px-5 py-1">
        <DetailRow label="User ID" value={user.userId} />
      </div>

      <div className="mt-6">
        <SectionHeading>Permissions</SectionHeading>
        {user.permissions.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {user.permissions.map((permission) => (
              <span
                key={permission}
                className={cn(
                  'inline-flex items-center rounded-xs border border-hairline px-2.5 py-1',
                  'text-micro text-muted',
                )}
              >
                {permission}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-caption text-muted">No permissions assigned.</p>
        )}
      </div>

      {user.roles.length > 0 && (
        <div className="mt-6">
          <SectionHeading>Roles</SectionHeading>
          <div className="flex flex-wrap gap-2">
            {user.roles.map((role) => (
              <span
                key={role}
                className={cn(
                  'inline-flex items-center rounded-xs border border-hairline px-2.5 py-1',
                  'text-micro text-muted',
                )}
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
