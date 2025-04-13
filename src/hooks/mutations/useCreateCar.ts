import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
import { useAdminStore } from '@/store/use-admin-store';
import { toast } from 'sonner';
import type { Car } from '@/lib/api/types';

interface CreateCarInput {
  model: string;
  year: number;
  color: string;
  brand_id: string;
  price: number;
  stock: number;
  fuel_type: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  image: File;
  availability?: 'in_stock' | 'out_of_stock' | 'pre_order';
}

export const useCreateCar = () => {
  const queryClient = useQueryClient();
  const { cars, totalCars, setCars } = useAdminStore();

  return useMutation({
    mutationFn: async (input: CreateCarInput) => {
      // Create FormData object
      const formData = new FormData();
      formData.append('model', input.model);
      formData.append('year', input.year.toString());
      formData.append('color', input.color);
      formData.append('brand_id', input.brand_id);
      formData.append('price', input.price.toString());
      formData.append('stock', input.stock.toString());
      formData.append('fuel_type', input.fuel_type);
      formData.append('image', input.image);
      if (input.availability) {
        formData.append('availability', input.availability);
      }

      const response = await adminApi.createCar(formData);
      return response.data;
    },
    onSuccess: (data) => {
      // Update admin store
      const newCar = data.data.car as Car;
      setCars([newCar, ...cars], totalCars + 1);

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['admin-cars'] });
      
      toast.success('Xe đã được thêm thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm xe mới');
    },
  });
}; 