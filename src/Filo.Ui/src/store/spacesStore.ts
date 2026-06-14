import { create } from 'zustand'

export interface Space {
  id: string
  name: string
}

interface SpacesState {
  spaces: Space[]
  addSpace: (name: string) => void
  removeSpace: (id: string) => void
}

export const useSpacesStore = create<SpacesState>((set) => ({
  spaces: [],
  addSpace: (name) =>
    set((state) => ({
      spaces: [...state.spaces, { id: crypto.randomUUID(), name }],
    })),
  removeSpace: (id) =>
    set((state) => ({
      spaces: state.spaces.filter((s) => s.id !== id),
    })),
}))
