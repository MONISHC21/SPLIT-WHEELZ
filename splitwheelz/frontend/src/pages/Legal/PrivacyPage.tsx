import { Link } from 'react-router-dom'
import { Car, ArrowLeft } from 'lucide-react'

const sections = [
  {
    title: '1. Information We Collect',
    content: `We collect information you provide directly to us, including:

• **Personal Information**: Name, email address, phone number, date of birth
• **Identity Documents**: Aadhaar card number, driving license number (for KYC verification)
• **Financial Information**: Bank account details for payment processing (stored securely by our payment provider, Razorpay)
• **Vehicle Usage Data**: Booking history, driving patterns (for insurance purposes)
• **Device Information**: IP address, browser type, operating system

We use industry-standard encryption to protect all personal data.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `Your information is used to:

• Create and manage your SplitWheelz account
• Process payments and EMI transactions
• Facilitate co-ownership agreements
• Verify your identity (KYC compliance)
• Send booking confirmations, payment reminders, and service updates
• Improve our platform features and user experience
• Comply with legal obligations under Indian law (IT Act, RBI regulations)
• Resolve disputes between co-owners`,
  },
  {
    title: '3. Information Sharing',
    content: `We do not sell your personal data. We share data with:

• **Co-Owners**: Limited profile information (name, ownership %, trust score) is visible to your vehicle co-owners
• **Payment Partners**: Razorpay processes payments; they have their own privacy policy
• **KYC Partners**: We use UIDAI-compliant APIs for Aadhaar verification
• **Legal Requirements**: We disclose data if required by Indian courts or regulatory authorities
• **Service Providers**: Cloud hosting (AWS), SMS services — all under strict data processing agreements`,
  },
  {
    title: '4. Data Security',
    content: `We implement robust security measures:

• 256-bit SSL/TLS encryption for all data in transit
• AES-256 encryption for sensitive data at rest
• Regular security audits and penetration testing
• Two-factor authentication for all accounts
• Strict access controls — only authorized personnel access your data
• We are ISO 27001 compliant and follow CERT-In guidelines`,
  },
  {
    title: '5. Data Retention',
    content: `We retain your data as follows:

• **Account Data**: Retained while your account is active + 3 years after deletion (as per RBI guidelines)
• **Transaction Records**: 7 years (Income Tax Act requirement)
• **KYC Documents**: 5 years after account closure (PMLA requirement)
• **Booking Logs**: 2 years
• You may request data deletion by emailing privacy@splitwheelz.com, subject to legal retention requirements`,
  },
  {
    title: '6. Your Rights',
    content: `Under applicable Indian law, you have the right to:

• **Access**: Request a copy of your personal data
• **Correction**: Update incorrect or incomplete data
• **Deletion**: Request deletion of your data (subject to legal requirements)
• **Portability**: Export your data in machine-readable format
• **Restriction**: Limit how we process your data
• **Objection**: Opt out of marketing communications

To exercise any right, email privacy@splitwheelz.com with subject "Privacy Request".`,
  },
  {
    title: '7. Cookies',
    content: `We use cookies and similar technologies for:

• **Essential Cookies**: Required for login sessions and security
• **Analytics Cookies**: Google Analytics to understand platform usage (anonymized data)
• **Preference Cookies**: Remember your language and display preferences

You can manage cookie preferences in your browser settings. Disabling essential cookies may affect platform functionality.`,
  },
  {
    title: '8. Children\'s Privacy',
    content: `SplitWheelz is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately at privacy@splitwheelz.com.`,
  },
  {
    title: '9. Changes to This Policy',
    content: `We reserve the right to update this Privacy Policy at any time. We will notify you of significant changes via:

• Email to your registered address
• A prominent notice on our platform

Continued use of SplitWheelz after changes constitutes acceptance of the revised policy.`,
  },
  {
    title: '10. Contact & Grievance Officer',
    content: `For privacy-related queries or to exercise your rights:

**Data Protection Officer**
SplitWheelz Technologies Pvt. Ltd.
91springboard, 7th Floor, Koramangala
Bangalore, Karnataka 560034

Email: privacy@splitwheelz.com
Phone: +91 800-012-3456

We respond to all privacy requests within 30 days as required by law.`,
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navbar */}
      <nav className="bg-[#0F172A] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Car className="w-6 h-6 text-blue-400" />
            <span className="font-display font-bold text-white">SplitWheelz</span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-slate-300 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">Legal</div>
          <h1 className="font-display font-bold text-4xl text-slate-900 mb-3">Privacy Policy</h1>
          <p className="text-slate-500">
            Last updated: June 1, 2026 · Effective: June 1, 2026
          </p>
          <p className="text-slate-600 mt-3 leading-relaxed">
            SplitWheelz Technologies Pvt. Ltd. ("SplitWheelz", "we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
          </p>
        </div>

        {/* Quick Summary */}
        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 mb-10">
          <h2 className="font-display font-bold text-blue-900 text-lg mb-3">Privacy at a Glance</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              '✅ We never sell your personal data',
              '✅ We use bank-grade encryption',
              '✅ You can delete your data anytime',
              '✅ We comply with Indian IT Act & DPDP Act',
              '✅ Dedicated Data Protection Officer',
              '✅ 30-day response to all privacy requests',
            ].map((item) => (
              <div key={item} className="text-blue-800 text-sm">{item}</div>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-display font-bold text-xl text-slate-900 mb-4">{section.title}</h2>
              <div className="prose prose-slate max-w-none">
                {section.content.split('\n\n').map((para, i) => (
                  <p key={i} className="text-slate-600 leading-relaxed mb-3 last:mb-0 text-sm whitespace-pre-line">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-slate-400 text-sm">
            Questions? Contact us at{' '}
            <a href="mailto:privacy@splitwheelz.com" className="text-blue-600 hover:text-blue-700">
              privacy@splitwheelz.com
            </a>
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Link to="/terms" className="text-blue-600 hover:text-blue-700 text-sm font-medium">Terms & Conditions</Link>
            <span className="text-gray-300">|</span>
            <Link to="/contact" className="text-blue-600 hover:text-blue-700 text-sm font-medium">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
