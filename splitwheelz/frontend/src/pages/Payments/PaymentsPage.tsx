import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CreditCard, Download, Filter, Search, CheckCircle2,
  Clock, XCircle, AlertCircle, TrendingUp, ArrowUpRight,
  IndianRupee, Receipt, Smartphone
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'
import { formatCurrency, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

const transactions = [
  { id: '1', description: 'EMI Payment - Hyundai Creta (Jun)', type: 'EMI_PAYMENT', amount: 12500, status: 'COMPLETED', date: '2026-06-01', razorpayId: 'pay_Abc123' },
  { id: '2', description: 'Booking Payment - Jun 20 Drive', type: 'BOOKING_PAYMENT', amount: 1200, status: 'COMPLETED', date: '2026-06-15', razorpayId: 'pay_Def456' },
  { id: '3', description: 'Insurance Contribution - Creta', type: 'INSURANCE_PAYMENT', amount: 2500, status: 'COMPLETED', date: '2026-06-01', razorpayId: 'pay_Ghi789' },
  { id: '4', description: 'Maintenance - Oil Change Creta', type: 'MAINTENANCE_CONTRIBUTION', amount: 1500, status: 'COMPLETED', date: '2026-05-20', razorpayId: 'pay_Jkl012' },
  { id: '5', description: 'EMI Payment - Toyota Camry (Jun)', type: 'EMI_PAYMENT', amount: 37500, status: 'COMPLETED', date: '2026-06-05', razorpayId: 'pay_Mno345' },
  { id: '6', description: 'Refund - Cancelled Booking', type: 'REFUND', amount: 4500, status: 'REFUNDED', date: '2026-06-12', razorpayId: 'pay_Pqr678' },
  { id: '7', description: 'EMI Payment - Hyundai Creta (Jul)', type: 'EMI_PAYMENT', amount: 12500, status: 'PENDING', date: '2026-07-01', razorpayId: null },
  { id: '8', description: 'EMI Payment - Toyota Camry (Jul)', type: 'EMI_PAYMENT', amount: 37500, status: 'PENDING', date: '2026-07-05', razorpayId: null },
]

const monthlyData = [
  { month: 'Jan', amount: 55000 },
  { month: 'Feb', amount: 52000 },
  { month: 'Mar', amount: 58000 },
  { month: 'Apr', amount: 55000 },
  { month: 'May', amount: 57200 },
  { month: 'Jun', amount: 55200 },
]

const typeConfig: Record<string, { label: string; color: string; icon: typeof CreditCard }> = {
  EMI_PAYMENT: { label: 'EMI', color: 'bg-blue-100 text-blue-700', icon: IndianRupee },
  BOOKING_PAYMENT: { label: 'Booking', color: 'bg-green-100 text-green-700', icon: Receipt },
  INSURANCE_PAYMENT: { label: 'Insurance', color: 'bg-purple-100 text-purple-700', icon: CheckCircle2 },
  MAINTENANCE_CONTRIBUTION: { label: 'Maintenance', color: 'bg-orange-100 text-orange-700', icon: TrendingUp },
  REFUND: { label: 'Refund', color: 'bg-teal-100 text-teal-700', icon: ArrowUpRight },
  SLOT_PURCHASE: { label: 'Slot Purchase', color: 'bg-pink-100 text-pink-700', icon: CreditCard },
}

const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string }> = {
  COMPLETED: { icon: CheckCircle2, color: 'text-green-600' },
  PENDING: { icon: Clock, color: 'text-amber-600' },
  FAILED: { icon: XCircle, color: 'text-red-600' },
  REFUNDED: { icon: ArrowUpRight, color: 'text-teal-600' },
  PROCESSING: { icon: AlertCircle, color: 'text-blue-600' },
}

const paymentMethods = [
  { id: 'upi', label: 'UPI', icon: '📱', desc: 'PhonePe, GPay, Paytm' },
  { id: 'card', label: 'Card', icon: '💳', desc: 'Credit / Debit Card' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦', desc: 'All major banks' },
]

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [showPayNow, setShowPayNow] = useState<typeof transactions[0] | null>(null)
  const [selectedMethod, setSelectedMethod] = useState('upi')
  const [processing, setProcessing] = useState(false)

  const filtered = transactions.filter((t) => {
    const matchSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchType = !filterType || t.type === filterType
    const matchStatus = !filterStatus || t.status === filterStatus
    return matchSearch && matchType && matchStatus
  })

  const totalPaid = transactions.filter((t) => t.status === 'COMPLETED').reduce((s, t) => s + t.amount, 0)
  const totalPending = transactions.filter((t) => t.status === 'PENDING').reduce((s, t) => s + t.amount, 0)
  const totalRefunded = transactions.filter((t) => t.status === 'REFUNDED').reduce((s, t) => s + t.amount, 0)

  const handlePay = async () => {
    if (!showPayNow) return
    setProcessing(true)
    await new Promise((r) => setTimeout(r, 1800))
    setProcessing(false)
    setShowPayNow(null)
    toast.success(`Payment of ${formatCurrency(showPayNow.amount)} successful! 🎉`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display font-bold text-2xl text-slate-900">Payments</h2>
        <p className="text-slate-500 text-sm mt-0.5">Track and manage all your payment transactions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Paid</span>
          </div>
          <div className="font-display font-bold text-2xl text-slate-900">{formatCurrency(totalPaid)}</div>
          <div className="text-slate-500 text-xs mt-1">Total cleared this month</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Pending</span>
          </div>
          <div className="font-display font-bold text-2xl text-slate-900">{formatCurrency(totalPending)}</div>
          <div className="text-slate-500 text-xs mt-1">Due soon</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-teal-600" />
            </div>
            <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded-full">Refunded</span>
          </div>
          <div className="font-display font-bold text-2xl text-slate-900">{formatCurrency(totalRefunded)}</div>
          <div className="text-slate-500 text-xs mt-1">Total refunds received</div>
        </motion.div>
      </div>

      {/* Monthly spend chart */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <h3 className="font-display font-bold text-slate-900 mb-4">Monthly Spend</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
            <Tooltip
              contentStyle={{ background: '#0F172A', border: 'none', borderRadius: 12, color: '#fff' }}
              formatter={(v: number) => [formatCurrency(v), 'Amount']}
            />
            <Bar dataKey="amount" fill="#2563EB" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Pending EMIs */}
      {totalPending > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <span className="font-semibold text-amber-800">Pending Payments</span>
          </div>
          <div className="space-y-2">
            {transactions.filter((t) => t.status === 'PENDING').map((t) => (
              <div key={t.id} className="flex items-center justify-between bg-white rounded-xl p-3 shadow-sm">
                <div>
                  <div className="font-medium text-slate-900 text-sm">{t.description}</div>
                  <div className="text-slate-500 text-xs">Due: {formatDate(t.date)}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900">{formatCurrency(t.amount)}</span>
                  <button
                    onClick={() => setShowPayNow(t)}
                    className="btn-primary text-xs py-1.5 px-3"
                  >
                    Pay Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100"
      >
        <div className="p-5 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <h3 className="font-display font-bold text-slate-900 flex-1">Transaction History</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-9 text-sm py-2 w-40"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field text-sm py-2 w-36"
              >
                <option value="">All Status</option>
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Pending</option>
                <option value="REFUNDED">Refunded</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {filtered.map((t, i) => {
            const typeInfo = typeConfig[t.type] ?? { label: t.type, color: 'bg-gray-100 text-gray-700', icon: CreditCard }
            const statusInfo = statusConfig[t.status] ?? { icon: AlertCircle, color: 'text-gray-500' }
            const TypeIcon = typeInfo.icon
            const StatusIcon = statusInfo.icon

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeInfo.color}`}>
                  <TypeIcon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-900 text-sm truncate">{t.description}</div>
                  <div className="text-slate-400 text-xs mt-0.5">{formatDate(t.date)} · {t.razorpayId || 'Pending'}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`font-bold text-sm ${t.type === 'REFUND' ? 'text-teal-600' : 'text-slate-900'}`}>
                    {t.type === 'REFUND' ? '+' : '-'}{formatCurrency(t.amount)}
                  </div>
                  <div className={`flex items-center gap-1 justify-end text-xs ${statusInfo.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {t.status}
                  </div>
                </div>
                {t.status === 'COMPLETED' && (
                  <button
                    onClick={() => toast.success('Receipt downloaded!')}
                    className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
                  >
                    <Download className="w-4 h-4 text-gray-500" />
                  </button>
                )}
                {t.status === 'PENDING' && (
                  <button
                    onClick={() => setShowPayNow(t)}
                    className="text-xs btn-primary py-1.5 px-3 flex-shrink-0"
                  >
                    Pay
                  </button>
                )}
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Pay Now Modal */}
      <AnimatePresence>
        {showPayNow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !processing && setShowPayNow(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-display font-bold text-2xl text-slate-900 mb-1">Make Payment</h2>
              <p className="text-slate-500 text-sm mb-6">{showPayNow.description}</p>

              <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500">Amount</span>
                  <span className="font-bold text-slate-900">{formatCurrency(showPayNow.amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Processing fee</span>
                  <span className="font-semibold text-slate-700">₹2</span>
                </div>
                <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between">
                  <span className="font-semibold text-slate-900">Total</span>
                  <span className="font-display font-bold text-blue-600 text-lg">{formatCurrency(showPayNow.amount + 2)}</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-3">Payment Method</label>
                <div className="space-y-2">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                        selectedMethod === method.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-2xl">{method.icon}</span>
                      <div className="text-left">
                        <div className="font-semibold text-slate-900 text-sm">{method.label}</div>
                        <div className="text-slate-500 text-xs">{method.desc}</div>
                      </div>
                      {selectedMethod === method.id && (
                        <CheckCircle2 className="w-5 h-5 text-blue-600 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  disabled={processing}
                  onClick={() => setShowPayNow(null)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePay}
                  disabled={processing}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-4 h-4" />
                      Pay via Razorpay
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
