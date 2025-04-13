import { axiosInstance } from './axios-instance';
import { ApiResponse, PaymentStatusResponse } from './types';

export const paymentApi = {
  createPaymentLink: (orderId: string, amount: number) =>
    axiosInstance.post<ApiResponse<string, number>>('/payment/create-link', {
      order_id: orderId,
      amount,
    }),

  checkStatus: (orderCode: string) =>
    axiosInstance.get<ApiResponse<PaymentStatusResponse, null>>(`/payment/check-status/${orderCode}`),
};