import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, BookOpen, MessageSquare, Phone, Mail, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const categories = [
  { icon: '🚗', title: 'Vehicle Ownership', count: 12 },
  { icon: '📅', title: 'Booking & Scheduling', count: 8 },
  { icon: '💳', title: 'Payments & Billing', count: 10 },
  { icon: '👥', title: 'Co-Owner Management', count: 7 },
  { icon: '🔐', title: 'Account & Security', count: 6 },
  { icon: '⚖️', title: 'Disputes & Resolution', count: 5 },
]

const faqs = [
  {
    q: 'How do I get started with co-ownership?',
    a: 'Sign up, browse vehicles, and purchase a slot. Each slot gives you proportional ownership and weekly hour limits. A PAN/Aadhaar KYC is required before purchasing.',
    category: 'Ownership',
  },
  {
    q: 'What happens if a co-owner stops paying?',
    a: 'The platform automatically tracks dues. If an owner has pending charges for 30 days, their booking access is suspended. Other owners are notified and may vote to transfer the slot.',
    category: 'Ownership',
  },
  {
    q: 'How is the weekly hour limit calculated?',
    a: 'A week has 168 hours. Each slot gets an equal share: 4 slots = 42 hrs/week each, 2 slots = 84 hrs/week each. Unused hours do not roll over.',
    category: 'Booking',
  },
  {
    q: 'Can I cancel a booking?',
    a: 'Yes, bookings can be cancelled up to 2 hours before the start time for a full refund. Cancellations within 2 hours receive a 50% refund. No-shows receive no refund.',
    category: 'Booking',
  },
  {
    q: 'How does the refund process work?',
    a: 'Refunds are initiated instantly on our side and typically take 3-5 business days to reflect in your bank account, depending on your payment method.',
    category: 'Payments',
  },
  {
    q: 'Is my data and payment information secure?',
    a: 'Yes. Payments are processed via Razorpay (PCI-DSS Level 1 compliant). We never store card details. Firebase Auth ensures your login is always secure.',
    category: 'Security',
  },
]

export default function HelpCenter() {
  const [search, setSearch] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="gradient-primary py-24 px-4 text-center text-white">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl lg:text-5xl font-bold mb-4">Help Center</h1>
          <p className="text-white/70 text-xl mb-8 max-w-2xl mx-auto">
            Find answers to all your SplitWheelz questions
          </p>
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search help articles..."
                className="w-full pl-10 pr-4 py-3.5 rounded-xl text-slate-800 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-400 text-base"
              />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16 space-y-16">
        {/* Categories */}
        <div>
          <h2 className="font-display text-2xl font-bold text-navy mb-8">Browse by Topic</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <div className="text-3xl mb-3">{cat.icon}</div>
                <h3 className="font-semibold text-navy">{cat.title}</h3>
                <p className="text-slate-500 text-sm mt-1">{cat.count} articles</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div id="faq">
          <h2 className="font-display text-2xl font-bold text-navy mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {filteredFaqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center px-6 py-5 text-left"
                >
                  <span className="font-semibold text-navy">{faq.q}</span>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs hidden sm:block">{faq.category}</Badge>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pb-5 text-slate-600 leading-relaxed text-sm"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </motion.div>
            ))}
            {filteredFaqs.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No results found for "{search}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact options */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: MessageSquare,
              title: 'Live Chat',
              desc: 'Chat with our support team. Usually responds in < 2 minutes.',
              action: 'Start Chat',
              href: '#',
              color: 'bg-blue-500',
            },
            {
              icon: Mail,
              title: 'Email Support',
              desc: 'Send us an email and we\'ll respond within 24 hours.',
              action: 'Send Email',
              href: '/contact',
              color: 'bg-violet-500',
            },
            {
              icon: Phone,
              title: 'Call Us',
              desc: 'Available Mon–Sat, 9 AM to 6 PM IST.',
              action: '+91 1800-SPLIT',
              href: 'tel:+911800',
              color: 'bg-green-500',
            },
          ].map(({ icon: Icon, title, desc, action, href, color }) => (
            <div key={title} className="bg-white rounded-2xl p-6 border border-slate-100 text-center hover:shadow-lg transition-shadow">
              <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display font-bold text-xl text-navy mb-2">{title}</h3>
              <p className="text-slate-500 text-sm mb-4">{desc}</p>
              <Button variant="outline" asChild>
                <Link to={href}>{action}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
