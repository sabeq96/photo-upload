import { create } from "zustand"
import type { UsersResponse } from "../types/pb"

interface AuthStore {
    user: UsersResponse | null,
    isLoading: boolean,
    setUser: (user: UsersResponse | null) => void,
    setIsLoading: (isLoading: boolean) => void,
}

export const authStore = create<AuthStore>((set) => ({
    user: null,
    isLoading: false,
    setUser: (user: UsersResponse | null) => set({ user }),
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
  }))