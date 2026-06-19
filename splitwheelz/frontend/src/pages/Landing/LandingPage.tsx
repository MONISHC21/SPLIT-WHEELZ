import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users, ShieldCheck, Calendar, CreditCard, Shield, Wrench,
  ChevronDown, Star, ArrowRight, Car, Check, Menu, X,
  TrendingUp, Zap, Globe
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const features = [
  { icon: Users, title: 'Shared Ownership', desc: 'Co-own premium vehicles with verified partners and split costs equally.', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { icon: ShieldCheck, title: 'Verified Co-Owners', desc: 'Every co-owner is KYC verified with Aadhaar & driving license checks.', color: 'text-green-500', bg: 'bg-green-500/10' },
  { icon: Calendar, title: 'Smart Scheduling', desc: 'AI-powered booking system prevents conflicts and optimizes vehicle usage.', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  { icon: CreditCard, title: 'EMI Splitting', desc: 'Auto-split EMI payments among co-owners with reminders and tracking.', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { icon: Shield, title: 'Insurance Management', desc: 'Shared insurance costs with transparent renewal and claims management.', color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { icon: Wrench, title: 'Maintenance Tracking', desc: 'Predictive maintenance alerts and shared service cost tracking.', color: 'text-rose-500', bg: 'bg-rose-500/10' },
]

const steps = [
  { step: 1, title: 'Choose a Vehicle', desc: 'Browse our curated marketplace of premium vehicles.' },
  { step: 2, title: 'Find Co-Owners', desc: 'Match with verified partners who share your preferences.' },
  { step: 3, title: 'Split Costs', desc: 'Divide EMI, insurance, and maintenance automatically.' },
  { step: 4, title: 'Book Slots', desc: 'Schedule your drive using our smart calendar system.' },
  { step: 5, title: 'Drive & Enjoy', desc: 'Hit the road with a QR access pass.' },
]

const testimonials = [
  {
    name: 'Rahul Sharma',
    role: 'Software Engineer, Bangalore',
    text: "I always wanted a Creta but couldn't justify the full EMI. With SplitWheelz, I drive it every weekend at 1/4th the cost!",
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=400',
    rating: 5,
  },
  {
    name: 'Priya Menon',
    role: 'Marketing Manager, Chennai',
    text: "The scheduling system is brilliant. No conflicts with my co-owners and the app handles everything from EMI to insurance.",
    avatar: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?w=400',
    rating: 5,
  },
  {
    name: 'Arjun Patel',
    role: 'Freelancer, Mumbai',
    text: "As a freelancer, owning a car alone didn't make sense. SplitWheelz gave me the flexibility I needed with zero hassle.",
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=400',
    rating: 5,
  },
]

const faqs = [
  { q: 'How does co-ownership legally work?', a: 'We facilitate a legal co-ownership agreement registered with the RTO. Each owner holds a proportional stake with defined rights and responsibilities.' },
  { q: "What if a co-owner misses an EMI payment?", a: "Our platform has a protection fund and escalation system. Defaulters face restricted access and their share can be transferred to a new verified co-owner." },
  { q: 'Can I sell my ownership share?', a: 'Yes! You can list your share on our marketplace. Existing co-owners get first right of refusal, then it opens to verified buyers.' },
  { q: 'How are driving schedules managed?', a: "Our AI-powered scheduling system lets co-owners book slots in advance. It detects conflicts and suggests optimal time distribution." },
  { q: 'What vehicles are available?', a: 'We have sedans, SUVs, hatchbacks, luxury cars, and EVs from top brands like Hyundai, Toyota, BMW, and Tesla.' },
  { q: 'Is my payment secure?', a: 'All payments are processed via Razorpay with bank-grade encryption. Your financial data is never stored on our servers.' },
]

const vehicles = [
  { brand: 'Hyundai', model: 'Creta', price: 1500000, emi: 12500, slots: 4, available: 2, image: 'https://images.pexels.com/photos/1638459/pexels-photo-1638459.jpeg?w=600', type: 'SUV' },
  { brand: 'Toyota', model: 'Camry', price: 4500000, emi: 37500, slots: 3, available: 1, image: 'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?w=600', type: 'Sedan' },
  { brand: 'BMW', model: '5 Series', price: 7500000, emi: 62500, slots: 4, available: 3, image: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?w=600', type: 'Luxury' },
]

const stats = [
  { value: '2,500+', label: 'Happy Co-Owners' },
  { value: '450+', label: 'Vehicles Listed' },
  { value: '₹2.1Cr+', label: 'EMI Saved' },
  { value: '18 Cities', label: 'Pan India' },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100" initial={false}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-slate-900 font-display pr-4">{q}</span>
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
            transition={{ duration: 0.3 }}
          >
            <p className="px-6 pb-6 text-slate-600 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 600], [0, 200])
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const fadeUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
  }

  const stagger = {
    animate: { transition: { staggerChildren: 0.1 } },
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between bg-[#0F172A]/80 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/10">
            <Link to="/" className="flex items-center gap-2">
              <Car className="w-7 h-7 text-blue-400" />
              <span className="font-display font-bold text-white text-xl">SplitWheelz</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              {['Marketplace', 'How It Works', 'Pricing', 'About'].map((item) => (
                <Link
                  key={item}
                  to={item === 'Marketplace' ? '/marketplace' : `#${item.toLowerCase().replace(' ', '-')}`}
                  className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
                >
                  {item}
                </Link>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:scale-105"
              >
                Get Started
              </Link>
            </div>
            <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          {/* Mobile menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-2 bg-[#0F172A] rounded-2xl p-4 border border-white/10"
              >
                {['Marketplace', 'How It Works', 'Pricing', 'About'].map((item) => (
                  <Link
                    key={item}
                    to={item === 'Marketplace' ? '/marketplace' : '#'}
                    className="block py-3 px-4 text-slate-300 hover:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </Link>
                ))}
                <div className="border-t border-white/10 mt-2 pt-3 flex flex-col gap-2">
                  <Link to="/login" className="btn-secondary text-center text-sm py-2.5">
                    Sign In
                  </Link>
                  <Link to="/signup" className="btn-primary text-center text-sm py-2.5">
                    Get Started
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Premium sports car"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/95 via-[#0F172A]/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/50 to-transparent" />
        </motion.div>

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
              style={{ left: `${(i * 5.3) % 100}%`, top: `${(i * 7.1) % 100}%` }}
              animate={{ y: [-20, 20], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: (i % 5) * 0.5 }}
            />
          ))}
        </div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 w-full">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-sm font-medium px-4 py-2 rounded-full mb-6"
            >
              <Zap className="w-4 h-4" />
              India's #1 Fractional Vehicle Ownership Platform
            </motion.div>

            <motion.h1
              {...fadeUp}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display font-extrabold text-5xl md:text-6xl lg:text-7xl text-white leading-tight"
            >
              Drive Your{' '}
              <span className="gradient-text">Dream Car</span>
              <br />Without Paying the Full Price
            </motion.h1>

            <motion.p
              {...fadeUp}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 text-xl text-slate-300 max-w-2xl leading-relaxed"
            >
              Split ownership. Split EMI. Share maintenance. Enjoy premium mobility at a fraction of the cost.
            </motion.p>

            <motion.div
              {...fadeUp}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap gap-4 mt-10"
            >
              <Link
                to="/signup"
                className="group inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-2xl transition-all hover:scale-105 shadow-2xl shadow-blue-600/30"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-2xl border border-white/20 transition-all hover:scale-105 backdrop-blur-sm"
              >
                <Car className="w-5 h-5" />
                Explore Cars
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              {...fadeUp}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div className="font-display font-bold text-2xl text-white">{stat.value}</div>
                  <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 flex flex-col items-center gap-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs">Scroll to explore</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
              Why SplitWheelz
            </span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-slate-900">
              Everything you need,{' '}
              <span className="gradient-text">nothing you don't</span>
            </h2>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-lg">
              The smarter way to own a car — all the pride, a fraction of the cost.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={{ initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="font-display font-semibold text-slate-900 text-lg mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6" style={{ background: '#0F172A' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block bg-blue-600/20 text-blue-300 text-sm font-semibold px-4 py-2 rounded-full mb-4 border border-blue-500/20">
              Process
            </span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white">How It Works</h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">Get started in minutes with our simple 5-step process.</p>
          </motion.div>

          <div className="relative">
            <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-blue-600/30" />
            <motion.div
              variants={stagger}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-8"
            >
              {steps.map((s, i) => (
                <motion.div
                  key={s.step}
                  variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center relative"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto text-xl font-bold font-display shadow-lg shadow-blue-600/30"
                  >
                    {s.step}
                  </motion.div>
                  <h3 className="font-display font-semibold text-white mt-4 text-base">{s.title}</h3>
                  <p className="text-slate-400 mt-2 text-sm">{s.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vehicle Showcase */}
      <section className="py-24 px-6 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
              Featured Vehicles
            </span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-slate-900">Drive Premium, Pay Fraction</h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto text-lg">
              Explore vehicles available for co-ownership right now.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {vehicles.map((v, i) => (
              <motion.div
                key={v.model}
                variants={{ initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 group border border-gray-100"
              >
                <div className="relative overflow-hidden h-52">
                  <img
                    src={v.image}
                    alt={v.model}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">{v.type}</span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {v.available} slots left
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display font-bold text-slate-900 text-xl">
                    {v.brand} {v.model}
                  </h3>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-display font-bold text-blue-600">{formatCurrency(v.price)}</div>
                      <div className="text-sm text-slate-500">/ {v.slots} owners</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-slate-900">{formatCurrency(v.emi)}/mo</div>
                      <div className="text-sm text-slate-500">Your EMI share</div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                    <Users className="w-4 h-4" />
                    <span>{v.slots} total slots</span>
                    <span className="mx-1">·</span>
                    <span className="text-green-600 font-medium">{v.available} available</span>
                  </div>
                  <Link
                    to="/marketplace"
                    className="mt-5 block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all hover:scale-[1.02]"
                  >
                    Join Ownership
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-12">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
            >
              View all vehicles
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block bg-yellow-100 text-yellow-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
              Testimonials
            </span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-slate-900">What Our Users Say</h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                variants={{ initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-[#F8FAFC] rounded-2xl p-6 border border-gray-100"
              >
                <div className="flex mb-3">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{t.name}</div>
                    <div className="text-slate-500 text-xs">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 bg-[#F8FAFC]">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
              FAQ
            </span>
            <h2 className="font-display font-bold text-4xl text-slate-900">Frequently Asked Questions</h2>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="space-y-3"
          >
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-24 px-6"
        style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1e3a8a 50%, #2563EB 100%)' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-6">
              Ready to Own Your Dream Car?
            </h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Join 2,500+ co-owners already saving on premium vehicles. Start with just ₹25,000/month.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all hover:scale-105"
              >
                <TrendingUp className="w-5 h-5" />
                Start For Free
              </Link>
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold px-8 py-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
              >
                <Globe className="w-5 h-5" />
                Browse Vehicles
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F172A] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Car className="w-7 h-7 text-blue-400" />
                <span className="font-display font-bold text-white text-xl">SplitWheelz</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Own the Drive, Share the Cost. India's leading fractional vehicle ownership platform.
              </p>
            </div>
            <div>
              <h4 className="font-display font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2">
                {['Marketplace', 'How It Works', 'Pricing', 'Blog'].map((item) => (
                  <li key={item}>
                    <Link to="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                {['About', 'Careers', 'Press', 'Contact'].map((item) => (
                  <li key={item}>
                    <Link to="/contact" className="text-slate-400 hover:text-white transition-colors text-sm">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                {[
                  { label: 'Privacy Policy', to: '/privacy' },
                  { label: 'Terms & Conditions', to: '/terms' },
                  { label: 'Cookie Policy', to: '#' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link to={item.to} className="text-slate-400 hover:text-white transition-colors text-sm">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © 2026 SplitWheelz Technologies Pvt. Ltd. All rights reserved.
            </p>
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
