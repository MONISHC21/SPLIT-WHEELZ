import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import {
  Car, Bell, Menu, X, ChevronDown, Settings, LogOut,
  User, Shield, Sparkles,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { UserAvatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/dashboard', label: 'Dashboard', authRequired: true },
  { href: '/help', label: 'Help' },
]

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled
        ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm'
        : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className={cn(
              'font-display font-bold text-xl transition-colors',
              scrolled ? 'text-navy' : 'text-white'
            )}>
              SplitWheelz
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.authRequired && !isAuthenticated) return null
              const isActive = location.pathname === link.href
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : scrolled
                        ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <button
                  onClick={() => navigate('/notifications')}
                  className={cn(
                    'relative p-2 rounded-lg transition-all',
                    scrolled
                      ? 'text-slate-600 hover:bg-slate-100'
                      : 'text-white/80 hover:bg-white/10'
                  )}
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-all"
                  >
                    <UserAvatar src={user?.avatar} name={user?.name || 'User'} size="sm" />
                    <span className={cn(
                      'text-sm font-medium hidden sm:block transition-colors',
                      scrolled ? 'text-slate-700' : 'text-white'
                    )}>
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className={cn(
                      'w-4 h-4 transition-all',
                      scrolled ? 'text-slate-500' : 'text-white/70',
                      profileOpen && 'rotate-180'
                    )} />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden"
                        onMouseLeave={() => setProfileOpen(false)}
                      >
                        <div className="p-3 border-b border-slate-100">
                          <p className="font-semibold text-navy text-sm">{user?.name}</p>
                          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                          {user?.role === 'ADMIN' && (
                            <Badge variant="navy" className="mt-1 text-xs">
                              <Shield className="w-3 h-3 mr-1" />Admin
                            </Badge>
                          )}
                        </div>
                        <div className="p-1.5">
                          {[
                            { icon: User, label: 'Profile', href: '/profile' },
                            { icon: Settings, label: 'Settings', href: '/settings' },
                            ...(user?.role === 'ADMIN'
                              ? [{ icon: Shield, label: 'Admin Panel', href: '/admin' }]
                              : []),
                          ].map((item) => (
                            <Link
                              key={item.href}
                              to={item.href}
                              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                              onClick={() => setProfileOpen(false)}
                            >
                              <item.icon className="w-4 h-4 text-slate-400" />
                              {item.label}
                            </Link>
                          ))}
                          <button
                            onClick={() => { logout(); setProfileOpen(false) }}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50 w-full mt-1 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className={scrolled ? '' : 'text-white hover:bg-white/10 hover:text-white'}
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/signup')}
                  className="bg-white text-primary-700 hover:bg-primary-50"
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  Get Started
                </Button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className={cn(
                'md:hidden p-2 rounded-lg transition-all',
                scrolled ? 'text-slate-600 hover:bg-slate-100' : 'text-white hover:bg-white/10'
              )}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-b border-slate-200"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => {
                if (link.authRequired && !isAuthenticated) return null
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="block px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              })}
              {!isAuthenticated && (
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => navigate('/login')}>
                    Sign In
                  </Button>
                  <Button className="flex-1" onClick={() => navigate('/signup')}>
                    Get Started
                  </Button>
                </div>
              )}
              {isAuthenticated && (
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-3 px-4 py-3">
                    <UserAvatar src={user?.avatar} name={user?.name || ''} />
                    <div>
                      <p className="font-semibold text-navy text-sm">{user?.name}</p>
                      <p className="text-xs text-slate-500">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
