import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";
import { useAdminStore } from "@/store/use-admin-store";
import { toast } from "sonner";
import { Brand } from "@/lib/api/types";

export interface UpdateBrandInput {
  id: string;
  name?: string;
  description?: string;
  logo?: File;
}

export function useUpdateBrand() {
  const queryClient = useQueryClient();
  const { brands, setBrands } = useAdminStore();

  return useMutation({
    mutationFn: async (data: { id: number; name: string; country: string; banner?: File }) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("country", data.country);
      if (data.banner) {
        formData.append("banner", data.banner);
      }
      return adminApi.updateBrand(data.id, formData);
    },
    onSuccess: (response, variables) => {
      // Cập nhật danh sách thương hiệu trong store
      if (brands) {
        setBrands(
          brands.map((brand) =>
            brand.id === variables.id ? response.data.data.brand : brand
          )
        );
      }
      
      // Invalidate queries để refresh dữ liệu
      queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      
      toast.success("Cập nhật thương hiệu thành công");
    },
    onError: (error: any) => {
      console.error("Update brand error:", error);
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật thương hiệu");
    },
  });
} 