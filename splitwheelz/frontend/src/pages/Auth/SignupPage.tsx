import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Car, Eye, EyeOff, Loader2, CheckCircle2, Upload, Shield, ChevronRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'
import type { User } from '@/types'

const step1Schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

const step2Schema = z.object({
  aadhaarNumber: z.string().regex(/^\d{12}$/, 'Aadhaar must be 12 digits'),
  dlNumber: z.string().min(5, 'Enter a valid driving license number'),
})

const step3Schema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
})

type Step1Data = z.infer<typeof step1Schema>
type Step2Data = z.infer<typeof step2Schema>
type Step3Data = z.infer<typeof step3Schema>

const steps = [
  { id: 1, label: 'Personal Info', icon: '👤' },
  { id: 2, label: 'KYC Verification', icon: '🛡️' },
  { id: 3, label: 'Verify OTP', icon: '📱' },
]

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null)
  const [step2Data, setStep2Data] = useState<Step2Data | null>(null)
  const { setUser, setTokens } = useAuthStore()
  const navigate = useNavigate()

  const form1 = useForm<Step1Data>({ resolver: zodResolver(step1Schema) })
  const form2 = useForm<Step2Data>({ resolver: zodResolver(step2Schema) })
  const form3 = useForm<Step3Data>({ resolver: zodResolver(step3Schema) })

  const handleStep1 = async (data: Step1Data) => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    setStep1Data(data)
    setLoading(false)
    setCurrentStep(2)
    toast.success('Personal details saved!')
  }

  const handleStep2 = async (data: Step2Data) => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setStep2Data(data)
    setLoading(false)
    setCurrentStep(3)
    toast.success('KYC submitted! OTP sent to your phone.')
  }

  const handleStep3 = async (data: Step3Data) => {
    if (data.otp !== '123456') {
      toast.error('Invalid OTP. Use 123456 for demo.')
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))

    const mockUser: User = {
      id: Date.now().toString(),
      firebaseUid: 'mock-uid-' + Date.now(),
      email: step1Data!.email,
      name: step1Data!.name,
      phone: step1Data!.phone,
      role: 'USER',
      isKycVerified: true,
      isEmailVerified: true,
      ownershipScore: 700,
      trustScore: 85,
      createdAt: new Date().toISOString(),
    }

    setUser(mockUser)
    setTokens('mock-token', 'mock-refresh')
    setLoading(false)
    toast.success('Account created! Welcome to SplitWheelz 🎉')
    navigate('/dashboard')
    console.log('Registered with step2Data:', step2Data)
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1e3a8a 100%)' }}>
      {/* Left visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12">
        <div className="text-center max-w-md">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Car className="w-12 h-12 text-blue-400" />
            <span className="font-display font-bold text-white text-4xl">SplitWheelz</span>
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Start your journey to smarter vehicle ownership
          </h2>
          <p className="text-slate-400 text-lg mb-10">
            Join 2,500+ co-owners driving premium cars at fraction of the cost.
          </p>

          {/* Benefits */}
          {[
            'Co-own premium vehicles from ₹12,500/month',
            'KYC-verified co-owners for peace of mind',
            'Zero conflicts with AI-powered scheduling',
            'Transparent cost sharing for EMI, insurance & maintenance',
          ].map((benefit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 + 0.3 }}
              className="flex items-center gap-3 mb-4 text-left"
            >
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-slate-300 text-sm">{benefit}</span>
            </motion.div>
          ))}

          <img
            src="https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?w=500"
            alt="Car"
            className="mt-8 rounded-3xl w-full object-cover h-44 opacity-80"
          />
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 lg:max-w-lg flex items-center justify-center p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            {/* Logo mobile */}
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <Car className="w-7 h-7 text-blue-600" />
              <span className="font-display font-bold text-slate-900 text-xl">SplitWheelz</span>
            </div>

            <h1 className="font-display font-bold text-slate-900 text-2xl mb-1">Create your account</h1>
            <p className="text-slate-500 text-sm mb-6">Free forever. No credit card required.</p>

            {/* Step indicator */}
            <div className="flex items-center mb-8">
              {steps.map((s, i) => (
                <div key={s.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        currentStep > s.id
                          ? 'bg-green-500 text-white'
                          : currentStep === s.id
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {currentStep > s.id ? <CheckCircle2 className="w-5 h-5" /> : s.id}
                    </div>
                    <span className={`text-xs mt-1 font-medium hidden sm:block ${currentStep === s.id ? 'text-blue-600' : 'text-gray-400'}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 transition-all ${currentStep > s.id ? 'bg-green-400' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Personal Info */}
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.form
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={form1.handleSubmit(handleStep1)}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                    <input {...form1.register('name')} placeholder="Rahul Sharma" className="input-field" />
                    {form1.formState.errors.name && (
                      <p className="text-red-500 text-xs mt-1">{form1.formState.errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                    <input {...form1.register('email')} type="email" placeholder="you@example.com" className="input-field" />
                    {form1.formState.errors.email && (
                      <p className="text-red-500 text-xs mt-1">{form1.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-slate-600 text-sm font-medium">
                        🇮🇳 +91
                      </span>
                      <input
                        {...form1.register('phone')}
                        placeholder="9876543210"
                        className="input-field rounded-l-none flex-1"
                      />
                    </div>
                    {form1.formState.errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{form1.formState.errors.phone.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                    <div className="relative">
                      <input
                        {...form1.register('password')}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="input-field pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {form1.formState.errors.password && (
                      <p className="text-red-500 text-xs mt-1">{form1.formState.errors.password.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <input
                        {...form1.register('confirmPassword')}
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="input-field pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {form1.formState.errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">{form1.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>Next Step <ChevronRight className="w-4 h-4" /></>
                    )}
                  </button>
                </motion.form>
              )}

              {/* Step 2: KYC */}
              {currentStep === 2 && (
                <motion.form
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={form2.handleSubmit(handleStep2)}
                  className="space-y-4"
                >
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
                    <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-blue-800 font-semibold text-sm">KYC Verification Required</p>
                      <p className="text-blue-600 text-xs mt-0.5">
                        Your data is encrypted and never shared without consent.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Aadhaar Number</label>
                    <input
                      {...form2.register('aadhaarNumber')}
                      placeholder="XXXX XXXX XXXX"
                      maxLength={12}
                      className="input-field"
                    />
                    {form2.formState.errors.aadhaarNumber && (
                      <p className="text-red-500 text-xs mt-1">{form2.formState.errors.aadhaarNumber.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Driving License Number</label>
                    <input
                      {...form2.register('dlNumber')}
                      placeholder="DL-XXXXXXXXXX"
                      className="input-field uppercase"
                    />
                    {form2.formState.errors.dlNumber && (
                      <p className="text-red-500 text-xs mt-1">{form2.formState.errors.dlNumber.message}</p>
                    )}
                  </div>

                  {/* Document upload areas */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Upload Aadhaar Card</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer bg-gray-50">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Upload Driving License</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer bg-gray-50">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 btn-secondary text-sm py-3"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-70 text-sm"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <>Submit KYC <ChevronRight className="w-4 h-4" /></>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Step 3: OTP */}
              {currentStep === 3 && (
                <motion.form
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={form3.handleSubmit(handleStep3)}
                  className="space-y-4"
                >
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">📱</span>
                    </div>
                    <p className="text-slate-700 font-semibold">Verify your phone</p>
                    <p className="text-slate-500 text-sm mt-1">
                      We've sent a 6-digit OTP to +91 {step1Data?.phone?.slice(0, 5)}XXXXX
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5 text-center">
                      Enter 6-Digit OTP
                    </label>
                    <input
                      {...form3.register('otp')}
                      placeholder="• • • • • •"
                      maxLength={6}
                      className="input-field text-center text-2xl tracking-widest font-bold"
                    />
                    {form3.formState.errors.otp && (
                      <p className="text-red-500 text-xs mt-1 text-center">{form3.formState.errors.otp.message}</p>
                    )}
                    <p className="text-xs text-center text-slate-400 mt-2">
                      Demo OTP: <span className="font-bold text-blue-600">123456</span>
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Verify & Create Account
                      </>
                    )}
                  </button>

                  <p className="text-center text-sm text-slate-500">
                    Didn't receive OTP?{' '}
                    <button type="button" className="text-blue-600 font-medium hover:text-blue-700">
                      Resend OTP
                    </button>
                  </p>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="w-full text-center text-sm text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    ← Back to KYC
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
