import { motion } from 'framer-motion'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="gradient-primary py-16 px-4 text-center text-white">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl font-bold">Privacy Policy</h1>
          <p className="text-white/70 mt-2">Last updated: December 2024</p>
        </motion.div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-16 prose prose-slate">
        <div className="bg-white rounded-2xl p-8 space-y-8 shadow-sm border border-slate-100">
          {[
            {
              title: '1. Information We Collect',
              content: `We collect information you provide directly: name, email, phone number, government ID documents for KYC verification, driving license details, and payment information. We also automatically collect device information, IP addresses, and usage analytics to improve our services.`,
            },
            {
              title: '2. How We Use Your Information',
              content: `Your information is used to: create and manage your account, process vehicle ownership and booking transactions, send notifications about your bookings and payments, verify your identity for KYC compliance, prevent fraud and ensure platform security, and improve our products and services.`,
            },
            {
              title: '3. Information Sharing',
              content: `We never sell your personal data. We share information only with: co-owners of vehicles you share (limited profile info), payment processors (Razorpay) for transaction processing, identity verification services for KYC, and law enforcement when legally required.`,
            },
            {
              title: '4. Data Security',
              content: `We implement industry-standard security measures including: 256-bit AES encryption for sensitive data, PCI-DSS compliant payment processing via Razorpay, Firebase Authentication for secure login, regular security audits, and strict access controls for our team.`,
            },
            {
              title: '5. Your Rights',
              content: `You have the right to: access your personal data, request corrections, download a copy of your data, delete your account and associated data (subject to legal retention requirements), opt out of marketing communications, and lodge a complaint with data protection authorities.`,
            },
            {
              title: '6. Cookies',
              content: `We use essential cookies for authentication and session management, analytics cookies (Google Analytics) to understand usage patterns, and preference cookies to remember your settings. You can control cookie preferences in your browser settings.`,
            },
            {
              title: '7. Contact Us',
              content: `For privacy-related queries, contact our Data Protection Officer at privacy@splitwheelz.com or write to: SplitWheelz Technologies Pvt. Ltd., Bangalore, Karnataka — 560001.`,
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
