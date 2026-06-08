import { apiClient } from '@/lib/axios'
import type { SystemInfo } from '@/types'

export async function getSystemInfo(): Promise<SystemInfo> {
  const { data } = await apiClient.get<SystemInfo>('/api/system-info')
  return data
}
