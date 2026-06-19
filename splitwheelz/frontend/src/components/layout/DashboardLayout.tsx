import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Car, Calendar, CreditCard, Users,
  Bell, Settings, HelpCircle, ChevronRight, Menu,
  LogOut, ShieldCheck, TrendingUp
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { getInitials } from '@/lib/utils'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/marketplace', label: 'Marketplace', icon: Car },
  { to: '/bookings', label: 'Bookings', icon: Calendar },
  { to: '/payments', label: 'Payments', icon: CreditCard },
  { to: '/co-owners', label: 'Co-Owners', icon: Users },
  { to: '/notifications', label: 'Notifications', icon: Bell },
]

const bottomItems = [
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/help', label: 'Help Center', icon: HelpCircle },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700/50">
        <Link to="/" className="flex items-center gap-2">
          <Car className="w-7 h-7 text-blue-400" />
          <span className="font-display font-bold text-white text-xl">SplitWheelz</span>
        </Link>
      </div>

      {/* User info */}
      <div className="p-4 m-3 bg-slate-700/30 rounded-2xl">
        <div className="flex items-center gap-3">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {getInitials(user?.name || 'U')}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-white text-sm truncate">{user?.name}</div>
            <div className="text-slate-400 text-xs truncate">{user?.email}</div>
          </div>
          {user?.isKycVerified && <ShieldCheck className="w-4 h-4 text-green-400 flex-shrink-0" />}
        </div>
        {user && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="bg-slate-600/30 rounded-lg p-2 text-center">
              <div className="text-blue-400 font-bold text-sm">{user.ownershipScore}</div>
              <div className="text-slate-500 text-xs">Score</div>
            </div>
            <div className="bg-slate-600/30 rounded-lg p-2 text-center">
              <div className="text-green-400 font-bold text-sm">{user.trustScore}%</div>
              <div className="text-slate-500 text-xs">Trust</div>
            </div>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto mt-2">
        {navItems.map((item) => {
          const active = location.pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                active
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/40'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium text-sm">{item.label}</span>
              {active && <ChevronRight className="w-4 h-4 ml-auto" />}
            </Link>
          )
        })}

        {user?.role === 'ADMIN' && (
          <Link
            to="/admin"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              location.pathname === '/admin'
                ? 'bg-purple-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/40'
            }`}
          >
            <TrendingUp className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-sm">Admin</span>
          </Link>
        )}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-4 mt-2 border-t border-slate-700/50 pt-3 space-y-1">
        {bottomItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/40 transition-all duration-200"
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{item.label}</span>
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  )

  const pageTitle = location.pathname
    .replace('/dashboard', 'Dashboard')
    .replace('/bookings', 'Bookings')
    .replace('/payments', 'Payments')
    .replace('/co-owners', 'Co-Owners')
    .replace('/notifications', 'Notifications')
    .replace('/settings', 'Settings')
    .replace('/admin', 'Admin')
    .replace('/marketplace', 'Marketplace')
    .replace('/', '')

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 bg-[#0F172A] flex-col flex-shrink-0 rounded-r-3xl shadow-xl overflow-hidden">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-[#0F172A] z-50 overflow-hidden rounded-r-3xl"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-slate-600 hover:text-blue-600 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="font-display font-bold text-slate-900 text-lg capitalize">
                {pageTitle || 'Dashboard'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/notifications"
              className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors relative"
            >
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                3
              </span>
            </Link>
            <Link to="/settings" className="w-10 h-10 rounded-xl overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  {getInitials(user?.name || 'U')}
                </div>
              )}
            </Link>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
