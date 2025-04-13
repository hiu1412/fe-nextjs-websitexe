"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";
import { Car } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/lib/utils";
import { Loader2, MoreHorizontal, Plus, Search } from "lucide-react";
import Image from "next/image";
import { CreateCarModal } from "@/components/cars/CreateCarModal";
import { EditCarModal } from "@/components/cars/EditCarModal";
import { useDeleteCar } from "@/hooks/mutations/useDeleteCar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type FuelType = "all" | "electric" | "gasoline" | "hybrid" | "diesel";
type Availability = "all" | "in_stock" | "out_of_stock" | "pre_order";

const ITEMS_PER_PAGE_OPTIONS = [12, 24, 36, 48];

export default function CarsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [search, setSearch] = useState("");
  const [fuelType, setFuelType] = useState<FuelType>("all");
  const [availability, setAvailability] = useState<Availability>("all");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);
  const deleteCarMutation = useDeleteCar();

  const { data: carsData, isLoading } = useQuery({
    queryKey: ["admin-cars", page, limit, search, fuelType, availability],
    queryFn: async () => {
      const response = await adminApi.getCars(page, limit);
      console.log("Cars API Response:", response);
      return response;
    },
  });

  const cars = carsData?.data?.data?.cars || [];
  const pagination = carsData?.data?.data?.pagination;
  const total = pagination?.total || 0;
  const totalPages = pagination?.total_pages || 1;

  const availabilityColors = {
    in_stock: "bg-green-100 text-green-800",
    out_of_stock: "bg-red-100 text-red-800",
    pre_order: "bg-blue-100 text-blue-800",
  };

  const fuelTypeColors = {
    electric: "bg-purple-100 text-purple-800",
    gasoline: "bg-orange-100 text-orange-800",
    hybrid: "bg-teal-100 text-teal-800",
    diesel: "bg-gray-100 text-gray-800",
  };

  const handleEdit = (car: Car) => {
    setSelectedCar(car);
    setEditModalOpen(true);
  };

  const handleDelete = (car: Car) => {
    setCarToDelete(car);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (carToDelete) {
      deleteCarMutation.mutate(carToDelete.id);
      setDeleteModalOpen(false);
      setCarToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quản lý xe</h1>
          <p className="text-muted-foreground">Tổng số xe: {total}</p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm xe mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách xe</CardTitle>
          <CardDescription>
            Quản lý tất cả các xe trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên xe..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={fuelType}
              onValueChange={(value) => setFuelType(value as FuelType)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Loại nhiên liệu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="electric">Điện</SelectItem>
                <SelectItem value="gasoline">Xăng</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="diesel">Dầu</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={availability}
              onValueChange={(value) => setAvailability(value as Availability)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tình trạng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="in_stock">Còn hàng</SelectItem>
                <SelectItem value="out_of_stock">Hết hàng</SelectItem>
                <SelectItem value="pre_order">Đặt trước</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Cars table */}
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hình ảnh</TableHead>
                    <TableHead>Tên xe</TableHead>
                    <TableHead>Hãng xe</TableHead>
                    <TableHead>Năm SX</TableHead>
                    <TableHead>Màu sắc</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead>Kho</TableHead>
                    <TableHead>Tình trạng</TableHead>
                    <TableHead>Nhiên liệu</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cars.map((car: Car & { brand: { name: string } }) => (
                    <TableRow key={car.id}>
                      <TableCell>
                        <div className="relative w-16 h-12 rounded-md overflow-hidden">
                          <Image
                            src={car.image_url}
                            alt={car.model}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{car.model}</TableCell>
                      <TableCell>{car.brand.name}</TableCell>
                      <TableCell>{car.year}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: car.color }}
                          />
                          {car.color}
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatPrice(parseFloat(car.price))}
                      </TableCell>
                      <TableCell>{car.stock}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={availabilityColors[car.availability]}
                        >
                          {car.availability === "in_stock"
                            ? "Còn hàng"
                            : car.availability === "out_of_stock"
                            ? "Hết hàng"
                            : "Đặt trước"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={fuelTypeColors[car.fuel_type]}
                        >
                          {car.fuel_type === "electric"
                            ? "Điện"
                            : car.fuel_type === "gasoline"
                            ? "Xăng"
                            : car.fuel_type === "hybrid"
                            ? "Hybrid"
                            : "Dầu"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(car)}>
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(car)}
                            >
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-4 border-t">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    Trang {page} / {totalPages}
                  </div>
                  <Select
                    value={limit.toString()}
                    onValueChange={(value) => {
                      setLimit(Number(value));
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ITEMS_PER_PAGE_OPTIONS.map((value) => (
                        <SelectItem key={value} value={value.toString()}>
                          {value} mục / trang
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!pagination?.has_prev_page}
                  >
                    Trước
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!pagination?.has_next_page}
                  >
                    Sau
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateCarModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />

      {selectedCar && (
        <EditCarModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          car={selectedCar}
        />
      )}

      <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa xe</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa xe {carToDelete?.model}? Hành động này
              không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
