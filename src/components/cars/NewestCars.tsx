"use client";

import { useNewestCars } from "@/hooks/queries/useNewestCars";
import { useCarStore } from "@/store/useCarStore";
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

export const NewestCars = () => {
  const { data, isLoading, error } = useNewestCars();
  const { newestCars, setSelectedCar } = useCarStore();

  // Debug logs
  console.log("NewestCars Component State:", {
    isLoading,
    error,
    data,
    newestCarsFromStore: newestCars,
  });

  if (isLoading) {
    return (
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
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Có lỗi xảy ra khi tải dữ liệu</p>
        <p className="text-muted-foreground text-sm mt-2">{error.message}</p>
      </div>
    );
  }

  if (!newestCars || newestCars.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Không có xe mới nào</p>
        {data && (
          <pre className="text-xs mt-4 p-4 bg-muted rounded-lg overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {newestCars.map((car) => (
        <Card key={car.id} className="w-full group p-0">
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
              <p className="text-lg font-semibold">{formatPrice(car.price)}</p>
              <p className="text-sm text-muted-foreground">
                Còn {car.stock} xe
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => setSelectedCar(car)}
              variant={
                car.availability === "in_stock" ? "default" : "secondary"
              }
              disabled={car.availability === "out_of_stock"}
            >
              {car.availability === "in_stock"
                ? "Xem chi tiết"
                : car.availability === "pre_order"
                ? "Đặt trước"
                : "Hết hàng"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
