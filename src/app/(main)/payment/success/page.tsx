"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { paymentApi } from "@/lib/api/payment";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import type { PaymentStatusResponse } from "@/lib/api/types";

type PaymentPageStatus = "checking" | "success" | "failed";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<PaymentPageStatus>("checking");
  const [message, setMessage] = useState(
    "Đang kiểm tra trạng thái thanh toán..."
  );

  useEffect(() => {
    const orderCode = searchParams.get("orderCode");
    if (!orderCode) {
      setStatus("failed");
      setMessage("Không tìm thấy mã đơn hàng");
      return;
    }

    const checkPaymentStatus = async () => {
      try {
        const response = await paymentApi.checkStatus(orderCode);

        if (response.data.status === "success") {
          const paymentStatus: PaymentStatusResponse = response.data.message;
          if (paymentStatus.status === "PAID") {
            setStatus("success");
            setMessage(paymentStatus.message);
          } else {
            setStatus("failed");
            setMessage(paymentStatus.message);
          }
        } else {
          setStatus("failed");
          setMessage("Không thể kiểm tra trạng thái thanh toán");
        }
      } catch (err) {
        console.error("Lỗi kiểm tra thanh toán:", err);
        setStatus("failed");
        setMessage("Có lỗi xảy ra khi kiểm tra trạng thái thanh toán");
      }
    };

    // Kiểm tra trạng thái ngay lập tức
    checkPaymentStatus();

    // Kiểm tra lại mỗi 5 giây nếu đang ở trạng thái checking
    const interval = setInterval(() => {
      if (status === "checking") {
        checkPaymentStatus();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [searchParams, status]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-6">
        <div className="text-center space-y-4">
          {status === "checking" && (
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          )}
          {status === "success" && (
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
          )}
          {status === "failed" && (
            <XCircle className="h-12 w-12 text-destructive mx-auto" />
          )}

          <h1 className="text-2xl font-bold">
            {status === "checking" && "Đang xử lý"}
            {status === "success" && "Thanh toán thành công"}
            {status === "failed" && "Thanh toán thất bại"}
          </h1>

          <p className="text-muted-foreground">{message}</p>

          <div className="pt-4 space-x-3">
            <Button variant="outline" onClick={() => router.push("/your-orders")}>
              Xem đơn hàng
            </Button>
            <Button onClick={() => router.push("/")}>Về trang chủ</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
