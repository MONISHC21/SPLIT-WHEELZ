import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users, Car, TrendingUp, AlertCircle, CheckCircle2,
  ShieldCheck, XCircle, Eye, Ban, Search, RefreshCw,
  IndianRupee
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

const revenueData = [
  { month: 'Jan', revenue: 4200000 },
  { month: 'Feb', revenue: 3800000 },
  { month: 'Mar', revenue: 5100000 },
  { month: 'Apr', revenue: 4700000 },
  { month: 'May', revenue: 5900000 },
  { month: 'Jun', revenue: 6200000 },
]

const userGrowth = [
  { month: 'Jan', users: 180 },
  { month: 'Feb', users: 320 },
  { month: 'Mar', users: 490 },
  { month: 'Apr', users: 750 },
  { month: 'May', users: 1100 },
  { month: 'Jun', users: 1650 },
]

const vehicleDistribution = [
  { type: 'SUV', count: 142, color: '#2563EB' },
  { type: 'Sedan', count: 98, color: '#22C55E' },
  { type: 'Luxury', count: 67, color: '#A855F7' },
  { type: 'Electric', count: 55, color: '#38BDF8' },
  { type: 'Others', count: 88, color: '#94a3b8' },
]

const recentUsers = [
  { id: '1', name: 'Ananya Singh', email: 'ananya@example.com', role: 'USER', kyc: true, joined: '2026-06-18', vehicles: 2, status: 'ACTIVE' },
  { id: '2', name: 'Vikram Reddy', email: 'vikram@example.com', role: 'USER', kyc: false, joined: '2026-06-17', vehicles: 0, status: 'PENDING' },
  { id: '3', name: 'Sunita Joshi', email: 'sunita@example.com', role: 'USER', kyc: true, joined: '2026-06-16', vehicles: 1, status: 'ACTIVE' },
  { id: '4', name: 'Mohammed Ali', email: 'mali@example.com', role: 'MODERATOR', kyc: true, joined: '2026-06-15', vehicles: 3, status: 'ACTIVE' },
  { id: '5', name: 'Deepa Mehta', email: 'deepa@example.com', role: 'USER', kyc: false, joined: '2026-06-14', vehicles: 0, status: 'SUSPENDED' },
]

const recentVehicles = [
  { id: '1', name: 'Honda City 2024', brand: 'Honda', city: 'Mumbai', status: 'PENDING_VERIFICATION', slots: 4, price: 1200000 },
  { id: '2', name: 'Maruti Ertiga 2024', brand: 'Maruti', city: 'Bangalore', status: 'AVAILABLE', slots: 3, price: 1100000 },
  { id: '3', name: 'Kia Seltos 2024', brand: 'Kia', city: 'Pune', status: 'PENDING_VERIFICATION', slots: 4, price: 1800000 },
]

const disputes = [
  { id: '1', title: 'Booking Conflict - Creta', user: 'Rahul Sharma', type: 'BOOKING_CONFLICT', status: 'OPEN', date: '2026-06-17' },
  { id: '2', title: 'Payment Dispute', user: 'Priya Menon', type: 'PAYMENT_DISPUTE', status: 'UNDER_REVIEW', date: '2026-06-15' },
]

const statCards = [
  { title: 'Total Users', value: '2,547', change: '+12%', icon: Users, color: 'bg-blue-600', lightColor: 'bg-blue-50', textColor: 'text-blue-600' },
  { title: 'Total Vehicles', value: '450', change: '+8%', icon: Car, color: 'bg-green-600', lightColor: 'bg-green-50', textColor: 'text-green-600' },
  { title: 'Monthly Revenue', value: formatCurrency(6200000), change: '+5%', icon: IndianRupee, color: 'bg-purple-600', lightColor: 'bg-purple-50', textColor: 'text-purple-600' },
  { title: 'Open Disputes', value: '12', change: '-3%', icon: AlertCircle, color: 'bg-red-600', lightColor: 'bg-red-50', textColor: 'text-red-600' },
  { title: 'Active Bookings', value: '189', change: '+22%', icon: CheckCircle2, color: 'bg-teal-600', lightColor: 'bg-teal-50', textColor: 'text-teal-600' },
  { title: 'KYC Pending', value: '34', change: '+5', icon: ShieldCheck, color: 'bg-amber-600', lightColor: 'bg-amber-50', textColor: 'text-amber-600' },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'vehicles' | 'disputes'>('overview')
  const [userSearch, setUserSearch] = useState('')

  const filteredUsers = recentUsers.filter((u) =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl text-slate-900">Admin Dashboard</h2>
          <p className="text-slate-500 text-sm mt-0.5">Platform overview and management</p>
        </div>
        <button
          onClick={() => toast.success('Data refreshed!')}
          className="flex items-center gap-2 btn-secondary text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['overview', 'users', 'vehicles', 'disputes'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
              activeTab === tab ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-slate-600 hover:border-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {statCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 ${card.lightColor} rounded-xl flex items-center justify-center`}>
                    <card.icon className={`w-5 h-5 ${card.textColor}`} />
                  </div>
                  <span className={`text-xs font-semibold ${card.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {card.change}
                  </span>
                </div>
                <div className="font-display font-bold text-xl text-slate-900">{card.value}</div>
                <div className="text-slate-500 text-xs mt-1">{card.title}</div>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <h3 className="font-display font-bold text-slate-900 mb-4">Monthly Revenue</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 100000}L`} />
                  <Tooltip
                    contentStyle={{ background: '#0F172A', border: 'none', borderRadius: 10, color: '#fff', fontSize: 12 }}
                    formatter={(v: number) => [formatCurrency(v), 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2.5} fill="url(#revGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <h3 className="font-display font-bold text-slate-900 mb-4">User Growth</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#0F172A', border: 'none', borderRadius: 10, color: '#fff', fontSize: 12 }}
                  />
                  <Bar dataKey="users" fill="#22C55E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <h3 className="font-display font-bold text-slate-900 mb-4">Vehicle Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={vehicleDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {vehicleDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend formatter={(v) => <span style={{ fontSize: 12, color: '#64748b' }}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <h3 className="font-display font-bold text-slate-900 mb-4">Recent Disputes</h3>
              <div className="space-y-3">
                {disputes.map((d) => (
                  <div key={d.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <div className="font-medium text-sm text-slate-900">{d.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{d.user} · {d.date}</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      d.status === 'OPEN' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {d.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display font-bold text-slate-900">User Management</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  placeholder="Search users..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="input-field pl-9 text-sm py-2 w-56"
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide border-b border-gray-100">
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">KYC</th>
                  <th className="px-5 py-3">Vehicles</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm">{user.name}</div>
                          <div className="text-slate-400 text-xs">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        user.role === 'MODERATOR' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {user.kyc ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-700 text-sm font-medium">{user.vehicles}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                        user.status === 'SUSPENDED' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toast.success(`Viewing ${user.name}'s profile`)}
                          className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {!user.kyc && (
                          <button
                            onClick={() => toast.success(`KYC approved for ${user.name}`)}
                            className="w-8 h-8 rounded-lg bg-green-50 hover:bg-green-100 flex items-center justify-center text-green-600 transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </button>
                        )}
                        {user.status !== 'SUSPENDED' && (
                          <button
                            onClick={() => toast.success(`${user.name} has been suspended`)}
                            className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-600 transition-colors"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'vehicles' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-display font-bold text-slate-900">Vehicle Management</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {recentVehicles.map((v) => (
              <div key={v.id} className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Car className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900 text-sm">{v.name}</div>
                  <div className="text-slate-500 text-xs mt-0.5">
                    {v.brand} · {v.city} · {v.slots} slots · {formatCurrency(v.price)}
                  </div>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  v.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {v.status.replace('_', ' ')}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toast.success(`${v.name} verified!`)}
                    className="flex items-center gap-1.5 text-xs font-semibold bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verify
                  </button>
                  <button
                    onClick={() => toast.success('Vehicle details opened')}
                    className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'disputes' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-display font-bold text-slate-900">Dispute Resolution</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {disputes.map((d) => (
              <div key={d.id} className="p-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{d.title}</div>
                    <div className="text-slate-500 text-xs mt-0.5">
                      Raised by {d.user} · {d.type.replace('_', ' ')} · {d.date}
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    d.status === 'OPEN' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {d.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    placeholder="Resolution notes..."
                    className="input-field flex-1 text-sm py-2"
                  />
                  <button
                    onClick={() => toast.success('Dispute resolved!')}
                    className="btn-primary text-sm flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Resolve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
