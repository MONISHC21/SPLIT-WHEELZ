import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

export default function ContactUs() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (data: object) => {
    await new Promise((r) => setTimeout(r, 1000))
    toast.success('Message sent! We\'ll get back to you within 24 hours.')
    reset()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="gradient-primary py-20 px-4 text-center text-white">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-white/70 text-xl">We'd love to hear from you</p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <div>
            <h2 className="font-display text-2xl font-bold text-navy mb-6">Get in Touch</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Have a question, feedback, or need help? Our team is here to assist.
              Typically we respond within 24 hours.
            </p>
            <div className="space-y-5">
              {[
                { icon: Mail, label: 'Email', value: 'hello@splitwheelz.com' },
                { icon: Phone, label: 'Phone', value: '+91 1800-SPLITWHEELZ' },
                { icon: MapPin, label: 'Office', value: 'Bangalore, Karnataka, India' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs uppercase tracking-wide">{label}</p>
                    <p className="font-semibold text-navy">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-primary-50 rounded-2xl">
              <h3 className="font-semibold text-navy mb-2">Support Hours</h3>
              <p className="text-slate-600 text-sm">Monday – Saturday: 9 AM to 6 PM IST</p>
              <p className="text-slate-600 text-sm">Sunday: 10 AM to 4 PM IST</p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
            <h2 className="font-display text-xl font-bold text-navy mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="First Name" {...register('firstName', { required: true })} placeholder="Priya" />
                <Input label="Last Name" {...register('lastName', { required: true })} placeholder="Sharma" />
              </div>
              <Input label="Email" type="email" {...register('email', { required: true })} placeholder="priya@example.com" />
              <Input label="Subject" {...register('subject', { required: true })} placeholder="How can we help?" />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
                <textarea
                  {...register('message', { required: true })}
                  rows={5}
                  placeholder="Describe your issue or question in detail..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none transition-all"
                />
              </div>
              <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
