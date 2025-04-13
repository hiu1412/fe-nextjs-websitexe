// Common types
export interface ApiResponse<T = unknown, D = null> {
  status: 'success' | 'error';
  message: T;
  data: D;
}

// Payment types
export type PaymentStatus = 'PAID' | 'PENDING' | 'CANCELLED';

export interface PaymentStatusResponse {
  status: PaymentStatus;
  message: string;
}

export interface PaymentLinkResponse {
  checkoutUrl: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ApiErrorResponse {
  status: string;
  message: string;
  errors?: Record<string, string[]>;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  email_verified_at: string | null;
  role: "admin" | "customer";
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  status: "success" | "error";
  message: string;
  data: {
    user: User;
    access_token: string;
  };
}

// Product types
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category_id: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = 'pending' | 'completed' | 'cancelled';

export interface Car {
  id: string;
  model: string;
  year: string;
  brand_id: string;
  color: string;
  price: string;
  image_url: string;
  stock: number;
  fuel_type: 'electric' | 'gasoline' | 'hybrid' | 'diesel';
  availability: 'in_stock' | 'out_of_stock' | 'pre_order';
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  name: string;
  country: string;
  banner_url: string;
  created_at: string;
  updated_at: string;
}

export interface OrderDetail {
  id: string;
  order_id: string;
  car_id: string;
  quantity: number;
  price: string;
  subtotal_price: string;
  created_at: string;
  updated_at: string;
  car: Car;
}

export interface Payment {
  id: string;
  order_id: string;
  amount: string;
  status: 'pending' | 'completed' | 'failed';
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_price: string;
  status: OrderStatus;
  order_time: string;
  created_at: string;
  updated_at: string;
  order_details: OrderDetail[];
  payment: Payment;
}

export interface CreateOrderRequest {
  type: 'cart';
}

export interface CreateOrderResponse {
  status: 'success' | 'error';
  message: string;
  data: {
    order: Order;
  };
}

// Admin specific response types
export type AdminBrandsResponse = ApiResponse<{
  brands: Brand[];
  total: number;
}>;

export type AdminCarsResponse = ApiResponse<{
  cars: Car[];
  total: number;
}>;

export type AdminOrdersResponse = ApiResponse<{
  orders: Order[];
  total: number;
}>;

export type AdminSingleBrandResponse = ApiResponse<{
  brand: Brand;
}>;

export type AdminSingleCarResponse = ApiResponse<{
  car: Car;
}>;

export type AdminSingleOrderResponse = ApiResponse<{
  order: Order;
}>;