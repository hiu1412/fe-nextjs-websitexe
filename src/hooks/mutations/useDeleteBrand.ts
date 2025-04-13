import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";
import { useAdminStore } from "@/store/use-admin-store";
import { toast } from "sonner";

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();
  const { brands, setBrands } = useAdminStore();

  return useMutation({
    mutationFn: (id: string) => adminApi.deleteBrand(id),
    onSuccess: (response, id) => {
      // Cập nhật danh sách thương hiệu trong store
      if (brands) {
        setBrands(brands.filter(brand => brand.id !== id));
      }
      
      // Invalidate queries để refresh dữ liệu
      queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      
      toast.success("Xóa thương hiệu thành công!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Xóa thương hiệu thất bại, vui lòng thử lại.");
    }
  });
}; 