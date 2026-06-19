import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  register: (data: { firebaseToken: string; fcmToken?: string }) => api.post('/auth/register', data),
  login: (data: { firebaseToken: string; fcmToken?: string }) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: Partial<{ name: string; phone: string; bio: string }>) => api.patch('/auth/profile', data),
  logout: () => api.post('/auth/logout'),
}

export const vehicleAPI = {
  getAll: (params?: Record<string, unknown>) => api.get('/vehicles', { params }),
  getById: (id: string) => api.get(`/vehicles/${id}`),
  getOwners: (id: string) => api.get(`/vehicles/${id}/owners`),
  search: (query: string) => api.get('/vehicles/search', { params: { q: query } }),
  wishlist: () => api.get('/vehicles/wishlist'),
  toggleWishlist: (id: string) => api.post(`/vehicles/${id}/wishlist`),
}

export const bookingAPI = {
  getAll: (params?: Record<string, unknown>) => api.get('/bookings', { params }),
  getById: (id: string) => api.get(`/bookings/${id}`),
  create: (data: { vehicleId: string; startTime: string; endTime: string }) => api.post('/bookings', data),
  cancel: (id: string, reason?: string) => api.delete(`/bookings/${id}`, { data: { reason } }),
  getAvailability: (vehicleId: string, date: string) =>
    api.get(`/bookings/availability/${vehicleId}`, { params: { date } }),
  getQR: (id: string) => api.get(`/bookings/${id}/qr`),
}

export const paymentAPI = {
  getAll: (params?: Record<string, unknown>) => api.get('/payments', { params }),
  createOrder: (data: {
    amount: number
    type: string
    description: string
    vehicleId?: string
    bookingId?: string
  }) => api.post('/payments/create-order', data),
  verify: (data: {
    razorpayOrderId: string
    razorpayPaymentId: string
    razorpaySignature: string
  }) => api.post('/payments/verify', data),
  getReceipt: (id: string) => api.get(`/payments/${id}/receipt`),
}

export const ownershipAPI = {
  getMyShares: () => api.get('/ownership/my-shares'),
  joinVehicle: (vehicleId: string, slotNumber: number) =>
    api.post('/ownership/join', { vehicleId, slotNumber }),
  getCoOwners: (vehicleId: string) => api.get(`/ownership/co-owners/${vehicleId}`),
  vote: (voteId: string, choice: 'YES' | 'NO') => api.post(`/ownership/vote/${voteId}`, { choice }),
  sellShare: (shareId: string, price: number) => api.post(`/ownership/sell/${shareId}`, { price }),
  transferShare: (shareId: string, toUserId: string) =>
    api.post(`/ownership/transfer/${shareId}`, { toUserId }),
}

export const notificationAPI = {
  getAll: (params?: Record<string, unknown>) => api.get('/notifications', { params }),
  markRead: (id: string) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
  delete: (id: string) => api.delete(`/notifications/${id}`),
}

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params?: Record<string, unknown>) => api.get('/admin/users', { params }),
  updateUser: (id: string, data: Record<string, unknown>) => api.patch(`/admin/users/${id}`, data),
  banUser: (id: string) => api.post(`/admin/users/${id}/ban`),
  getVehicles: (params?: Record<string, unknown>) => api.get('/admin/vehicles', { params }),
  verifyVehicle: (id: string) => api.post(`/admin/vehicles/${id}/verify`),
  getDisputes: (params?: Record<string, unknown>) => api.get('/admin/disputes', { params }),
  resolveDispute: (id: string, resolution: string) =>
    api.post(`/admin/disputes/${id}/resolve`, { resolution }),
  getRevenueReport: () => api.get('/admin/reports/revenue'),
}

export default api
