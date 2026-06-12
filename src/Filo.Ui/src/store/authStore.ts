import { create } from 'zustand'
import type { CurrentUser } from '@/types'

interface AuthState {
  user: CurrentUser | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: CurrentUser | null) => void
  setLoading: (isLoading: boolean) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: user !== null, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  clearUser: () => set({ user: null, isAuthenticated: false, isLoading: false }),
}))
