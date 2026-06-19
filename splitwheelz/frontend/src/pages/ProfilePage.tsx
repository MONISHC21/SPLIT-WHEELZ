import { motion } from 'framer-motion'
import { Star, Car, Calendar, CreditCard, MapPin, Phone, Mail, Award } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { userApi } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/ui/avatar'
import { Link } from 'react-router-dom'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function ProfilePage() {
  const { user } = useAuthStore()
  const { data: profile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data } = await userApi.getProfile()
      return data.data
    },
  })

  const p = profile || user

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-navy">My Profile</h1>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <Card>
          <CardContent className="p-8 flex flex-col items-center text-center">
            <UserAvatar src={p?.avatar} name={p?.name || 'User'} size="xl" className="mb-4 w-24 h-24 text-2xl" />
            <h2 className="font-display text-2xl font-bold text-navy">{p?.name}</h2>
            <p className="text-slate-500 text-sm mt-1">{p?.role}</p>
            <div className="flex gap-2 mt-3 flex-wrap justify-center">
              {p?.isEmailVerified && <Badge variant="success" className="text-xs">✓ Email</Badge>}
              {p?.kycVerified && <Badge variant="success" className="text-xs">✓ KYC</Badge>}
            </div>

            <div className="w-full mt-6 space-y-3 text-sm text-slate-600">
              {p?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{p.email}</span>
                </div>
              )}
              {p?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{p.phone}</span>
                </div>
              )}
              {p?.city && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{p.city}{p.state && `, ${p.state}`}</span>
                </div>
              )}
            </div>

            <Button variant="outline" size="sm" className="mt-6 w-full" asChild>
              <Link to="/settings">Edit Profile</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="lg:col-span-2 space-y-4">
          {/* Loyalty points banner */}
          <div className="bg-gradient-to-r from-primary-600 to-accent rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Loyalty Points</p>
                <p className="text-4xl font-display font-bold mt-1">{p?.loyaltyPoints || 0}</p>
                <p className="text-white/70 text-sm mt-1">≈ {formatCurrency((p?.loyaltyPoints || 0) * 0.5)} value</p>
              </div>
              <Award className="w-16 h-16 text-white/30" />
            </div>
            <p className="text-white/80 text-sm mt-3">
              Earn 1 point per ₹100 spent. Redeem for booking discounts.
            </p>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Car, label: 'Vehicles', value: '2' },
              { icon: Calendar, label: 'Bookings', value: p?.totalBookings || 0 },
              { icon: CreditCard, label: 'Total Spent', value: formatCurrency(p?.totalSpent || 0) },
            ].map(({ icon: Icon, label, value }) => (
              <Card key={label}>
                <CardContent className="p-4 text-center">
                  <Icon className="w-6 h-6 text-primary-500 mx-auto mb-2" />
                  <p className="font-bold text-xl text-navy">{value}</p>
                  <p className="text-slate-500 text-xs">{label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Member since */}
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="font-semibold text-navy">Member since</p>
                <p className="text-slate-500 text-sm">{p?.createdAt ? formatDate(p.createdAt, 'MMMM yyyy') : 'N/A'}</p>
              </div>
              <div className="ml-auto">
                <Badge variant="gradient">Active Member</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Referral Program</CardTitle></CardHeader>
            <CardContent>
              <p className="text-slate-500 text-sm mb-3">
                Share your referral code and earn 500 loyalty points for each friend who joins!
              </p>
              <div className="flex gap-2">
                <div className="flex-1 bg-slate-100 rounded-xl px-4 py-2.5 font-mono font-bold text-navy text-sm">
                  {p?.referralCode || 'LOADING...'}
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(p?.referralCode || '')
                    alert('Copied!')
                  }}
                >
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
