"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/api/axios-instance";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { useAuthStore } from "@/store/use-auth-store";
import { Car } from "@/hooks/queries/cars";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  car_id: string;
  user_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  car: Car;
}

// Thêm các interface mới cho cấu trúc dữ liệu API
interface CartPivot {
  cart_id: string;
  car_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

interface CarWithPivot extends Car {
  pivot: CartPivot;
}

interface CartData {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  cars: CarWithPivot[];
}

interface CartResponse {
  status: string;
  message: string;
  data: {
    cart: CartData[];
  };
}

interface ApiError {
  response?: {
    status?: number;
    data?: Record<string, unknown>;
  };
  request?: unknown;
  message?: string;
}

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  error: Error | null;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  isLoading: false,
  error: null,
  totalItems: 0,
  totalPrice: 0,
});

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized);

  // Lấy giỏ hàng từ API
  const { data, isLoading, error } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get<CartResponse>(
          API_ENDPOINTS.CART.ME
        );

        if (!response.data || !response.data.data || !response.data.data.cart) {
          return [];
        }

        // Xử lý dữ liệu theo cấu trúc mới
        const cartItems = response.data.data.cart.flatMap((cart: CartData) => {
          return cart.cars.map((car: CarWithPivot) => ({
            id: car.pivot.cart_id + car.id,
            car_id: car.id,
            user_id: cart.user_id,
            quantity: car.pivot.quantity,
            created_at: car.pivot.created_at,
            updated_at: car.pivot.updated_at,
            car: car,
          }));
        });

        return cartItems;
      } catch (error: unknown) {
        console.error("Lỗi khi lấy giỏ hàng:", error);

        // Ghi nhật ký chi tiết về lỗi để dễ dàng gỡ lỗi
        const err = error as ApiError;
        if (err.response) {
          console.error(
            "Server response:",
            err.response.status,
            err.response.data
          );
        } else if (err.request) {
          console.error("No response from server:", err.request);
        } else if (err.message) {
          console.error("Error message:", err.message);
        }

        // Hiển thị thông báo lỗi nếu không phải lỗi xác thực
        if (err.response && err.response.status !== 401) {
          toast.error("Không thể tải giỏ hàng", {
            description:
              "Đã xảy ra lỗi khi tải giỏ hàng. Vui lòng làm mới trang.",
          });
        }

        return [];
      }
    },
    enabled: isAuthenticated && isAuthInitialized,
    staleTime: 0, // Luôn xem dữ liệu là cũ -> luôn fetch lại
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: true, // Fetch lại khi focus vào cửa sổ
    refetchOnMount: true, // Fetch lại khi component mount
  });

  // Cập nhật giỏ hàng khi xác thực thay đổi
  useEffect(() => {
    if (isAuthenticated && isAuthInitialized) {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    }
  }, [isAuthenticated, isAuthInitialized, queryClient]);

  // Tính toán tổng số lượng mặt hàng
  const totalItems = (data || []).length; // Đếm số lượng xe độc nhất (mỗi model xe tính là 1)

  // Tính tổng giá trị giỏ hàng
  const totalPrice = (data || []).reduce(
    (sum: number, item: CartItem) =>
      sum + parseFloat(item.car.price) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items: data || [],
        isLoading,
        error: error as Error | null,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
