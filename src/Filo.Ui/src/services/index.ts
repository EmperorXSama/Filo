import type { SystemInfo } from '@/types'

export async function getSystemInfo(): Promise<SystemInfo> {
  const response = await fetch('/api/system-info')

  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: response.statusText }))
    throw { status: response.status, message: body.message ?? response.statusText }
  }

  return response.json()
}
