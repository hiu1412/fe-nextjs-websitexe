export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    ME: "/auth/user",
    GOOGLE_LOGIN: "/auth/google",
    GOOGLE_CALLBACK: "/auth/google/callback",
    REDIRECT_URI: typeof window !== 'undefined' ? `${window.location.origin}/auth/google/callback` : '',
    VERIFY_EMAIL: (token: string) => `/auth/verify-email/${token}`,
    RESEND_VERIFICATION: "/auth/resend-verification-email",
    SEND_RESET_PASSWORD: "/auth/send-reset-password-email",
    RESET_PASSWORD: (token: string) => `/auth/reset-password/${token}`,
  },

  // User endpoints
  USERS: {
    BASE: "/users",
    DETAIL: (id: number) => `/users/${id}`,
    UPDATE: (id: number) => `/users/${id}`,
    DELETE: (id: number) => `/users/${id}`,
  },

  // Product endpoints
  PRODUCTS: {
    BASE: "/products",
    DETAIL: (id: number) => `/products/${id}`,
    CREATE: "/products",
    UPDATE: (id: number) => `/products/${id}`,
    DELETE: (id: number) => `/products/${id}`,
    BY_CATEGORY: (categoryId: number) => `/categories/${categoryId}/products`,
  },

  // Category endpoints
  CATEGORIES: {
    BASE: "/categories",
    DETAIL: (id: string) => `/categories/${id}`,
    CREATE: "/categories",
    UPDATE: (id: string) => `/categories/${id}`,
    DELETE: (id: string) => `/categories/${id}`,
  },

  // Order endpoints
  ORDER: {
    ME: "/order/me",
    DETAIL: (id: string) => `/order/${id}`,
    CREATE: "/order/create",
    CANCEL: (id: string) => `/order/cancel/${id}`,
    ALL: "/order",
  },

  // Car endpoints
  CARS: {
    BASE: '/cars',
    DETAIL: (id: string) => `/cars/${id}`,
    CREATE: '/cars',
    UPDATE: (id: string) => `/cars/${id}`,
    DELETE: (id: string) => `/cars/${id}`,
    NEWEST: '/cars/newest',
  },

  // Brand endpoints
  BRANDS: {
    BASE: "/brands",
    DETAIL: (id: string) => `/brands/${id}`,
    CREATE: "/brands",
    UPDATE: (id: string) => `/brands/${id}`,
    DELETE: (id: string) => `/brands/${id}`,
  },

  // Cart endpoints
  CART: {
    ME: "/cart/me",
    ADD: "/cart/add",
    REMOVE: "/cart/remove",
    CLEAR: "/cart/clear",
    UPDATE: "/cart/update",
  },

  // Upload endpoints
  UPLOAD: {
    FILE: "/upload/file",
  },

  // Payment endpoints
  PAYMENT: {
    CREATE_URL: (orderId: string) => `/payment/${orderId}/create-url`,
  },
} as const;