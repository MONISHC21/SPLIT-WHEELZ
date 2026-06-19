import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User, Bell, Shield, CreditCard, Smartphone, Camera,
  Eye, EyeOff, CheckCircle2, Upload, Trash2, LogOut
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { getInitials } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function SettingsPage() {
  const { user, setUser, logout } = useAuthStore()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'payments'>('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [notifications, setNotifications] = useState({
    emailEmi: true,
    emailBooking: true,
    emailMaintenance: false,
    smsEmi: true,
    smsBooking: false,
    pushAll: true,
  })
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: '',
  })

  const handleSaveProfile = async () => {
    await new Promise((r) => setTimeout(r, 600))
    if (user) {
      setUser({ ...user, name: profileForm.name, phone: profileForm.phone })
    }
    toast.success('Profile updated successfully!')
  }

  const handleDeleteAccount = () => {
    toast.error('Account deletion requires verification. Email sent.')
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & KYC', icon: Shield },
    { id: 'payments', label: 'Payment Methods', icon: CreditCard },
  ] as const

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display font-bold text-2xl text-slate-900">Settings</h2>
        <p className="text-slate-500 text-sm mt-0.5">Manage your account preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            {/* Avatar */}
            <div className="text-center mb-5 pb-5 border-b border-gray-100">
              <div className="relative inline-block">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-100 mx-auto" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-2xl mx-auto ring-4 ring-blue-100">
                    {getInitials(user?.name || 'U')}
                  </div>
                )}
                <button className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors">
                  <Camera className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
              <div className="mt-3">
                <div className="font-semibold text-slate-900">{user?.name}</div>
                <div className="text-slate-500 text-sm">{user?.email}</div>
                {user?.isKycVerified && (
                  <div className="flex items-center justify-center gap-1 mt-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600 font-medium">KYC Verified</span>
                  </div>
                )}
              </div>
            </div>

            {/* Nav */}
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-4 h-4 flex-shrink-0" />
                  {tab.label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all mt-2"
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                Sign Out
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            {activeTab === 'profile' && (
              <div className="space-y-5">
                <h3 className="font-display font-bold text-slate-900 text-lg">Personal Information</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                    <input
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                    <input
                      value={profileForm.email}
                      disabled
                      className="input-field opacity-60 cursor-not-allowed"
                    />
                    <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
                    <input
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      placeholder="+91 9876543210"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
                    <select className="input-field">
                      <option>Bangalore</option>
                      <option>Mumbai</option>
                      <option>Delhi</option>
                      <option>Chennai</option>
                      <option>Pune</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>
                  <textarea
                    rows={3}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    placeholder="Tell your co-owners a bit about yourself..."
                    className="input-field resize-none"
                  />
                </div>

                {/* Profile picture upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Profile Photo</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Click to upload a new photo</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button onClick={handleSaveProfile} className="btn-primary">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="font-display font-bold text-slate-900 text-lg">Notification Preferences</h3>

                {[
                  { section: 'Email Notifications', icon: '📧', items: [
                    { key: 'emailEmi', label: 'EMI Reminders', desc: '3 days before due date' },
                    { key: 'emailBooking', label: 'Booking Updates', desc: 'Confirmation, cancellation, reminders' },
                    { key: 'emailMaintenance', label: 'Maintenance Alerts', desc: 'Service due soon alerts' },
                  ]},
                  { section: 'SMS Notifications', icon: '📱', items: [
                    { key: 'smsEmi', label: 'EMI Reminders', desc: 'Text alerts before due date' },
                    { key: 'smsBooking', label: 'Booking Reminders', desc: 'Day-before booking reminder' },
                  ]},
                  { section: 'Push Notifications', icon: '🔔', items: [
                    { key: 'pushAll', label: 'All Notifications', desc: 'Receive all push notifications' },
                  ]},
                ].map((group) => (
                  <div key={group.section}>
                    <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <span>{group.icon}</span>
                      {group.section}
                    </h4>
                    <div className="space-y-3">
                      {group.items.map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <div className="font-medium text-slate-900 text-sm">{item.label}</div>
                            <div className="text-slate-500 text-xs mt-0.5">{item.desc}</div>
                          </div>
                          <div
                            onClick={() => setNotifications((n) => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))}
                            className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${
                              notifications[item.key as keyof typeof notifications] ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                          >
                            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                              notifications[item.key as keyof typeof notifications] ? 'translate-x-5' : ''
                            }`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex justify-end">
                  <button onClick={() => toast.success('Notification preferences saved!')} className="btn-primary">
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="font-display font-bold text-slate-900 text-lg">Security & KYC</h3>

                {/* KYC Status */}
                <div className={`rounded-2xl p-5 border ${user?.isKycVerified ? 'bg-green-50 border-green-100' : 'bg-amber-50 border-amber-100'}`}>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className={`w-6 h-6 ${user?.isKycVerified ? 'text-green-600' : 'text-amber-600'}`} />
                    <div>
                      <div className={`font-semibold ${user?.isKycVerified ? 'text-green-800' : 'text-amber-800'}`}>
                        KYC {user?.isKycVerified ? 'Verified' : 'Pending Verification'}
                      </div>
                      <p className={`text-sm ${user?.isKycVerified ? 'text-green-600' : 'text-amber-600'}`}>
                        {user?.isKycVerified
                          ? 'Your identity is verified. You have full access to all features.'
                          : 'Complete KYC to unlock all platform features.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Change Password */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Change Password</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="input-field pr-10"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
                      <input type="password" placeholder="••••••••" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm New Password</label>
                      <input type="password" placeholder="••••••••" className="input-field" />
                    </div>
                    <button
                      onClick={() => toast.success('Password updated successfully!')}
                      className="btn-primary text-sm"
                    >
                      Update Password
                    </button>
                  </div>
                </div>

                {/* Two Factor Auth */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-slate-600" />
                      <div>
                        <div className="font-medium text-slate-900 text-sm">SMS Authentication</div>
                        <div className="text-slate-500 text-xs">+91 98765XXXXX</div>
                      </div>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-1 rounded-full">Enabled</span>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="border border-red-100 rounded-2xl p-5 bg-red-50">
                  <h4 className="font-semibold text-red-800 mb-2">Danger Zone</h4>
                  <p className="text-red-600 text-sm mb-3">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex items-center gap-2 text-sm font-semibold text-red-600 border border-red-400 hover:bg-red-100 px-4 py-2 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="space-y-5">
                <h3 className="font-display font-bold text-slate-900 text-lg">Payment Methods</h3>

                {/* Saved methods */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <span className="text-xl">💳</span>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">Axis Bank •••• 4231</div>
                        <div className="text-slate-500 text-xs">Expires 09/2028</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">Primary</span>
                      <button className="text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <span className="text-xl">🏦</span>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">HDFC Bank Account</div>
                        <div className="text-slate-500 text-xs">Net Banking - Saved</div>
                      </div>
                    </div>
                    <button className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Add new */}
                <button
                  onClick={() => toast.success('Redirecting to secure card vault...')}
                  className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-4 text-center text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="font-medium text-sm">Add New Payment Method</span>
                </button>

                {/* Auto-pay settings */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                  <h4 className="font-semibold text-blue-900 mb-1">Auto-Pay Settings</h4>
                  <p className="text-blue-600 text-sm mb-3">Auto-deduct EMI and maintenance payments automatically</p>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 text-sm font-medium">Enable Auto-Pay</span>
                    <div className="w-11 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                      <div className="absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full shadow" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
