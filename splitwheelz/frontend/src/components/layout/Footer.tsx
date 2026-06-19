import { Link } from 'react-router-dom'
import { Car, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

const footerLinks = {
  Product: [
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/#pricing', label: 'Pricing' },
    { href: '/#features', label: 'Features' },
  ],
  Company: [
    { href: '/contact', label: 'Contact Us' },
    { href: '/help', label: 'Help Center' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms & Conditions' },
  ],
  Support: [
    { href: '/help#faq', label: 'FAQ' },
    { href: '/help#guides', label: 'User Guides' },
    { href: '/contact', label: 'Report Issue' },
  ],
}

const socials = [
  { icon: Twitter, href: 'https://twitter.com/splitwheelz', label: 'Twitter' },
  { icon: Instagram, href: 'https://instagram.com/splitwheelz', label: 'Instagram' },
  { icon: Linkedin, href: 'https://linkedin.com/company/splitwheelz', label: 'LinkedIn' },
]

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl">SplitWheelz</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mb-6">
              The smarter way to own a vehicle. Split costs, share bookings, and enjoy the 
              freedom of car ownership — without the full price tag.
            </p>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4.5 h-4.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(({ href, label }) => (
                  <li key={label}>
                    <Link
                      to={href}
                      className="text-slate-400 hover:text-white text-sm transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact info */}
        <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-white/10">
          {[
            { icon: Mail, text: 'hello@splitwheelz.com' },
            { icon: Phone, text: '+91 1800-SPLITWHEELZ' },
            { icon: MapPin, text: 'Bangalore, India' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-slate-400 text-sm">
              <Icon className="w-4 h-4 text-accent" />
              {text}
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© 2024 SplitWheelz Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
