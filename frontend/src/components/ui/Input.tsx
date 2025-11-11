import React from 'react'
import cn from '../../lib/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn('w-full border rounded p-2 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none', className)}
      {...props}
    />
  )
})

Input.displayName = 'Input'

export default Input
