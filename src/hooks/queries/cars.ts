import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/api/axios-instance";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export interface Brand {
  id: string;
  name: string;
  country: string;
  banner_url: string;
  created_at: string;
  updated_at: string;
}

export interface Car {
  id: string;
  model: string;
  year: string;
  brand_id: string;
  color: string;
  price: string;
  image_url: string;
  stock: number;
  fuel_type: "electric" | "gas";
  availability: "in_stock" | "out_of_stock";
  created_at: string;
  updated_at: string;
  brand: Brand;
  description?: string;
}

interface CarResponse {
  status: string;
  message: string;
  data: {
    car: Car;
  };
}

interface CarsResponse {
  status: string;
  message: string;
  data: {
    cars: Car[];
    total: number;
    current_page: number;
    per_page: number;
    last_page: number;
  };
}

// Hook để lấy danh sách xe
export const useCars = (page = 1) => {
  return useQuery({
    queryKey: ["cars", page],
    queryFn: async () => {
      const response = await axiosInstance.get<CarsResponse>(
        `${API_ENDPOINTS.CARS.BASE}?page=${page}`
      );
      return response.data.data;
    },
  });
};

// Hook để lấy chi tiết xe theo ID
export const useCarDetail = (id: string) => {
  return useQuery({
    queryKey: ["car", id],
    queryFn: async () => {
      const response = await axiosInstance.get<CarResponse>(
        API_ENDPOINTS.CARS.DETAIL(id)
      );
      return response.data.data.car;
    },
    enabled: !!id,
  });
};

// Hook để lấy xe mới nhất
export const useNewestCar = () => {
  return useQuery({
    queryKey: ["newest-car"],
    queryFn: async () => {
      const response = await axiosInstance.get<CarResponse>(
        API_ENDPOINTS.CARS.NEWEST
      );
      return response.data.data.car;
    },
  });
}; 