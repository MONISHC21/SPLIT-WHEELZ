import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Home, Car, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/30">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center px-4"
      >
        <div className="relative mb-8 inline-block">
          <div className="text-[160px] font-display font-black text-slate-100 leading-none select-none">
            404
          </div>
          <motion.div
            animate={{ x: [-20, 20, -20], rotate: [-3, 3, -3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent rounded-2xl flex items-center justify-center shadow-xl">
              <Car className="w-10 h-10 text-white" />
            </div>
          </motion.div>
        </div>

        <h1 className="font-display text-3xl font-bold text-navy mb-3">Oops! Road not found.</h1>
        <p className="text-slate-500 text-lg mb-8 max-w-md mx-auto">
          Looks like you've taken a wrong turn. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" asChild>
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" size="lg" onClick={() => history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
