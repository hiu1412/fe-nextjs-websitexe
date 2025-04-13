import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/api/axios-instance";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { BillingInfo, ShippingInfo, PaymentMethod } from "@/store/checkout-store";
import type { CartItem } from "@/types";

interface CreateOrderRequest {
  billingInfo: BillingInfo;
  shippingInfo: ShippingInfo;
  paymentMethod: PaymentMethod;
  items: CartItem[];
}

interface CreateOrderResponse {
  id: string;
  status: "pending" | "confirmed" | "cancelled";
  total: number;
  createdAt: string;
}

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: async (data: CreateOrderRequest) => {
      const response = await axiosInstance.post<CreateOrderResponse>(
        API_ENDPOINTS.ORDERS.CREATE,
        data
      );
      return response.data;
    },
  });
}; 