import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Search, SlidersHorizontal, Grid3x2 as Grid3X3, List, Star, MapPin, Fuel, Users, X, ChevronDown, Zap, Car } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { vehicleApi } from '@/lib/api'
import { useVehicleStore } from '@/stores/vehicleStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { formatCurrency, getVehicleStatusColor, getFuelIcon } from '@/lib/utils'
import type { Vehicle } from '@/types'

const vehicleTypes = ['SEDAN', 'SUV', 'HATCHBACK', 'LUXURY', 'SPORTS', 'ELECTRIC', 'VAN']
const fuelTypes = ['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID', 'CNG']

function VehicleCard({ vehicle, viewMode }: { vehicle: Vehicle; viewMode: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all"
      >
        <Link to={`/vehicles/${vehicle.id}`} className="flex gap-0">
          <div className="relative w-64 flex-shrink-0">
            <img
              src={vehicle.images[0] || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400'}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-full h-full object-cover"
            />
            {vehicle.isFeatured && (
              <div className="absolute top-3 left-3">
                <Badge variant="gradient" className="text-xs">⭐ Featured</Badge>
              </div>
            )}
          </div>
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-display text-xl font-bold text-navy">
                  {vehicle.make} {vehicle.model}
                </h3>
                <p className="text-slate-500 text-sm flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {vehicle.location || 'Location TBA'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary-600">{formatCurrency(vehicle.pricePerSlot)}</p>
                <p className="text-xs text-slate-500">/slot/month</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">{vehicle.year}</Badge>
              <Badge variant="secondary">{getFuelIcon(vehicle.fuelType)} {vehicle.fuelType}</Badge>
              <Badge variant="secondary">{vehicle.transmission}</Badge>
              <Badge variant={vehicle.status === 'AVAILABLE' ? 'success' : 'warning'}>
                {vehicle.status.replace('_', ' ')}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {vehicle.availableSlots}/{vehicle.totalSlots} slots
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {vehicle.averageRating} ({vehicle.totalReviews})
                </span>
              </div>
              <Button size="sm" className="ml-4">
                View Details
              </Button>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
    >
      <Link to={`/vehicles/${vehicle.id}`}>
        <div className="relative overflow-hidden h-52">
          <img
            src={vehicle.images[0] || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400'}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {vehicle.isFeatured && (
            <div className="absolute top-3 left-3">
              <Badge variant="gradient" className="text-xs">⭐ Featured</Badge>
            </div>
          )}

          {vehicle.isVerified && (
            <div className="absolute top-3 right-3">
              <Badge variant="success" className="text-xs">✓ Verified</Badge>
            </div>
          )}

          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
            <div className={`text-xs px-2 py-1 rounded-lg font-medium ${getVehicleStatusColor(vehicle.status)}`}>
              {vehicle.availableSlots > 0 ? `${vehicle.availableSlots} slots left` : 'Fully Booked'}
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1">
              <span className="font-bold text-navy text-sm">{formatCurrency(vehicle.pricePerSlot)}/mo</span>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-display font-bold text-lg text-navy leading-tight">
                {vehicle.make} {vehicle.model}
              </h3>
              <p className="text-slate-500 text-sm">{vehicle.year} · {vehicle.color}</p>
            </div>
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-amber-700 text-sm font-bold">{vehicle.averageRating}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-500 text-sm mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>{vehicle.location || 'Location TBA'}</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            <span className="text-xs bg-slate-50 text-slate-600 px-2 py-1 rounded-lg">
              {getFuelIcon(vehicle.fuelType)} {vehicle.fuelType}
            </span>
            <span className="text-xs bg-slate-50 text-slate-600 px-2 py-1 rounded-lg">
              <Fuel className="w-3 h-3 inline mr-1" />
              {vehicle.mileage ? `${vehicle.mileage} km/l` : 'N/A'}
            </span>
            <span className="text-xs bg-slate-50 text-slate-600 px-2 py-1 rounded-lg">
              {vehicle.seatingCapacity} seats
            </span>
          </div>

          {/* Slot progress */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>Ownership slots</span>
              <span className="font-semibold text-navy">
                {vehicle.totalSlots - vehicle.availableSlots}/{vehicle.totalSlots} filled
              </span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-accent rounded-full transition-all"
                style={{
                  width: `${((vehicle.totalSlots - vehicle.availableSlots) / vehicle.totalSlots) * 100}%`
                }}
              />
            </div>
          </div>

          <Button className="w-full" size="sm" disabled={vehicle.availableSlots === 0}>
            {vehicle.availableSlots > 0 ? 'View & Own a Slot' : 'Join Waitlist'}
          </Button>
        </div>
      </Link>
    </motion.div>
  )
}

export default function VehicleMarketplace() {
  const { filters, setFilters, resetFilters, currentPage, setPage, viewMode, setViewMode } = useVehicleStore()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchInput, setSearchInput] = useState(filters.search)

  const queryParams: Record<string, unknown> = {
    page: currentPage,
    limit: 12,
    ...(filters.type && { type: filters.type }),
    ...(filters.fuelType && { fuelType: filters.fuelType }),
    ...(filters.location && { location: filters.location }),
    ...(filters.search && { search: filters.search }),
    ...(filters.minPrice > 0 && { minPrice: filters.minPrice }),
    ...(filters.maxPrice < 200000 && { maxPrice: filters.maxPrice }),
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    status: 'AVAILABLE',
  }

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['vehicles', queryParams],
    queryFn: async () => {
      const { data } = await vehicleApi.getAll(queryParams)
      return data.data as { vehicles: Vehicle[]; pagination: { total: number; totalPages: number; page: number } }
    },
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters({ search: searchInput })
  }

  const activeFilterCount = [
    filters.type, filters.fuelType, filters.minPrice > 0, filters.maxPrice < 200000,
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero bar */}
      <div className="bg-navy pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h1 className="font-display text-3xl lg:text-5xl font-bold text-white mb-2">
              Find Your Perfect Co-Own
            </h1>
            <p className="text-white/60 text-lg">
              {data?.pagination?.total || 0}+ vehicles available across India
            </p>
          </motion.div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto">
            <Input
              placeholder="Search by make, model, location..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:bg-white focus-visible:text-navy"
            />
            <Button type="submit" variant="gradient">Search</Button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter row */}
        <div className="flex flex-wrap gap-3 items-center mb-6">
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:border-primary-300 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="default" className="text-xs h-5 w-5 p-0 flex items-center justify-center rounded-full">
                {activeFilterCount}
              </Badge>
            )}
          </button>

          {/* Quick type filters */}
          <div className="flex gap-2 flex-wrap">
            {vehicleTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilters({ type: filters.type === type ? '' : type })}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  filters.type === type
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="ml-auto flex items-center gap-3">
            <Select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onValueChange={(v) => {
                const [sortBy, sortOrder] = v.split('-')
                setFilters({ sortBy, sortOrder: sortOrder as 'asc' | 'desc' })
              }}
            >
              <SelectTrigger className="w-44 h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                <SelectItem value="pricePerSlot-asc">Price: Low to High</SelectItem>
                <SelectItem value="pricePerSlot-desc">Price: High to Low</SelectItem>
                <SelectItem value="averageRating-desc">Top Rated</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active filters */}
        <AnimatePresence>
          {(filters.type || filters.fuelType || filters.search || filters.minPrice > 0) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2 mb-4"
            >
              {filters.search && (
                <Badge variant="info" className="gap-1 cursor-pointer" onClick={() => { setFilters({ search: '' }); setSearchInput('') }}>
                  Search: {filters.search} <X className="w-3 h-3" />
                </Badge>
              )}
              {filters.type && (
                <Badge variant="info" className="gap-1 cursor-pointer" onClick={() => setFilters({ type: '' })}>
                  {filters.type} <X className="w-3 h-3" />
                </Badge>
              )}
              {filters.fuelType && (
                <Badge variant="info" className="gap-1 cursor-pointer" onClick={() => setFilters({ fuelType: '' })}>
                  {filters.fuelType} <X className="w-3 h-3" />
                </Badge>
              )}
              <button
                onClick={resetFilters}
                className="text-xs text-red-500 hover:underline flex items-center gap-1"
              >
                Clear all
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter drawer */}
        <AnimatePresence>
          {drawerOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 overflow-hidden"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Fuel Type</label>
                  <Select value={filters.fuelType || 'all'} onValueChange={(v) => setFilters({ fuelType: v === 'all' ? '' : v })}>
                    <SelectTrigger><SelectValue placeholder="All Fuel Types" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Fuel Types</SelectItem>
                      {fuelTypes.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Location</label>
                  <Input
                    placeholder="City or area"
                    value={filters.location}
                    onChange={(e) => setFilters({ location: e.target.value })}
                    leftIcon={<MapPin className="w-4 h-4" />}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Min Price/slot</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice || ''}
                    onChange={(e) => setFilters({ minPrice: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Max Price/slot</label>
                  <Input
                    type="number"
                    placeholder="200000"
                    value={filters.maxPrice < 200000 ? filters.maxPrice : ''}
                    onChange={(e) => setFilters({ maxPrice: parseInt(e.target.value) || 200000 })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                <Button variant="outline" size="sm" onClick={resetFilters}>Reset</Button>
                <Button size="sm" onClick={() => setDrawerOpen(false)}>Apply Filters</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-80 rounded-2xl skeleton" />
            ))}
          </div>
        ) : !data?.vehicles?.length ? (
          <div className="text-center py-20">
            <Car className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="font-display text-2xl font-bold text-navy mb-2">No vehicles found</h3>
            <p className="text-slate-500 mb-6">Try adjusting your search or filters</p>
            <Button onClick={resetFilters}>Clear Filters</Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-500 text-sm">
                Showing {data.vehicles.length} of {data.pagination.total} vehicles
                {isFetching && <Spinner size="sm" className="inline-block ml-2" />}
              </p>
            </div>

            <div className={viewMode === 'grid'
              ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
            }>
              {data.vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} viewMode={viewMode} />
              ))}
            </div>

            {/* Pagination */}
            {data.pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setPage(currentPage - 1)}
                >
                  Previous
                </Button>
                {Array.from({ length: Math.min(data.pagination.totalPages, 5) }).map((_, i) => {
                  const page = i + 1
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPage(page)}
                    >
                      {page}
                    </Button>
                  )
                })}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === data.pagination.totalPages}
                  onClick={() => setPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
