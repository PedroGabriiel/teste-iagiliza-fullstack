import React, { createContext, useContext, useCallback, useState, ReactNode, useEffect } from 'react'
import cn from '../../lib/cn'

type ToastType = 'success' | 'error' | 'info'
type ToastItem = { id: string; title: string; description?: string; type?: ToastType }

const ToastContext = createContext<{ showToast: (t: Omit<ToastItem, 'id'>) => void }>({ showToast: () => {} })

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = useCallback((t: Omit<ToastItem, 'id'>) => {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 7)
    const item: ToastItem = { id, ...t }
    setToasts((s) => [item, ...s])
    // auto dismiss
    setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), 4000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'max-w-sm w-full rounded-md p-3 shadow-lg border',
              t.type === 'success'
                ? 'bg-green-600 text-white border-green-700'
                : t.type === 'error'
                ? 'bg-red-600 text-white border-red-700'
                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700'
            )}
          >
            <div className="font-medium">{t.title}</div>
            {t.description && <div className="text-sm opacity-90 mt-1">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}

export default ToastProvider
