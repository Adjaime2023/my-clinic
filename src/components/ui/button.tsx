import { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils' // ou implemente seu próprio se não tiver

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'primary' | 'medical'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  ...props
}: ButtonProps) => {
  const base = 'inline-flex items-center justify-center font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

  const variants = {
    default: 'bg-gray-800 text-white hover:bg-gray-700',
    outline: 'border border-gray-300 text-gray-800 hover:bg-gray-100',
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    medical: 'bg-green-600 text-white hover:bg-green-700',
  }

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}
