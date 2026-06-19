import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  helpText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, leftIcon, rightIcon, helpText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            id={inputId}
            className={cn(
              'flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-red-400 focus-visible:ring-red-400',
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
        {helpText && !error && (
          <p className="text-xs text-slate-500">{helpText}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
