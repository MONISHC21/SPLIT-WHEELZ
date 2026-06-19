import { cn } from '@/lib/utils'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  color?: 'primary' | 'white' | 'gray'
}

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-10 h-10',
  xl: 'w-14 h-14',
}

const colors = {
  primary: 'border-primary-600',
  white: 'border-white',
  gray: 'border-gray-400',
}

export function Spinner({ size = 'md', className, color = 'primary' }: SpinnerProps) {
  return (
    <div
      className={cn(
        'rounded-full border-2 border-t-transparent animate-spin',
        sizes[size],
        colors[color],
        className
      )}
    />
  )
}

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-100 rounded-full" />
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-navy-600 font-medium text-lg">Loading SplitWheelz...</p>
      </div>
    </div>
  )
}

export function LoadingCard() {
  return (
    <div className="flex items-center justify-center p-12">
      <Spinner size="lg" />
    </div>
  )
}
