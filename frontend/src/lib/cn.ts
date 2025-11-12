import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

// Pequeno helper para combinar classes de forma segura (clsx + tailwind-merge)
export default function cn(...inputs: any[]) {
  return twMerge(clsx(...inputs))
}

export { cn }
