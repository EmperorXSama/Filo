import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { getSystemInfo } from '@/services'
import { cn } from '@/utils/cn'
import type { SystemInfo } from '@/types'

const FIELDS: { key: keyof SystemInfo; label: string }[] = [
  { key: 'machineName', label: 'Machine Name' },
  { key: 'osVersion', label: 'OS Version' },
  { key: 'osArchitecture', label: 'OS Architecture' },
  { key: 'processArchitecture', label: 'Process Architecture' },
  { key: 'runtimeVersion', label: 'Runtime Version' },
  { key: 'clrVersion', label: 'CLR Version' },
  { key: 'runtimeIdentifier', label: 'Runtime Identifier' },
  { key: 'environment', label: 'Environment' },
  { key: 'workingDirectory', label: 'Working Directory' },
  { key: 'userName', label: 'User Name' },
  { key: 'userDomainName', label: 'User Domain Name' },
  { key: 'is64BitProcess', label: '64-bit Process' },
  { key: 'processorCount', label: 'Processor Count' },
  { key: 'processUptime', label: 'Process Uptime' },
  { key: 'applicationVersion', label: 'Application Version' },
  { key: 'userInteractive', label: 'User Interactive' },
  { key: 'applicationName', label: 'Application Name' },
]

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-x-4 py-1.5">
      <span className="font-body text-body text-muted shrink-0">{label}</span>
      <span className="font-body text-body text-ink text-right break-all">{value}</span>
    </div>
  )
}

export function SystemInfo() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['system-info'],
    queryFn: getSystemInfo,
  })

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <Card className="w-full max-w-lg border-card-border bg-canvas shadow-none">
          <CardHeader>
            <CardTitle className="font-body text-feature-heading text-coral">
              Failed to load system info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-body text-body text-muted">
              {(error as { message?: string })?.message ?? 'An unexpected error occurred.'}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-xl">
      <Card
        className={cn(
          'w-full max-w-xl border-card-border bg-canvas shadow-none',
          'rounded-sm',
        )}
      >
        <CardHeader>
          <CardTitle className="font-body text-section-heading text-ink">
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-hairline">
            {FIELDS.map(({ key, label }) => (
              <InfoRow
                key={key}
                label={label}
                value={String(data[key])}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
