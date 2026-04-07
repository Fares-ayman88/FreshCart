export type ApiQueryValue = string | number | boolean | null | undefined;
export type ApiQueryParams = Record<string, ApiQueryValue>;

export interface PaginationMeta {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage?: number;
  prevPage?: number;
}

export interface ApiCollectionResponse<T> {
  results?: number;
  metadata?: PaginationMeta;
  data: T[];
}

export interface ApiEntityResponse<T> {
  data: T;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  _id: string;
  review?: string;
  rating: number;
  product: string;
  user: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  id: string;
  sold: number;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  price: number;
  priceAfterDiscount?: number;
  ratingsAverage: number;
  ratingsQuantity: number;
  imageCover: string;
  images: string[];
  availableColors?: string[];
  category: Category;
  brand: Brand;
  subcategory: Subcategory[];
  reviews?: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  _id?: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

export interface AuthResponse {
  message: string;
  user: AuthUser;
  token: string;
}

export interface ShippingAddress {
  _id?: string;
  details: string;
  phone: string;
  city: string;
}

export interface UserProfile extends AuthUser {
  _id: string;
  active: boolean;
  wishlist: string[];
  phone: string;
  addresses: ShippingAddress[];
  createdAt: string;
  updatedAt: string;
  passwordChangedAt?: string;
}

export interface CartLineItem {
  _id: string;
  count: number;
  product: Product | string;
  price: number;
}

export interface CartPayload {
  _id?: string;
  cartOwner?: string;
  products: CartLineItem[];
  totalCartPrice: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartResponse {
  status: string;
  message?: string;
  numOfCartItems: number;
  cartId?: string | null;
  data: CartPayload;
}

export interface AddToCartResponse {
  status: string;
  message: string;
  numOfCartItems: number;
  cartId: string;
  data: CartPayload;
}

export interface ClearCartResponse {
  message: string;
}

export interface WishlistResponse<T = Product[] | string[]> {
  status: string;
  message?: string;
  count?: number;
  data: T;
}

export interface OrderLineItem {
  _id: string;
  count: number;
  product: Product | string;
  price: number;
}

export interface Order {
  _id: string;
  id: number;
  taxPrice: number;
  shippingPrice: number;
  totalOrderPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  isDelivered: boolean;
  shippingAddress: ShippingAddress;
  user:
    | string
    | {
        _id: string;
        name: string;
        email: string;
        phone: string;
      };
  cartItems: OrderLineItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CashOrderResponse {
  status: string;
  data: Order;
}

export interface CheckoutSessionResponse {
  status: string;
  session: {
    url: string;
    success_url: string;
    cancel_url: string;
  };
}

export interface DecodedToken {
  id: string;
  name?: string;
  role?: string;
  iat: number;
  exp: number;
}
