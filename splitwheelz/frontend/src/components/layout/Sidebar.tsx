import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Car, LayoutDashboard, Calendar, CreditCard, Users,
  Bell, Settings, HelpCircle, Shield, ChevronLeft, ChevronRight, LogOut, Activity,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'
import { UserAvatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/marketplace', icon: Car, label: 'Marketplace' },
  { href: '/bookings', icon: Calendar, label: 'Bookings' },
  { href: '/payments', icon: CreditCard, label: 'Payments' },
  { href: '/notifications', icon: Bell, label: 'Notifications', badge: true },
  { href: '/settings', icon: Settings, label: 'Settings' },
  { href: '/help', icon: HelpCircle, label: 'Help Center' },
]

const adminNavItems = [
  { href: '/admin', icon: Shield, label: 'Admin Panel' },
  { href: '/admin/analytics', icon: Activity, label: 'Analytics' },
]

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const location = useLocation()

  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 256 : 72 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative flex-shrink-0 bg-navy border-r border-white/5 flex flex-col h-screen"
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center h-16 px-4 border-b border-white/5',
        sidebarOpen ? 'gap-3' : 'justify-center'
      )}>
        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent rounded-lg flex items-center justify-center flex-shrink-0">
          <Car className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-display font-bold text-white text-lg"
            >
              SplitWheelz
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-primary-700 transition-colors z-10"
      >
        {sidebarOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </button>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group',
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-white/60 hover:bg-white/10 hover:text-white',
                !sidebarOpen && 'justify-center px-2'
              )}
              title={!sidebarOpen ? item.label : undefined}
            >
              <item.icon className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-white' : 'text-white/60 group-hover:text-white')} />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium flex-1"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {item.badge && sidebarOpen && (
                <Badge variant="destructive" className="text-xs h-5 w-5 p-0 flex items-center justify-center rounded-full">
                  3
                </Badge>
              )}
            </Link>
          )
        })}

        {user?.role === 'ADMIN' && (
          <>
            <div className={cn('my-3 border-t border-white/10', !sidebarOpen && 'mx-2')} />
            {adminNavItems.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group',
                    isActive
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'text-amber-400/60 hover:bg-amber-500/10 hover:text-amber-400',
                    !sidebarOpen && 'justify-center px-2'
                  )}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm font-medium"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              )
            })}
          </>
        )}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-white/10">
        {sidebarOpen ? (
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-all group">
            <UserAvatar src={user?.avatar} name={user?.name || 'User'} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-white/50 truncate">{user?.email}</p>
            </div>
            <button onClick={logout} className="text-white/40 hover:text-red-400 transition-colors p-1">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={logout}
            className="w-full flex justify-center p-2 text-white/40 hover:text-red-400 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </motion.aside>
  )
}
