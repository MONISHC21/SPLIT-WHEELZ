export interface User {
  id: string
  firebaseUid: string
  email: string
  name: string
  avatar?: string
  phone?: string
  role: 'USER' | 'ADMIN' | 'MODERATOR'
  isKycVerified: boolean
  isEmailVerified: boolean
  ownershipScore: number
  trustScore: number
  createdAt: string
}

export interface Vehicle {
  id: string
  title: string
  brand: string
  model: string
  year: number
  type: 'SEDAN' | 'SUV' | 'HATCHBACK' | 'LUXURY' | 'SPORTS' | 'VAN' | 'ELECTRIC'
  fuelType: 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID' | 'CNG'
  color: string
  registrationNumber: string
  totalPrice: number
  monthlyEMI: number
  insuranceCost: number
  maintenanceCost: number
  totalSlots: number
  availableSlots: number
  pricePerSlot: number
  images: string[]
  features: string[]
  specs: Record<string, string>
  rating: number
  totalReviews: number
  status: 'AVAILABLE' | 'FULLY_BOOKED' | 'MAINTENANCE' | 'INACTIVE'
  location: string
  city: string
  ownership?: OwnershipShare[]
  createdAt: string
}

export interface OwnershipShare {
  id: string
  userId: string
  vehicleId: string
  percentage: number
  slotNumber: number
  monthlyEMI: number
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'TRANSFERRED' | 'SOLD'
  joinedAt: string
  user?: User
}

export interface Booking {
  id: string
  userId: string
  vehicleId: string
  startTime: string
  endTime: string
  totalHours: number
  totalCost: number
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW'
  qrCode?: string
  vehicle?: Vehicle
  user?: User
  createdAt: string
}

export interface Payment {
  id: string
  userId: string
  amount: number
  currency: string
  type: 'SLOT_PURCHASE' | 'BOOKING_PAYMENT' | 'MAINTENANCE_CONTRIBUTION' | 'INSURANCE_PAYMENT' | 'EMI_PAYMENT' | 'REFUND'
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
  razorpayOrderId?: string
  razorpayPaymentId?: string
  description: string
  metadata?: Record<string, unknown>
  createdAt: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'PAYMENT' | 'BOOKING' | 'MAINTENANCE'
  isRead: boolean
  actionUrl?: string
  createdAt: string
}

export interface Dispute {
  id: string
  raisedById: string
  vehicleId: string
  type: 'BOOKING_CONFLICT' | 'DAMAGE_REPORT' | 'PAYMENT_DISPUTE' | 'MAINTENANCE_DISAGREEMENT' | 'GENERAL'
  title: string
  description: string
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED' | 'ESCALATED'
  resolution?: string
  createdAt: string
}

export interface CoOwner {
  id: string
  name: string
  avatar?: string
  email: string
  ownershipPercentage: number
  trustScore: number
  ownershipScore: number
  totalBookings: number
  joinedAt: string
  status: 'ACTIVE' | 'SUSPENDED'
}

export interface DashboardStats {
  totalVehicles: number
  upcomingBookings: number
  monthlyExpense: number
  ownershipScore: number
  recentBookings: Booking[]
  paymentStatus: { paid: number; pending: number; overdue: number }
  usageStats: { month: string; hours: number }[]
}

export interface AdminStats {
  totalUsers: number
  totalVehicles: number
  monthlyRevenue: number
  pendingVerifications: number
  activeBookings: number
  openDisputes: number
  revenueData: { month: string; revenue: number }[]
  userGrowth: { month: string; users: number }[]
  vehicleDistribution: { type: string; count: number }[]
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}
