import { motion } from 'framer-motion'

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="gradient-primary py-16 px-4 text-center text-white">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl font-bold">Terms & Conditions</h1>
          <p className="text-white/70 mt-2">Last updated: December 2024</p>
        </motion.div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl p-8 space-y-8 shadow-sm border border-slate-100">
          {[
            {
              title: '1. Acceptance of Terms',
              content: 'By accessing or using SplitWheelz, you agree to be bound by these Terms and Conditions. If you do not agree to any part of these terms, you may not use our services.',
            },
            {
              title: '2. Eligibility',
              content: 'You must be at least 18 years old with a valid Indian driving license to purchase ownership slots or make bookings. KYC verification (Aadhaar + PAN) is mandatory for slot purchases.',
            },
            {
              title: '3. Vehicle Co-Ownership',
              content: 'Purchasing a slot grants you fractional ownership rights and usage hours as specified at purchase. Co-owners are jointly responsible for maintaining the vehicle in good condition. SplitWheelz acts as a platform facilitator and is not a party to co-ownership agreements.',
            },
            {
              title: '4. Booking & Usage',
              content: 'Bookings are subject to vehicle availability. Weekly hour limits must be respected. Using a vehicle outside your booked slot is strictly prohibited. SplitWheelz may cancel bookings and suspend accounts for violations.',
            },
            {
              title: '5. Payments & Refunds',
              content: 'All payments are non-refundable except where explicitly stated in our refund policy. Bookings cancelled 24+ hours before start receive a full refund. Cancellations within 2 hours receive a 50% refund. No-shows are non-refundable.',
            },
            {
              title: '6. Disputes',
              content: 'Disputes between co-owners should first be attempted through the platform\'s voting and mediation tools. SplitWheelz reserves the right to make binding decisions on disputes escalated to our moderation team.',
            },
            {
              title: '7. Limitation of Liability',
              content: 'SplitWheelz is not liable for: vehicle damage caused by co-owners, accidents during bookings, disputes between co-owners, or indirect/consequential damages. Our platform liability is limited to the amount paid by you in the last 3 months.',
            },
            {
              title: '8. Governing Law',
              content: 'These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka.',
            },
          ].map(({ title, content }) => (
            <div key={title}>
              <h2 className="font-display text-xl font-bold text-navy mb-3">{title}</h2>
              <p className="text-slate-600 leading-relaxed text-sm">{content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
