import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Bell, Shield, CreditCard, Globe, Camera, Save, Upload } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { authApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { UserAvatar } from '@/components/ui/avatar'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: '',
      city: '',
      state: '',
      pincode: '',
      addressLine1: '',
      drivingLicense: '',
    },
  })

  const handleSaveProfile = async (data: Record<string, string>) => {
    setIsSaving(true)
    try {
      const { data: res } = await authApi.updateProfile(data)
      if (res.success) {
        updateUser({ name: data.name })
        toast.success('Profile updated successfully')
      }
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ]

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-navy">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account preferences</p>
      </motion.div>

      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit flex-wrap">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === id ? 'bg-white text-navy shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Avatar */}
          <Card>
            <CardContent className="p-6 flex flex-col items-center">
              <div className="relative mb-4">
                <UserAvatar src={user?.avatar} name={user?.name || ''} size="xl" />
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors shadow-md">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-display font-bold text-lg text-navy text-center">{user?.name}</h3>
              <p className="text-slate-500 text-sm text-center">{user?.email}</p>
              <div className="flex gap-2 mt-3 flex-wrap justify-center">
                {user?.isEmailVerified && <Badge variant="success" className="text-xs">✓ Email</Badge>}
                {user?.kycVerified && <Badge variant="success" className="text-xs">✓ KYC</Badge>}
                <Badge variant="info" className="text-xs">{user?.role}</Badge>
              </div>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
            </CardContent>
          </Card>

          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(handleSaveProfile)} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Full Name" {...form.register('name')} placeholder="Your full name" />
                    <Input label="Phone Number" {...form.register('phone')} placeholder="+91 98765 43210" />
                  </div>
                  <Input label="Address Line 1" {...form.register('addressLine1')} placeholder="Street address" />
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Input label="City" {...form.register('city')} placeholder="Bangalore" />
                    <Input label="State" {...form.register('state')} placeholder="Karnataka" />
                    <Input label="Pincode" {...form.register('pincode')} placeholder="560001" />
                  </div>
                  <Input
                    label="Driving License Number"
                    {...form.register('drivingLicense')}
                    placeholder="KA-01-20230001234"
                    helpText="Required for booking vehicles"
                  />
                  <Button type="submit" loading={isSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <Card>
          <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            {[
              { label: 'Booking Confirmations', desc: 'Get notified when a booking is confirmed', key: 'booking' },
              { label: 'Payment Receipts', desc: 'Receive payment and refund notifications', key: 'payment' },
              { label: 'Maintenance Reminders', desc: 'Vehicle service and maintenance alerts', key: 'maintenance' },
              { label: 'Co-Owner Messages', desc: 'New messages in your group chats', key: 'chat' },
              { label: 'Vote & Dispute Updates', desc: 'Updates on votes and dispute resolutions', key: 'votes' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                <div>
                  <p className="font-medium text-navy text-sm">{item.label}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all" />
                </label>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {activeTab === 'security' && (
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>KYC Verification</CardTitle></CardHeader>
            <CardContent>
              {user?.kycVerified ? (
                <div className="flex items-center gap-3 bg-green-50 text-green-700 p-4 rounded-xl">
                  <Shield className="w-5 h-5" />
                  <div>
                    <p className="font-semibold">KYC Verified ✓</p>
                    <p className="text-sm opacity-80">Your identity is verified. You can purchase ownership slots.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-amber-50 text-amber-700 p-4 rounded-xl">
                    <Shield className="w-5 h-5" />
                    <div>
                      <p className="font-semibold">KYC Not Verified</p>
                      <p className="text-sm opacity-80">Verify your identity to purchase vehicle slots.</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-2">Aadhaar Card</p>
                      <Button variant="outline" className="w-full">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Aadhaar
                      </Button>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-2">PAN Card</p>
                      <Button variant="outline" className="w-full">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload PAN
                      </Button>
                    </div>
                  </div>
                  <Button>Submit for Verification</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'billing' && (
        <Card>
          <CardHeader><CardTitle>Billing & Payments</CardTitle></CardHeader>
          <CardContent>
            <p className="text-slate-500 text-sm mb-4">
              All payments are processed securely via Razorpay. Your card details are not stored on our servers.
            </p>
            <Button variant="outline" asChild>
              <a href="/payments">View Transaction History</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
