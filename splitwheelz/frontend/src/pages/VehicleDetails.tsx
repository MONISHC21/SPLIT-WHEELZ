import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Star, Shield, Users, Fuel, Gauge, Settings2, ChevronLeft, ChevronRight, ArrowRight, CircleCheck as CheckCircle, MessageSquare, Calendar, Zap, TriangleAlert as AlertTriangle } from 'lucide-react'
import { useVehicle, useOwnershipDetails } from '@/hooks/useVehicles'
import { useAuthStore } from '@/stores/authStore'
import { ownershipApi } from '@/lib/api'
import { useRazorpay } from '@/hooks/usePayments'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UserAvatar } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { formatCurrency, getFuelIcon, formatRelativeTime } from '@/lib/utils'
import type { VehicleReview } from '@/types'
import toast from 'react-hot-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export default function VehicleDetails() {
  const { id } = useParams<{ id: string }>()
  const { user, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { initiatePayment, isLoading: paymentLoading } = useRazorpay()

  const { data: vehicle, isLoading } = useVehicle(id!)
  const { data: ownershipData } = useOwnershipDetails(id!)

  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState<'specs' | 'owners' | 'reviews'>('specs')

  const purchaseSlotMutation = useMutation({
    mutationFn: () => ownershipApi.purchaseSlot(id!),
    onSuccess: async (data) => {
      const ownership = data.data.data
      // Initiate payment
      await initiatePayment(
        { ownershipId: ownership.id, type: 'SLOT_PURCHASE' },
        { name: user?.name, email: user?.email },
        () => {
          queryClient.invalidateQueries({ queryKey: ['vehicle', id] })
          queryClient.invalidateQueries({ queryKey: ['ownership', id] })
          navigate('/dashboard')
        }
      )
    },
    onError: (err: unknown) => {
      const error = err as { message?: string }
      toast.error(error?.message || 'Failed to purchase slot')
    },
  })

  const handleClaimSlot = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to purchase a slot')
      navigate('/login')
      return
    }

    if (!user?.kycVerified) {
      toast.error('Please complete KYC verification in Settings first')
      return
    }

    purchaseSlotMutation.mutate()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-navy mb-2">Vehicle not found</h2>
          <Button asChild><Link to="/marketplace">Back to Marketplace</Link></Button>
        </div>
      </div>
    )
  }

  const hasSlot = ownershipData?.ownerships?.some(
    (o: { userId: string; status: string }) => o.userId === user?.id && o.status === 'ACTIVE'
  )

  const specs = [
    { label: 'Year', value: vehicle.year },
    { label: 'Color', value: vehicle.color },
    { label: 'Fuel Type', value: `${getFuelIcon(vehicle.fuelType)} ${vehicle.fuelType}` },
    { label: 'Transmission', value: vehicle.transmission },
    { label: 'Engine', value: vehicle.engineCC ? `${vehicle.engineCC}cc` : 'N/A' },
    { label: 'Mileage', value: vehicle.mileage ? `${vehicle.mileage} km/l` : 'N/A' },
    { label: 'Seating', value: `${vehicle.seatingCapacity} seats` },
    { label: 'Type', value: vehicle.type },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-slate-500">
          <Link to="/marketplace" className="hover:text-primary-600 flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />Marketplace
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-navy font-medium">{vehicle.make} {vehicle.model}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Images + Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image gallery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="relative aspect-video">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    src={vehicle.images[selectedImage] || 'https://via.placeholder.com/800x450?text=Vehicle'}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {vehicle.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage((prev) => Math.max(0, prev - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg disabled:opacity-40"
                      disabled={selectedImage === 0}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImage((prev) => Math.min(vehicle.images.length - 1, prev + 1))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg disabled:opacity-40"
                      disabled={selectedImage === vehicle.images.length - 1}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                <div className="absolute top-4 left-4 flex gap-2">
                  {vehicle.isVerified && <Badge variant="success">✓ Verified</Badge>}
                  {vehicle.isFeatured && <Badge variant="gradient">⭐ Featured</Badge>}
                </div>
              </div>

              {vehicle.images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto scrollbar-hide">
                  {vehicle.images.map((img: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden ring-2 transition-all ${
                        i === selectedImage ? 'ring-primary-500' : 'ring-transparent hover:ring-primary-200'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title block */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="font-display text-3xl font-bold text-navy">
                      {vehicle.make} {vehicle.model}
                    </h1>
                    <div className="flex items-center flex-wrap gap-3 mt-2">
                      <span className="text-slate-500 text-sm">{vehicle.year}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500 text-sm">{vehicle.registrationNumber}</span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1 text-slate-500 text-sm">
                        <MapPin className="w-3.5 h-3.5" />
                        {vehicle.location || 'Location TBA'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-xl">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-navy text-lg">{vehicle.averageRating}</span>
                    <span className="text-slate-500 text-sm">({vehicle.totalReviews})</span>
                  </div>
                </div>

                {vehicle.description && (
                  <p className="text-slate-600 leading-relaxed">{vehicle.description}</p>
                )}
              </CardContent>
            </Card>

            {/* Tabs */}
            <Card>
              <div className="flex border-b border-slate-100">
                {(['specs', 'owners', 'reviews'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 text-sm font-semibold capitalize transition-colors ${
                      activeTab === tab
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <CardContent className="p-6">
                {activeTab === 'specs' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {specs.map((spec) => (
                        <div key={spec.label} className="bg-slate-50 rounded-xl p-4">
                          <p className="text-xs text-slate-500 mb-1">{spec.label}</p>
                          <p className="font-semibold text-navy capitalize">{spec.value}</p>
                        </div>
                      ))}
                    </div>

                    {vehicle.features.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-semibold text-navy mb-3">Features & Amenities</h3>
                        <div className="flex flex-wrap gap-2">
                          {vehicle.features.map((f: string) => (
                            <span key={f} className="flex items-center gap-1.5 bg-primary-50 text-primary-700 text-sm px-3 py-1.5 rounded-full">
                              <CheckCircle className="w-3.5 h-3.5" />
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'owners' && (
                  <div className="space-y-4">
                    {!ownershipData?.ownerships?.length ? (
                      <p className="text-slate-500 text-center py-4">No co-owners yet. Be the first!</p>
                    ) : (
                      ownershipData.ownerships.map((o: { id: string; user: { name: string; avatar: string | null }; slotNumber: number; ownershipShare: number; status: string; isAdmin: boolean; weeklyHours: number; createdAt: string }) => (
                        <div key={o.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                          <UserAvatar src={o.user.avatar} name={o.user.name} />
                          <div className="flex-1">
                            <p className="font-semibold text-navy">{o.user.name}</p>
                            <p className="text-slate-500 text-sm">
                              Slot {o.slotNumber} · {o.ownershipShare}% share · {o.weeklyHours}h/week
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {o.isAdmin && <Badge variant="navy" className="text-xs">Admin</Badge>}
                            <Badge variant={o.status === 'ACTIVE' ? 'success' : 'secondary'} className="text-xs">
                              {o.status}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    {!vehicle.reviews?.length ? (
                      <p className="text-slate-500 text-center py-4">No reviews yet.</p>
                    ) : (
                      vehicle.reviews.map((r: VehicleReview) => (
                        <div key={r.id} className="p-4 border border-slate-100 rounded-xl">
                          <div className="flex items-center gap-3 mb-2">
                            {r.user && <UserAvatar src={r.user.avatar} name={r.user.name || 'User'} size="sm" />}
                            <div>
                              <p className="font-semibold text-sm">{r.user?.name || 'Verified User'}</p>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                                ))}
                                <span className="text-xs text-slate-500 ml-1">{formatRelativeTime(r.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          {r.comment && <p className="text-slate-600 text-sm">{r.comment}</p>}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: Booking / Ownership card */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="flex items-baseline justify-between mb-2">
                  <div>
                    <span className="text-3xl font-display font-bold text-primary-600">
                      {formatCurrency(vehicle.pricePerSlot)}
                    </span>
                    <span className="text-slate-500 text-sm ml-1">/slot/month</span>
                  </div>
                  <Badge variant={vehicle.availableSlots > 0 ? 'success' : 'warning'}>
                    {vehicle.availableSlots > 0 ? `${vehicle.availableSlots} slots left` : 'Full'}
                  </Badge>
                </div>

                {/* Slot visualization */}
                <div className="mb-6">
                  <p className="text-sm text-slate-500 mb-2">Ownership Slots</p>
                  <div className="flex gap-2">
                    {Array.from({ length: vehicle.totalSlots }).map((_, i) => {
                      const filled = i < (vehicle.totalSlots - vehicle.availableSlots)
                      return (
                        <div
                          key={i}
                          className={`flex-1 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${
                            filled
                              ? 'bg-primary-600 text-white'
                              : 'bg-slate-100 text-slate-400 border-2 border-dashed border-slate-300'
                          }`}
                        >
                          {filled ? `S${i + 1}` : 'Free'}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* cost breakdown */}
                <div className="bg-slate-50 rounded-xl p-4 mb-6 space-y-2">
                  <p className="font-semibold text-sm text-navy mb-3">Monthly Cost Breakdown</p>
                  {[
                    { label: 'Slot payment', value: formatCurrency(vehicle.pricePerSlot) },
                    { label: 'Maintenance share', value: formatCurrency(vehicle.monthlyMaintenanceCost / vehicle.totalSlots) },
                    { label: 'Insurance share', value: formatCurrency(vehicle.insuranceCost / vehicle.totalSlots) },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-slate-500">{label}</span>
                      <span className="font-medium text-navy">{value}</span>
                    </div>
                  ))}
                  <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-bold">
                    <span>Total/month</span>
                    <span className="text-primary-600">
                      {formatCurrency(
                        vehicle.pricePerSlot +
                        vehicle.monthlyMaintenanceCost / vehicle.totalSlots +
                        vehicle.insuranceCost / vehicle.totalSlots
                      )}
                    </span>
                  </div>
                </div>

                {hasSlot ? (
                  <div className="space-y-3">
                    <div className="bg-green-50 text-green-700 rounded-xl p-3 text-sm text-center font-medium">
                      ✓ You own a slot in this vehicle
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to={`/bookings/new/${vehicle.id}`}>
                        <Calendar className="w-4 h-4 mr-2" />Book a Slot
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full" asChild>
                      <Link to={`/co-owners/${vehicle.id}`}>
                        <MessageSquare className="w-4 h-4 mr-2" />Co-Owner Chat
                      </Link>
                    </Button>
                  </div>
                ) : vehicle.availableSlots > 0 ? (
                  <div className="space-y-3">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleClaimSlot}
                      loading={purchaseSlotMutation.isPending || paymentLoading}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Claim a Slot
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    {isAuthenticated && !user?.kycVerified && (
                      <div className="flex items-start gap-2 bg-amber-50 text-amber-700 rounded-xl p-3 text-xs">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>Complete KYC verification in <Link to="/settings" className="underline">Settings</Link> before purchasing.</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <Button variant="outline" className="w-full" disabled>
                    All Slots Taken
                  </Button>
                )}

                <p className="text-xs text-slate-400 text-center mt-4">
                  <Shield className="w-3 h-3 inline mr-1" />
                  Secure payment via Razorpay
                </p>
              </CardContent>
            </Card>

            {/* Quick stats */}
            <Card>
              <CardContent className="p-5 space-y-3">
                {[
                  { icon: Users, label: 'Co-owners', value: `${vehicle.totalSlots - vehicle.availableSlots}/${vehicle.totalSlots}` },
                  { icon: Calendar, label: 'Total bookings', value: vehicle.totalBookings.toString() },
                  { icon: Gauge, label: 'Transmission', value: vehicle.transmission },
                  { icon: Fuel, label: 'Fuel type', value: vehicle.fuelType },
                  { icon: Settings2, label: 'Engine', value: vehicle.engineCC ? `${vehicle.engineCC}cc` : 'N/A' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-500">
                      <Icon className="w-4 h-4" />{label}
                    </span>
                    <span className="font-semibold text-navy capitalize">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
