import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams } from 'react-router-dom'
import {
  Calendar, Clock, ChevronLeft, ChevronRight, CheckCircle2,
  Car, XCircle, AlertCircle, QrCode, Download, Plus
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const timeSlots = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00',
]

const bookedSlots: Record<string, string[]> = {
  '2026-06-22': ['09:00', '10:00', '11:00'],
  '2026-06-24': ['14:00', '15:00', '16:00', '17:00'],
  '2026-06-26': ['08:00'],
}

const mockBookings = [
  { id: '1', vehicle: 'Hyundai Creta', date: '2026-06-20', startTime: '10:00', endTime: '14:00', hours: 4, amount: 1200, status: 'CONFIRMED', qrCode: 'QR-SW-2026-001' },
  { id: '2', vehicle: 'Toyota Camry', date: '2026-06-18', startTime: '14:00', endTime: '16:00', hours: 2, amount: 1800, status: 'COMPLETED', qrCode: 'QR-SW-2026-002' },
  { id: '3', vehicle: 'Hyundai Creta', date: '2026-06-15', startTime: '08:00', endTime: '14:00', hours: 6, amount: 1800, status: 'COMPLETED', qrCode: 'QR-SW-2026-003' },
  { id: '4', vehicle: 'BMW 5 Series', date: '2026-06-10', startTime: '16:00', endTime: '19:00', hours: 3, amount: 4500, status: 'CANCELLED', qrCode: null },
]

const statusConfig: Record<string, { color: string; icon: typeof CheckCircle2; label: string }> = {
  CONFIRMED: { color: 'bg-blue-100 text-blue-700', icon: Clock, label: 'Confirmed' },
  COMPLETED: { color: 'bg-green-100 text-green-700', icon: CheckCircle2, label: 'Completed' },
  CANCELLED: { color: 'bg-red-100 text-red-700', icon: XCircle, label: 'Cancelled' },
  PENDING: { color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle, label: 'Pending' },
  NO_SHOW: { color: 'bg-gray-100 text-gray-700', icon: AlertCircle, label: 'No Show' },
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

export default function BookingPage() {
  const { vehicleId } = useParams()
  const [activeView, setActiveView] = useState<'calendar' | 'history'>('calendar')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedStart, setSelectedStart] = useState<string | null>(null)
  const [selectedEnd, setSelectedEnd] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 5)) // June 2026
  const [showQR, setShowQR] = useState<string | null>(null)
  const [showNewBookingModal, setShowNewBookingModal] = useState(!!vehicleId)

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1))
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1))

  const formatDateKey = (day: number) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  const today = new Date()
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const getTimeRange = (start: string, end: string) => {
    const startH = parseInt(start.split(':')[0])
    const endH = parseInt(end.split(':')[0])
    return Array.from({ length: endH - startH }, (_, i) => `${String(startH + i).padStart(2, '0')}:00`)
  }

  const isSlotBooked = (date: string, time: string) => bookedSlots[date]?.includes(time)

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedStart || !selectedEnd) {
      toast.error('Please select date and time range')
      return
    }
    await new Promise((r) => setTimeout(r, 800))
    toast.success('Booking confirmed! QR code sent to your email.')
    setShowNewBookingModal(false)
    setSelectedDate(null)
    setSelectedStart(null)
    setSelectedEnd(null)
  }

  const totalHours = selectedStart && selectedEnd
    ? parseInt(selectedEnd) - parseInt(selectedStart.split(':')[0])
    : 0
  const totalCost = totalHours * 300 // ₹300/hour estimate

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl text-slate-900">Bookings</h2>
          <p className="text-slate-500 text-sm mt-0.5">Manage your vehicle time slots</p>
        </div>
        <button
          onClick={() => setShowNewBookingModal(true)}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          New Booking
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveView('calendar')}
            className={`flex-1 py-4 text-sm font-semibold transition-all ${activeView === 'calendar' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Calendar View
          </button>
          <button
            onClick={() => setActiveView('history')}
            className={`flex-1 py-4 text-sm font-semibold transition-all ${activeView === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}
          >
            <Clock className="w-4 h-4 inline mr-2" />
            Booking History
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeView === 'calendar' && (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* Calendar */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <button onClick={prevMonth} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                      <ChevronLeft className="w-4 h-4 text-slate-600" />
                    </button>
                    <h3 className="font-display font-bold text-slate-900">
                      {MONTHS[month]} {year}
                    </h3>
                    <button onClick={nextMonth} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {DAYS.map((d) => (
                      <div key={d} className="text-center text-xs font-semibold text-slate-400 py-2">{d}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {[...Array(firstDay)].map((_, i) => <div key={`empty-${i}`} />)}
                    {[...Array(daysInMonth)].map((_, i) => {
                      const day = i + 1
                      const dateKey = formatDateKey(day)
                      const hasBooking = bookedSlots[dateKey]
                      const isSelected = selectedDate === dateKey
                      const isToday = dateKey === todayKey
                      const isPast = new Date(dateKey) < new Date(todayKey)

                      return (
                        <button
                          key={day}
                          disabled={isPast}
                          onClick={() => setSelectedDate(dateKey)}
                          className={`aspect-square rounded-xl text-sm font-medium transition-all relative ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                              : isToday
                              ? 'bg-blue-50 text-blue-700 border-2 border-blue-300'
                              : isPast
                              ? 'text-slate-300 cursor-not-allowed'
                              : 'text-slate-700 hover:bg-gray-100'
                          }`}
                        >
                          {day}
                          {hasBooking && !isSelected && (
                            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full" />
                          )}
                        </button>
                      )
                    })}
                  </div>

                  <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-600 rounded" />Selected</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-50 border-2 border-blue-300 rounded" />Today</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full ml-0.5" />Has bookings</span>
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  {selectedDate ? (
                    <>
                      <h4 className="font-semibold text-slate-900 mb-3 text-sm">
                        Time Slots for {formatDate(selectedDate)}
                      </h4>
                      <div className="grid grid-cols-4 gap-2 mb-5">
                        {timeSlots.map((time) => {
                          const booked = isSlotBooked(selectedDate, time)
                          const isStartSelected = selectedStart === time
                          const inRange = selectedStart && selectedEnd &&
                            getTimeRange(selectedStart, selectedEnd).includes(time)

                          return (
                            <button
                              key={time}
                              disabled={!!booked}
                              onClick={() => {
                                if (!selectedStart || (selectedStart && selectedEnd)) {
                                  setSelectedStart(time)
                                  setSelectedEnd(null)
                                } else {
                                  if (time > selectedStart) {
                                    setSelectedEnd(
                                      `${String(parseInt(time.split(':')[0]) + 1).padStart(2, '0')}:00`
                                    )
                                  }
                                }
                              }}
                              className={`py-2 px-1 rounded-lg text-xs font-medium transition-all ${
                                booked
                                  ? 'bg-red-50 text-red-300 cursor-not-allowed border border-red-100'
                                  : isStartSelected
                                  ? 'bg-blue-600 text-white shadow-sm'
                                  : inRange
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                              }`}
                            >
                              {time}
                            </button>
                          )
                        })}
                      </div>

                      {selectedStart && (
                        <div className="bg-blue-50 rounded-xl p-4 mb-4">
                          <p className="text-blue-800 text-sm font-medium">
                            {selectedEnd
                              ? `Selected: ${selectedStart} – ${selectedEnd} (${totalHours} hrs)`
                              : `Start: ${selectedStart} — Now select end time`}
                          </p>
                          {selectedEnd && (
                            <p className="text-blue-600 text-sm mt-1">
                              Estimated cost: <span className="font-bold">{formatCurrency(totalCost)}</span>
                            </p>
                          )}
                        </div>
                      )}

                      <button
                        onClick={handleConfirmBooking}
                        disabled={!selectedStart || !selectedEnd}
                        className="w-full btn-primary disabled:opacity-50 text-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 inline mr-2" />
                        Confirm Booking
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                      <Calendar className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-slate-500 text-sm">Select a date to view available time slots</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeView === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="space-y-3">
                  {mockBookings.map((booking) => {
                    const config = statusConfig[booking.status]
                    const StatusIconComp = config.icon
                    return (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                          <Car className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-900 text-sm">{booking.vehicle}</div>
                          <div className="text-slate-500 text-xs mt-0.5">
                            {formatDate(booking.date)} · {booking.startTime} – {booking.endTime} ({booking.hours} hrs)
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-bold text-slate-900 text-sm">{formatCurrency(booking.amount)}</div>
                          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${config.color}`}>
                            <StatusIconComp className="w-3 h-3" />
                            {config.label}
                          </div>
                        </div>
                        {booking.qrCode && booking.status !== 'CANCELLED' && (
                          <button
                            onClick={() => setShowQR(booking.qrCode)}
                            className="w-9 h-9 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowQR(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-display font-bold text-xl text-slate-900 mb-2">Access QR Code</h3>
              <p className="text-slate-500 text-sm mb-6">Show this to the vehicle partner to confirm your booking</p>

              {/* Mock QR code */}
              <div className="w-48 h-48 mx-auto bg-slate-900 rounded-2xl p-4 mb-4">
                <div className="w-full h-full grid grid-cols-8 gap-0.5">
                  {[...Array(64)].map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-sm ${Math.random() > 0.5 ? 'bg-white' : 'bg-transparent'}`}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 mb-6">
                <p className="font-mono text-blue-700 font-bold text-lg tracking-widest">{showQR}</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowQR(null)} className="flex-1 btn-secondary text-sm">
                  Close
                </button>
                <button onClick={() => toast.success('QR code saved!')} className="flex-1 btn-primary text-sm flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Save QR
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Booking Modal */}
      <AnimatePresence>
        {showNewBookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewBookingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-display font-bold text-xl text-slate-900 mb-4">New Booking</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Vehicle</label>
                  <select className="input-field">
                    <option>Hyundai Creta - Bangalore</option>
                    <option>Toyota Camry - Mumbai</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
                    <input type="date" className="input-field" min="2026-06-20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Start Time</label>
                    <select className="input-field">
                      {timeSlots.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">End Time</label>
                    <select className="input-field">
                      {timeSlots.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Purpose</label>
                    <select className="input-field">
                      <option>Personal Use</option>
                      <option>Business</option>
                      <option>Travel</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowNewBookingModal(false)} className="flex-1 btn-secondary text-sm">Cancel</button>
                <button
                  onClick={() => {
                    handleConfirmBooking()
                    setShowNewBookingModal(false)
                  }}
                  className="flex-1 btn-primary text-sm"
                >
                  Confirm Booking
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
