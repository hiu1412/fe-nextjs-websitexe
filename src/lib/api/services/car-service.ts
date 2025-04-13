import { API_ENDPOINTS } from "../endpoints";
import { ApiResponse, Car, Category, Brand } from "../types";
import axiosInstance from "../axios-instance";

export interface PaginatedResponse<T> {
  status: string;
  message: string;
  data: {
    cars: T[];
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
    first_page_url: string;
  };
}

export const carService = {
  // Car APIs
  getAllCars: async (page: number = 1): Promise<PaginatedResponse<Car>> => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.CARS.BASE}?page=${page}`);
    return response.data;
  },

  getCarById: async (id: string): Promise<ApiResponse<Car>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.CARS.DETAIL(id));
    return response.data;
  },

  getNewestCars: async (): Promise<ApiResponse<Car[]>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.CARS.NEWEST);
    return response.data;
  },

  getCarsByCategory: async (categoryId: string): Promise<ApiResponse<Car[]>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.CARS.BY_CATEGORY(categoryId));
    return response.data;
  },

  createCar: async (data: Omit<Car, "id" | "created_at" | "updated_at">): Promise<ApiResponse<Car>> => {
    const response = await axiosInstance.post(API_ENDPOINTS.CARS.CREATE, data);
    return response.data;
  },

  updateCar: async (id: string, data: Partial<Car>): Promise<ApiResponse<Car>> => {
    const response = await axiosInstance.post(API_ENDPOINTS.CARS.UPDATE(id), data);
    return response.data;
  },

  deleteCar: async (id: string): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.delete(API_ENDPOINTS.CARS.DELETE(id));
    return response.data;
  },

  // Brand APIs
  getAllBrands: async (): Promise<ApiResponse<Brand[]>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.BRANDS.BASE);
    return response.data;
  },

  getBrandById: async (id: string): Promise<ApiResponse<Brand>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.BRANDS.DETAIL(id));
    return response.data;
  },

  createBrand: async (data: Omit<Brand, "id" | "created_at" | "updated_at">): Promise<ApiResponse<Brand>> => {
    const response = await axiosInstance.post(API_ENDPOINTS.BRANDS.CREATE, data);
    return response.data;
  },

  updateBrand: async (id: string, data: Partial<Brand>): Promise<ApiResponse<Brand>> => {
    const response = await axiosInstance.post(API_ENDPOINTS.BRANDS.UPDATE(id), data);
    return response.data;
  },

  deleteBrand: async (id: string): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.delete(API_ENDPOINTS.BRANDS.DELETE(id));
    return response.data;
  },
};

export default carService;