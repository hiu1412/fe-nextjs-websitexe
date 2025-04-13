"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function PaymentCancelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="container py-10">
      <Card>
        <CardContent className="pt-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <XCircle className="h-12 w-12 text-red-500" />
            <h2 className="text-2xl font-bold text-red-500">
              Thanh toán không thành công
            </h2>
            <p className="text-muted-foreground">
              Rất tiếc, thanh toán của bạn đã bị hủy hoặc thất bại.
              <br />
              Vui lòng thử lại hoặc chọn phương thức thanh toán khác.
            </p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => router.push("/your-orders")}
              >
                Xem đơn hàng
              </Button>
              <Button onClick={() => router.push("/")}>Tiếp tục mua sắm</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
