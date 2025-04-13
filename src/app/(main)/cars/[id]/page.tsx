"use client";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useCarDetail } from "@/hooks/queries/cars";
import {
  ArrowLeft,
  CalendarIcon,
  Loader2,
  MapPin,
  Package2,
  Tags,
  Info,
  Heart,
  CreditCard,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/providers/cart-provider";
import {
  useAddToCart,
  useRemoveFromCart,
  useUpdateCartItem,
} from "@/hooks/queries/cart-actions";
import { Input } from "@/components/ui/input";

export default function CarDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isFavourite, setIsFavourite] = useState(false);
  const { data: car, isLoading, isError } = useCarDetail(params.id);
  const { items: cartItems } = useCart();

  // Kiểm tra xe đã có trong giỏ hàng chưa
  const cartItem = cartItems.find((item) => item.car_id === params.id);
  const isInCart = !!cartItem;

  // Mutations
  const { mutateAsync: addToCart, isPending: isAddingToCart } = useAddToCart();
  const { mutateAsync: removeFromCart, isPending: isRemovingFromCart } =
    useRemoveFromCart();
  const { mutateAsync: updateCartItem, isPending: isUpdatingCart } =
    useUpdateCartItem();

  // Mutation để thêm vào danh sách yêu thích
  const { mutateAsync: toggleFavourite, isPending: isTogglingFavourite } =
    useMutation({
      mutationFn: async () => {
        // Giả lập API gọi - sẽ thay thế bằng API thực tế sau
        return new Promise<void>((resolve) => setTimeout(resolve, 500));
      },
      onSuccess: () => {
        setIsFavourite(!isFavourite);
        toast.success(
          isFavourite
            ? "Đã xóa khỏi danh sách yêu thích"
            : "Đã thêm vào danh sách yêu thích"
        );
      },
      onError: () => {
        toast.error("Không thể cập nhật danh sách yêu thích", {
          description: "Vui lòng thử lại sau hoặc đăng nhập vào tài khoản.",
        });
      },
    });

  const handleAddToCart = async () => {
    if (!car) return;

    try {
      await addToCart({ car_id: car.id, quantity: 1 });
      toast.success("Thêm vào giỏ hàng thành công", {
        description: `Đã thêm ${car.model} vào giỏ hàng của bạn`,
      });
    } catch {
      // Lỗi đã được xử lý trong onError của mutation
    }
  };

  const handleBuyNow = async () => {
    if (!car) return;

    try {
      await addToCart({ car_id: car.id, quantity: 1 });
      router.push("/cart");
    } catch {
      // Lỗi đã được xử lý trong onError của mutation
    }
  };

  const handleToggleFavourite = async () => {
    try {
      await toggleFavourite();
    } catch {
      // Lỗi đã được xử lý trong onError của mutation
    }
  };

  const handleUpdateQuantity = async (car_id: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      await updateCartItem({ car_id, quantity: newQuantity });
    } catch {
      // Lỗi đã được xử lý trong onError của mutationse);
    }
  };

  const handleRemoveFromCart = async (car_id: string) => {
    try {
      await removeFromCart({ car_id });
    } catch {
      // Lỗi đã được xử lý trong onError của mutation
    }
  };

  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Danh sách xe", href: "/cars" },
    { label: car?.model || "Chi tiết xe", href: `/cars/${params.id}` },
  ];

  if (isLoading) {
    return (
      <div className="container py-8">
        <Breadcrumb items={breadcrumbItems} />
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-video w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-10 w-1/3" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-2/3" />
            </div>
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
        <div className="mt-8">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !car) {
    return (
      <div className="container py-8">
        <Breadcrumb items={breadcrumbItems} />
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold">Không tìm thấy thông tin xe</h2>
          <p className="mt-2 text-muted-foreground">
            Không thể tải thông tin xe này. Vui lòng thử lại sau hoặc quay lại
            danh sách xe.
          </p>
          <Button asChild className="mt-4">
            <Link href="/cars">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại danh sách xe
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const inStock = car.availability === "in_stock" && car.stock > 0;
  const isPending =
    isAddingToCart ||
    isTogglingFavourite ||
    isRemovingFromCart ||
    isUpdatingCart;

  return (
    <div className="container py-8">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hình ảnh xe */}
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <Image
            src={car.image_url}
            alt={car.model}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/70 backdrop-blur-sm hover:bg-white/90 z-10"
            onClick={handleToggleFavourite}
            disabled={isPending}
          >
            <Heart
              className={`h-5 w-5 ${
                isFavourite ? "fill-rose-500 text-rose-500" : "text-rose-500"
              }`}
            />
          </Button>
        </div>

        {/* Thông tin chi tiết */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center mb-2">
              <h1 className="text-3xl font-bold">{car.model}</h1>
              <Badge variant="outline" className="ml-2">
                {car.brand.name}
              </Badge>
            </div>
            <p className="text-lg font-semibold text-primary">
              {formatPrice(parseFloat(car.price))}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 text-muted-foreground mr-2" />
              <span>Năm sản xuất: {car.year}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-muted-foreground mr-2" />
              <span>Xuất xứ: {car.brand.country}</span>
            </div>
            <div className="flex items-center">
              <Tags className="h-5 w-5 text-muted-foreground mr-2" />
              <span>Màu sắc: {car.color}</span>
            </div>
            <div className="flex items-center">
              <Package2 className="h-5 w-5 text-muted-foreground mr-2" />
              <span>Kho: {car.stock} chiếc</span>
            </div>
          </div>

          <div>
            <Badge
              variant={car.fuel_type === "electric" ? "secondary" : "default"}
            >
              {car.fuel_type === "electric" ? "Xe điện" : "Xăng"}
            </Badge>
            <Badge
              variant={inStock ? "outline" : "destructive"}
              className="ml-2"
            >
              {inStock ? "Còn hàng" : "Hết hàng"}
            </Badge>
          </div>

          {/* Phân đoạn này hiển thị các nút thêm vào giỏ hàng/mua ngay nếu chưa có trong giỏ,
               hoặc hiển thị điều khiển số lượng nếu đã có trong giỏ */}
          {isInCart ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    handleUpdateQuantity(car.id, (cartItem?.quantity || 1) - 1)
                  }
                  disabled={cartItem?.quantity <= 1 || isPending}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={cartItem?.quantity || 1}
                  min={1}
                  max={car.stock}
                  onChange={(e) =>
                    handleUpdateQuantity(car.id, parseInt(e.target.value) || 1)
                  }
                  className="w-16 text-center"
                  disabled={isPending}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    handleUpdateQuantity(car.id, (cartItem?.quantity || 1) + 1)
                  }
                  disabled={cartItem?.quantity >= car.stock || isPending}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleRemoveFromCart(car.id)}
                disabled={isPending}
              >
                {isRemovingFromCart ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>

              <Button
                className="flex-1"
                variant="default"
                onClick={() => router.push("/cart")}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Xem giỏ hàng
              </Button>
            </div>
          ) : (
            <div className="flex flex-col space-y-3">
              <Button
                className="w-full"
                size="lg"
                onClick={handleAddToCart}
                disabled={!inStock || isPending}
              >
                {isAddingToCart ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <ShoppingCart className="h-4 w-4 mr-2" />
                )}
                {inStock ? "Thêm vào giỏ hàng" : "Hết hàng"}
              </Button>

              <Button
                className="w-full"
                size="lg"
                variant="destructive"
                onClick={handleBuyNow}
                disabled={!inStock || isPending}
              >
                {isAddingToCart ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CreditCard className="h-4 w-4 mr-2" />
                )}
                Mua ngay
              </Button>

              <Button
                className="w-full"
                size="lg"
                variant="outline"
                onClick={handleToggleFavourite}
                disabled={isPending}
              >
                {isTogglingFavourite ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Heart
                    className={`h-4 w-4 mr-2 ${
                      isFavourite ? "fill-rose-500 text-rose-500" : ""
                    }`}
                  />
                )}
                {isFavourite ? "Đã thêm vào yêu thích" : "Thêm vào yêu thích"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mô tả sản phẩm */}
      {car.description && (
        <Card className="mt-10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Info className="h-5 w-5 text-primary" />
              <CardTitle>Mô tả sản phẩm</CardTitle>
            </div>
            <CardDescription className="text-foreground whitespace-pre-line text-base">
              {car.description}
            </CardDescription>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
