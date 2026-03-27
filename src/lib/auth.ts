"use client";

import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

import { AUTH_COOKIE_KEY } from "@/lib/constants";
import type { DecodedToken } from "@/lib/types";

export function getAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return Cookies.get(AUTH_COOKIE_KEY) ?? null;
}

export function setAuthToken(token: string) {
  if (typeof window === "undefined") {
    return;
  }

  Cookies.set(AUTH_COOKIE_KEY, token, {
    expires: 7,
    sameSite: "lax",
  });
}

export function clearAuthToken() {
  if (typeof window === "undefined") {
    return;
  }

  Cookies.remove(AUTH_COOKIE_KEY);
}

export function decodeAuthToken(token: string) {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch {
    return null;
  }
}
