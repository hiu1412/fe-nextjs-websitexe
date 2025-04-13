import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateCar } from "@/hooks/mutations/useUpdateCar";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";
import { Brand, Car } from "@/lib/api/types";
import { Loader2 } from "lucide-react";

const editCarSchema = z.object({
  model: z.string().min(1, "Vui lòng nhập tên xe"),
  year: z
    .string()
    .regex(/^\d{4}$/, "Năm phải có 4 chữ số")
    .refine((val) => {
      const year = parseInt(val);
      return year >= 1886 && year <= new Date().getFullYear();
    }, "Năm không hợp lệ"),
  color: z.string().min(1, "Vui lòng nhập màu xe"),
  brand_id: z.string().min(1, "Vui lòng chọn hãng xe"),
  price: z
    .string()
    .min(1, "Vui lòng nhập giá xe")
    .regex(/^\d+$/, "Giá phải là số"),
  stock: z
    .string()
    .regex(/^\d+$/, "Số lượng phải là số")
    .transform(Number)
    .refine((n) => n >= 0, "Số lượng không được âm"),
  fuel_type: z.enum(["gasoline", "diesel", "electric", "hybrid"], {
    required_error: "Vui lòng chọn loại nhiên liệu",
  }),
  availability: z
    .enum(["in_stock", "out_of_stock", "pre_order"])
    .default("in_stock"),
});

type EditCarForm = z.infer<typeof editCarSchema>;

interface EditCarModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  car: Car;
}

export function EditCarModal({ open, onOpenChange, car }: EditCarModalProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<EditCarForm>({
    resolver: zodResolver(editCarSchema),
    defaultValues: {
      model: car.model,
      year: car.year,
      color: car.color,
      brand_id: car.brand_id,
      price: car.price,
      stock: car.stock.toString(),
      fuel_type: car.fuel_type,
      availability: car.availability,
    },
  });

  // Reset form khi car thay đổi
  useEffect(() => {
    form.reset({
      model: car.model,
      year: car.year,
      color: car.color,
      brand_id: car.brand_id,
      price: car.price,
      stock: car.stock.toString(),
      fuel_type: car.fuel_type,
      availability: car.availability,
    });
    setImagePreview(car.image_url);
  }, [car, form]);

  const { data: brandsData } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const response = await adminApi.getBrands();
      return response.data;
    },
  });

  const updateCar = useUpdateCar();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: EditCarForm) => {
    updateCar.mutate(
      {
        id: car.id,
        ...data,
        year: parseInt(data.year),
        price: parseFloat(data.price),
        stock: parseInt(data.stock.toString()),
        image: selectedImage,
      },
      {
        onSuccess: () => {
          setSelectedImage(null);
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa xe</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin xe {car.model}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên xe</FormLabel>
                  <FormControl>
                    <Input placeholder="VF e34" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Năm sản xuất</FormLabel>
                    <FormControl>
                      <Input placeholder="2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Màu sắc</FormLabel>
                    <FormControl>
                      <Input placeholder="Đen" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá (VNĐ)</FormLabel>
                    <FormControl>
                      <Input placeholder="690000000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số lượng</FormLabel>
                    <FormControl>
                      <Input placeholder="10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="brand_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hãng xe</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn hãng xe" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {brandsData?.data?.brands.map((brand: Brand) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fuel_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nhiên liệu</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại nhiên liệu" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="gasoline">Xăng</SelectItem>
                        <SelectItem value="diesel">Dầu</SelectItem>
                        <SelectItem value="electric">Điện</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tình trạng</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tình trạng" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="in_stock">Còn hàng</SelectItem>
                      <SelectItem value="out_of_stock">Hết hàng</SelectItem>
                      <SelectItem value="pre_order">Đặt trước</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Hình ảnh</FormLabel>
              <FormControl>
                <div className="grid gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </FormControl>
            </FormItem>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={updateCar.isPending}>
                {updateCar.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
