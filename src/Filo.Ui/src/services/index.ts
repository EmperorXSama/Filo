import { apiClient } from '@/lib/axios'
import type { DummyItem, SystemInfo } from '@/types'

export async function getSystemInfo(): Promise<SystemInfo> {
  const { data } = await apiClient.get<SystemInfo>('system-info')
  return data
}

export async function createDummyItem(): Promise<DummyItem> {
  const { data } = await apiClient.post<DummyItem>('dummies', {
    name: `Test-${Date.now()}`,
    description: 'Connection test from UI',
    isActive: true,
  })
  return data
}

export async function getDummyItems(): Promise<DummyItem[]> {
  const { data } = await apiClient.get<DummyItem[]>('dummies')
  return data
}
