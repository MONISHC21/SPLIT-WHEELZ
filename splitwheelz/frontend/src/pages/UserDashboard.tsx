import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Car, Calendar, CreditCard, TrendingUp, Clock, Star,
  ArrowRight, Bell, Zap, ChevronRight, Activity,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { useAuthStore } from '@/stores/authStore'
import { userApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserAvatar } from '@/components/ui/avatar'
import { formatCurrency, formatDateTime, formatRelativeTime, getBookingStatusColor } from '@/lib/utils'
import { DashboardStats } from '@/types'

const mockChartData = [
  { month: 'Jan', spent: 22000, saved: 18000 },
  { month: 'Feb', spent: 26000, saved: 21000 },
  { month: 'Mar', spent: 19000, saved: 16000 },
  { month: 'Apr', spent: 31000, saved: 25000 },
  { month: 'May', spent: 24000, saved: 20000 },
  { month: 'Jun', spent: 28000, saved: 23000 },
]

export default function UserDashboard() {
  const { user } = useAuthStore()

  const { data: dashData, isLoading } = useQuery({
    queryKey: ['user-dashboard'],
    queryFn: async () => {
      const { data } = await userApi.getDashboard()
      return data.data as DashboardStats
    },
  })

  const greetingHour = new Date().getHours()
  const greeting =
    greetingHour < 12 ? 'Good morning' :
    greetingHour < 17 ? 'Good afternoon' : 'Good evening'

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl skeleton" />
          ))}
        </div>
        <div className="h-80 rounded-2xl skeleton" />
      </div>
    )
  }

  const stats = [
    {
      title: 'My Vehicles',
      value: dashData?.activeOwnerships?.length || 0,
      icon: Car,
      color: 'bg-blue-500',
      trend: '+1 this month',
      href: '/marketplace',
    },
    {
      title: 'Upcoming Bookings',
      value: dashData?.upcomingBookings?.length || 0,
      icon: Calendar,
      color: 'bg-violet-500',
      trend: 'Next booking soon',
      href: '/bookings',
    },
    {
      title: 'This Month',
      value: formatCurrency(dashData?.monthlyStats?.amountSpent || 0),
      icon: CreditCard,
      color: 'bg-emerald-500',
      trend: `${dashData?.monthlyStats?.bookings || 0} bookings`,
      href: '/payments',
    },
    {
      title: 'Hours Driven',
      value: `${Math.round(Number(dashData?.monthlyStats?.hoursUsed || 0))}h`,
      icon: Clock,
      color: 'bg-orange-500',
      trend: 'This month',
      href: '/bookings',
    },
  ]

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Hello header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-3xl font-bold text-navy">
            {greeting}, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            <span>{user?.loyaltyPoints || 0} loyalty points</span>
            {dashData?.unreadNotifications ? (
              <Badge variant="destructive" className="ml-2">
                {dashData.unreadNotifications} new alerts
              </Badge>
            ) : null}
          </p>
        </motion.div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link to="/notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
              {dashData?.unreadNotifications ? (
                <Badge variant="destructive" className="ml-2 text-xs">
                  {dashData.unreadNotifications}
                </Badge>
              ) : null}
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/marketplace">
              <Zap className="w-4 h-4 mr-2" />
              Find Vehicles
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={stat.href}>
              <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                  </div>
                  <p className="text-2xl font-display font-bold text-navy">{stat.value}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{stat.title}</p>
                  <p className="text-xs text-green-600 mt-1 font-medium">{stat.trend}</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Spending & Savings</CardTitle>
                <Badge variant="success" className="text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% saved
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={mockChartData}>
                  <defs>
                    <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSaved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                  <Tooltip formatter={(value: number, name: string) => [formatCurrency(value), name === 'spent' ? 'Spent' : 'Saved']} />
                  <Area type="monotone" dataKey="spent" stroke="#2563EB" strokeWidth={2} fill="url(#colorSpent)" />
                  <Area type="monotone" dataKey="saved" stroke="#22C55E" strokeWidth={2} fill="url(#colorSaved)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* My Vehicles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">My Vehicles</CardTitle>
                <Link to="/marketplace" className="text-sm text-primary-600 hover:underline flex items-center">
                  Add <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {!dashData?.activeOwnerships?.length ? (
                <div className="text-center py-8">
                  <Car className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">No vehicles yet</p>
                  <Button size="sm" className="mt-3" asChild>
                    <Link to="/marketplace">Browse Vehicles</Link>
                  </Button>
                </div>
              ) : (
                dashData.activeOwnerships.map((ownership) => (
                  <Link
                    key={ownership.id}
                    to={`/co-owners/${ownership.vehicleId}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <img
                      src={ownership.vehicle?.images?.[0] || 'https://via.placeholder.com/48x48?text=🚗'}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-navy truncate">
                        {ownership.vehicle?.make} {ownership.vehicle?.model}
                      </p>
                      <p className="text-xs text-slate-500">{ownership.vehicle?.year} · Slot {ownership.slotNumber}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary-500 transition-colors" />
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Upcoming Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Bookings</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/bookings">View all <ArrowRight className="w-4 h-4 ml-1" /></Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!dashData?.upcomingBookings?.length ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-500 text-sm mb-4">No upcoming bookings</p>
                {dashData?.activeOwnerships?.length ? (
                  <Button size="sm" asChild>
                    <Link to={`/bookings/new/${dashData.activeOwnerships[0]?.vehicleId}`}>
                      Book Now
                    </Link>
                  </Button>
                ) : null}
              </div>
            ) : (
              <div className="space-y-3">
                {dashData.upcomingBookings.map((booking) => (
                  <Link
                    key={booking.id}
                    to={`/bookings`}
                    className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all group"
                  >
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Car className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-navy text-sm">
                          {booking.vehicle?.make} {booking.vehicle?.model}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-lg font-medium ${getBookingStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-slate-500 text-sm mt-0.5">
                        {formatDateTime(booking.startTime)}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {formatRelativeTime(booking.startTime)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-navy text-sm">{formatCurrency(booking.finalAmount)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent payments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Payments</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/payments">View all <ArrowRight className="w-4 h-4 ml-1" /></Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!dashData?.recentPayments?.length ? (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No recent payments</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dashData.recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center gap-4 py-2">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                      <Activity className="w-5 h-5 text-slate-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-navy">
                        {payment.booking?.vehicle?.make} {payment.booking?.vehicle?.model}
                        {!payment.booking && payment.type.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-slate-500">{formatRelativeTime(payment.createdAt)}</p>
                    </div>
                    <span className="font-bold text-navy">{formatCurrency(payment.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
