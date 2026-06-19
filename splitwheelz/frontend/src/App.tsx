import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import LandingPage from '@/pages/Landing/LandingPage'
import LoginPage from '@/pages/Auth/LoginPage'
import SignupPage from '@/pages/Auth/SignupPage'
import DashboardPage from '@/pages/Dashboard/DashboardPage'
import MarketplacePage from '@/pages/Marketplace/MarketplacePage'
import VehicleDetailsPage from '@/pages/VehicleDetails/VehicleDetailsPage'
import BookingPage from '@/pages/Booking/BookingPage'
import PaymentsPage from '@/pages/Payments/PaymentsPage'
import CoOwnersPage from '@/pages/CoOwners/CoOwnersPage'
import NotificationsPage from '@/pages/Notifications/NotificationsPage'
import AdminDashboard from '@/pages/Admin/AdminDashboard'
import SettingsPage from '@/pages/Settings/SettingsPage'
import HelpCenterPage from '@/pages/HelpCenter/HelpCenterPage'
import ContactPage from '@/pages/Contact/ContactPage'
import PrivacyPage from '@/pages/Legal/PrivacyPage'
import TermsPage from '@/pages/Legal/TermsPage'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { AnimatePresence } from 'framer-motion'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'ADMIN') return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/help" element={<HelpCenterPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/vehicles/:id" element={<VehicleDetailsPage />} />
        {/* Protected */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><DashboardPage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><DashboardLayout><BookingPage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/bookings/new/:vehicleId" element={<ProtectedRoute><DashboardLayout><BookingPage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/payments" element={<ProtectedRoute><DashboardLayout><PaymentsPage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/co-owners" element={<ProtectedRoute><DashboardLayout><CoOwnersPage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><DashboardLayout><NotificationsPage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><DashboardLayout><SettingsPage /></DashboardLayout></ProtectedRoute>} />
        {/* Admin */}
        <Route path="/admin" element={<AdminRoute><DashboardLayout><AdminDashboard /></DashboardLayout></AdminRoute>} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}
