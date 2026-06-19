import { useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, TrendingUp, ArrowDownLeft, Clock, Download } from 'lucide-react'
import { useMyPayments, usePaymentStats } from '@/hooks/usePayments'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency, formatRelativeTime, getPaymentStatusColor } from '@/lib/utils'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { Payment } from '@/types'

const STATUS_COLORS = {
  COMPLETED: '#22C55E',
  PENDING: '#F59E0B',
  FAILED: '#EF4444',
  REFUNDED: '#3B82F6',
}

export default function PaymentsPage() {
  const [typeFilter, setTypeFilter] = useState('ALL')

  const { data: paymentsData, isLoading } = useMyPayments(
    typeFilter !== 'ALL' ? { type: typeFilter } : undefined
  )
  const { data: stats } = usePaymentStats()

  const payments: Payment[] = paymentsData?.payments || []

  const pieData = [
    { name: 'Booking', value: 65 },
    { name: 'Maintenance', value: 20 },
    { name: 'Insurance', value: 15 },
  ]
  const PIE_COLORS = ['#2563EB', '#38BDF8', '#22C55E']

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-navy">Payments</h1>
        <p className="text-slate-500 mt-1">Track your transaction history</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            icon: CreditCard,
            label: 'Total Spent',
            value: formatCurrency(stats?.totalSpent || 0),
            color: 'bg-blue-500',
          },
          {
            icon: TrendingUp,
            label: 'Transactions',
            value: stats?.totalTransactions || 0,
            color: 'bg-violet-500',
          },
          {
            icon: ArrowDownLeft,
            label: 'Total Refunds',
            value: formatCurrency(stats?.totalRefunded || 0),
            color: 'bg-green-500',
          },
          {
            icon: Clock,
            label: 'Pending',
            value: payments.filter((p) => p.status === 'PENDING').length,
            color: 'bg-orange-500',
          },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <CardContent className="p-5">
                <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-display font-bold text-navy">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Transactions list */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Transaction History</CardTitle>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    <SelectItem value="BOOKING_PAYMENT">Bookings</SelectItem>
                    <SelectItem value="SLOT_PURCHASE">Slot Purchase</SelectItem>
                    <SelectItem value="MAINTENANCE_CONTRIBUTION">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 skeleton rounded-xl" />)}
                </div>
              ) : !payments.length ? (
                <div className="text-center py-10">
                  <CreditCard className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-500">No transactions found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <CreditCard className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-navy truncate">
                          {payment.booking?.vehicle?.make} {payment.booking?.vehicle?.model}
                          {!payment.booking && payment.type.replace(/_/g, ' ')}
                        </p>
                        <p className="text-xs text-slate-500">
                          {payment.razorpayPaymentId
                            ? `#${payment.razorpayPaymentId.slice(-8).toUpperCase()}`
                            : `#${payment.id.slice(-8).toUpperCase()}`
                          } · {formatRelativeTime(payment.createdAt)}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-navy">{formatCurrency(payment.amount)}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPaymentStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Spending Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: number) => [`${val}%`, '']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {pieData.map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: PIE_COLORS[i] }} />
                      <span className="text-slate-600">{item.name}</span>
                    </div>
                    <span className="font-semibold text-navy">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
