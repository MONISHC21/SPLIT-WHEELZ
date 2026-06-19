import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  ArrowRight, Car, Users, Calendar, Shield, Star, TrendingDown,
  CheckCircle, ChevronDown, Sparkles, Zap, BarChart3, MessageSquare,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useFeaturedVehicles } from '@/hooks/useVehicles'
import { formatCurrency } from '@/lib/utils'

// Animation variants
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.15 } },
}

// Section animations wrapper
function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const features = [
  {
    icon: Users,
    title: 'Co-Own with up to 4 People',
    description: 'Split the vehicle cost with trusted co-owners. Each person gets dedicated weekly hours.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Calendar,
    title: 'Smart Booking System',
    description: 'Book your vehicle\'s time slots with our calendar. Real-time conflict detection prevents double bookings.',
    color: 'from-violet-500 to-violet-600',
  },
  {
    icon: TrendingDown,
    title: 'Save up to 75%',
    description: 'Why pay 100% when you use 25%? Share acquisition costs, insurance, and maintenance.',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: Shield,
    title: 'Secure & Transparent',
    description: 'All payments via Razorpay, Firebase auth, and smart contracts for dispute resolution.',
    color: 'from-orange-500 to-orange-600',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track usage, costs, and savings. Know exactly how much you\'re spending vs. saving.',
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    icon: MessageSquare,
    title: 'Co-Owner Chat',
    description: 'Built-in group chat for each vehicle. Discuss maintenance, plan trips, vote on decisions.',
    color: 'from-pink-500 to-pink-600',
  },
]

const steps = [
  {
    number: '01',
    title: 'Browse Vehicles',
    description: 'Explore our curated marketplace of vehicles available for co-ownership. Filter by type, budget, and location.',
  },
  {
    number: '02',
    title: 'Purchase a Slot',
    description: 'Choose how many slots you want. Each slot = dedicated ownership hours and equal cost sharing.',
  },
  {
    number: '03',
    title: 'Book & Drive',
    description: 'Use the calendar to book your weekly hours. Real-time availability syncs across all co-owners.',
  },
  {
    number: '04',
    title: 'Split & Save',
    description: 'Costs are automatically distributed. Insurance, maintenance, and parking — all divided equally.',
  },
]

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer, Bangalore',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
    rating: 5,
    text: 'I co-own a BMW 3 Series with two friends. We pay ₹28,000/month each — less than a cab subscription, but we drive a luxury car!',
    savings: '₹60,000/year',
  },
  {
    name: 'Rahul Verma',
    role: 'Startup Founder, Mumbai',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul',
    rating: 5,
    text: 'The booking system is genius. No conflicts, no disputes, everyone gets their fair share of the vehicle. Highly recommend!',
    savings: '₹45,000/year',
  },
  {
    name: 'Ananya Krishnan',
    role: 'Marketing Lead, Chennai',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ananya',
    rating: 5,
    text: 'SplitWheelz changed how I think about ownership. I never imagined I could afford a Fortuner. Now I co-own one!',
    savings: '₹80,000/year',
  },
]

const faqs = [
  {
    q: 'How many people can co-own a vehicle?',
    a: 'Currently, 2 to 4 co-owners per vehicle. Each person owns an equal share (25-50%) and gets proportional weekly hours.',
  },
  {
    q: 'What if a co-owner doesn\'t pay maintenance?',
    a: 'Our platform automatically tracks dues and can restrict booking access until outstanding amounts are cleared. Admin co-owners get notified.',
  },
  {
    q: 'Can I sell my ownership slot?',
    a: 'Yes! You can transfer your slot to any KYC-verified SplitWheelz user. The platform handles the transfer process.',
  },
  {
    q: 'How are disputes resolved?',
    a: 'Co-owners can vote on decisions democratically. For serious disputes, our moderation team reviews evidence and resolves within 48 hours.',
  },
  {
    q: 'Is my money safe?',
    a: 'All payments are processed by Razorpay (PCI-DSS compliant). Funds for ownership purchases are held in escrow.',
  },
]

export default function LandingPage() {
  const { data: featuredVehicles } = useFeaturedVehicles()

  return (
    <div className="overflow-hidden">
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center gradient-primary overflow-hidden bg-grid">
        {/* Decorative blobs */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <motion.div
              variants={stagger}
              initial="initial"
              animate="animate"
              className="text-white"
            >
              <motion.div variants={fadeUp}>
                <Badge variant="gradient" className="mb-6 text-sm px-4 py-2">
                  <Sparkles className="w-4 h-4 mr-2" />
                  India's #1 Vehicle Co-Ownership Platform
                </Badge>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="font-display text-5xl lg:text-7xl font-bold leading-tight mb-6"
              >
                Own a Car
                <br />
                <span className="gradient-text">Together.</span>
                <br />
                Drive Smarter.
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-white/70 text-xl leading-relaxed mb-8 max-w-lg"
              >
                Co-own premium vehicles with up to 3 others. Split costs 4 ways, 
                book your dedicated hours, and stop paying full price for a car 
                you use 25% of the time.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button size="xl" variant="gradient" className="text-base" asChild>
                  <Link to="/marketplace">
                    <Car className="w-5 h-5 mr-2" />
                    Browse Vehicles
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button
                  size="xl"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 text-base"
                  asChild
                >
                  <Link to="/signup">Start for Free</Link>
                </Button>
              </motion.div>

              {/* Stats row */}
              <motion.div variants={fadeUp} className="flex gap-8">
                {[
                  { value: '2,500+', label: 'Happy Owners' },
                  { value: '850+', label: 'Vehicles' },
                  { value: '₹4.2Cr', label: 'Saved Collectively' },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <p className="text-3xl font-display font-bold text-white">{value}</p>
                    <p className="text-white/50 text-sm">{label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right — Hero car card */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Main card */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 text-white">
                  <img
                    src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600"
                    alt="Vehicle"
                    className="w-full h-64 object-cover rounded-2xl mb-4"
                  />
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-display text-xl font-bold">Toyota Fortuner</h3>
                      <p className="text-white/60 text-sm">2022 • Diesel • Bangalore</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-display font-bold text-accent">₹45K</p>
                      <p className="text-white/60 text-xs">per slot/month</p>
                    </div>
                  </div>
                  {/* Ownership progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/70">Slots Filled</span>
                      <span className="font-semibold">2 / 4</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '50%' }}
                        transition={{ duration: 1.5, delay: 0.8 }}
                        className="h-full bg-gradient-to-r from-accent to-primary-400 rounded-full"
                      />
                    </div>
                  </div>
                  <Button className="w-full bg-white text-primary-700 hover:bg-primary-50" size="sm">
                    Claim a Slot
                  </Button>
                </div>

                {/* Floating stat cards */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-6 -left-6 bg-green-500 text-white rounded-2xl px-4 py-3 shadow-xl"
                >
                  <p className="text-xs font-medium opacity-80">You Save</p>
                  <p className="text-xl font-display font-bold">₹1.35L/yr</p>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute -bottom-4 -right-4 bg-white rounded-2xl px-4 py-3 shadow-xl"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">★</span>
                    <span className="font-bold text-navy">4.9</span>
                    <span className="text-slate-500 text-xs">(24 reviews)</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 flex flex-col items-center gap-2"
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <Badge variant="info" className="mb-4">Why SplitWheelz</Badge>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-navy mb-4">
              Everything you need to
              <span className="gradient-text"> co-own smartly</span>
            </h2>
            <p className="text-slate-500 text-xl max-w-2xl mx-auto">
              From marketplace to booking to payments — the complete platform for vehicle co-ownership.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <AnimatedSection key={feature.title}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-6 rounded-2xl border border-slate-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-navy mb-2">{feature.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section-padding bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <Badge className="mb-4">How It Works</Badge>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-navy mb-4">
              Start co-owning in <span className="gradient-text">4 simple steps</span>
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200" />

            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative w-20 h-20 bg-white border-2 border-primary-200 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <span className="font-display font-bold text-3xl gradient-text">{step.number}</span>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="font-display font-bold text-xl text-navy mb-3">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>

          <AnimatedSection className="text-center mt-12">
            <Button size="xl" variant="gradient" asChild>
              <Link to="/signup">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== FEATURED VEHICLES ===== */}
      {featuredVehicles && featuredVehicles.length > 0 && (
        <section className="section-padding bg-white">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection className="flex justify-between items-end mb-12">
              <div>
                <Badge className="mb-3">Featured Vehicles</Badge>
                <h2 className="font-display text-4xl font-bold text-navy">
                  Popular Co-Ownerships
                </h2>
              </div>
              <Button variant="outline" asChild>
                <Link to="/marketplace">
                  View All <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredVehicles.slice(0, 3).map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/vehicles/${vehicle.id}`} className="block group">
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                      <div className="relative overflow-hidden h-56">
                        <img
                          src={vehicle.images[0] || 'https://via.placeholder.com/400x250?text=Vehicle'}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge variant="gradient" className="text-xs">⭐ Featured</Badge>
                        </div>
                        <div className="absolute bottom-3 right-3">
                          <div className="bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5">
                            <span className="font-bold text-navy text-sm">
                              {formatCurrency(vehicle.pricePerSlot)}/slot
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-display font-bold text-lg text-navy">
                              {vehicle.make} {vehicle.model}
                            </h3>
                            <p className="text-slate-500 text-sm">{vehicle.year} · {vehicle.type}</p>
                          </div>
                          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-amber-700 text-sm font-bold">{vehicle.averageRating}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 flex-wrap mb-4">
                          {vehicle.features.slice(0, 3).map((f) => (
                            <span key={f} className="text-xs bg-slate-50 text-slate-600 px-2 py-1 rounded-lg border">
                              {f}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex -space-x-2">
                            {Array.from({ length: vehicle.totalSlots - vehicle.availableSlots }).map((_, i) => (
                              <div
                                key={i}
                                className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-accent border-2 border-white"
                              />
                            ))}
                          </div>
                          <span className="text-sm text-green-600 font-semibold">
                            {vehicle.availableSlots} slot{vehicle.availableSlots !== 1 ? 's' : ''} left
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== TESTIMONIALS ===== */}
      <section className="section-padding gradient-primary bg-grid">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <Badge variant="gradient" className="mb-4">Happy Co-Owners</Badge>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
              Real people, real savings
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, index) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-white/80 text-sm leading-relaxed mb-4 italic">
                  "{t.text}"
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full bg-white/20" />
                    <div>
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-white/50 text-xs">{t.role}</p>
                    </div>
                  </div>
                  <div className="bg-green-500/20 px-3 py-1 rounded-lg">
                    <p className="text-green-300 text-xs font-bold">{t.savings} saved</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="section-padding bg-white">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <Badge className="mb-4">Simple Pricing</Badge>
            <h2 className="font-display text-4xl font-bold text-navy mb-4">
              Pay only for what you use
            </h2>
            <p className="text-slate-500 text-xl">No hidden fees. No subscriptions. Just fair cost-sharing.</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                slots: '1 Slot (25%)',
                price: '₹22K–₹85K',
                desc: 'per month',
                weekly: '42 hrs/week',
                features: ['25% ownership', '42 hrs/week', 'Booking system', 'Cost splitting', 'Group chat'],
                cta: 'Get Started',
                popular: false,
              },
              {
                slots: '2 Slots (50%)',
                price: '₹44K–₹170K',
                desc: 'per month',
                weekly: '84 hrs/week',
                features: ['50% ownership', '84 hrs/week', 'Priority booking', 'Full access', '2 votes'],
                cta: 'Most Flexible',
                popular: true,
              },
              {
                slots: '4 Slots (100%)',
                price: '₹88K–₹340K',
                desc: 'per month',
                weekly: '168 hrs/week',
                features: ['Full ownership', 'Unlimited hours', 'Admin controls', 'All features', 'Single owner'],
                cta: 'Full Ownership',
                popular: false,
              },
            ].map((plan, i) => (
              <motion.div
                key={plan.slots}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-7 rounded-2xl border-2 ${plan.popular ? 'border-primary-500 shadow-2xl shadow-primary-100 scale-105' : 'border-slate-200'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge variant="gradient" className="text-sm px-4 py-1">
                      <Zap className="w-3 h-3 mr-1" /> Most Popular
                    </Badge>
                  </div>
                )}
                <h3 className="font-display font-bold text-lg text-navy mb-1">{plan.slots}</h3>
                <div className="my-4">
                  <span className="text-3xl font-display font-bold text-navy">{plan.price}</span>
                  <span className="text-slate-500 text-sm ml-1">{plan.desc}</span>
                </div>
                <p className="text-primary-600 font-semibold text-sm mb-4">{plan.weekly}</p>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.popular ? 'gradient' : 'outline'}
                  className="w-full"
                  asChild
                >
                  <Link to="/marketplace">{plan.cta}</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="section-padding bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <Badge className="mb-4">FAQ</Badge>
            <h2 className="font-display text-4xl font-bold text-navy">
              Got questions? We've got answers.
            </h2>
          </AnimatedSection>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.details
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden open:border-primary-200"
              >
                <summary className="flex justify-between items-center px-6 py-5 cursor-pointer font-semibold text-navy hover:text-primary-600 transition-colors list-none">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" />
                </summary>
                <div className="px-6 pb-5 text-slate-600 leading-relaxed text-sm">
                  {faq.a}
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="section-padding gradient-primary bg-grid">
        <div className="max-w-4xl mx-auto text-center text-white">
          <AnimatedSection>
            <Badge variant="gradient" className="mb-6 text-sm">Join 2,500+ Co-Owners</Badge>
            <h2 className="font-display text-5xl lg:text-6xl font-bold mb-6">
              Ready to split costs
              <br />
              <span className="text-accent">and drive smarter?</span>
            </h2>
            <p className="text-white/70 text-xl mb-10 max-w-2xl mx-auto">
              Browse available vehicles, pick your slot, and start saving — all in under 5 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" variant="gradient" className="text-base bg-white !text-primary-700 hover:bg-primary-50" asChild>
                <Link to="/marketplace">
                  <Car className="w-5 h-5 mr-2" />
                  Browse Vehicles
                </Link>
              </Button>
              <Button size="xl" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base" asChild>
                <Link to="/contact">Talk to Us</Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
