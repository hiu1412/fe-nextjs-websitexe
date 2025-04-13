import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Button } from "@/components/ui/button";
import { useUpdateBrand } from "@/hooks/mutations/useUpdateBrand";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { Brand } from "@/lib/api/types";

const formSchema = z.object({
  name: z.string().min(1, "Tên thương hiệu không được để trống"),
  country: z.string().min(1, "Quốc gia không được để trống"),
  banner: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditBrandModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand: Brand;
}

export function EditBrandModal({
  open,
  onOpenChange,
  brand,
}: EditBrandModalProps) {
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const updateBrandMutation = useUpdateBrand();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: brand.name,
      country: brand.country,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: brand.name,
        country: brand.country,
      });
      setBannerPreview(brand.banner_url || null);
    }
  }, [open, brand, form]);

  const onSubmit = (values: FormValues) => {
    const formData = {
      id: brand.id,
      name: values.name,
      country: values.country,
      banner: values.banner,
    };

    updateBrandMutation.mutate(formData, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("banner", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thương hiệu</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin thương hiệu xe
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên thương hiệu</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên thương hiệu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quốc gia</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập quốc gia" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="banner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerChange}
                      />
                      {bannerPreview && (
                        <div className="relative w-full h-32 border rounded-md overflow-hidden">
                          <Image
                            src={bannerPreview}
                            alt="Banner preview"
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={updateBrandMutation.isPending}>
                {updateBrandMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Lưu thay đổi"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
