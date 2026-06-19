import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import toast from 'react-hot-toast'

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: attach JWT token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: handle errors + auto token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken })
          const { accessToken } = data.data
          localStorage.setItem('accessToken', accessToken)
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return apiClient(originalRequest)
        } catch {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          window.location.href = '/login'
          return Promise.reject(error)
        }
      }
    }

    const errorData = error.response?.data as { message?: string } | undefined
    const message = errorData?.message || error.message || 'Something went wrong'

    if (error.response?.status === 429) {
      toast.error('Too many requests. Please try again later.')
    } else if (error.response?.status && error.response.status >= 500) {
      toast.error('Server error. Please try again.')
    }

    return Promise.reject({ ...error, message })
  }
)

// Auth API
export const authApi = {
  login: (firebaseToken: string, fcmToken?: string) =>
    apiClient.post('/auth/login', { firebaseToken, fcmToken }),
  refresh: (refreshToken: string) =>
    apiClient.post('/auth/refresh', { refreshToken }),
  getMe: () => apiClient.get('/auth/me'),
  updateProfile: (data: Record<string, unknown>) =>
    apiClient.patch('/auth/profile', data),
  logout: (fcmToken?: string) =>
    apiClient.post('/auth/logout', { fcmToken }),
}

// Vehicle API
export const vehicleApi = {
  getAll: (params?: Record<string, unknown>) =>
    apiClient.get('/vehicles', { params }),
  getById: (id: string) => apiClient.get(`/vehicles/${id}`),
  getFeatured: () => apiClient.get('/vehicles/featured'),
  getAvailability: (id: string, startDate: string, endDate: string) =>
    apiClient.get(`/vehicles/${id}/availability`, { params: { startDate, endDate } }),
  create: (data: Record<string, unknown>) => apiClient.post('/vehicles', data),
  update: (id: string, data: Record<string, unknown>) =>
    apiClient.put(`/vehicles/${id}`, data),
  uploadImages: (id: string, formData: FormData) =>
    apiClient.post(`/vehicles/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}

// Booking API
export const bookingApi = {
  create: (data: Record<string, unknown>) => apiClient.post('/bookings', data),
  getMy: (params?: Record<string, unknown>) =>
    apiClient.get('/bookings/my', { params }),
  getById: (id: string) => apiClient.get(`/bookings/${id}`),
  cancel: (id: string, reason?: string) =>
    apiClient.patch(`/bookings/${id}/cancel`, { reason }),
  getVehicleBookings: (vehicleId: string, params?: Record<string, unknown>) =>
    apiClient.get(`/bookings/vehicle/${vehicleId}`, { params }),
}

// Payment API
export const paymentApi = {
  createOrder: (data: Record<string, unknown>) =>
    apiClient.post('/payments/create-order', data),
  verify: (data: Record<string, unknown>) =>
    apiClient.post('/payments/verify', data),
  getMy: (params?: Record<string, unknown>) =>
    apiClient.get('/payments/my', { params }),
  getStats: () => apiClient.get('/payments/stats'),
  requestRefund: (paymentId: string, reason: string) =>
    apiClient.post(`/payments/${paymentId}/refund`, { reason }),
}

// Ownership API
export const ownershipApi = {
  getMy: () => apiClient.get('/ownership/my'),
  getDetails: (vehicleId: string) =>
    apiClient.get(`/ownership/${vehicleId}`),
  purchaseSlot: (vehicleId: string) =>
    apiClient.post(`/ownership/${vehicleId}/purchase`),
  getStats: (vehicleId: string) =>
    apiClient.get(`/ownership/${vehicleId}/stats`),
  transfer: (vehicleId: string, data: Record<string, unknown>) =>
    apiClient.post(`/ownership/${vehicleId}/transfer`, data),
  getChat: (vehicleId: string, params?: Record<string, unknown>) =>
    apiClient.get(`/ownership/${vehicleId}/chat`, { params }),
  sendMessage: (vehicleId: string, message: string, attachments?: string[]) =>
    apiClient.post(`/ownership/${vehicleId}/chat`, { message, attachments }),
}

// User API
export const userApi = {
  getProfile: () => apiClient.get('/users/profile'),
  getDashboard: () => apiClient.get('/users/dashboard'),
  getActivity: () => apiClient.get('/users/activity'),
}

// Notification API
export const notificationApi = {
  getMy: (params?: Record<string, unknown>) =>
    apiClient.get('/notifications', { params }),
  markRead: (id: string) =>
    apiClient.patch(`/notifications/${id}/read`),
  delete: (id: string) =>
    apiClient.delete(`/notifications/${id}`),
}

// Dispute API
export const disputeApi = {
  create: (data: Record<string, unknown>) =>
    apiClient.post('/disputes', data),
  getMy: () => apiClient.get('/disputes/my'),
  getById: (id: string) => apiClient.get(`/disputes/${id}`),
  createVote: (data: Record<string, unknown>) =>
    apiClient.post('/disputes/votes', data),
  castVote: (voteId: string, optionIndex: number) =>
    apiClient.post(`/disputes/votes/${voteId}/cast`, { optionIndex }),
}

// Admin API
export const adminApi = {
  getDashboard: () => apiClient.get('/admin/dashboard'),
  getUsers: (params?: Record<string, unknown>) =>
    apiClient.get('/admin/users', { params }),
  banUser: (userId: string, reason?: string) =>
    apiClient.post(`/admin/users/${userId}/ban`, { reason }),
  unbanUser: (userId: string) =>
    apiClient.post(`/admin/users/${userId}/unban`),
  verifyVehicle: (vehicleId: string) =>
    apiClient.post(`/admin/vehicles/${vehicleId}/verify`),
  featureVehicle: (vehicleId: string, featured: boolean) =>
    apiClient.post(`/admin/vehicles/${vehicleId}/feature`, { featured }),
  getRevenueAnalytics: () =>
    apiClient.get('/admin/analytics/revenue'),
  resolveDispute: (disputeId: string, data: Record<string, unknown>) =>
    apiClient.post(`/admin/disputes/${disputeId}/resolve`, data),
}

export default apiClient
