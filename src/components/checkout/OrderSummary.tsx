import { useCart } from "@/hooks/queries/cart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import type { BuyNowItem } from "@/store/checkout-store";
import type { Car } from "@/types";

interface OrderSummaryProps {
  buyNowItem?: BuyNowItem | null;
  buyNowProduct?: Car | null;
}

export function OrderSummary({ buyNowItem, buyNowProduct }: OrderSummaryProps) {
  const { data: cartItems } = useCart();

  // Nếu là mua ngay và có thông tin sản phẩm
  if (buyNowItem && buyNowProduct) {
    const total = buyNowProduct.price * buyNowItem.quantity;
    const shippingFee = 0;

    return (
      <Card>
        <CardHeader>
          <CardTitle>Tổng quan đơn hàng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>
                {buyNowProduct.name} x {buyNowItem.quantity}
              </span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển</span>
              <span>{formatPrice(shippingFee)}</span>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between font-bold">
            <span>Tổng cộng</span>
            <span>{formatPrice(total + shippingFee)}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Nếu là thanh toán từ giỏ hàng
  const subtotal =
    cartItems?.reduce((total, item) => {
      return total + item.car.price * item.quantity;
    }, 0) ?? 0;

  const shippingFee = 0;
  const total = subtotal + shippingFee;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tổng quan đơn hàng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {cartItems?.map((item) => (
            <div key={item.car.id} className="flex justify-between">
              <span>
                {item.car.name} x {item.quantity}
              </span>
              <span>{formatPrice(item.car.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Tạm tính</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Phí vận chuyển</span>
            <span>{formatPrice(shippingFee)}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between font-bold">
          <span>Tổng cộng</span>
          <span>{formatPrice(total)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
