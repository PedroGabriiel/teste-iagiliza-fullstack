import React from 'react'
import { cva, VariantProps } from 'class-variance-authority'
import cn from '../../lib/cn'

const buttonVariants = cva('inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2', {
  variants: {
    variant: {
      default: 'bg-brand text-white hover:bg-brand-700',
      secondary: 'bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-gray-100 hover:bg-gray-50',
    },
    size: {
      default: 'h-10 px-4 py-2',
      sm: 'h-8 px-3 text-sm',
      lg: 'h-12 px-6',
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'default'
  }
})

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => {
  return <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
})

Button.displayName = 'Button'

export default Button
