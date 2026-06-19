import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Search, ChevronDown, MessageCircle, Mail, Phone,
  BookOpen, CreditCard, Car, Users, Shield, ArrowRight, Car as CarIcon
} from 'lucide-react'

const categories = [
  { icon: Car, label: 'Getting Started', color: 'bg-blue-50 text-blue-600', count: 8 },
  { icon: Users, label: 'Co-Ownership', color: 'bg-green-50 text-green-600', count: 12 },
  { icon: CreditCard, label: 'Payments & EMI', color: 'bg-purple-50 text-purple-600', count: 10 },
  { icon: BookOpen, label: 'Bookings', color: 'bg-amber-50 text-amber-600', count: 9 },
  { icon: Shield, label: 'Safety & Security', color: 'bg-red-50 text-red-600', count: 7 },
  { icon: MessageCircle, label: 'Disputes', color: 'bg-rose-50 text-rose-600', count: 5 },
]

const faqs = [
  {
    category: 'Getting Started',
    question: 'What is SplitWheelz and how does it work?',
    answer: 'SplitWheelz is India\'s first fractional vehicle ownership platform. You co-own a premium vehicle with 2-4 verified partners, splitting the purchase price, EMI, insurance, and maintenance costs. You get a proportional ownership share and can book the vehicle for exclusive use during your booked slots.',
  },
  {
    category: 'Getting Started',
    question: 'Who can join SplitWheelz?',
    answer: 'Any Indian citizen who is 21+ years old with a valid driving license and Aadhaar card can join. We verify all users through our KYC process before allowing ownership.',
  },
  {
    category: 'Co-Ownership',
    question: 'How is ownership legally documented?',
    answer: 'We create a legally binding co-ownership agreement that is registered with the RTO. Each owner\'s name is on the RC book (as joint owner), and the agreement specifies rights, responsibilities, profit-sharing from resale, and exit procedures.',
  },
  {
    category: 'Co-Ownership',
    question: 'What happens if a co-owner stops paying EMI?',
    answer: 'SplitWheelz has a Protection Fund that covers up to 2 months of missed EMI. Simultaneously, the defaulting owner\'s access is suspended, and the co-ownership agreement allows other owners to buy out the defaulter\'s share at a pre-agreed valuation. Legal action is the final escalation.',
  },
  {
    category: 'Payments & EMI',
    question: 'How are EMI payments split?',
    answer: 'EMI is split proportionally based on ownership percentage. For a 4-owner vehicle, each pays 25% of the total monthly EMI. Payments can be automated via auto-debit. Reminders are sent 5 days before due date.',
  },
  {
    category: 'Payments & EMI',
    question: 'Is my payment information safe?',
    answer: 'All payments are processed via Razorpay (PCI-DSS Level 1 compliant). We never store your card details. Our platform uses bank-grade 256-bit SSL encryption for all transactions.',
  },
  {
    category: 'Bookings',
    question: 'How do I book the vehicle for my personal use?',
    answer: 'Log in to your dashboard, go to Bookings, select your vehicle, choose a date and time slot. You can book up to 30 days in advance. Co-owners cannot book the same slot — our system prevents conflicts automatically.',
  },
  {
    category: 'Safety & Security',
    question: 'What if the vehicle is damaged during my booking?',
    answer: 'The driving co-owner is responsible for damage during their slot. We require a refundable security deposit per booking. Comprehensive insurance covers major damages. Minor scratches are resolved via the dispute resolution system.',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-slate-900 text-sm pr-4">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="px-5 pb-5 text-slate-600 text-sm leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const filteredFaqs = faqs.filter((f) => {
    const matchSearch = !searchQuery ||
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchCategory = !selectedCategory || f.category === selectedCategory
    return matchSearch && matchCategory
  })

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navbar */}
      <nav className="bg-[#0F172A] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <CarIcon className="w-6 h-6 text-blue-400" />
            <span className="font-display font-bold text-white">SplitWheelz</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-slate-300 hover:text-white text-sm transition-colors">Sign In</Link>
            <Link to="/signup" className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition-all">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-r from-[#0F172A] to-blue-900 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-display font-bold text-4xl text-white mb-4">How can we help?</h1>
          <p className="text-slate-300 mb-8">Find answers to common questions about SplitWheelz</p>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xl text-base"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Categories */}
        <div className="mb-10">
          <h2 className="font-display font-bold text-2xl text-slate-900 mb-6">Browse by Topic</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <motion.button
                key={cat.label}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedCategory(selectedCategory === cat.label ? '' : cat.label)}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  selectedCategory === cat.label
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-100 bg-white hover:shadow-md'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl ${cat.color} flex items-center justify-center mx-auto mb-2`}>
                  <cat.icon className="w-5 h-5" />
                </div>
                <div className="font-semibold text-slate-900 text-xs">{cat.label}</div>
                <div className="text-slate-400 text-xs mt-0.5">{cat.count} articles</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-2xl text-slate-900">
              {selectedCategory || 'All'} Questions
            </h2>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory('')}
                className="text-blue-600 text-sm font-medium hover:text-blue-700"
              >
                Clear filter
              </button>
            )}
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-slate-500">No results found for "{searchQuery}"</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((faq) => (
                <FAQItem key={faq.question} q={faq.question} a={faq.answer} />
              ))}
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="font-display font-bold text-2xl text-slate-900 mb-2">Still need help?</h2>
          <p className="text-slate-500 mb-6">Our support team is available Mon–Sat, 9 AM to 7 PM IST.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/contact"
              className="flex flex-col items-center gap-3 p-5 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-all group"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <div className="font-semibold text-slate-900">Live Chat</div>
                <div className="text-slate-500 text-xs mt-0.5">Typically replies in 5 min</div>
              </div>
              <ArrowRight className="w-4 h-4 text-blue-600" />
            </Link>
            <a
              href="mailto:support@splitwheelz.com"
              className="flex flex-col items-center gap-3 p-5 bg-green-50 rounded-2xl hover:bg-green-100 transition-all group"
            >
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <div className="font-semibold text-slate-900">Email Support</div>
                <div className="text-slate-500 text-xs mt-0.5">support@splitwheelz.com</div>
              </div>
              <ArrowRight className="w-4 h-4 text-green-600" />
            </a>
            <a
              href="tel:+918000123456"
              className="flex flex-col items-center gap-3 p-5 bg-purple-50 rounded-2xl hover:bg-purple-100 transition-all group"
            >
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <div className="font-semibold text-slate-900">Phone</div>
                <div className="text-slate-500 text-xs mt-0.5">+91 800-012-3456</div>
              </div>
              <ArrowRight className="w-4 h-4 text-purple-600" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
