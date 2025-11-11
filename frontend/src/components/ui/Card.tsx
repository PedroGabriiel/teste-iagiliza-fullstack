import React from 'react'
import cn from '../../lib/cn'

export default function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('bg-white dark:bg-gray-800 p-6 rounded shadow', className)}>{children}</div>
}
