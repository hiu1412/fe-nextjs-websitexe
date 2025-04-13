"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/providers/cart-provider";
import { useCheckoutStore } from "@/store/checkout-store";
import { useCreateOrder } from "@/hooks/queries/use-create-order";
import { useAuthStore } from "@/store/use-auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CheckoutPage() {
  const { items, totalPrice, totalItems } = useCart();
  const { buyNowItem, form, setForm, resetForm } = useCheckoutStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const { mutateAsync: createOrder, isPending: isCreatingOrder } = useCreateOrder();

  useEffect(() => {
    if (totalItems === 0 && !buyNowItem) {
      router.push("/cart");
    }
  }, [totalItems, router, buyNowItem]);

  useEffect(() => {
    // Tự động điền thông tin từ user data
    if (user) {
      setForm({
        fullName: user.full_name,
        email: user.email,
        phone: user.phone || "",
        address: user.address || "",
        city: "", // Mặc định trống vì API chưa có thông tin này
      });
    }
    // Reset form khi component unmount
    return () => resetForm();
  }, [user, setForm, resetForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createOrder();
      // Nếu thành công, chuyển về trang chủ
      router.push("/");
    } catch {
      // Lỗi đã được xử lý trong useCreateOrder hook
      return;
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Thanh toán</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin giao hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Họ và tên</Label>
                    <Input
                      id="fullName"
                      required
                      value={form.fullName}
                      onChange={(e) => setForm({ fullName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Input
                    id="address"
                    required
                    value={form.address}
                    onChange={(e) => setForm({ address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Thành phố</Label>
                  <Input
                    id="city"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ city: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Đơn hàng của bạn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div>
                        {item.car.model} x {item.quantity}
                      </div>
                      <div className="font-medium">
                        {formatPrice(parseFloat(item.car.price) * item.quantity)}
                      </div>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between items-center">
                    <div className="text-muted-foreground">Tạm tính</div>
                    <div className="font-medium">{formatPrice(totalPrice)}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-muted-foreground">Phí vận chuyển</div>
                    <div>Miễn phí</div>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <div>Tổng cộng</div>
                    <div className="text-primary text-xl">
                      {formatPrice(totalPrice)}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardContent className="pt-0">
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isCreatingOrder}
                >
                  {isCreatingOrder ? "Đang xử lý..." : "Đặt hàng"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}