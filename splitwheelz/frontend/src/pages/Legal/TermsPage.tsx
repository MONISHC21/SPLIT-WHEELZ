import { Link } from 'react-router-dom'
import { Car, ArrowLeft } from 'lucide-react'

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing or using the SplitWheelz platform (website, mobile application, and related services), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to all the terms, you must not use our services.

These Terms constitute a legally binding agreement between you and SplitWheelz Technologies Pvt. Ltd., a company incorporated under the Companies Act, 2013, with its registered office in Bangalore, India.`,
  },
  {
    title: '2. Eligibility',
    content: `To use SplitWheelz, you must:

• Be at least 18 years of age
• Hold a valid Indian driving license
• Be an Indian resident with a valid Aadhaar card
• Have a valid Indian bank account
• Not be a person barred from contracting under any applicable law
• Successfully complete our KYC verification process

We reserve the right to refuse service to anyone for any reason.`,
  },
  {
    title: '3. Co-Ownership Agreement',
    content: `When you join a vehicle ownership group:

• A legally binding co-ownership agreement is created between all vehicle owners
• Each owner's name is registered as a joint owner in the vehicle's RC Book with the RTO
• Ownership shares are defined (typically 25% for a 4-person group)
• All owners agree to the EMI, insurance, and maintenance payment schedule
• Exit clauses are pre-defined: other owners get 30-day first right of refusal before external sale
• The ownership agreement overrides any informal arrangements among co-owners`,
  },
  {
    title: '4. Payment Terms',
    content: `By joining a vehicle ownership group, you commit to:

• Paying your proportional share of the monthly EMI on or before the due date
• Contributing to insurance premium costs annually
• Contributing to maintenance fund monthly
• A one-time slot purchase fee to join ownership

**Late Payment**: Payments delayed beyond 7 days incur a 2% monthly late fee.
**Default**: More than 2 months of non-payment results in access suspension and legal proceedings.
**Refunds**: Slot purchase fees are non-refundable once the RTO transfer is complete. Booking-related refunds follow our Cancellation Policy.`,
  },
  {
    title: '5. Booking & Usage',
    content: `As a co-owner, you have the right to use the vehicle during your booked slots:

• Bookings must be made at least 2 hours in advance
• Maximum consecutive booking: 72 hours (subject to other owners' consent)
• The vehicle must be returned in the same condition with the same fuel level
• Any damage during your slot is your liability
• Subletting or commercial use (Ola, Uber, etc.) of the vehicle is strictly prohibited
• You must hold a valid driving license at all times while driving
• Traffic violations during your slot are your responsibility

Failure to follow usage guidelines may result in account suspension without refund.`,
  },
  {
    title: '6. Platform Fees',
    content: `SplitWheelz charges:

• **Platform Fee**: 2% of total vehicle price (one-time, on slot purchase)
• **Transaction Fee**: 1.5% per payment transaction (waived for EMI auto-pay)
• **Booking Fee**: ₹50 per booking (waived for the first 3 bookings)
• **Transfer Fee**: ₹5,000 for ownership share transfer processing

All fees are inclusive of GST at 18%. Platform fees are non-negotiable and non-refundable.`,
  },
  {
    title: '7. Dispute Resolution',
    content: `In case of disputes between co-owners:

1. **Mediation**: SplitWheelz provides a structured mediation process within 7 days
2. **Arbitration**: Unresolved disputes go to arbitration under the Arbitration & Conciliation Act, 1996
3. **Legal**: Parties may pursue legal remedies through competent Indian courts in Bangalore jurisdiction

SplitWheelz's decision in operational matters (booking conflicts, access suspension) is final and binding.`,
  },
  {
    title: '8. Limitation of Liability',
    content: `SplitWheelz is a technology platform facilitating co-ownership arrangements. To the maximum extent permitted by law:

• We are not liable for accidents, injuries, or damages during vehicle use
• We are not liable for co-owner defaults beyond our Protection Fund coverage
• Our maximum liability is limited to the platform fees paid by you in the last 12 months
• We do not warrant the mechanical condition of listed vehicles (sellers are responsible)
• Force majeure events (natural disasters, government orders) exempt us from performance`,
  },
  {
    title: '9. Intellectual Property',
    content: `All content on the SplitWheelz platform, including logos, design, text, graphics, and software, is the property of SplitWheelz Technologies Pvt. Ltd. or its licensors. You may not:

• Copy, reproduce, or redistribute our content
• Reverse engineer our software
• Use our branding without written permission
• Create derivative works based on our platform`,
  },
  {
    title: '10. Termination',
    content: `We may suspend or terminate your account immediately if:

• You violate these Terms
• We suspect fraudulent activity
• You fail to complete KYC within 30 days of registration
• You provide false information
• You misuse the booking system

Upon termination, your ownership shares will be transferred per the co-ownership agreement exit clauses. Outstanding dues remain payable.`,
  },
  {
    title: '11. Governing Law',
    content: `These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Bangalore, Karnataka, India. If any provision of these Terms is found to be unenforceable, the remaining provisions shall continue in full force.`,
  },
  {
    title: '12. Contact for Legal Matters',
    content: `For legal inquiries regarding these Terms:

SplitWheelz Technologies Pvt. Ltd.
Attn: Legal Department
91springboard, 7th Floor, Koramangala
Bangalore, Karnataka 560034

Email: legal@splitwheelz.com

For general support, contact support@splitwheelz.com`,
  },
]

export default function TermsPage() {
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
          <div className="inline-block bg-slate-100 text-slate-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">Legal</div>
          <h1 className="font-display font-bold text-4xl text-slate-900 mb-3">Terms & Conditions</h1>
          <p className="text-slate-500">
            Last updated: June 1, 2026 · Effective: June 1, 2026
          </p>
          <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
            <p className="text-amber-800 text-sm">
              ⚠️ <strong>Important:</strong> Please read these Terms carefully before using SplitWheelz. They contain important information about your legal rights and obligations, including dispute resolution and limitation of liability provisions.
            </p>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="font-display font-bold text-slate-900 mb-3">Table of Contents</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {sections.map((s) => (
              <div key={s.title} className="text-blue-600 text-sm hover:text-blue-800 cursor-pointer py-0.5">
                {s.title}
              </div>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-display font-bold text-xl text-slate-900 mb-4">{section.title}</h2>
              <div className="space-y-3">
                {section.content.split('\n\n').map((para, i) => (
                  <p key={i} className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-slate-400 text-sm mb-4">
            By using SplitWheelz, you acknowledge that you have read, understood, and agree to be bound by these Terms.
          </p>
          <p className="text-slate-400 text-sm">
            Questions? Contact us at{' '}
            <a href="mailto:legal@splitwheelz.com" className="text-blue-600 hover:text-blue-700">
              legal@splitwheelz.com
            </a>
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Link to="/privacy" className="text-blue-600 hover:text-blue-700 text-sm font-medium">Privacy Policy</Link>
            <span className="text-gray-300">|</span>
            <Link to="/contact" className="text-blue-600 hover:text-blue-700 text-sm font-medium">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
