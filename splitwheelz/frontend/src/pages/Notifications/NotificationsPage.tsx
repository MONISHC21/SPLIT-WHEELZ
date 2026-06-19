import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell, CheckCheck, Trash2, CreditCard, Calendar,
  AlertTriangle, Info, CheckCircle2, Wrench
} from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'
import toast from 'react-hot-toast'

const initialNotifications = [
  { id: '1', title: 'EMI Due Reminder', message: 'Your EMI of ₹12,500 for Hyundai Creta is due in 3 days. Pay now to avoid late fees.', type: 'PAYMENT', isRead: false, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), actionUrl: '/payments' },
  { id: '2', title: 'Booking Confirmed', message: 'Your booking for Hyundai Creta on June 20, 2026 (10:00 AM – 2:00 PM) has been confirmed.', type: 'BOOKING', isRead: false, createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), actionUrl: '/bookings' },
  { id: '3', title: 'New Vote Pending', message: 'Your co-owners have raised a vote on tyre replacement. Please cast your vote before June 28.', type: 'INFO', isRead: false, createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), actionUrl: '/co-owners' },
  { id: '4', title: 'Maintenance Alert', message: 'Hyundai Creta is due for service in 2,000 km. Schedule a service appointment soon.', type: 'MAINTENANCE', isRead: true, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), actionUrl: '/co-owners' },
  { id: '5', title: 'Payment Successful', message: 'Your EMI payment of ₹37,500 for Toyota Camry (June) was processed successfully.', type: 'SUCCESS', isRead: true, createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), actionUrl: '/payments' },
  { id: '6', title: 'Booking Cancelled', message: 'Your booking for BMW 5 Series on June 10 has been cancelled. Refund of ₹4,500 initiated.', type: 'WARNING', isRead: true, createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), actionUrl: '/bookings' },
  { id: '7', title: 'New Co-Owner Joined', message: 'Kavitha Nair has joined as a co-owner of Toyota Camry with 33% share.', type: 'INFO', isRead: true, createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), actionUrl: '/co-owners' },
  { id: '8', title: 'Insurance Renewed', message: 'Your vehicle insurance for Hyundai Creta has been successfully renewed. Coverage valid till June 2027.', type: 'SUCCESS', isRead: true, createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), actionUrl: '/payments' },
]

const typeConfig: Record<string, { icon: typeof Bell; bg: string; iconColor: string; border: string }> = {
  PAYMENT: { icon: CreditCard, bg: 'bg-blue-50', iconColor: 'text-blue-600', border: 'border-blue-100' },
  BOOKING: { icon: Calendar, bg: 'bg-green-50', iconColor: 'text-green-600', border: 'border-green-100' },
  MAINTENANCE: { icon: Wrench, bg: 'bg-orange-50', iconColor: 'text-orange-600', border: 'border-orange-100' },
  SUCCESS: { icon: CheckCircle2, bg: 'bg-green-50', iconColor: 'text-green-600', border: 'border-green-100' },
  WARNING: { icon: AlertTriangle, bg: 'bg-amber-50', iconColor: 'text-amber-600', border: 'border-amber-100' },
  ERROR: { icon: AlertTriangle, bg: 'bg-red-50', iconColor: 'text-red-600', border: 'border-red-100' },
  INFO: { icon: Info, bg: 'bg-slate-50', iconColor: 'text-slate-600', border: 'border-slate-100' },
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all')

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const displayed = activeFilter === 'unread'
    ? notifications.filter((n) => !n.isRead)
    : notifications

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    toast.success('All notifications marked as read')
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
    toast.success('All notifications cleared')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl text-slate-900">Notifications</h2>
          <p className="text-slate-500 text-sm mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 px-3 py-2 rounded-xl hover:bg-blue-50 transition-all"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 px-3 py-2 rounded-xl hover:bg-red-50 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeFilter === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-gray-200 hover:border-gray-300'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setActiveFilter('unread')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeFilter === 'unread' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-gray-200 hover:border-gray-300'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications list */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {displayed.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">
              {activeFilter === 'unread' ? 'No unread notifications' : 'All notifications cleared'}
            </p>
            <p className="text-slate-400 text-sm mt-1">You're all caught up!</p>
          </div>
        ) : (
          <AnimatePresence>
            {displayed.map((n) => {
              const config = typeConfig[n.type] ?? typeConfig.INFO
              const Icon = config.icon
              return (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10, height: 0 }}
                  className={`flex items-start gap-4 p-5 border-b border-gray-50 last:border-b-0 transition-colors ${
                    !n.isRead ? 'bg-blue-50/30' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => { if (!n.isRead) markRead(n.id) }}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                    <Icon className={`w-5 h-5 ${config.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <p className={`font-semibold text-sm ${!n.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                          {n.title}
                        </p>
                        {!n.isRead && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <span className="text-xs text-slate-400 flex-shrink-0">
                        {formatRelativeTime(n.createdAt)}
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm mt-0.5 leading-relaxed">{n.message}</p>
                    {n.actionUrl && (
                      <a
                        href={n.actionUrl}
                        className="text-blue-600 text-xs font-medium hover:text-blue-700 mt-1.5 inline-block"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View details →
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!n.isRead && (
                      <button
                        onClick={(e) => { e.stopPropagation(); markRead(n.id) }}
                        className="w-8 h-8 rounded-lg hover:bg-gray-200 flex items-center justify-center text-slate-400 transition-colors"
                        title="Mark as read"
                      >
                        <CheckCheck className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteNotification(n.id) }}
                      className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
