"use client";

import { useBrands } from "@/hooks/queries/useBrands";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { MapPin, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Brand } from "@/lib/api/types";

export const BrandGrid = () => {
  const { data, isLoading } = useBrands();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="w-full">
            <div className="relative aspect-[21/9]">
              <Skeleton className="h-full w-full rounded-t-lg" />
            </div>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </CardHeader>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (!data?.data?.brands || data.data.brands.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Không có thương hiệu nào</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.data.brands.map((brand: Brand) => (
        <Card key={brand.id} className="overflow-hidden">
          <div className="relative aspect-[21/9]">
            <Image
              src={brand.banner_url}
              alt={brand.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <CardHeader className="absolute bottom-0 left-0 right-0 text-white pb-3">
              <CardTitle className="text-2xl font-bold">{brand.name}</CardTitle>
              <CardDescription className="flex items-center gap-2 text-white/90">
                <MapPin className="w-4 h-4" />
                <span>{brand.country}</span>
              </CardDescription>
            </CardHeader>
          </div>
          <CardFooter className="p-4">
            <Link href={`/cars?brand=${brand.id}`} className="w-full">
              <Button className="w-full" variant="outline">
                <div className="flex items-center justify-between w-full">
                  <span>Xem các dòng xe</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
