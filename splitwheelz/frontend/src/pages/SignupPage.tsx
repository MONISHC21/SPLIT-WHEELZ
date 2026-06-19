import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Car, Chrome, CheckCircle, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  referralCode: z.string().optional(),
})

type SignupForm = z.infer<typeof signupSchema>

const benefits = [
  'Browse 850+ vehicles in your city',
  'Co-own with up to 3 trusted people',
  'Save up to 75% on ownership costs',
  'Dedicated weekly hours — no conflicts',
  'Built-in chat, voting & disputes',
]

export default function SignupPage() {
  const navigate = useNavigate()
  const { loginWithGoogle } = useAuthStore()
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)
  const [step, setStep] = useState(1)

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  })

  const handleGoogleSignup = async () => {
    setIsLoadingGoogle(true)
    try {
      await loginWithGoogle()
      navigate('/dashboard')
    } catch {
      // error shown in store
    } finally {
      setIsLoadingGoogle(false)
    }
  }

  const handlePhoneSignup = () => {
    toast.success('Redirecting to phone sign-up...')
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-900 to-navy items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-20 right-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
        <div className="relative text-white px-12 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link to="/" className="flex items-center gap-2 mb-10">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="font-display font-bold text-2xl">SplitWheelz</span>
            </Link>

            <h2 className="font-display text-4xl font-bold mb-4">
              Join 2,500+ smart
              <br />
              <span className="text-accent">vehicle co-owners</span>
            </h2>
            <p className="text-white/60 text-lg mb-8">
              Create your free account and start co-owning today.
            </p>

            <div className="space-y-3">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-white/80 text-sm">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-white">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-2 text-navy font-display font-bold text-2xl mb-8 lg:hidden">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              SplitWheelz
            </Link>
            <h2 className="font-display text-3xl font-bold text-navy">Create your account</h2>
            <p className="text-slate-500 mt-2">Free to join. No credit card required.</p>
          </div>

          {step === 1 ? (
            <div className="space-y-4">
              {/* Google */}
              <Button
                variant="outline"
                size="lg"
                className="w-full border-2 h-12"
                onClick={handleGoogleSignup}
                loading={isLoadingGoogle}
              >
                {!isLoadingGoogle && <Chrome className="w-5 h-5 mr-3 text-blue-500" />}
                Continue with Google
              </Button>

              <div className="relative flex items-center gap-4">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-slate-400 text-sm">or</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {/* Phone */}
              <Button
                variant="outline"
                size="lg"
                className="w-full border-2 h-12"
                onClick={handlePhoneSignup}
              >
                📱 Continue with Phone
              </Button>

              <div className="relative flex items-center gap-4">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-slate-400 text-sm">or fill in details</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={() => setStep(2)}
              >
                Sign up with Email
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ) : (
            <form
              onSubmit={form.handleSubmit(() => {
                handleGoogleSignup()
              })}
              className="space-y-4"
            >
              <Input
                label="Full Name"
                placeholder="Priya Sharma"
                error={form.formState.errors.name?.message}
                {...form.register('name')}
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="priya@example.com"
                error={form.formState.errors.email?.message}
                {...form.register('email')}
              />
              <Input
                label="Referral Code (optional)"
                placeholder="Enter referral code"
                {...form.register('referralCode')}
                helpText="Get extra loyalty points when a friend refers you"
              />

              <Button type="submit" size="lg" className="w-full" loading={isLoadingGoogle}>
                Create Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-sm text-slate-500 hover:text-slate-700"
              >
                ← Back to sign-up options
              </button>
            </form>
          )}

          <p className="text-center text-slate-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>

          <p className="text-center text-xs text-slate-400 mt-4">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="underline hover:text-slate-600">Terms</Link>
            {' '}and{' '}
            <Link to="/privacy" className="underline hover:text-slate-600">Privacy Policy</Link>.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
