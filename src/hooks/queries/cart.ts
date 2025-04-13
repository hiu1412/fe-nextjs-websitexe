import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/api/axios-instance";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { Car } from "./cars";
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

// Interface mới cho cấu trúc dữ liệu API
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

interface CartActionResponse {
  status: string;
  message: string;
  data: {
    cart_item: CartItem;
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

// Hook để lấy giỏ hàng hiện tại
export const useGetCart = () => {
  return useQuery({
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
            id: car.pivot.cart_id + car.id, // Tạo id duy nhất cho cart item
            car_id: car.id,
            user_id: cart.user_id,
            quantity: car.pivot.quantity,
            created_at: car.pivot.created_at,
            updated_at: car.pivot.updated_at,
            car: car
          }));
        });
        
        return cartItems;
      } catch (error: unknown) {
        // Ghi nhật ký chi tiết về lỗi để dễ dàng gỡ lỗi
        const err = error as ApiError;
        if (err.response && err.response.status !== 401) {
          toast.error("Không thể tải giỏ hàng", {
            description: "Đã xảy ra lỗi khi tải giỏ hàng. Vui lòng làm mới trang.",
          });
        }
        
        return [];
      }
    },
    retry: 1,
    retryDelay: 1000,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

// Hook tổng hợp cho các thao tác giỏ hàng
export const useCart = () => {
  const queryClient = useQueryClient();
  
  // Mutation để thêm sản phẩm vào giỏ hàng
  const addToCartMutation = useMutation({
    mutationFn: async (data: { car_id: string; quantity: number }) => {
      const response = await axiosInstance.post<CartActionResponse>(
        API_ENDPOINTS.CART.ADD,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      toast.error("Không thể thêm vào giỏ hàng. Vui lòng đăng nhập và thử lại.");
    },
  });

  // Mutation để xóa sản phẩm khỏi giỏ hàng
  const removeFromCartMutation = useMutation({
    mutationFn: async (data: { car_id: string }) => {
      const response = await axiosInstance.delete(API_ENDPOINTS.CART.REMOVE, {
        data,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      toast.error("Không thể xóa khỏi giỏ hàng. Vui lòng thử lại.");
    },
  });

  // Mutation để xóa toàn bộ giỏ hàng
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.delete(API_ENDPOINTS.CART.CLEAR);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      toast.error("Không thể xóa giỏ hàng. Vui lòng thử lại.");
    },
  });

  // Sử dụng useQuery để lấy giỏ hàng
  const { data: cartItems, isLoading, error } = useGetCart();

  // Tính tổng tiền giỏ hàng
  const cartTotal = (cartItems || []).reduce((total: number, item: CartItem) => {
    return total + parseFloat(item.car.price) * item.quantity;
  }, 0);

  return {
    cartItems,
    isLoading,
    error,
    cartTotal,
    addToCart: addToCartMutation.mutateAsync,
    removeFromCart: removeFromCartMutation.mutateAsync,
    clearCart: clearCartMutation.mutateAsync,
    isPending: 
      addToCartMutation.isPending || 
      removeFromCartMutation.isPending || 
      clearCartMutation.isPending,
  };
}; 