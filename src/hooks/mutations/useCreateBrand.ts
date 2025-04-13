import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";
import { toast } from "sonner";

export function useCreateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; country: string; banner?: File }) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("country", data.country);
      if (data.banner) {
        formData.append("banner", data.banner);
      }
      return adminApi.createBrand(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
      toast.success("Thêm thương hiệu thành công");
    },
    onError: (error: any) => {
      console.error("Create brand error:", error);
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi thêm thương hiệu");
    },
  });
} 