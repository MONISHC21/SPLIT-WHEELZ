export interface User {
  id: string
  firebaseUid: string
  email: string
  name: string
  avatar?: string
  phone?: string
  role: 'USER' | 'ADMIN' | 'MODERATOR'
  isKycVerified: boolean
  kycVerified?: boolean
  isEmailVerified: boolean
  ownershipScore: number
  trustScore: number
  loyaltyPoints?: number
  createdAt: string
}

export interface Vehicle {
  id: string
  title: string
  brand: string
  model: string
  make: string
  year: number
  type: 'SEDAN' | 'SUV' | 'HATCHBACK' | 'LUXURY' | 'SPORTS' | 'VAN' | 'ELECTRIC'
  fuelType: 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID' | 'CNG'
  transmission?: 'MANUAL' | 'AUTOMATIC'
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
  averageRating?: number
  totalReviews: number
  mileage?: number
  seatingCapacity?: number
  engineCC?: number
  description?: string
  reviews?: VehicleReview[]
  status: 'AVAILABLE' | 'FULLY_BOOKED' | 'MAINTENANCE' | 'INACTIVE'
  isFeatured?: boolean
  isVerified?: boolean
  location: string
  city: string
  ownership?: OwnershipShare[]
  createdAt: string
}

export interface VehicleReview {
  id: string
  rating: number
  comment?: string
  createdAt: string
  user?: { name: string; avatar?: string }
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
  vehicle?: Vehicle
}

export interface Booking {
  id: string
  userId: string
  vehicleId: string
  startTime: string
  endTime: string
  totalHours: number
  totalCost: number
  finalAmount?: number
  durationHours?: number
  purpose?: string
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
  booking?: { vehicle?: Vehicle }
  createdAt: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  body?: string
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'PAYMENT' | 'BOOKING' | 'MAINTENANCE'
  isRead: boolean
  actionUrl?: string
  createdAt: string
}

export interface ChatMessage {
  id: string
  userId?: string
  senderId: string
  receiverId?: string
  content?: string
  message?: string
  vehicleId?: string
  createdAt: string
  sender?: User
  user?: User
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
  upcomingBookings: number | Booking[]
  monthlyExpense: number
  ownershipScore: number
  activeOwnerships?: OwnershipShare[] | number
  monthlyStats?: { month: string; bookings: number; hours: number; expense: number; amountSpent?: number; hoursUsed?: number }[]
  unreadNotifications?: number
  recentPayments?: Payment[]
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
