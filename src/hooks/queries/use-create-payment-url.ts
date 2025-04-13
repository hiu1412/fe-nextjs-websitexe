import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/api/axios-instance";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { toast } from "sonner";

interface CreatePaymentUrlResponse {
  status: "success";
  message: string;
  data: {
    payment_url: string;
  };
}

export const useCreatePaymentUrl = () => {
  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await axiosInstance.post<CreatePaymentUrlResponse>(
        API_ENDPOINTS.PAYMENT.CREATE_URL(orderId)
      );
      return response.data;
    },
    onSuccess: (data: any) => {

      window.open(data.data.payment_url, "_blank");
    },
    onError: (error: any) => {
      console.error("Lỗi khi tạo link thanh toán:", error);
      toast.error("Không thể tạo link thanh toán", {
        description: "Vui lòng thử lại sau",
      });
    },
  });
}; 