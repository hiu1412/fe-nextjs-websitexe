import { useQuery } from '@tanstack/react-query';
import { carService } from '@/lib/api/services/car-service';

export const ALL_CARS_QUERY_KEY = ['cars', 'all'] as const;

interface UseAllCarsParams {
  page?: number;
}

export const useAllCars = ({ page = 1 }: UseAllCarsParams = {}) => {
  return useQuery({
    queryKey: [...ALL_CARS_QUERY_KEY, page],
    queryFn: () => carService.getAllCars(page),
  });
}; 