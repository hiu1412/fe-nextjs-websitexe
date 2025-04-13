"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/api/axios-instance";
import type { ButtonProps } from "@/components/ui/button";

interface PayButtonProps {
  orderId: string;
  amount: number;
  disabled?: boolean;
  size?: ButtonProps["size"];
}

export function PayButton({ orderId, amount, disabled, size }: PayButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post("/payment/create-link", {
        order_id: orderId,
        amount: amount,
      });

      if (response.data.status === "success") {
        // URL thanh toán nằm trong message
        window.location.href = response.data.message;
      } else {
        toast.error("Không thể tạo liên kết thanh toán");
      }
    } catch (error) {
      console.error("Lỗi tạo payment:", error);
      toast.error("Có lỗi xảy ra khi tạo liên kết thanh toán");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || isLoading}
      size={size}
      className="w-full sm:w-auto"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Đang xử lý
        </>
      ) : (
        "Thanh toán ngay"
      )}
    </Button>
  );
}
