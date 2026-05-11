import type { ReactNode } from 'react'

interface Props {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export default function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-2xl bg-surface-lighter border border-border flex items-center justify-center text-text-muted mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-text-muted text-center max-w-xs mb-6">{description}</p>
      {action}
    </div>
  )
}
