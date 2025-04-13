import { create } from 'zustand';
import type { Brand, Car, Order, User } from '@/lib/api/types';

interface AdminState {
  // Cars
  cars: Car[];
  totalCars: number;
  selectedCar: Car | null;
  setCars: (cars: Car[], total: number) => void;
  setSelectedCar: (car: Car | null) => void;

  // Brands
  brands: Brand[];
  totalBrands: number;
  selectedBrand: Brand | null;
  setBrands: (brands: Brand[], total: number) => void;
  setSelectedBrand: (brand: Brand | null) => void;

  // Orders
  orders: Order[];
  totalOrders: number;
  selectedOrder: Order | null;
  setOrders: (orders: Order[], total: number) => void;
  setSelectedOrder: (order: Order | null) => void;

  // Users
  users: User[];
  totalUsers: number;
  selectedUser: User | null;
  setUsers: (users: User[], total: number) => void;
  setSelectedUser: (user: User | null) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  // Cars
  cars: [],
  totalCars: 0,
  selectedCar: null,
  setCars: (cars, total) => set({ cars, totalCars: total }),
  setSelectedCar: (car) => set({ selectedCar: car }),

  // Brands
  brands: [],
  totalBrands: 0,
  selectedBrand: null,
  setBrands: (brands, total) => set({ brands, totalBrands: total }),
  setSelectedBrand: (brand) => set({ selectedBrand: brand }),

  // Orders
  orders: [],
  totalOrders: 0,
  selectedOrder: null,
  setOrders: (orders, total) => set({ orders, totalOrders: total }),
  setSelectedOrder: (order) => set({ selectedOrder: order }),

  // Users
  users: [],
  totalUsers: 0,
  selectedUser: null,
  setUsers: (users, total) => set({ users, totalUsers: total }),
  setSelectedUser: (user) => set({ selectedUser: user }),
})); 