import axios from "axios";

import { getAuthToken } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/constants";
import type {
  AddToCartResponse,
  ApiCollectionResponse,
  ApiEntityResponse,
  ApiQueryParams,
  AuthResponse,
  Brand,
  CartResponse,
  CashOrderResponse,
  Category,
  CheckoutSessionResponse,
  ClearCartResponse,
  Order,
  Product,
  ShippingAddress,
  Subcategory,
  UserProfile,
  WishlistResponse,
} from "@/lib/types";

export const queryKeys = {
  categories: ["categories"] as const,
  brands: ["brands"] as const,
  cart: ["cart"] as const,
  wishlist: ["wishlist"] as const,
  me: ["me"] as const,
  products: (params?: ApiQueryParams) => ["products", params] as const,
  product: (productId: string) => ["product", productId] as const,
  subcategories: (categoryId: string) => ["subcategories", categoryId] as const,
  orders: (userId: string) => ["orders", userId] as const,
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20_000,
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.token = token;
  }

  return config;
});

export async function signUp(payload: {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}) {
  const { data } = await api.post<AuthResponse>("/v1/auth/signup", payload);
  return data;
}

export async function signIn(payload: {
  email: string;
  password: string;
}) {
  const { data } = await api.post<AuthResponse>("/v1/auth/signin", payload);
  return data;
}

export async function verifyToken() {
  const { data } = await api.get<{
    message: string;
    decoded: { id: string; name?: string; role?: string; iat: number; exp: number };
  }>("/v1/auth/verifyToken");
  return data;
}

export async function getProfile() {
  const { data } = await api.get<ApiEntityResponse<UserProfile>>("/v1/users/getMe");
  return data;
}

export async function updateProfile(payload: {
  name: string;
  phone: string;
}) {
  const { data } = await api.put<{
    message: string;
    user: { name: string; email: string; role: string };
  }>("/v1/users/updateMe", payload);
  return data;
}

export async function changePassword(payload: {
  currentPassword: string;
  password: string;
  rePassword: string;
}) {
  const { data } = await api.put<AuthResponse>(
    "/v1/users/changeMyPassword",
    payload,
  );
  return data;
}

export async function getCategories(params?: ApiQueryParams) {
  const { data } = await api.get<ApiCollectionResponse<Category>>("/v1/categories", {
    params,
  });
  return data;
}

export async function getCategory(categoryId: string) {
  const { data } = await api.get<ApiEntityResponse<Category>>(
    `/v1/categories/${categoryId}`,
  );
  return data;
}

export async function getCategorySubcategories(categoryId: string) {
  const { data } = await api.get<ApiCollectionResponse<Subcategory>>(
    `/v1/categories/${categoryId}/subcategories`,
  );
  return data;
}

export async function getBrands(params?: ApiQueryParams) {
  const { data } = await api.get<ApiCollectionResponse<Brand>>("/v1/brands", {
    params,
  });
  return data;
}

export async function getProducts(params?: ApiQueryParams) {
  const { data } = await api.get<ApiCollectionResponse<Product>>("/v1/products", {
    params,
  });
  return data;
}

export async function getProduct(productId: string) {
  const { data } = await api.get<ApiEntityResponse<Product>>(
    `/v1/products/${productId}`,
  );
  return data;
}

export async function getCart() {
  const { data } = await api.get<CartResponse>("/v2/cart");
  return data;
}

export async function addToCart(productId: string) {
  const { data } = await api.post<AddToCartResponse>("/v1/cart", { productId });
  return data;
}

export async function updateCartProductCount(productId: string, count: number) {
  const { data } = await api.put<CartResponse>(`/v1/cart/${productId}`, { count });
  return data;
}

export async function removeCartProduct(productId: string) {
  const { data } = await api.delete<CartResponse>(`/v1/cart/${productId}`);
  return data;
}

export async function clearCart() {
  const { data } = await api.delete<ClearCartResponse>("/v1/cart");
  return data;
}

export async function getWishlist() {
  const { data } = await api.get<WishlistResponse<Product[]>>("/v1/wishlist");
  return data;
}

export async function addToWishlist(productId: string) {
  const { data } = await api.post<WishlistResponse<string[]>>("/v1/wishlist", {
    productId,
  });
  return data;
}

export async function removeFromWishlist(productId: string) {
  const { data } = await api.delete<WishlistResponse<string[]>>(
    `/v1/wishlist/${productId}`,
  );
  return data;
}

export async function createCashOrder(
  cartId: string,
  shippingAddress: ShippingAddress,
) {
  const { data } = await api.post<CashOrderResponse>(`/v1/orders/${cartId}`, {
    shippingAddress,
  });
  return data;
}

export async function createCheckoutSession(
  cartId: string,
  shippingAddress: ShippingAddress,
  baseUrl: string,
) {
  const { data } = await api.post<CheckoutSessionResponse>(
    `/v1/orders/checkout-session/${cartId}`,
    { shippingAddress },
    {
      params: {
        url: baseUrl,
      },
    },
  );
  return data;
}

export async function getUserOrders(userId: string) {
  const { data } = await api.get<Order[]>(`/v1/orders/user/${userId}`);
  return data;
}
