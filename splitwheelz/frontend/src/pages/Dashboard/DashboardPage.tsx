import { motion } from 'framer-motion'
import {
  Car, Calendar, CreditCard, TrendingUp, ArrowRight,
  CheckCircle2, Clock, AlertCircle, Bell, Zap,
  Shield, Star
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { formatCurrency, formatDate } from '@/lib/utils'

const usageData = [
  { month: 'Jan', hours: 18 },
  { month: 'Feb', hours: 22 },
  { month: 'Mar', hours: 15 },
  { month: 'Apr', hours: 28 },
  { month: 'May', hours: 32 },
  { month: 'Jun', hours: 24 },
  { month: 'Jul', hours: 35 },
]

const recentBookings = [
  { id: '1', vehicle: 'Hyundai Creta', date: '2026-06-20T10:00:00', duration: '4 hrs', status: 'CONFIRMED', amount: 1200 },
  { id: '2', vehicle: 'Toyota Camry', date: '2026-06-18T14:00:00', duration: '2 hrs', status: 'COMPLETED', amount: 1800 },
  { id: '3', vehicle: 'Hyundai Creta', date: '2026-06-15T08:00:00', duration: '6 hrs', status: 'COMPLETED', amount: 1800 },
  { id: '4', vehicle: 'BMW 5 Series', date: '2026-06-10T16:00:00', duration: '3 hrs', status: 'CANCELLED', amount: 4500 },
]

const emiCards = [
  { vehicle: 'Hyundai Creta', amount: 12500, dueDate: '2026-07-01', status: 'UPCOMING', color: 'blue' },
  { vehicle: 'Toyota Camry', amount: 37500, dueDate: '2026-07-05', status: 'UPCOMING', color: 'teal' },
]

const quickActions = [
  { label: 'Browse Vehicles', icon: Car, to: '/marketplace', color: 'bg-blue-600', desc: 'Find new cars' },
  { label: 'Book a Slot', icon: Calendar, to: '/bookings', color: 'bg-green-600', desc: 'Schedule a drive' },
  { label: 'Make Payment', icon: CreditCard, to: '/payments', color: 'bg-purple-600', desc: 'Pay EMI / dues' },
  { label: 'Co-Owners', icon: Shield, to: '/co-owners', color: 'bg-amber-600', desc: 'Chat & vote' },
]

const statusColors: Record<string, string> = {
  CONFIRMED: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
}

const StatusIcon = ({ status }: { status: string }) => {
  if (status === 'COMPLETED') return <CheckCircle2 className="w-4 h-4 text-green-600" />
  if (status === 'CONFIRMED') return <Clock className="w-4 h-4 text-blue-600" />
  if (status === 'CANCELLED') return <AlertCircle className="w-4 h-4 text-red-600" />
  return <Clock className="w-4 h-4 text-yellow-600" />
}

export default function DashboardPage() {
  const { user } = useAuthStore()

  const statCards = [
    {
      title: 'My Vehicles',
      value: '2',
      change: '+1 this month',
      icon: Car,
      color: 'bg-blue-600',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Upcoming Bookings',
      value: '3',
      change: 'Next: Jun 20',
      icon: Calendar,
      color: 'bg-green-600',
      lightColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Monthly Expense',
      value: formatCurrency(50000),
      change: '₹2,500 vs last month',
      icon: CreditCard,
      color: 'bg-purple-600',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Ownership Score',
      value: user?.ownershipScore?.toString() ?? '820',
      change: '+15 this week',
      icon: Star,
      color: 'bg-amber-600',
      lightColor: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-[#0F172A] via-[#1e3a8a] to-blue-600 rounded-3xl p-6 md:p-8 text-white"
      >
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-blue-200 text-sm font-medium mb-1">Good morning 👋</p>
              <h2 className="font-display font-bold text-2xl md:text-3xl">
                Welcome back, {user?.name?.split(' ')[0] ?? 'User'}!
              </h2>
              <p className="text-blue-100 mt-1 text-sm">
                You have <span className="font-bold text-white">3 upcoming bookings</span> this week.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/bookings"
                className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-all text-sm"
              >
                <Calendar className="w-4 h-4" />
                Book a Drive
              </Link>
            </div>
          </div>

          {/* KYC Alert */}
          {!user?.isKycVerified && (
            <div className="mt-4 flex items-center gap-3 bg-yellow-500/20 border border-yellow-400/30 rounded-xl p-3">
              <AlertCircle className="w-5 h-5 text-yellow-300 flex-shrink-0" />
              <p className="text-yellow-100 text-sm">
                Complete KYC verification to unlock all features.{' '}
                <Link to="/settings" className="underline font-medium">Verify now →</Link>
              </p>
            </div>
          )}
        </div>

        {/* Decorative background elements */}
        <div className="absolute right-0 top-0 w-64 h-full opacity-10">
          <Car className="w-full h-full" />
        </div>
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full" />
        <div className="absolute -right-20 -top-10 w-64 h-64 bg-blue-400/10 rounded-full" />
      </motion.div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${card.lightColor} rounded-xl flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.textColor}`} />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="font-display font-bold text-2xl text-slate-900">{card.value}</div>
            <div className="text-slate-500 text-xs mt-1">{card.title}</div>
            <div className="text-green-600 text-xs mt-1 font-medium">{card.change}</div>
          </motion.div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Usage chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-slate-900">Usage Hours</h3>
              <p className="text-slate-500 text-sm">Monthly driving hours across all vehicles</p>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-lg">
              <Zap className="w-3 h-3" />
              +18% vs last month
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={usageData}>
              <defs>
                <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#0F172A', border: 'none', borderRadius: 12, color: '#fff' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Area
                type="monotone"
                dataKey="hours"
                stroke="#2563EB"
                strokeWidth={2.5}
                fill="url(#hoursGrad)"
                dot={{ fill: '#2563EB', strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: '#2563EB' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="font-display font-bold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className="bg-gray-50 hover:bg-gray-100 rounded-xl p-4 text-center transition-all group hover:-translate-y-0.5"
              >
                <div className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <div className="font-semibold text-slate-900 text-xs">{action.label}</div>
                <div className="text-slate-400 text-xs mt-0.5">{action.desc}</div>
              </Link>
            ))}
          </div>

          {/* Notification preview */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-slate-900 text-sm">Notifications</span>
              <Link to="/notifications" className="text-blue-600 text-xs font-medium">View all</Link>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2 bg-blue-50 rounded-lg p-2">
                <Bell className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-700">EMI of ₹12,500 due in 3 days for Creta</p>
              </div>
              <div className="flex items-start gap-2 bg-green-50 rounded-lg p-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-700">Booking confirmed for Jun 20 — Creta</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold text-slate-900">Recent Bookings</h3>
            <Link to="/bookings" className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-700">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide border-b border-gray-100">
                  <th className="pb-3">Vehicle</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Duration</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 font-medium text-slate-900 text-sm">{b.vehicle}</td>
                    <td className="py-3 text-slate-500 text-sm">{formatDate(b.date)}</td>
                    <td className="py-3 text-slate-500 text-sm">{b.duration}</td>
                    <td className="py-3 text-slate-700 font-semibold text-sm">{formatCurrency(b.amount)}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5">
                        <StatusIcon status={b.status} />
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[b.status]}`}>
                          {b.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* EMI Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold text-slate-900">EMI Payments</h3>
            <Link to="/payments" className="text-blue-600 text-sm font-medium hover:text-blue-700">Details</Link>
          </div>
          <div className="space-y-3">
            {emiCards.map((card) => (
              <div
                key={card.vehicle}
                className={`rounded-2xl p-4 ${
                  card.color === 'blue' ? 'bg-blue-50 border border-blue-100' : 'bg-teal-50 border border-teal-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-semibold ${card.color === 'blue' ? 'text-blue-900' : 'text-teal-900'}`}>
                    {card.vehicle}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    card.color === 'blue' ? 'bg-blue-200 text-blue-800' : 'bg-teal-200 text-teal-800'
                  }`}>
                    UPCOMING
                  </span>
                </div>
                <div className={`font-display font-bold text-xl ${card.color === 'blue' ? 'text-blue-700' : 'text-teal-700'}`}>
                  {formatCurrency(card.amount)}
                </div>
                <div className={`text-xs mt-1 ${card.color === 'blue' ? 'text-blue-600' : 'text-teal-600'}`}>
                  Due: {formatDate(card.dueDate)}
                </div>
                <button
                  className={`mt-3 w-full text-sm font-semibold py-2 rounded-xl transition-all ${
                    card.color === 'blue'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-teal-600 hover:bg-teal-700 text-white'
                  }`}
                >
                  Pay Now
                </button>
              </div>
            ))}
          </div>

          {/* Payment Summary */}
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Paid this month</span>
              <span className="font-semibold text-green-600">{formatCurrency(50000)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Pending</span>
              <span className="font-semibold text-amber-600">{formatCurrency(50000)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Overdue</span>
              <span className="font-semibold text-red-600">{formatCurrency(0)}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
