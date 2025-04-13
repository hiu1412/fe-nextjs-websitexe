import { useQuery } from '@tanstack/react-query';
import { carService } from '@/lib/api/services/car-service';

export const BRANDS_QUERY_KEY = ['brands'] as const;

export const useBrands = () => {
  return useQuery({
    queryKey: BRANDS_QUERY_KEY,
    queryFn: () => carService.getAllBrands(),
  });
}; 