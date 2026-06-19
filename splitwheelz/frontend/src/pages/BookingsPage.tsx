import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Calendar, Car, Clock, X, Eye, AlertTriangle } from 'lucide-react'
import { useMyBookings, useCancelBooking } from '@/hooks/useVehicles'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency, formatDateTime, formatDuration, getBookingStatusColor } from '@/lib/utils'
import type { Booking } from '@/types'

export default function BookingsPage() {
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [cancelId, setCancelId] = useState<string | null>(null)

  const { data, isLoading } = useMyBookings(
    statusFilter !== 'ALL' ? { status: statusFilter } : undefined
  )
  const cancelBooking = useCancelBooking()

  const bookings: Booking[] = data?.bookings || []

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-navy">My Bookings</h1>
          <p className="text-slate-500 mt-1">Track all your vehicle reservations</p>
        </div>
      </motion.div>

      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Bookings</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl skeleton" />
          ))}
        </div>
      ) : !bookings.length ? (
        <Card>
          <CardContent className="flex flex-col items-center py-16">
            <Calendar className="w-16 h-16 text-slate-200 mb-4" />
            <h3 className="font-display text-xl font-bold text-navy mb-2">No bookings found</h3>
            <p className="text-slate-500 mb-6">
              {statusFilter !== 'ALL' ? 'No bookings with this status.' : 'Book a vehicle to get started.'}
            </p>
            <Button asChild>
              <Link to="/marketplace">Browse Vehicles</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Vehicle image */}
                    <div className="w-full sm:w-32 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                      {booking.vehicle?.images?.[0] ? (
                        <img
                          src={booking.vehicle.images[0]}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Car className="w-8 h-8 text-slate-300" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-display font-bold text-lg text-navy">
                            {booking.vehicle?.make} {booking.vehicle?.model}
                          </h3>
                          <p className="text-slate-500 text-sm">#{booking.id.slice(-8).toUpperCase()}</p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${getBookingStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="w-4 h-4 text-primary-500" />
                          <span>{formatDateTime(booking.startTime)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Clock className="w-4 h-4 text-primary-500" />
                          <span>{formatDuration(Number(booking.durationHours))}</span>
                        </div>
                        <div className="text-sm font-bold text-navy">
                          {formatCurrency(booking.finalAmount)}
                        </div>
                      </div>

                      {booking.purpose && (
                        <p className="text-slate-500 text-sm mt-2 italic">"{booking.purpose}"</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col gap-2 sm:w-24 flex-shrink-0">
                      {['PENDING', 'CONFIRMED'].includes(booking.status) && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1 sm:flex-none"
                          onClick={() => setCancelId(booking.id)}
                        >
                          <X className="w-3.5 h-3.5 mr-1" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Cancel modal */}
      {cancelId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-display font-bold text-navy">Cancel Booking?</h3>
                <p className="text-slate-500 text-sm">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-slate-600 text-sm mb-6">
              Refund will be processed within 3-5 business days if eligible.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setCancelId(null)}>
                Keep Booking
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                loading={cancelBooking.isPending}
                onClick={() => {
                  cancelBooking.mutate({ id: cancelId }, {
                    onSuccess: () => setCancelId(null)
                  })
                }}
              >
                Cancel Booking
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
