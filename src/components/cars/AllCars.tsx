"use client";

import { useAllCars } from "@/hooks/queries/useAllCars";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Car } from "@/lib/api/types";
import { Heart, ShoppingCart, CreditCard, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCart } from "@/hooks/queries/cart";

const formatPrice = (price: string) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(price));
};

const FuelTypeBadge = ({ type }: { type: string }) => {
  const colors = {
    electric: "bg-green-100 text-green-800",
    gasoline: "bg-blue-100 text-blue-800",
    hybrid: "bg-purple-100 text-purple-800",
    diesel: "bg-gray-100 text-gray-800",
  };

  const labels = {
    electric: "Điện",
    gasoline: "Xăng",
    hybrid: "Hybrid",
    diesel: "Diesel",
  };

  return (
    <Badge variant="secondary" className={colors[type as keyof typeof colors]}>
      {labels[type as keyof typeof labels]}
    </Badge>
  );
};

interface Filters {
  search: string;
  fuelType: string;
  priceRange: [number, number];
  availability: string;
  year: string;
}

export const AllCars = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useAllCars({ page: currentPage });
  const { addToCart, isPending } = useCart();
  const [filters, setFilters] = useState<Filters>({
    search: "",
    fuelType: "all",
    priceRange: [0, 2000000000], // 2 tỷ VNĐ
    availability: "all",
    year: "all",
  });

  const handleAddToCart = async (car: Car) => {
    try {
      await addToCart({ car_id: car.id, quantity: 1 });
      toast.success("Thêm vào giỏ hàng thành công", {
        description: `Đã thêm ${car.model} vào giỏ hàng của bạn`,
      });
    } catch {
      toast.error("Không thể thêm vào giỏ hàng", {
        description: "Vui lòng đăng nhập và thử lại sau.",
      });
    }
  };

  const filteredCars = data?.data?.cars?.filter((car: Car) => {
    if (
      filters.search &&
      !car.model.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false;
    if (filters.fuelType !== "all" && car.fuel_type !== filters.fuelType)
      return false;
    if (
      Number(car.price) < filters.priceRange[0] ||
      Number(car.price) > filters.priceRange[1]
    )
      return false;
    if (
      filters.availability !== "all" &&
      car.availability !== filters.availability
    )
      return false;
    if (filters.year !== "all" && car.year !== filters.year) return false;
    return true;
  });

  const totalPages = data?.data?.last_page || 1;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="w-full">
                <div className="rounded-t-lg h-48 w-full">
                  <Skeleton className="h-full w-full rounded-t-lg" />
                </div>
                <CardHeader>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-8 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Filter Sidebar */}
      <div className="lg:col-span-1 space-y-6">
        <div className="space-y-2">
          <Label>Tìm kiếm</Label>
          <Input
            placeholder="Tên xe..."
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Loại nhiên liệu</Label>
          <Select
            value={filters.fuelType}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, fuelType: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn loại nhiên liệu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="electric">Điện</SelectItem>
              <SelectItem value="gasoline">Xăng</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
              <SelectItem value="diesel">Diesel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Khoảng giá</Label>
          <div className="pt-2">
            <Slider
              min={0}
              max={2000000000}
              step={50000000}
              value={filters.priceRange}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  priceRange: value as [number, number],
                }))
              }
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatPrice(filters.priceRange[0].toString())}</span>
            <span>{formatPrice(filters.priceRange[1].toString())}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Trạng thái</Label>
          <Select
            value={filters.availability}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, availability: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="in_stock">Còn hàng</SelectItem>
              <SelectItem value="out_of_stock">Hết hàng</SelectItem>
              <SelectItem value="pre_order">Đặt trước</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Năm sản xuất</Label>
          <Select
            value={filters.year}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, year: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn năm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cars Grid */}
      <div className="lg:col-span-3">
        {!filteredCars || filteredCars.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Không tìm thấy xe phù hợp với bộ lọc
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car: Car) => (
                <Card key={car.id} className="w-full group p-0">
                  <div className="relative">
                    <div className="relative aspect-[16/9]">
                      <Image
                        src={car.image_url}
                        alt={car.model}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-t-lg"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                      />
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-colors"
                    >
                      <Heart className="w-5 h-5 text-rose-500" />
                    </Button>
                  </div>
                  <CardHeader className="space-y-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl line-clamp-1">
                        {car.model}
                      </CardTitle>
                      <FuelTypeBadge type={car.fuel_type} />
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <span>Năm {car.year}</span>
                      <span>•</span>
                      <span>{car.color}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-semibold">
                        {formatPrice(car.price)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Còn {car.stock} xe
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 flex flex-col gap-2">
                    <div className="grid grid-cols-3 gap-2 w-full">
                      <Button
                        className="w-full col-span-3"
                        onClick={() => router.push(`/cars/${car.id}`)}
                        variant="outline"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Xem chi tiết
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <Button
                        className="w-full"
                        variant={
                          car.availability === "in_stock"
                            ? "default"
                            : "secondary"
                        }
                        disabled={
                          car.availability === "out_of_stock" || isPending
                        }
                        onClick={() => handleAddToCart(car)}
                      >
                        {car.availability === "in_stock" ? (
                          <div className="flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4" />
                            <span>Thêm vào giỏ</span>
                          </div>
                        ) : car.availability === "pre_order" ? (
                          "Đặt trước"
                        ) : (
                          "Hết hàng"
                        )}
                      </Button>
                      <Button
                        className="w-full"
                        variant="destructive"
                        disabled={car.availability !== "in_stock"}
                        onClick={() => {
                          handleAddToCart(car);
                          router.push("/checkout");
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          <span>Mua ngay</span>
                        </div>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                      />
                    </PaginationItem>
                  )}

                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        onClick={() => setCurrentPage(i + 1)}
                        isActive={currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
