import { type ClassValue, clsx } from "clsx";
import { AxiosError } from "axios";
import { twMerge } from "tailwind-merge";

import type { Product } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function formatSoldCount(value: number) {
  if (!Number.isFinite(value) || value > 999_999) {
    return "Hot seller";
  }

  return `${new Intl.NumberFormat("en-US").format(value)} sold`;
}

export function extractErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const message =
      (error.response?.data as { message?: string; errors?: { msg?: string }[] })
        ?.message ??
      (error.response?.data as { errors?: { msg?: string }[] })?.errors?.[0]?.msg;

    if (message) {
      return message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export function isProductEntity(product: Product | string): product is Product {
  return typeof product !== "string";
}

export function getInitials(value?: string | null) {
  if (!value) {
    return "FC";
  }

  return value
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function buildQueryString(
  query: Record<string, string | number | null | undefined>,
) {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && `${value}`.trim() !== "") {
      params.set(key, `${value}`);
    }
  });

  return params.toString();
}
