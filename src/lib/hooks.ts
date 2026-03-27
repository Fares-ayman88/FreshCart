"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuthStore } from "@/store/auth-store";

export function useProtectedRoute(message = "Please sign in to continue.") {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const hydrated = useAuthStore((state) => state.hydrated);

  useEffect(() => {
    if (hydrated && !token) {
      toast.info(message);
      router.replace("/login");
    }
  }, [hydrated, message, router, token]);

  return {
    canRender: hydrated && Boolean(token),
    hydrated,
    isAuthenticated: Boolean(token),
  };
}

export function useGuestOnlyRoute() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const hydrated = useAuthStore((state) => state.hydrated);

  useEffect(() => {
    if (hydrated && token) {
      router.replace("/");
    }
  }, [hydrated, router, token]);

  return {
    hydrated,
    isAuthenticated: Boolean(token),
  };
}
