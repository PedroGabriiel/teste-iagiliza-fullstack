import React, { useEffect } from 'react'
import cn from '../../lib/cn'
import Card from './Card'

// Modal simples que também suporta o modo "balloon" (um balão fixado à direita,
// sem botões e com auto-dismiss). Use prop `variant: 'modal' | 'balloon'`.
export default function Modal({
  title,
  description,
  open,
  onClose,
  variant = 'modal',
  balloonClassName,
}: {
  title: string
  description?: string
  open: boolean
  onClose?: () => void
  variant?: 'modal' | 'balloon'
  balloonClassName?: string
}) {
  useEffect(() => {
    if (!open) return
    if (variant === 'balloon') {
      const t = setTimeout(() => onClose && onClose(), 3000)
      return () => clearTimeout(t)
    }
  }, [open, variant, onClose])

  if (!open) return null

  if (variant === 'balloon') {
    return (
      <div className="fixed right-4 top-1/4 z-50">
        <div className="pointer-events-auto">
          <div className={cn('max-w-[12rem] w-44 rounded-sm p-2 shadow-md border bg-white dark:bg-gray-800 dark:border-gray-700', balloonClassName)}>
            <div className="font-medium text-sm mb-1 truncate">{title}</div>
            {description && <div className="text-xs text-gray-600 dark:text-gray-300 truncate">{description}</div>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <Card className="z-10 max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {description && <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{description}</p>}

        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-brand text-white">OK</button>
        </div>
      </Card>
    </div>
  )
}
