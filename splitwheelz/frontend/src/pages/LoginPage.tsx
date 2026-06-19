import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Car, Phone, ArrowRight, Loader2, Chrome } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/stores/authStore'
import { setupRecaptcha, sendOTP, getFirebaseAuth } from '@/lib/firebase'
import { authApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import type { ConfirmationResult, RecaptchaVerifier } from 'firebase/auth'

const phoneSchema = z.object({
  phone: z.string().regex(/^(\+91)?[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
})

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
})

type PhoneForm = z.infer<typeof phoneSchema>
type OtpForm = z.infer<typeof otpSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const { loginWithGoogle, setUser, setTokens } = useAuthStore()
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)
  const [isLoadingOTP, setIsLoadingOTP] = useState(false)
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null)

  const phoneForm = useForm<PhoneForm>({ resolver: zodResolver(phoneSchema) })
  const otpForm = useForm<OtpForm>({ resolver: zodResolver(otpSchema) })

  const handleGoogleLogin = async () => {
    setIsLoadingGoogle(true)
    try {
      await loginWithGoogle()
      navigate('/dashboard')
    } catch {
      // error is shown in store
    } finally {
      setIsLoadingGoogle(false)
    }
  }

  const handleSendOTP = async (data: PhoneForm) => {
    setIsLoadingOTP(true)
    try {
      const phone = data.phone.startsWith('+91') ? data.phone : `+91${data.phone}`
      setPhoneNumber(phone)

      let verifier = recaptchaVerifier
      if (!verifier) {
        verifier = setupRecaptcha('recaptcha-container')
        setRecaptchaVerifier(verifier)
      }

      const confirmation = await sendOTP(phone, verifier)
      setConfirmationResult(confirmation)
      setStep('otp')
      toast.success(`OTP sent to ${phone}`)
    } catch (err: unknown) {
      const error = err as { message?: string }
      toast.error(error?.message || 'Failed to send OTP')
    } finally {
      setIsLoadingOTP(false)
    }
  }

  const handleVerifyOTP = async (data: OtpForm) => {
    if (!confirmationResult) return
    setIsLoadingOTP(true)
    try {
      const result = await confirmationResult.confirm(data.otp)
      const idToken = await result.user.getIdToken()

      const { data: responseData } = await authApi.login(idToken)
      if (responseData.success) {
        const { user, accessToken, refreshToken } = responseData.data
        setUser(user)
        setTokens(accessToken, refreshToken)
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        toast.success(`Welcome back, ${user.name}!`)
        navigate('/dashboard')
      }
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string }
      if (error?.code === 'auth/invalid-verification-code') {
        toast.error('Invalid OTP. Please try again.')
      } else {
        toast.error('Verification failed. Try again.')
      }
    } finally {
      setIsLoadingOTP(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative text-white text-center px-12 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Car className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-display text-5xl font-bold mb-4">SplitWheelz</h1>
            <p className="text-white/70 text-xl leading-relaxed">
              Co-own premium vehicles. Split costs intelligently. Drive smarter.
            </p>
          </motion.div>

          {[
            { icon: '🚗', text: 'Own a BMW with just ₹85K/month' },
            { icon: '📅', text: 'Book your dedicated hours anytime' },
            { icon: '💰', text: 'Save up to 75% vs full ownership' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
              className="flex items-center gap-3 mb-4 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-left"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-white/90 font-medium">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-white">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-2 text-navy font-display font-bold text-2xl mb-8 lg:hidden">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              SplitWheelz
            </Link>
            <h2 className="font-display text-3xl font-bold text-navy">Welcome back</h2>
            <p className="text-slate-500 mt-2">Sign in to your SplitWheelz account</p>
          </div>

          {/* Google Sign In */}
          <Button
            variant="outline"
            size="lg"
            className="w-full mb-6 border-2 h-12"
            onClick={handleGoogleLogin}
            loading={isLoadingGoogle}
          >
            {!isLoadingGoogle && (
              <Chrome className="w-5 h-5 mr-3 text-blue-500" />
            )}
            Continue with Google
          </Button>

          <div className="relative flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-slate-400 text-sm font-medium">or sign in with phone</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Phone + OTP */}
          {step === 'phone' ? (
            <form onSubmit={phoneForm.handleSubmit(handleSendOTP)} className="space-y-4">
              <Input
                label="Mobile Number"
                placeholder="9876543210"
                leftIcon={<Phone className="w-4 h-4" />}
                error={phoneForm.formState.errors.phone?.message}
                helpText="We'll send an OTP to verify"
                {...phoneForm.register('phone')}
              />

              <div id="recaptcha-container" />

              <Button
                type="submit"
                size="lg"
                className="w-full"
                loading={isLoadingOTP}
              >
                Send OTP
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          ) : (
            <form onSubmit={otpForm.handleSubmit(handleVerifyOTP)} className="space-y-4">
              <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
                OTP sent to <strong>{phoneNumber}</strong>
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="ml-2 underline hover:text-blue-900"
                >
                  Change
                </button>
              </div>

              <Input
                label="One-Time Password"
                placeholder="123456"
                maxLength={6}
                error={otpForm.formState.errors.otp?.message}
                {...otpForm.register('otp')}
              />

              <Button
                type="submit"
                size="lg"
                className="w-full"
                loading={isLoadingOTP}
              >
                {isLoadingOTP ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying...</> : 'Verify & Sign In'}
              </Button>
            </form>
          )}

          <p className="text-center text-slate-500 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-600 font-semibold hover:underline">
              Sign up free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
