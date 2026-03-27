"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { clearAuthToken, setAuthToken } from "@/lib/auth";
import type { AuthUser } from "@/lib/types";

interface AuthState {
  hydrated: boolean;
  token: string | null;
  user: AuthUser | null;
  setSession: (payload: { token: string; user: AuthUser }) => void;
  setUser: (user: AuthUser | null) => void;
  clearSession: () => void;
  markHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      hydrated: false,
      token: null,
      user: null,
      setSession: ({ token, user }) => {
        setAuthToken(token);
        set({ token, user });
      },
      setUser: (user) => set({ user }),
      clearSession: () => {
        clearAuthToken();
        set({ token: null, user: null });
      },
      markHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "freshcart-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          setAuthToken(state.token);
        } else {
          clearAuthToken();
        }

        state?.markHydrated();
      },
    },
  ),
);
