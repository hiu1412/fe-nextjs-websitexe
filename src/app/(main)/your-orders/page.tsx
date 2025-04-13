"use client";

import { useOrders } from "@/hooks/queries/use-orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Order, OrderStatus } from "@/lib/api/types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCancelOrder } from "@/hooks/queries/use-cancel-order";
import { Loader2, AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PayButton } from "@/components/payment/pay-button";

const orderStatusMap: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Chờ xử lý",
    className: "bg-yellow-100 text-yellow-800",
  },
  completed: {
    label: "Hoàn thành",
    className: "bg-green-100 text-green-800",
  },
  cancelled: {
    label: "Đã hủy",
    className: "bg-red-100 text-red-800",
  },
};

export default function YourOrdersPage() {
  const { data: ordersData, isLoading } = useOrders();
  const cancelOrder = useCancelOrder();

  if (isLoading) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-8">Đơn hàng của bạn</h1>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const orders = ordersData?.data?.orders?.data;

  if (!orders || orders.length === 0) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-8">Đơn hàng của bạn</h1>
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              Bạn chưa có đơn hàng nào
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Đơn hàng của bạn</h1>
      <div className="space-y-6">
        {orders.map((order: Order) => (
          <Card key={order.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  Đơn hàng #{order.id.split("-")[0].toUpperCase()}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Đặt ngày{" "}
                  {format(new Date(order.created_at), "dd/MM/yyyy HH:mm", {
                    locale: vi,
                  })}
                </p>
              </div>
              <Badge
                variant="secondary"
                className={orderStatusMap[order.status].className}
              >
                {orderStatusMap[order.status].label}
              </Badge>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-4">
                  {order.order_details.map((detail) => (
                    <div
                      key={detail.id}
                      className="flex items-center space-x-4"
                    >
                      <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={detail.car.image_url}
                          alt={detail.car.model}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 items-center justify-between">
                        <div>
                          <p className="font-medium">{detail.car.model}</p>
                          <p className="text-sm text-muted-foreground">
                            {detail.quantity} chiếc x{" "}
                            {formatPrice(parseFloat(detail.price))}
                          </p>
                        </div>
                        <p className="font-medium">
                          {formatPrice(parseFloat(detail.subtotal_price))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tổng tiền</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatPrice(parseFloat(order.total_price))}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {order.payment && (
                    <>
                      <Badge
                        variant="secondary"
                        className={
                          order.payment.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : order.payment.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {order.payment.status === "completed"
                          ? "Đã thanh toán"
                          : order.payment.status === "pending"
                          ? "Chờ thanh toán"
                          : "Thanh toán thất bại"}
                      </Badge>
                      {order.payment.status === "pending" && (
                        <PayButton
                          orderId={order.id}
                          amount={parseInt(order.total_price)}
                          size="sm"
                        />
                      )}
                    </>
                  )}
                  {order.status === "pending" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={cancelOrder.isPending}
                        >
                          {cancelOrder.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          <AlertCircle className="mr-2 h-4 w-4" />
                          Hủy đơn
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Xác nhận hủy đơn hàng
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Bạn có chắc chắn muốn hủy đơn hàng này? Hành động
                            này không thể hoàn tác.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Không</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => cancelOrder.mutate(order.id)}
                          >
                            Có, hủy đơn
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
