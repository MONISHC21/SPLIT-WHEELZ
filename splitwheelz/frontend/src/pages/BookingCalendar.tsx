import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ChevronLeft, ChevronRight, Clock, Calendar, AlertCircle,
  CheckCircle, Car, ArrowRight,
} from 'lucide-react'
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth,
  eachDayOfInterval, isSameMonth, isSameDay, isToday, addDays,
  isBefore, getDay, startOfDay,
} from 'date-fns'
import { useVehicle } from '@/hooks/useVehicles'
import { useCreateBooking } from '@/hooks/useVehicles'
import { useRazorpay } from '@/hooks/usePayments'
import { useAuthStore } from '@/stores/authStore'
import { bookingApi } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { formatCurrency, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7) // 7 AM to 8 PM

export default function BookingCalendar() {
  const { vehicleId } = useParams<{ vehicleId: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { initiatePayment } = useRazorpay()
  const createBooking = useCreateBooking()

  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [startHour, setStartHour] = useState<number | null>(null)
  const [endHour, setEndHour] = useState<number | null>(null)
  const [purpose, setPurpose] = useState('')
  const [step, setStep] = useState<'date' | 'time' | 'confirm'>('date')

  const { data: vehicle, isLoading: vehicleLoading } = useVehicle(vehicleId!)

  // Fetch bookings for current month
  const monthStart = format(startOfMonth(currentMonth), 'yyyy-MM-dd')
  const monthEnd = format(endOfMonth(addMonths(currentMonth, 1)), 'yyyy-MM-dd')

  const { data: bookingsData } = useQuery({
    queryKey: ['vehicle-bookings', vehicleId, monthStart, monthEnd],
    queryFn: async () => {
      const { data } = await bookingApi.getVehicleBookings(vehicleId!, { startDate: monthStart, endDate: monthEnd })
      return data.data as Array<{ startTime: string; endTime: string; userId: string }>
    },
    enabled: !!vehicleId,
  })

  const daysInMonth = useMemo(() =>
    eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) }),
    [currentMonth]
  )

  const bookedDates = useMemo(() => {
    if (!bookingsData) return new Set<string>()
    const dates = new Set<string>()
    bookingsData.forEach((b) => {
      const start = new Date(b.startTime)
      const end = new Date(b.endTime)
      let current = startOfDay(start)
      while (current <= end) {
        dates.add(format(current, 'yyyy-MM-dd'))
        current = addDays(current, 1)
      }
    })
    return dates
  }, [bookingsData])

  const getBookingsForHour = (hour: number) => {
    if (!selectedDate || !bookingsData) return []
    return bookingsData.filter((b) => {
      const start = new Date(b.startTime)
      const end = new Date(b.endTime)
      const bookingStartHour = start.getHours()
      const bookingEndHour = end.getHours()
      return isSameDay(start, selectedDate) && hour >= bookingStartHour && hour < bookingEndHour
    })
  }

  const isHourBooked = (hour: number) => getBookingsForHour(hour).length > 0
  const isMyBooking = (hour: number) =>
    getBookingsForHour(hour).some((b) => b.userId === user?.id)

  const durationHours = startHour !== null && endHour !== null ? endHour - startHour : 0
  const hourlyRate = vehicle ? Number(vehicle.pricePerSlot) / (4 * 42) : 0
  const totalAmount = hourlyRate * durationHours

  const handleConfirmBooking = async () => {
    if (!selectedDate || startHour === null || endHour === null || !vehicleId) return

    const startTime = new Date(selectedDate)
    startTime.setHours(startHour, 0, 0, 0)
    const endTime = new Date(selectedDate)
    endTime.setHours(endHour, 0, 0, 0)

    try {
      const { data } = await createBooking.mutateAsync({
        vehicleId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        purpose,
      })

      const booking = data.data

      await initiatePayment(
        { bookingId: booking.id, type: 'BOOKING_PAYMENT' },
        { name: user?.name, email: user?.email },
        () => navigate('/bookings')
      )
    } catch {
      // error handled in hook
    }
  }

  if (vehicleLoading) {
    return <div className="flex justify-center items-center h-64"><Spinner size="xl" /></div>
  }

  if (!vehicle) {
    return <div className="text-center p-8"><p className="text-gray-500">Vehicle not found.</p></div>
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-navy transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="font-display text-3xl font-bold text-navy">Book Your Ride</h1>
        <p className="text-slate-500 mt-1 flex items-center gap-2">
          <Car className="w-4 h-4" />
          {vehicle.make} {vehicle.model} · {vehicle.year}
        </p>
      </motion.div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-8">
        {['date', 'time', 'confirm'].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step === s ? 'bg-primary-600 text-white' :
              ['date', 'time', 'confirm'].indexOf(step) > i ? 'bg-green-500 text-white' :
              'bg-slate-200 text-slate-500'
            }`}>
              {['date', 'time', 'confirm'].indexOf(step) > i
                ? <CheckCircle className="w-4 h-4" />
                : i + 1}
            </div>
            <span className={`text-sm font-medium capitalize hidden sm:block ${step === s ? 'text-navy' : 'text-slate-400'}`}>
              {s === 'date' ? 'Pick Date' : s === 'time' ? 'Select Time' : 'Confirm'}
            </span>
            {i < 2 && <ChevronRight className="w-4 h-4 text-slate-300" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Calendar / time picker */}
        <div className="lg:col-span-2">
          {step === 'date' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{format(currentMonth, 'MMMM yyyy')}</CardTitle>
                  <div className="flex gap-2">
                    <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                      className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-slate-50 disabled:opacity-40"
                      disabled={isBefore(endOfMonth(subMonths(currentMonth, 1)), new Date())}>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                      className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-slate-50">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Day labels */}
                <div className="grid grid-cols-7 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                    <div key={d} className="text-center text-xs font-semibold text-slate-400 py-2">{d}</div>
                  ))}
                </div>

                {/* Empty cells for first week */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: getDay(startOfMonth(currentMonth)) }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}

                  {daysInMonth.map((day) => {
                    const isSelected = selectedDate && isSameDay(day, selectedDate)
                    const isPast = isBefore(day, startOfDay(new Date()))
                    const isBooked = bookedDates.has(format(day, 'yyyy-MM-dd'))
                    const today = isToday(day)

                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => {
                          if (!isPast) {
                            setSelectedDate(day)
                            setStartHour(null)
                            setEndHour(null)
                          }
                        }}
                        disabled={isPast}
                        className={`
                          relative aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all
                          ${isPast ? 'opacity-30 cursor-not-allowed' : 'hover:bg-primary-50 cursor-pointer'}
                          ${isSelected ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md' : ''}
                          ${today && !isSelected ? 'ring-2 ring-primary-400 text-primary-700' : ''}
                          ${!isSameMonth(day, currentMonth) ? 'opacity-30' : ''}
                        `}
                      >
                        {format(day, 'd')}
                        {isBooked && !isSelected && (
                          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-orange-400" />
                        )}
                      </button>
                    )
                  })}
                </div>

                <div className="flex gap-4 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-orange-400 rounded-full" /> Has bookings
                  </span>
                  <span className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-primary-600 rounded-full" /> Selected
                  </span>
                </div>

                <Button
                  className="w-full mt-4"
                  disabled={!selectedDate}
                  onClick={() => setStep('time')}
                >
                  Continue to Time Selection
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 'time' && selectedDate && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary-600" />
                  Select Time — {format(selectedDate, 'EEEE, MMM d')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500 mb-4">
                  {startHour === null ? 'Click a time to set start' : endHour === null ? 'Click a later time to set end' : `${startHour}:00 → ${endHour}:00 (${durationHours}h)`}
                </p>

                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-6">
                  {HOURS.map((hour) => {
                    const isBooked = isHourBooked(hour)
                    const myBooking = isMyBooking(hour)
                    const isStart = startHour === hour
                    const isEnd = endHour === hour
                    const inRange = startHour !== null && endHour !== null && hour > startHour && hour < endHour

                    return (
                      <button
                        key={hour}
                        onClick={() => {
                          if (isBooked) return
                          if (startHour === null) {
                            setStartHour(hour)
                          } else if (endHour === null) {
                            if (hour > startHour) setEndHour(hour)
                            else { setStartHour(hour); setEndHour(null) }
                          } else {
                            setStartHour(hour)
                            setEndHour(null)
                          }
                        }}
                        disabled={isBooked}
                        className={`
                          py-2.5 rounded-xl text-xs font-semibold transition-all
                          ${isBooked ? (myBooking ? 'bg-blue-100 text-blue-600' : 'bg-red-50 text-red-400 cursor-not-allowed opacity-60') : ''}
                          ${(isStart || isEnd) ? 'bg-primary-600 text-white shadow-md' : ''}
                          ${inRange ? 'bg-primary-100 text-primary-700' : ''}
                          ${!isBooked && !isStart && !isEnd && !inRange ? 'bg-slate-50 text-slate-600 hover:bg-primary-50 hover:text-primary-700' : ''}
                        `}
                      >
                        {String(hour).padStart(2, '0')}:00
                        {isBooked && !myBooking && <div className="text-[10px] mt-0.5">Taken</div>}
                      </button>
                    )
                  })}
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep('date')}>
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    disabled={!startHour || !endHour || durationHours <= 0}
                    onClick={() => setStep('confirm')}
                  >
                    Continue ({durationHours}h selected)
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 'confirm' && selectedDate && startHour !== null && endHour !== null && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Confirm Your Booking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                  {[
                    { label: 'Vehicle', value: `${vehicle.make} ${vehicle.model} (${vehicle.year})` },
                    { label: 'Date', value: format(selectedDate, 'EEEE, MMMM d, yyyy') },
                    { label: 'Start Time', value: `${String(startHour).padStart(2, '0')}:00` },
                    { label: 'End Time', value: `${String(endHour).padStart(2, '0')}:00` },
                    { label: 'Duration', value: `${durationHours} hour${durationHours !== 1 ? 's' : ''}` },
                    { label: 'Amount', value: formatCurrency(totalAmount), highlight: true },
                  ].map(({ label, value, highlight }) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-slate-500 text-sm">{label}</span>
                      <span className={`font-semibold text-sm ${highlight ? 'text-primary-600 text-lg' : 'text-navy'}`}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                    Purpose (optional)
                  </label>
                  <textarea
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="e.g., Family outing, Office trip, Weekend getaway..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">
                    You can cancel up to 2 hours before the booking for a full refund.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep('time')}>Back</Button>
                  <Button
                    className="flex-1"
                    size="lg"
                    loading={createBooking.isPending}
                    onClick={handleConfirmBooking}
                  >
                    Pay {formatCurrency(totalAmount)}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <img
                src={vehicle.images[0]}
                alt={vehicle.make}
                className="w-full h-36 object-cover rounded-xl"
              />
              <div>
                <h3 className="font-display font-bold text-navy">{vehicle.make} {vehicle.model}</h3>
                <p className="text-slate-500 text-sm">{vehicle.year} · {vehicle.color}</p>
              </div>

              {selectedDate && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4 text-primary-500" />
                    {format(selectedDate, 'MMMM d, yyyy')}
                  </div>
                  {startHour !== null && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="w-4 h-4 text-primary-500" />
                      {String(startHour).padStart(2, '0')}:00
                      {endHour !== null && ` → ${String(endHour).padStart(2, '0')}:00`}
                    </div>
                  )}
                  {durationHours > 0 && (
                    <Badge variant="info" className="text-xs">
                      {durationHours} hour{durationHours !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              )}

              {durationHours > 0 && (
                <div className="border-t border-slate-100 pt-4">
                  <div className="flex justify-between text-sm text-slate-500 mb-1">
                    <span>Hourly rate</span>
                    <span>{formatCurrency(hourlyRate)}/h</span>
                  </div>
                  <div className="flex justify-between font-bold text-navy">
                    <span>Total</span>
                    <span className="text-primary-600">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
