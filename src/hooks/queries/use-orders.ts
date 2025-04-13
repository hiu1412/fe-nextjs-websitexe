import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import axiosInstance from "@/lib/api/axios-instance";
import { Order } from "@/lib/api/types";

interface OrdersResponse {
  status: "success";
  message: string;
  data: {
    orders: Order[];
  };
}

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await axiosInstance.get<OrdersResponse>("/order/me");
      return response.data;
    },
  });
};

export const useOrderDetails = (orderId: string) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const response = await axiosInstance.get<{
        status: "success";
        message: string;
        data: {
          order: Order;
        };
      }>(API_ENDPOINTS.ORDER.DETAIL(orderId));
      return response.data;
    },
    enabled: !!orderId,
  });
};