import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/api/axios-instance";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { toast } from "sonner";

interface CancelOrderResponse {
  status: "success";
  message: string;
}

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await axiosInstance.delete<CancelOrderResponse>(
        API_ENDPOINTS.ORDER.CANCEL(orderId)
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate orders query để load lại danh sách đơn hàng
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Hủy đơn hàng thành công", {
        description: data.message,
      });
    },
    onError: (error) => {
      console.error("Lỗi khi hủy đơn hàng:", error);
      toast.error("Không thể hủy đơn hàng", {
        description: "Vui lòng thử lại sau",
      });
    },
  });
}; 