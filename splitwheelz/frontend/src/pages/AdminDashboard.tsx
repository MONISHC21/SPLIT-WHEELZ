import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Users, Car, CreditCard, TrendingUp, Shield, AlertTriangle,
  CheckCircle, XCircle, Eye, BarChart3,
} from 'lucide-react'
import { adminApi } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/ui/avatar'
import { formatCurrency, formatRelativeTime, getBookingStatusColor } from '@/lib/utils'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts'

const mockRevenueData = [
  { month: 'Jan', revenue: 420000, bookings: 85 },
  { month: 'Feb', revenue: 380000, bookings: 72 },
  { month: 'Mar', revenue: 550000, bookings: 110 },
  { month: 'Apr', revenue: 620000, bookings: 125 },
  { month: 'May', revenue: 480000, bookings: 95 },
  { month: 'Jun', revenue: 710000, bookings: 140 },
]

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const { data } = await adminApi.getDashboard()
      return data.data
    },
  })

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="grid grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl skeleton" />
          ))}
        </div>
      </div>
    )
  }

  const overview = data?.overview || {}

  const stats = [
    {
      title: 'Total Users',
      value: overview.totalUsers || 0,
      change: `+${overview.newUsersThisMonth || 0} this month`,
      trend: overview.userGrowth || 0,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Vehicles',
      value: overview.totalVehicles || 0,
      change: `${overview.activeVehicles || 0} active`,
      icon: Car,
      color: 'bg-violet-500',
    },
    {
      title: 'All-Time Revenue',
      value: formatCurrency(overview.totalRevenue || 0),
      change: `${formatCurrency(overview.revenueThisMonth || 0)} this month`,
      trend: overview.revenueGrowth || 0,
      icon: CreditCard,
      color: 'bg-emerald-500',
    },
    {
      title: 'Total Bookings',
      value: overview.totalBookings || 0,
      change: `+${overview.bookingsThisMonth || 0} this month`,
      trend: overview.bookingGrowth || 0,
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
    {
      title: 'Pending Disputes',
      value: overview.pendingDisputes || 0,
      change: 'Needs review',
      icon: AlertTriangle,
      color: 'bg-red-500',
    },
  ]

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-navy">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm">Platform management & analytics</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  {stat.trend !== undefined && (
                    <Badge variant={stat.trend > 0 ? 'success' : 'destructive'} className="text-xs">
                      {stat.trend > 0 ? '+' : ''}{stat.trend}%
                    </Badge>
                  )}
                </div>
                <p className="text-2xl font-display font-bold text-navy">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{stat.title}</p>
                <p className="text-xs text-green-600 font-medium mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={mockRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip formatter={(v: number) => [formatCurrency(v), 'Revenue']} />
                <Bar dataKey="revenue" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bookings Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={mockRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="bookings" stroke="#38BDF8" strokeWidth={2} dot={{ fill: '#38BDF8' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent users + bookings */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Users</CardTitle>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data?.recentUsers?.map((user: { id: string; name: string; email: string; avatar: string | null; role: string; createdAt: string }) => (
                <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <UserAvatar src={user.avatar} name={user.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-navy truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={user.role === 'ADMIN' ? 'navy' : 'secondary'} className="text-xs">
                      {user.role}
                    </Badge>
                    <span className="text-xs text-slate-400">{formatRelativeTime(user.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Bookings</CardTitle>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data?.recentBookings?.map((booking: {
                id: string
                status: string
                finalAmount: number
                createdAt: string
                user: { name: string; avatar: string | null }
                vehicle: { make: string; model: string }
              }) => (
                <div key={booking.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <UserAvatar src={booking.user.avatar} name={booking.user.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-navy truncate">{booking.user.name}</p>
                    <p className="text-xs text-slate-500">{booking.vehicle.make} {booking.vehicle.model}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-navy">{formatCurrency(booking.finalAmount)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getBookingStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
