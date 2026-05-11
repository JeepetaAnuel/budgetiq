import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  variant?: 'default' | 'brand' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md'
}

const v = {
  default: 'bg-surface-lighter text-text-muted',
  brand: 'bg-brand-500/10 text-brand-400 border border-brand-500/20',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
}

export default function Badge({ children, variant = 'default', size = 'sm' }: Props) {
  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-lg ${v[variant]} ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'}`}>
      {children}
    </span>
  )
}
