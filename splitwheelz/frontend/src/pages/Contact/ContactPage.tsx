import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  MapPin, Phone, Mail, Clock, Send, Car, CheckCircle2, Loader2
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject required'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
  type: z.string(),
})
type FormData = z.infer<typeof schema>

const contactInfo = [
  {
    icon: MapPin,
    title: 'Headquarters',
    lines: ['SplitWheelz Technologies Pvt. Ltd.', '91springboard, 7th Floor, Koramangala', 'Bangalore, Karnataka 560034'],
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Phone,
    title: 'Phone Support',
    lines: ['+91 800-012-3456', '+91 800-012-3457 (Customer Care)'],
    note: 'Mon–Sat, 9 AM – 7 PM IST',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    icon: Mail,
    title: 'Email',
    lines: ['support@splitwheelz.com', 'partnerships@splitwheelz.com'],
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    icon: Clock,
    title: 'Support Hours',
    lines: ['Monday – Friday: 9 AM – 8 PM', 'Saturday: 9 AM – 5 PM', 'Sunday: 10 AM – 2 PM'],
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'general' },
  })

  const onSubmit = async (_data: FormData) => {
    await new Promise((r) => setTimeout(r, 1000))
    setSubmitted(true)
    toast.success('Message sent! We\'ll get back to you within 24 hours.')
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navbar */}
      <nav className="bg-[#0F172A] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Car className="w-6 h-6 text-blue-400" />
            <span className="font-display font-bold text-white">SplitWheelz</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-slate-300 hover:text-white text-sm transition-colors">Sign In</Link>
            <Link to="/signup" className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition-all">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-r from-[#0F172A] to-blue-900 py-16 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display font-bold text-4xl text-white mb-4">Get in Touch</h1>
          <p className="text-slate-300 max-w-xl mx-auto">
            Have a question about co-ownership? Need help with your account? We'd love to hear from you.
          </p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            {contactInfo.map((info, i) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 ${info.bg} rounded-xl flex items-center justify-center`}>
                    <info.icon className={`w-5 h-5 ${info.color}`} />
                  </div>
                  <h3 className="font-semibold text-slate-900">{info.title}</h3>
                </div>
                {info.lines.map((line) => (
                  <p key={line} className="text-slate-500 text-sm">{line}</p>
                ))}
                {info.note && (
                  <p className="text-slate-400 text-xs mt-1 italic">{info.note}</p>
                )}
              </motion.div>
            ))}

            {/* Social */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-slate-900 mb-3">Follow Us</h3>
              <div className="flex gap-3">
                {[
                  { label: 'LinkedIn', color: 'bg-blue-100 hover:bg-blue-200 text-blue-700', emoji: '💼' },
                  { label: 'Twitter', color: 'bg-sky-100 hover:bg-sky-200 text-sky-700', emoji: '🐦' },
                  { label: 'Instagram', color: 'bg-pink-100 hover:bg-pink-200 text-pink-700', emoji: '📷' },
                ].map((s) => (
                  <button
                    key={s.label}
                    className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${s.color}`}
                  >
                    <span className="text-lg">{s.emoji}</span>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
          >
            {submitted ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-display font-bold text-2xl text-slate-900 mb-2">Message Sent!</h3>
                <p className="text-slate-500 mb-6">
                  Thank you for reaching out. Our team will get back to you within 24 hours at your email.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-primary"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 className="font-display font-bold text-2xl text-slate-900 mb-6">Send a Message</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
                      <input {...register('name')} placeholder="Rahul Sharma" className="input-field" />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address *</label>
                      <input {...register('email')} type="email" placeholder="you@example.com" className="input-field" />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
                      <input {...register('phone')} placeholder="+91 9876543210" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Inquiry Type</label>
                      <select {...register('type')} className="input-field">
                        <option value="general">General Inquiry</option>
                        <option value="partnership">Partnership</option>
                        <option value="support">Technical Support</option>
                        <option value="press">Press / Media</option>
                        <option value="investor">Investor Relations</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject *</label>
                    <input
                      {...register('subject')}
                      placeholder="How can we help you?"
                      className="input-field"
                    />
                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Message *</label>
                    <textarea
                      {...register('message')}
                      rows={5}
                      placeholder="Tell us more about your query..."
                      className="input-field resize-none"
                    />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
