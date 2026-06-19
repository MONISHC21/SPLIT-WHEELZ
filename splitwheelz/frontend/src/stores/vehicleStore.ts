import { create } from 'zustand'

export interface VehicleFilters {
  type: string
  fuelType: string
  minPrice: number
  maxPrice: number
  location: string
  search: string
  availableSlots: number
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

interface VehicleState {
  filters: VehicleFilters
  currentPage: number
  viewMode: 'grid' | 'list'
  setFilters: (filters: Partial<VehicleFilters>) => void
  resetFilters: () => void
  setPage: (page: number) => void
  setViewMode: (mode: 'grid' | 'list') => void
}

const defaultFilters: VehicleFilters = {
  type: '',
  fuelType: '',
  minPrice: 0,
  maxPrice: 200000,
  location: '',
  search: '',
  availableSlots: 0,
  sortBy: 'createdAt',
  sortOrder: 'desc',
}

export const useVehicleStore = create<VehicleState>((set) => ({
  filters: defaultFilters,
  currentPage: 1,
  viewMode: 'grid',

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      currentPage: 1,
    })),

  resetFilters: () =>
    set({ filters: defaultFilters, currentPage: 1 }),

  setPage: (page) => set({ currentPage: page }),

  setViewMode: (mode) => set({ viewMode: mode }),
}))
