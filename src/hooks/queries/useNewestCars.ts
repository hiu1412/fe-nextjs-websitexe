import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/api/axios-instance';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { useCarStore } from '@/store/useCarStore';
import type { ApiResponse, Car } from '@/lib/api/types';

interface NewestCarsResponse {
  cars: Car[];
}

export const NEWEST_CARS_QUERY_KEY = ['cars', 'newest'] as const;

export const useNewestCars = () => {
  const setNewestCars = useCarStore((state) => state.setNewestCars);

  return useQuery({
    queryKey: NEWEST_CARS_QUERY_KEY,
    queryFn: async () => {
      try {
        console.log('Calling API:', API_ENDPOINTS.CARS.NEWEST);
        const response = await axiosInstance.get<ApiResponse<NewestCarsResponse>>(API_ENDPOINTS.CARS.NEWEST);
        
        // Log chi tiết response
        console.log('API Response:', {
          status: response.data.status,
          message: response.data.message,
          data: response.data.data
        });
        
        // Kiểm tra cấu trúc data
        const responseData = response.data.data as NewestCarsResponse | null;
        if (response.data.status === 'success' && responseData?.cars) {
          console.log('Cars extracted:', responseData.cars);
          setNewestCars(responseData.cars);
        }
        
        return response.data;
      } catch (error) {
        console.error('Error fetching newest cars:', error);
        throw error;
      }
    },
  });
}; 