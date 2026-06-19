import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { vehicleApi, bookingApi, ownershipApi } from '@/lib/api'
import { useVehicleStore } from '@/stores/vehicleStore'
import toast from 'react-hot-toast'

export function useVehicles() {
  const { filters, currentPage } = useVehicleStore()

  const params: Record<string, unknown> = {
    page: currentPage,
    limit: 12,
    ...(filters.type && { type: filters.type }),
    ...(filters.fuelType && { fuelType: filters.fuelType }),
    ...(filters.location && { location: filters.location }),
    ...(filters.search && { search: filters.search }),
    ...(filters.minPrice > 0 && { minPrice: filters.minPrice }),
    ...(filters.maxPrice < 200000 && { maxPrice: filters.maxPrice }),
    ...(filters.availableSlots > 0 && { availableSlots: filters.availableSlots }),
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  }

  return useQuery({
    queryKey: ['vehicles', params],
    queryFn: async () => {
      const { data } = await vehicleApi.getAll(params)
      return data.data
    },
  })
}

export function useVehicle(id: string) {
  return useQuery({
    queryKey: ['vehicle', id],
    queryFn: async () => {
      const { data } = await vehicleApi.getById(id)
      return data.data
    },
    enabled: !!id,
  })
}

export function useFeaturedVehicles() {
  return useQuery({
    queryKey: ['vehicles', 'featured'],
    queryFn: async () => {
      const { data } = await vehicleApi.getFeatured()
      return data.data
    },
  })
}

export function useVehicleAvailability(id: string, startDate: string, endDate: string) {
  return useQuery({
    queryKey: ['vehicle-availability', id, startDate, endDate],
    queryFn: async () => {
      const { data } = await vehicleApi.getAvailability(id, startDate, endDate)
      return data.data
    },
    enabled: !!id && !!startDate && !!endDate,
  })
}

export function useMyBookings(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['my-bookings', params],
    queryFn: async () => {
      const { data } = await bookingApi.getMy(params)
      return data.data
    },
  })
}

export function useCreateBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => bookingApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] })
      toast.success('Booking created! Complete payment to confirm.')
    },
    onError: (err: unknown) => {
      const error = err as { message?: string }
      toast.error(error?.message || 'Failed to create booking')
    },
  })
}

export function useCancelBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      bookingApi.cancel(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] })
      toast.success('Booking cancelled')
    },
    onError: (err: unknown) => {
      const error = err as { message?: string }
      toast.error(error?.message || 'Failed to cancel booking')
    },
  })
}

export function useMyOwnerships() {
  return useQuery({
    queryKey: ['my-ownerships'],
    queryFn: async () => {
      const { data } = await ownershipApi.getMy()
      return data.data
    },
  })
}

export function useOwnershipDetails(vehicleId: string) {
  return useQuery({
    queryKey: ['ownership', vehicleId],
    queryFn: async () => {
      const { data } = await ownershipApi.getDetails(vehicleId)
      return data.data
    },
    enabled: !!vehicleId,
  })
}
