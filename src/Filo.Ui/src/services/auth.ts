import { apiClient } from '@/lib/axios'
import type { CurrentUser } from '@/types'

export function login(returnUrl?: string) {
  const url = returnUrl ? `/api/auth/login?returnUrl=${encodeURIComponent(returnUrl)}` : '/api/auth/login'
  window.location.href = url
}

export function logout() {
  window.location.href = '/api/auth/logout'
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const { data } = await apiClient.get<CurrentUser>('auth/me')
  return data
}

export interface RegisterUserData {
  firstName: string
  lastName: string
  email: string
  password: string
}

export async function registerUser(data: RegisterUserData): Promise<void> {
  await apiClient.post('users/register', data)
}

export async function checkSession(): Promise<Record<string, string[]>> {
  const { data } = await apiClient.get<Record<string, string[]>>('auth/check_session')
  return data
}
