import { axiosInstance } from './axios-instance';
import { API_ENDPOINTS } from './endpoints';
import type {
  AdminBrandsResponse,
  AdminOrdersResponse,
  AdminSingleBrandResponse,
  AdminSingleCarResponse,
  AdminSingleOrderResponse,
  ApiResponse,
  Brand,
  Car,
  Order,
  User,
} from './types';

interface AdminStats {
  totalCars: number;
  totalBrands: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  totalProducts: number;
}

interface Pagination {
  total: number;
  current_page: number;
  total_pages: number;
  limit: number;
  has_next_page: boolean;
  has_prev_page: boolean;
}

interface CarWithBrand extends Car {
  brand: Brand;
}

interface GetCarsResponse {
  cars: CarWithBrand[];
  pagination: Pagination;
}

export const adminApi = {
  // Stats
  getStats: () => axiosInstance.get<ApiResponse<AdminStats>>('/admin/stats'),

  // Cars
  getCars: async (page = 1, limit = 12) => {
    console.log('Calling getCars API with:', { page, limit });
    const response = await axiosInstance.get<ApiResponse<GetCarsResponse>>(`${API_ENDPOINTS.CARS.BASE}?page=${page}&limit=${limit}`);
    console.log('getCars API Response:', response.data);
    return response;
  },

  getCar: (id: string) =>
    axiosInstance.get<AdminSingleCarResponse>(API_ENDPOINTS.CARS.DETAIL(id)),

  createCar: (data: FormData) =>
    axiosInstance.post<AdminSingleCarResponse>(API_ENDPOINTS.CARS.CREATE, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  updateCar: (id: string, data: FormData) =>
    axiosInstance.put<AdminSingleCarResponse>(API_ENDPOINTS.CARS.UPDATE(id), data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  deleteCar: (id: string) =>
    axiosInstance.delete<AdminSingleCarResponse>(API_ENDPOINTS.CARS.DELETE(id)),

  // Brands
  getBrands: (page = 1) =>
    axiosInstance.get<AdminBrandsResponse>(`${API_ENDPOINTS.BRANDS.BASE}?page=${page}`),

  getBrand: (id: string) =>
    axiosInstance.get<AdminSingleBrandResponse>(API_ENDPOINTS.BRANDS.DETAIL(id)),

  createBrand: (data: FormData) =>
    axiosInstance.post<AdminSingleBrandResponse>(API_ENDPOINTS.BRANDS.CREATE, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  updateBrand: (id: string, data: FormData) =>
    axiosInstance.post<AdminSingleBrandResponse>(API_ENDPOINTS.BRANDS.UPDATE(id), data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  deleteBrand: (id: string) =>
    axiosInstance.delete<ApiResponse<null>>(API_ENDPOINTS.BRANDS.DELETE(id)),

  // Orders
  getOrders: (page = 1) =>
    axiosInstance.get<AdminOrdersResponse>(`${API_ENDPOINTS.ORDER.ALL}?page=${page}`),

  getOrder: (id: string) =>
    axiosInstance.get<AdminSingleOrderResponse>(API_ENDPOINTS.ORDER.DETAIL(id)),

  updateOrderStatus: (id: string, status: Order['status']) =>
    axiosInstance.patch<AdminSingleOrderResponse>(`/admin/orders/${id}/status`, {
      status,
    }),

  // Users
  getUsers: (page = 1) =>
    axiosInstance.get<ApiResponse<{ users: User[]; total: number }>>(
      `${API_ENDPOINTS.USERS.BASE}?page=${page}`
    ),

  getUser: (id: string) =>
    axiosInstance.get<ApiResponse<{ user: User }>>(API_ENDPOINTS.USERS.DETAIL(id)),

  updateUser: (id: string, data: Partial<User>) =>
    axiosInstance.put<ApiResponse<{ user: User }>>(API_ENDPOINTS.USERS.UPDATE(id), data),

  deleteUser: (id: string) =>
    axiosInstance.delete<ApiResponse<null>>(API_ENDPOINTS.USERS.DELETE(id)),
}; 