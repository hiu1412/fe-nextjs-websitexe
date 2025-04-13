import { create } from 'zustand';
import { Car } from '@/lib/api/types';

interface CarStore {
  newestCars: Car[];
  setNewestCars: (cars: Car[]) => void;
  selectedCar: Car | null;
  setSelectedCar: (car: Car | null) => void;
}

export const useCarStore = create<CarStore>((set) => ({
  newestCars: [],
  setNewestCars: (cars) => set({ newestCars: cars }),
  selectedCar: null,
  setSelectedCar: (car) => set({ selectedCar: car }),
})); 