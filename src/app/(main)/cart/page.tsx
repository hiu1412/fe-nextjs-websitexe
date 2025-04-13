"use client";

import { useCart } from "@/providers/cart-provider";
import { formatPrice } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Loader2,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useRemoveFromCart,
  useUpdateCartItem,
  useClearCart,
} from "@/hooks/queries/cart-actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, isLoading, totalItems, totalPrice } = useCart();
  const { mutateAsync: removeFromCart, isPending: isRemovingFromCart } =
    useRemoveFromCart();
  const { mutateAsync: updateCartItem, isPending: isUpdatingCart } =
    useUpdateCartItem();
  const { mutateAsync: clearCart, isPending: isClearingCart } = useClearCart();
  const [processingItems, setProcessingItems] = useState<
    Record<string, boolean>
  >({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [initialQuantities, setInitialQuantities] = useState<
    Record<string, number>
  >({});
  const router = useRouter();

  useEffect(() => {
    const initQuantities: Record<string, number> = {};
    items.forEach((item) => {
      initQuantities[item.car_id] = item.quantity;
    });
    setQuantities(initQuantities);
    setInitialQuantities(initQuantities);
  }, [items]);

  const handleRemoveItem = async (carId: string) => {
    const currentItem = items.find((item) => item.car_id === carId);
    if (!currentItem) return;

    setProcessingItems((prev) => ({ ...prev, [carId]: true }));
    try {
      await removeFromCart({
        car_id: carId,
        quantity: currentItem.quantity,
      });
    } finally {
      setProcessingItems((prev) => ({ ...prev, [carId]: false }));
    }
  };

  const handleUpdateQuantity = async (
    carId: string,
    newQuantity: number,
    stock: number
  ) => {
    if (newQuantity < 1 || newQuantity > stock) return;

    setQuantities((prev) => ({
      ...prev,
      [carId]: newQuantity,
    }));

    try {
      await updateCartItem({
        car_id: carId,
        quantity: newQuantity,
        currentQuantity: initialQuantities[carId],
      });
    } catch (error) {
      setQuantities((prev) => ({
        ...prev,
        [carId]: initialQuantities[carId],
      }));
    }
  };

  const handleClearCart = async () => {
    if (
      window.confirm("Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?")
    ) {
      await clearCart();
    }
  };

  if (isLoading) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Giỏ hàng của bạn</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-40" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center gap-4">
                      <Skeleton className="h-20 w-20 rounded-md" />
                      <div className="flex-1">
                        <Skeleton className="h-6 w-40 mb-2" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-10 w-28" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <Skeleton className="h-7 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (totalItems === 0) {
    return (
      <div className="container py-10">
        <div className="text-center max-w-md mx-auto py-12">
          <div className="bg-primary-foreground rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <ShoppingBag className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Giỏ hàng trống</h2>
          <p className="text-muted-foreground mb-6">
            Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các mẫu xe của
            chúng tôi.
          </p>
          <Button asChild size="lg">
            <Link href="/cars">
              Xem danh sách xe
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <ShoppingCart className="mr-2 h-8 w-8" />
        Giỏ hàng của bạn ({totalItems} sản phẩm)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Chi tiết sản phẩm</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearCart}
                disabled={isClearingCart}
              >
                {isClearingCart ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Xóa tất cả
              </Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Hình ảnh</TableHead>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead className="text-right">Đơn giá</TableHead>
                      <TableHead className="w-[150px] text-center">
                        Số lượng
                      </TableHead>
                      <TableHead className="text-right">Thành tiền</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => {
                      const isProcessing =
                        processingItems[item.car_id] || false;
                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="relative w-16 h-12 overflow-hidden rounded-md">
                              <Image
                                src={item.car.image_url}
                                alt={item.car.model}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Link
                              href={`/cars/${item.car_id}`}
                              className="font-medium hover:underline"
                            >
                              {item.car.model}
                            </Link>
                            <div className="text-sm text-muted-foreground">
                              {item.car.brand.name} | {item.car.year} |{" "}
                              {item.car.color}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {formatPrice(parseFloat(item.car.price))}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.car_id,
                                    (quantities[item.car_id] || item.quantity) -
                                      1,
                                    item.car.stock
                                  )
                                }
                                disabled={
                                  quantities[item.car_id] <= 1 || isProcessing
                                }
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Input
                                type="number"
                                min={1}
                                max={item.car.stock}
                                value={quantities[item.car_id] || item.quantity}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  if (!isNaN(value)) {
                                    handleUpdateQuantity(
                                      item.car_id,
                                      value,
                                      item.car.stock
                                    );
                                  }
                                }}
                                className="w-12 h-8 text-center"
                                disabled={isProcessing}
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.car_id,
                                    (quantities[item.car_id] || item.quantity) +
                                      1,
                                    item.car.stock
                                  )
                                }
                                disabled={
                                  quantities[item.car_id] >= item.car.stock ||
                                  isProcessing
                                }
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatPrice(
                              parseFloat(item.car.price) * item.quantity
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleRemoveItem(item.car_id)}
                              disabled={isProcessing}
                            >
                              {isProcessing ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Tổng đơn hàng</CardTitle>
              <CardDescription>Thông tin thanh toán</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span>Miễn phí</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-primary text-xl">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                onClick={() => router.push("/checkout")}
              >
                Tiến hành thanh toán
              </Button>
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">Phương thức thanh toán</h3>
              <p className="text-sm text-muted-foreground">
                Chúng tôi hỗ trợ nhiều phương thức thanh toán khác nhau bao gồm:
                thanh toán khi nhận hàng, chuyển khoản ngân hàng, và các loại
                thẻ tín dụng phổ biến.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
