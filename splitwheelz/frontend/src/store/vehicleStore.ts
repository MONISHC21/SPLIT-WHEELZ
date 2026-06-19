import { create } from 'zustand'
import type { Vehicle } from '@/types'

interface VehicleFilters {
  brand: string
  type: string
  fuelType: string
  minPrice: number
  maxPrice: number
  city: string
  search: string
  availableOnly: boolean
}

interface VehicleState {
  vehicles: Vehicle[]
  selectedVehicle: Vehicle | null
  filters: VehicleFilters
  wishlist: string[]
  setVehicles: (vehicles: Vehicle[]) => void
  setSelectedVehicle: (vehicle: Vehicle | null) => void
  setFilters: (filters: Partial<VehicleFilters>) => void
  resetFilters: () => void
  toggleWishlist: (vehicleId: string) => void
}

const defaultFilters: VehicleFilters = {
  brand: '',
  type: '',
  fuelType: '',
  minPrice: 0,
  maxPrice: 10000000,
  city: '',
  search: '',
  availableOnly: false,
}

export const useVehicleStore = create<VehicleState>((set) => ({
  vehicles: [],
  selectedVehicle: null,
  filters: defaultFilters,
  wishlist: [],
  setVehicles: (vehicles) => set({ vehicles }),
  setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  resetFilters: () => set({ filters: defaultFilters }),
  toggleWishlist: (vehicleId) =>
    set((state) => ({
      wishlist: state.wishlist.includes(vehicleId)
        ? state.wishlist.filter((id) => id !== vehicleId)
        : [...state.wishlist, vehicleId],
    })),
}))
