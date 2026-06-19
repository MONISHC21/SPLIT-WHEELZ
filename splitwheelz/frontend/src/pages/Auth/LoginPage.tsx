import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Car, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
type FormData = z.infer<typeof schema>

// Mock auth for demo (no Firebase needed)
const mockLogin = async (email: string, _password: string) => {
  await new Promise((r) => setTimeout(r, 800))
  return {
    user: {
      id: '1',
      firebaseUid: 'mock-uid',
      email,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      role: email.includes('admin') ? 'ADMIN' : 'USER',
      isKycVerified: true,
      isEmailVerified: true,
      ownershipScore: 820,
      trustScore: 94,
      createdAt: new Date().toISOString(),
    } as const,
    accessToken: 'mock-token',
    refreshToken: 'mock-refresh',
  }
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setUser, setTokens } = useAuthStore()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const handleLogin = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await mockLogin(data.email, data.password)
      setUser(res.user as import('@/types').User)
      setTokens(res.accessToken, res.refreshToken)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch {
      toast.error('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      const res = await mockLogin('user@gmail.com', '')
      setUser(res.user as import('@/types').User)
      setTokens(res.accessToken, res.refreshToken)
      toast.success('Welcome!')
      navigate('/dashboard')
    } catch {
      toast.error('Google login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1e3a8a 100%)' }}>
      {/* Left visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Car className="w-12 h-12 text-blue-400" />
            <span className="font-display font-bold text-white text-4xl">SplitWheelz</span>
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Own the Drive,
            <br />
            Share the Cost.
          </h2>
          <p className="text-slate-400 text-lg max-w-md">
            Join thousands of smart vehicle co-owners saving up to 75% on their dream car.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6">
            {[
              { val: '2,500+', label: 'Co-Owners' },
              { val: '450+', label: 'Vehicles' },
              { val: '18', label: 'Cities' },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-2xl p-4 text-center">
                <div className="font-display font-bold text-2xl text-white">{s.val}</div>
                <div className="text-slate-400 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <img
              src="https://images.pexels.com/photos/1638459/pexels-photo-1638459.jpeg?w=500"
              alt="Car"
              className="rounded-3xl w-full object-cover h-48 opacity-80"
            />
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 lg:max-w-lg flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <Car className="w-7 h-7 text-blue-600" />
              <span className="font-display font-bold text-slate-900 text-xl">SplitWheelz</span>
            </div>
            <h1 className="font-display font-bold text-slate-900 text-3xl mb-2">Welcome back</h1>
            <p className="text-slate-500 mb-8">Sign in to your account to continue.</p>

            {/* Google login */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 hover:border-gray-300 text-slate-700 font-semibold py-3 rounded-xl transition-all hover:bg-gray-50 mb-6 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500">or sign in with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className="input-field"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="input-field pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  Remember me
                </label>
                <Link to="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  Forgot password?
                </Link>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 font-semibold hover:text-blue-700">
                Create one
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
