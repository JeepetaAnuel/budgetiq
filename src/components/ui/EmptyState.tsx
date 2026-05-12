import type { ReactNode } from 'react'

interface Props {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export default function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 bg-surface-light border border-border rounded-2xl">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500/10 to-brand-600/5 border border-brand-500/10 flex items-center justify-center text-brand-400 mb-4 shadow-lg shadow-brand-500/5">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-1">{title}</h3>
      <p className="text-sm text-text-muted text-center max-w-sm mb-6 leading-relaxed">{description}</p>
      {action}
    </div>
  )
}