import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";
import { useAdminStore } from "@/store/use-admin-store";
import { toast } from "sonner";

export const useDeleteCar = () => {
  const queryClient = useQueryClient();
  const { cars, setCars } = useAdminStore();

  return useMutation({
    mutationFn: (id: string) => adminApi.deleteCar(id),
    onSuccess: (response, id) => {
      // Cập nhật danh sách xe trong store
      if (cars) {
        setCars(cars.filter(car => car.id !== id));
      }
      
      // Invalidate queries để refresh dữ liệu
      queryClient.invalidateQueries({ queryKey: ["admin-cars"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      
      toast.success("Xóa xe thành công!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Xóa xe thất bại, vui lòng thử lại.");
    }
  });
}; 