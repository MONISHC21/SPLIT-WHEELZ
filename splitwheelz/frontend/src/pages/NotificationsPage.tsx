import { motion } from 'framer-motion'
import { Bell, CheckCheck, Trash2, BookOpen } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatRelativeTime } from '@/lib/utils'
import type { Notification } from '@/types'

const notificationIcons: Record<string, string> = {
  BOOKING_CREATED: '📅',
  BOOKING_CONFIRMED: '✅',
  BOOKING_CANCELLED: '❌',
  PAYMENT_SUCCESS: '💳',
  REFUND_INITIATED: '💰',
  SLOT_TRANSFERRED: '🔄',
  VOTE_CREATED: '🗳️',
  DISPUTE_CREATED: '⚠️',
  DISPUTE_RESOLVED: '✅',
  MAINTENANCE_REMINDER: '🔧',
  WELCOME: '👋',
  ACCOUNT_BANNED: '🚫',
  DEFAULT: '🔔',
}

export default function NotificationsPage() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await notificationApi.getMy()
      return data.data as { notifications: Notification[]; unreadCount: number }
    },
  })

  const markRead = useMutation({
    mutationFn: (id: string) => notificationApi.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const deleteNotif = useMutation({
    mutationFn: (id: string) => notificationApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const markAllRead = () => markRead.mutate('all')

  const notifications = data?.notifications || []
  const unreadCount = data?.unreadCount || 0

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-display text-3xl font-bold text-navy flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount} unread</Badge>
            )}
          </h1>
          <p className="text-slate-500 mt-1">Stay updated on your activity</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
        )}
      </motion.div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 skeleton rounded-2xl" />
          ))}
        </div>
      ) : !notifications.length ? (
        <Card>
          <CardContent className="flex flex-col items-center py-16">
            <Bell className="w-16 h-16 text-slate-200 mb-4" />
            <h3 className="font-display text-xl font-bold text-navy mb-2">All caught up!</h3>
            <p className="text-slate-500">No notifications yet. They'll appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif, index) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
              className={`flex items-start gap-4 p-4 rounded-2xl border transition-all group ${
                !notif.isRead
                  ? 'bg-primary-50 border-primary-100 hover:border-primary-200'
                  : 'bg-white border-slate-100 hover:border-slate-200'
              }`}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl ${
                !notif.isRead ? 'bg-primary-100' : 'bg-slate-100'
              }`}>
                {notificationIcons[notif.type] || notificationIcons.DEFAULT}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`font-semibold text-sm ${!notif.isRead ? 'text-navy' : 'text-slate-700'}`}>
                    {notif.title}
                  </p>
                  {!notif.isRead && (
                    <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-1.5" />
                  )}
                </div>
                <p className="text-slate-500 text-sm mt-0.5 leading-relaxed">{notif.body}</p>
                <p className="text-xs text-slate-400 mt-1.5">{formatRelativeTime(notif.createdAt)}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                {!notif.isRead && (
                  <button
                    onClick={() => markRead.mutate(notif.id)}
                    className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center hover:bg-primary-200 transition-colors"
                    title="Mark as read"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotif.mutate(notif.id)}
                  className="w-8 h-8 rounded-lg bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
