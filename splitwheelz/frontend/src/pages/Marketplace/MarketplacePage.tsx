import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Search, SlidersHorizontal, Heart, Star, Users, Fuel,
  MapPin, X, ChevronDown, Grid3X3, List, ArrowRight
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useVehicleStore } from '@/store/vehicleStore'

const mockVehicles = [
  {
    id: '1', brand: 'Hyundai', model: 'Creta', year: 2024,
    type: 'SUV', fuelType: 'PETROL', city: 'Bangalore',
    totalPrice: 1500000, pricePerSlot: 375000, monthlyEMI: 12500,
    totalSlots: 4, availableSlots: 2, rating: 4.8, totalReviews: 24,
    status: 'AVAILABLE', color: 'White',
    images: ['https://images.pexels.com/photos/1638459/pexels-photo-1638459.jpeg?w=600'],
    features: ['360° Camera', 'Sunroof', 'BOSE Sound', 'Ventilated Seats'],
  },
  {
    id: '2', brand: 'Toyota', model: 'Camry', year: 2024,
    type: 'SEDAN', fuelType: 'HYBRID', city: 'Mumbai',
    totalPrice: 4500000, pricePerSlot: 1500000, monthlyEMI: 37500,
    totalSlots: 3, availableSlots: 1, rating: 4.9, totalReviews: 18,
    status: 'AVAILABLE', color: 'Silver',
    images: ['https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?w=600'],
    features: ['HEV Engine', 'JBL Sound', 'Adaptive Cruise', 'Head-Up Display'],
  },
  {
    id: '3', brand: 'BMW', model: '5 Series', year: 2024,
    type: 'LUXURY', fuelType: 'PETROL', city: 'Delhi',
    totalPrice: 7500000, pricePerSlot: 1875000, monthlyEMI: 62500,
    totalSlots: 4, availableSlots: 3, rating: 5.0, totalReviews: 12,
    status: 'AVAILABLE', color: 'Black',
    images: ['https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?w=600'],
    features: ['Harman Kardon', 'Gesture Control', 'Massage Seats', 'Sky Lounge'],
  },
  {
    id: '4', brand: 'Tata', model: 'Nexon EV', year: 2024,
    type: 'ELECTRIC', fuelType: 'ELECTRIC', city: 'Pune',
    totalPrice: 2000000, pricePerSlot: 500000, monthlyEMI: 16667,
    totalSlots: 4, availableSlots: 4, rating: 4.6, totalReviews: 31,
    status: 'AVAILABLE', color: 'Blue',
    images: ['https://images.pexels.com/photos/1638459/pexels-photo-1638459.jpeg?w=600'],
    features: ['465km Range', 'Fast Charging', 'Zconnect App', 'V2L'],
  },
  {
    id: '5', brand: 'Honda', model: 'City', year: 2024,
    type: 'SEDAN', fuelType: 'PETROL', city: 'Chennai',
    totalPrice: 1200000, pricePerSlot: 300000, monthlyEMI: 10000,
    totalSlots: 4, availableSlots: 0, rating: 4.5, totalReviews: 42,
    status: 'FULLY_BOOKED', color: 'Red',
    images: ['https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?w=600'],
    features: ['Honda SENSING', 'LaneWatch', 'Wireless CarPlay', 'LED Headlights'],
  },
  {
    id: '6', brand: 'Mercedes', model: 'GLC', year: 2024,
    type: 'LUXURY', fuelType: 'DIESEL', city: 'Hyderabad',
    totalPrice: 9000000, pricePerSlot: 3000000, monthlyEMI: 75000,
    totalSlots: 3, availableSlots: 2, rating: 4.9, totalReviews: 8,
    status: 'AVAILABLE', color: 'White',
    images: ['https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?w=600'],
    features: ['MBUX', 'Burmester Sound', 'Heated Seats', 'Parking Assistant'],
  },
]

const brands = ['Hyundai', 'Toyota', 'BMW', 'Tata', 'Honda', 'Mercedes', 'Maruti', 'Ford']
const vehicleTypes = ['SEDAN', 'SUV', 'HATCHBACK', 'LUXURY', 'SPORTS', 'VAN', 'ELECTRIC']
const fuelTypes = ['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID', 'CNG']
const cities = ['Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Chennai', 'Hyderabad', 'Kolkata']

const typeColors: Record<string, string> = {
  SUV: 'bg-blue-100 text-blue-700',
  SEDAN: 'bg-green-100 text-green-700',
  LUXURY: 'bg-purple-100 text-purple-700',
  ELECTRIC: 'bg-teal-100 text-teal-700',
  HATCHBACK: 'bg-orange-100 text-orange-700',
  SPORTS: 'bg-red-100 text-red-700',
  VAN: 'bg-gray-100 text-gray-700',
}

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedFuel, setSelectedFuel] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [availableOnly, setAvailableOnly] = useState(false)
  const [maxPrice, setMaxPrice] = useState(10000000)
  const [sortBy, setSortBy] = useState('popular')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const { wishlist, toggleWishlist } = useVehicleStore()

  const filtered = useMemo(() => {
    let list = [...mockVehicles]
    if (searchQuery) list = list.filter((v) =>
      `${v.brand} ${v.model}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.city.toLowerCase().includes(searchQuery.toLowerCase())
    )
    if (selectedBrand) list = list.filter((v) => v.brand === selectedBrand)
    if (selectedType) list = list.filter((v) => v.type === selectedType)
    if (selectedFuel) list = list.filter((v) => v.fuelType === selectedFuel)
    if (selectedCity) list = list.filter((v) => v.city === selectedCity)
    if (availableOnly) list = list.filter((v) => v.availableSlots > 0)
    list = list.filter((v) => v.totalPrice <= maxPrice)

    if (sortBy === 'price-asc') list.sort((a, b) => a.totalPrice - b.totalPrice)
    else if (sortBy === 'price-desc') list.sort((a, b) => b.totalPrice - a.totalPrice)
    else if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating)
    else if (sortBy === 'slots') list.sort((a, b) => b.availableSlots - a.availableSlots)

    return list
  }, [searchQuery, selectedBrand, selectedType, selectedFuel, selectedCity, availableOnly, maxPrice, sortBy])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedBrand('')
    setSelectedType('')
    setSelectedFuel('')
    setSelectedCity('')
    setAvailableOnly(false)
    setMaxPrice(10000000)
  }

  const hasFilters = searchQuery || selectedBrand || selectedType || selectedFuel || selectedCity || availableOnly || maxPrice < 10000000

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="font-display font-bold text-2xl text-slate-900">Vehicle Marketplace</h1>
              <p className="text-slate-500 text-sm mt-0.5">{filtered.length} vehicles available for co-ownership</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field w-auto text-sm py-2"
              >
                <option value="popular">Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="slots">Most Slots Available</option>
              </select>
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by brand, model, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-12"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-medium text-sm transition-all ${
                showFilters || hasFilters
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-gray-200 hover:border-gray-300'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasFilters && <span className="w-2 h-2 bg-yellow-400 rounded-full" />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 280 }}
                exit={{ opacity: 0, width: 0 }}
                className="flex-shrink-0 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-fit overflow-hidden"
                style={{ minWidth: 260 }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-display font-bold text-slate-900">Filters</h3>
                  {hasFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-red-500 text-sm font-medium flex items-center gap-1 hover:text-red-600"
                    >
                      <X className="w-4 h-4" /> Clear all
                    </button>
                  )}
                </div>

                {/* Available Only Toggle */}
                <div className="mb-5">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="font-medium text-slate-700 text-sm">Available slots only</span>
                    <div
                      onClick={() => setAvailableOnly(!availableOnly)}
                      className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${availableOnly ? 'bg-blue-600' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${availableOnly ? 'translate-x-5' : ''}`} />
                    </div>
                  </label>
                </div>

                {/* Brand */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Brand</label>
                  <div className="relative">
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="input-field text-sm appearance-none pr-8"
                    >
                      <option value="">All Brands</option>
                      {brands.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Vehicle Type */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Vehicle Type</label>
                  <div className="flex flex-wrap gap-2">
                    {vehicleTypes.map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedType(selectedType === t ? '' : t)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                          selectedType === t
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fuel Type */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Fuel Type</label>
                  <div className="flex flex-wrap gap-2">
                    {fuelTypes.map((f) => (
                      <button
                        key={f}
                        onClick={() => setSelectedFuel(selectedFuel === f ? '' : f)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                          selectedFuel === f
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* City */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">City</label>
                  <div className="relative">
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="input-field text-sm appearance-none pr-8"
                    >
                      <option value="">All Cities</option>
                      {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Max Price: {formatCurrency(maxPrice)}
                  </label>
                  <input
                    type="range"
                    min={500000}
                    max={10000000}
                    step={100000}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>₹5L</span>
                    <span>₹1Cr</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Vehicle Grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🚗</div>
                <h3 className="font-display font-bold text-slate-900 text-xl mb-2">No vehicles found</h3>
                <p className="text-slate-500 mb-4">Try adjusting your filters</p>
                <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
              </div>
            ) : (
              <motion.div
                layout
                className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5' : 'space-y-4'}
              >
                <AnimatePresence>
                  {filtered.map((vehicle, i) => (
                    <motion.div
                      key={vehicle.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ y: -4 }}
                      className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group ${viewMode === 'list' ? 'flex' : ''}`}
                    >
                      {/* Image */}
                      <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-56 flex-shrink-0' : 'h-48'}`}>
                        <img
                          src={vehicle.images[0]}
                          alt={vehicle.model}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeColors[vehicle.type] ?? 'bg-gray-100 text-gray-700'}`}>
                            {vehicle.type}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3">
                          <button
                            onClick={() => toggleWishlist(vehicle.id)}
                            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow"
                          >
                            <Heart
                              className={`w-4 h-4 transition-colors ${wishlist.includes(vehicle.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
                            />
                          </button>
                        </div>
                        {vehicle.status === 'FULLY_BOOKED' && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="bg-white text-slate-900 font-bold text-sm px-4 py-2 rounded-full shadow">
                              Fully Booked
                            </span>
                          </div>
                        )}
                        {vehicle.availableSlots > 0 && vehicle.status !== 'FULLY_BOOKED' && (
                          <div className="absolute bottom-3 left-3">
                            <span className="bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">
                              {vehicle.availableSlots} slot{vehicle.availableSlots !== 1 ? 's' : ''} left
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-display font-bold text-slate-900 text-lg">
                            {vehicle.brand} {vehicle.model}
                          </h3>
                          <span className="text-slate-500 text-sm">{vehicle.year}</span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {vehicle.city}
                          </span>
                          <span className="flex items-center gap-1">
                            <Fuel className="w-3 h-3" />
                            {vehicle.fuelType}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {vehicle.rating} ({vehicle.totalReviews})
                          </span>
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {vehicle.features.slice(0, 3).map((f) => (
                            <span key={f} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-lg">
                              {f}
                            </span>
                          ))}
                          {vehicle.features.length > 3 && (
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-lg">
                              +{vehicle.features.length - 3}
                            </span>
                          )}
                        </div>

                        <div className="flex items-end justify-between">
                          <div>
                            <div className="text-xl font-display font-bold text-blue-600">
                              {formatCurrency(vehicle.monthlyEMI)}<span className="text-sm font-normal text-slate-500">/mo</span>
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              <Users className="w-3 h-3 inline mr-1" />
                              {vehicle.totalSlots} owners · {formatCurrency(vehicle.pricePerSlot)} per slot
                            </div>
                          </div>
                          <Link
                            to={`/vehicles/${vehicle.id}`}
                            className={`inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all ${
                              vehicle.status === 'FULLY_BOOKED'
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
                            }`}
                          >
                            {vehicle.status === 'FULLY_BOOKED' ? 'Join Waitlist' : 'View Details'}
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
