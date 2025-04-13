import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/api/axios-instance";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { toast } from "sonner";
import { useMemo } from "react";
import debounce from "lodash/debounce";
import { useRouter } from "next/navigation";
import { useCheckoutStore } from "@/store/checkout-store";

interface ApiError {
  response?: {
    data?: {
      message?: string;
      data?: {
        available_stock?: number;
        current_quantity?: number;
        requested_quantity?: number;
      };
    };
  };
}

// Hook để thêm xe vào giỏ hàng
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ car_id, quantity }: { car_id: string; quantity: number }) => {
      const response = await axiosInstance.post(API_ENDPOINTS.CART.ADD, {
        car_id,
        quantity
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: unknown) => {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      
      const apiError = error as ApiError;
      if (apiError.response?.data?.message?.includes("Not enough stock")) {
        const stock = apiError.response.data.data?.available_stock || 0;
        const current = apiError.response.data.data?.current_quantity || 0;
        const requested = apiError.response.data.data?.requested_quantity || 0;
        
        toast.error("Số lượng vượt quá tồn kho", {
          description: `Chỉ còn ${stock} sản phẩm trong kho. Bạn đã có ${current} sản phẩm trong giỏ hàng và yêu cầu thêm ${requested} sản phẩm.`
        });
      } else {
        toast.error("Không thể thêm vào giỏ hàng", {
          description: "Vui lòng đăng nhập và thử lại sau."
        });
      }
    }
  });
};

// Hook để xóa xe khỏi giỏ hàng
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ car_id, quantity }: { car_id: string; quantity: number }) => {
      const response = await axiosInstance.delete(API_ENDPOINTS.CART.REMOVE, {
        data: { car_id, quantity }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    },
    onError: (error: unknown) => {
      console.error("Lỗi khi xóa khỏi giỏ hàng:", error);
      const apiError = error as ApiError;
      if (apiError.response?.data?.message?.includes("Car not found in cart")) {
        toast.error("Sản phẩm không còn trong giỏ hàng", {
          description: "Vui lòng làm mới trang."
        });
      } else {
        toast.error("Không thể xóa sản phẩm khỏi giỏ hàng", {
          description: "Vui lòng thử lại sau."
        });
      }
    }
  });
};

// Hook để cập nhật số lượng xe trong giỏ hàng
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  
  const debouncedMutation = useMemo(
    () =>
      debounce(
        async ({ car_id, targetQuantity, initialQuantity }: { car_id: string; targetQuantity: number; initialQuantity: number }) => {
          try {
            // Tính toán chênh lệch giữa số lượng cuối cùng và số lượng ban đầu
            const diff = Math.abs(targetQuantity - initialQuantity);
            
            if (diff === 0) return;

            if (targetQuantity > initialQuantity) {
              // Tăng số lượng
              await axiosInstance.post(API_ENDPOINTS.CART.ADD, {
                car_id,
                quantity: diff // Thêm chính xác số lượng chênh lệch
              });
            } else {
              // Giảm số lượng
              await axiosInstance.delete(API_ENDPOINTS.CART.REMOVE, {
                data: {
                  car_id,
                  quantity: diff // Xóa chính xác số lượng chênh lệch
                }
              });
            }
            // Cập nhật cache sau khi mutation thành công
            queryClient.invalidateQueries({ queryKey: ["cart"] });
          } catch (error) {
            console.error("Lỗi khi cập nhật giỏ hàng:", error);
            
            const apiError = error as ApiError;
            if (apiError.response?.data?.message?.includes("Not enough stock")) {
              const stock = apiError.response.data.data?.available_stock || 0;
              const current = apiError.response.data.data?.current_quantity || 0;
              const requested = apiError.response.data.data?.requested_quantity || 0;
              
              toast.error("Số lượng vượt quá tồn kho", {
                description: `Chỉ còn ${stock} sản phẩm trong kho. Bạn đã có ${current} sản phẩm trong giỏ hàng và yêu cầu thêm ${requested} sản phẩm.`
              });
            } else if (apiError.response?.data?.message?.includes("Car not found in cart")) {
              toast.error("Sản phẩm không còn trong giỏ hàng", {
                description: "Vui lòng làm mới trang."
              });
            } else {
              toast.error("Không thể cập nhật giỏ hàng", {
                description: "Vui lòng thử lại sau."
              });
            }
            throw error;
          }
        },
        500 // Debounce 500ms
      ),
    [queryClient]
  );

  return useMutation({
    mutationFn: async ({ car_id, quantity, currentQuantity }: { car_id: string; quantity: number; currentQuantity: number }) => {
      await debouncedMutation({ car_id, targetQuantity: quantity, initialQuantity: currentQuantity });
      return { success: true };
    }
  });
};

// Hook để xóa toàn bộ giỏ hàng
export const useClearCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.delete(API_ENDPOINTS.CART.CLEAR);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Đã xóa toàn bộ giỏ hàng");
    },
    onError: (error: unknown) => {
      console.error("Lỗi khi xóa giỏ hàng:", error);
      toast.error("Không thể xóa giỏ hàng", {
        description: "Vui lòng thử lại sau."
      });
    }
  });
};

export const useBuyNow = () => {
  const router = useRouter();
  const { setBuyNowItem } = useCheckoutStore();

  const buyNow = async (car_id: string, quantity: number = 1) => {
    setBuyNowItem({ car_id, quantity });
    router.push("/checkout");
  };

  return {
    buyNow,
    isLoading: false
  };
}; 