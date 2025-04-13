import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import axiosInstance from "@/lib/api/axios-instance";
import { CreateOrderResponse } from "@/lib/api/types";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface ErrorResponseData {
  status: string;
  message: string;
  errors?: Record<string, string[]>;
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post<CreateOrderResponse>(
        API_ENDPOINTS.ORDER.CREATE,
        { type: "cart" }
      );
      return response.data;
    },
    onSuccess: (data: CreateOrderResponse) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Đặt hàng thành công!", {
        description: `Mã đơn hàng: ${data.data.order.id}. Chúng tôi sẽ liên hệ sớm nhất.`,
      });
    },
    onError: (error: unknown) => {
      console.error("Lỗi khi tạo đơn hàng:", error);
      
      const axiosError = error as AxiosError<ErrorResponseData>;
      const errorMessage = axiosError.response?.data?.message || "Vui lòng thử lại sau.";
      
      toast.error("Đặt hàng thất bại", {
        description: errorMessage,
      });
      throw error;
    }
  });
};