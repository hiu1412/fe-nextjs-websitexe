import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
import { useAdminStore } from '@/store/use-admin-store';
import { toast } from 'sonner';
import type { Car } from '@/lib/api/types';

interface UpdateCarInput {
  id: string;
  model?: string;
  year?: number;
  color?: string;
  brand_id?: string;
  price?: number;
  stock?: number;
  fuel_type?: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  image?: File;
  availability?: 'in_stock' | 'out_of_stock' | 'pre_order';
}

export const useUpdateCar = () => {
  const queryClient = useQueryClient();
  const { cars, setCars } = useAdminStore();

  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateCarInput) => {
      // Create FormData object
      const formData = new FormData();
      
      // Chỉ append các field được cập nhật
      if (input.model) formData.append('model', input.model);
      if (input.year) formData.append('year', input.year.toString());
      if (input.color) formData.append('color', input.color);
      if (input.brand_id) formData.append('brand_id', input.brand_id);
      if (input.price) formData.append('price', input.price.toString());
      if (input.stock !== undefined) formData.append('stock', input.stock.toString());
      if (input.fuel_type) formData.append('fuel_type', input.fuel_type);
      if (input.availability) formData.append('availability', input.availability);
      if (input.image) formData.append('image', input.image);

      const response = await adminApi.updateCar(id, formData);
      return response.data;
    },
    onSuccess: (data) => {
      // Update admin store
      const updatedCar = data.data.car as Car;
      setCars(
        cars.map((car) => (car.id === updatedCar.id ? updatedCar : car)),
        cars.length
      );

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['admin-cars'] });
      
      toast.success('Xe đã được cập nhật thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật xe');
    },
  });
}; 