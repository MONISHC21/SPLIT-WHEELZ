import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Heart, Share2, Star, MapPin, Fuel, Users, Shield,
  ChevronLeft, ChevronRight, CheckCircle2, Wrench, CreditCard,
  Calendar, Zap, Award
} from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatCurrency, getInitials } from '@/lib/utils'
import { useVehicleStore } from '@/store/vehicleStore'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

const mockVehicle = {
  id: '1',
  brand: 'Hyundai',
  model: 'Creta',
  year: 2024,
  type: 'SUV',
  fuelType: 'PETROL',
  city: 'Bangalore',
  location: 'Koramangala, Bangalore',
  totalPrice: 1500000,
  pricePerSlot: 375000,
  monthlyEMI: 12500,
  insuranceCost: 2500,
  maintenanceCost: 1500,
  totalSlots: 4,
  availableSlots: 2,
  rating: 4.8,
  totalReviews: 24,
  status: 'AVAILABLE',
  color: 'Polar White',
  registrationNumber: 'KA-01-AB-1234',
  images: [
    'https://images.pexels.com/photos/1638459/pexels-photo-1638459.jpeg?w=800',
    'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?w=800',
    'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?w=800',
    'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?w=800',
  ],
  features: ['360° Camera', 'Panoramic Sunroof', 'BOSE Sound System', 'Ventilated Seats', 'Wireless CarPlay', '6 Airbags', 'Lane Departure Warning', 'Blind Spot Monitor'],
  specs: {
    'Engine': '1.5L Turbo GDi',
    'Power': '160 bhp',
    'Torque': '253 Nm',
    'Transmission': '7-Speed DCT',
    'Mileage': '14.4 km/l',
    'Fuel Tank': '50 liters',
    'Boot Space': '433 liters',
    'Safety Rating': '5 Star (NCAP)',
  },
  coOwners: [
    { id: '1', name: 'Rahul Sharma', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=200', percentage: 25, trustScore: 94, status: 'ACTIVE' },
    { id: '2', name: 'Priya Menon', avatar: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?w=200', percentage: 25, trustScore: 88, status: 'ACTIVE' },
  ],
}

const COLORS = ['#2563EB', '#22C55E', '#38BDF8', '#94a3b8']

export default function VehicleDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { wishlist, toggleWishlist } = useVehicleStore()
  const [currentImage, setCurrentImage] = useState(0)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<'specs' | 'features' | 'owners' | 'costs'>('specs')

  // In real app, fetch by id
  const vehicle = { ...mockVehicle, id: id || '1' }

  const ownershipData = [
    ...vehicle.coOwners.map((o, i) => ({ name: o.name, value: o.percentage, color: COLORS[i] })),
    { name: 'Available', value: vehicle.availableSlots * 25, color: '#e2e8f0' },
  ]

  const costBreakdown = [
    { label: 'Monthly EMI', amount: vehicle.monthlyEMI, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Insurance Share', amount: vehicle.insuranceCost, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Maintenance Fund', amount: vehicle.maintenanceCost, color: 'text-orange-600', bg: 'bg-orange-50' },
  ]
  const totalMonthly = vehicle.monthlyEMI + vehicle.insuranceCost + vehicle.maintenanceCost

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % vehicle.images.length)
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length)

  const handleJoinOwnership = () => {
    if (!user) {
      navigate('/login')
      return
    }
    if (selectedSlot === null) {
      toast.error('Please select a slot number')
      return
    }
    setShowPaymentModal(true)
  }

  const handlePayment = async () => {
    toast.success('Payment initiated! Redirecting to Razorpay...')
    setTimeout(() => {
      setShowPaymentModal(false)
      toast.success('🎉 You are now a co-owner! Welcome to the family.')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleWishlist(vehicle.id)}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                wishlist.includes(vehicle.id)
                  ? 'bg-red-50 border-red-200 text-red-500'
                  : 'border-gray-200 text-gray-400 hover:border-gray-300'
              }`}
            >
              <Heart className={`w-4 h-4 ${wishlist.includes(vehicle.id) ? 'fill-red-500' : ''}`} />
            </button>
            <button className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-300 transition-all">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
              <div className="relative h-72 md:h-96">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImage}
                    src={vehicle.images[currentImage]}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>

                {/* Navigation arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-700" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all"
                >
                  <ChevronRight className="w-5 h-5 text-slate-700" />
                </button>

                {/* Image count */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                  {currentImage + 1} / {vehicle.images.length}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 p-4">
                {vehicle.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                      currentImage === i ? 'ring-2 ring-blue-500 scale-105' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle Header */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">{vehicle.type}</span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      vehicle.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {vehicle.availableSlots > 0 ? `${vehicle.availableSlots} Slots Available` : 'Fully Booked'}
                    </span>
                  </div>
                  <h1 className="font-display font-bold text-3xl text-slate-900">
                    {vehicle.brand} {vehicle.model} {vehicle.year}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />{vehicle.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Fuel className="w-4 h-4" />{vehicle.fuelType}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {vehicle.rating} ({vehicle.totalReviews} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex border-b border-gray-100">
                {(['specs', 'features', 'owners', 'costs'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 text-sm font-semibold capitalize transition-all ${
                      activeTab === tab
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tab === 'owners' ? 'Co-Owners' : tab}
                  </button>
                ))}
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  {activeTab === 'specs' && (
                    <motion.div
                      key="specs"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {Object.entries(vehicle.specs).map(([key, val]) => (
                          <div key={key} className="bg-gray-50 rounded-xl p-4">
                            <div className="text-xs text-slate-500 mb-1">{key}</div>
                            <div className="font-semibold text-slate-900 text-sm">{val}</div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  {activeTab === 'features' && (
                    <motion.div
                      key="features"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {vehicle.features.map((f) => (
                          <div key={f} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-slate-700 text-sm font-medium">{f}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  {activeTab === 'owners' && (
                    <motion.div
                      key="owners"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {vehicle.coOwners.map((owner, i) => (
                          <div key={owner.id} className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4">
                            <img
                              src={owner.avatar}
                              alt={owner.name}
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-200"
                            />
                            <div className="flex-1">
                              <div className="font-semibold text-slate-900 text-sm">{owner.name}</div>
                              <div className="text-xs text-slate-500 mt-0.5">
                                {owner.percentage}% ownership
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <Shield className="w-3 h-3 text-green-500" />
                                <span className="text-xs text-green-700 font-medium">{owner.trustScore}% Trust Score</span>
                              </div>
                            </div>
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                              style={{ background: COLORS[i] }}
                            >
                              {getInitials(owner.name)}
                            </div>
                          </div>
                        ))}
                        {vehicle.availableSlots > 0 && (
                          <div className="flex items-center gap-4 bg-blue-50 border-2 border-dashed border-blue-200 rounded-2xl p-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                              <Users className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                              <div className="font-semibold text-blue-700 text-sm">Open Slot</div>
                              <div className="text-xs text-blue-500 mt-0.5">25% ownership available</div>
                              <div className="text-xs text-blue-600 font-medium mt-1">Be the next co-owner!</div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Pie chart */}
                      <div className="pt-4">
                        <h4 className="font-semibold text-slate-900 mb-3 text-sm">Ownership Distribution</h4>
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie
                              data={ownershipData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={90}
                              paddingAngle={3}
                              dataKey="value"
                            >
                              {ownershipData.map((entry, i) => (
                                <Cell key={i} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(v) => `${v}%`} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </motion.div>
                  )}
                  {activeTab === 'costs' && (
                    <motion.div
                      key="costs"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="space-y-3 mb-6">
                        {costBreakdown.map((cost) => (
                          <div key={cost.label} className={`${cost.bg} rounded-xl p-4 flex items-center justify-between`}>
                            <span className="font-medium text-slate-700 text-sm">{cost.label}</span>
                            <span className={`font-bold ${cost.color}`}>{formatCurrency(cost.amount)}/mo</span>
                          </div>
                        ))}
                        <div className="bg-slate-900 text-white rounded-xl p-4 flex items-center justify-between">
                          <span className="font-semibold">Total Monthly Cost</span>
                          <span className="font-display font-bold text-xl">{formatCurrency(totalMonthly)}</span>
                        </div>
                      </div>
                      <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-green-800 text-sm">You save vs solo ownership</span>
                        </div>
                        <div className="font-display font-bold text-2xl text-green-600">
                          {formatCurrency(vehicle.monthlyEMI * 3)}/mo
                        </div>
                        <p className="text-green-600 text-xs mt-1">That's 75% savings compared to owning alone!</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right column - Sticky booking card */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-6">
              <div className="mb-5">
                <div className="font-display font-bold text-3xl text-blue-600">
                  {formatCurrency(vehicle.monthlyEMI)}<span className="text-sm font-normal text-slate-500">/month</span>
                </div>
                <div className="text-slate-500 text-sm mt-1">
                  One-time: {formatCurrency(vehicle.pricePerSlot)} per slot
                </div>
              </div>

              {/* Cost Cards */}
              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-3 bg-blue-50 rounded-xl p-3">
                  <CreditCard className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <div className="flex-1 text-sm">
                    <span className="text-slate-600">EMI</span>
                  </div>
                  <span className="font-bold text-blue-700 text-sm">{formatCurrency(vehicle.monthlyEMI)}</span>
                </div>
                <div className="flex items-center gap-3 bg-purple-50 rounded-xl p-3">
                  <Shield className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <div className="flex-1 text-sm">
                    <span className="text-slate-600">Insurance</span>
                  </div>
                  <span className="font-bold text-purple-700 text-sm">{formatCurrency(vehicle.insuranceCost)}</span>
                </div>
                <div className="flex items-center gap-3 bg-orange-50 rounded-xl p-3">
                  <Wrench className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <div className="flex-1 text-sm">
                    <span className="text-slate-600">Maintenance</span>
                  </div>
                  <span className="font-bold text-orange-700 text-sm">{formatCurrency(vehicle.maintenanceCost)}</span>
                </div>
              </div>

              {/* Slot selector */}
              {vehicle.availableSlots > 0 && (
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Select Slot Number
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((slot) => {
                      const isTaken = slot <= (vehicle.totalSlots - vehicle.availableSlots)
                      return (
                        <button
                          key={slot}
                          disabled={isTaken}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                            isTaken
                              ? 'bg-red-50 text-red-300 cursor-not-allowed border border-red-100'
                              : selectedSlot === slot
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                              : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                          }`}
                        >
                          {isTaken ? '🔒' : `#${slot}`}
                        </button>
                      )
                    })}
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full" /> Available</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-300 rounded-full" /> Taken</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleJoinOwnership}
                disabled={vehicle.availableSlots === 0}
                className="w-full btn-primary flex items-center justify-center gap-2 text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap className="w-5 h-5" />
                {vehicle.availableSlots === 0 ? 'Join Waitlist' : 'Join Ownership'}
              </button>

              <Link
                to={user ? `/bookings/new/${vehicle.id}` : '/login'}
                className="w-full btn-secondary flex items-center justify-center gap-2 mt-3 text-sm"
              >
                <Calendar className="w-4 h-4" />
                Book a Drive Slot
              </Link>

              {/* Trust badges */}
              <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
                {[
                  { icon: Shield, text: 'KYC Verified Owners' },
                  { icon: CheckCircle2, text: 'RTO Registered Vehicle' },
                  { icon: Award, text: 'Insured & Maintained' },
                ].map((badge) => (
                  <div key={badge.text} className="flex items-center gap-2 text-sm text-slate-600">
                    <badge.icon className="w-4 h-4 text-green-500" />
                    <span>{badge.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowPaymentModal(false) }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <h2 className="font-display font-bold text-2xl text-slate-900 mb-2">Confirm Ownership</h2>
              <p className="text-slate-500 mb-6">You're about to join as a co-owner of {vehicle.brand} {vehicle.model}</p>

              <div className="bg-gray-50 rounded-2xl p-4 space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Slot Number</span>
                  <span className="font-bold text-slate-900">#{selectedSlot}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Ownership Share</span>
                  <span className="font-bold text-slate-900">25%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">One-time Payment</span>
                  <span className="font-bold text-slate-900">{formatCurrency(vehicle.pricePerSlot)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Monthly Cost</span>
                  <span className="font-bold text-blue-600">{formatCurrency(totalMonthly)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowPaymentModal(false)} className="flex-1 btn-secondary">
                  Cancel
                </button>
                <button onClick={handlePayment} className="flex-1 btn-primary">
                  Pay with Razorpay
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
