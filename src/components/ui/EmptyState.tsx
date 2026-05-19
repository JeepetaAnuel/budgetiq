import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { Inbox, SearchX, PiggyBank, Wallet, Target, FileText } from 'lucide-react'

type EmptyVariant = 'default' | 'transactions' | 'budgets' | 'savings' | 'search' | 'stats'

interface Props {
  icon?: ReactNode
  title: string
  description: string
  action?: ReactNode
  variant?: EmptyVariant
}

const ILLUSTRATIONS: Record<EmptyVariant, { icon: ReactNode; gradient: string }> = {
  default: { icon: <Inbox size={48} />, gradient: 'from-brand-500/10 to-brand-600/5' },
  transactions: { icon: <Wallet size={48} />, gradient: 'from-blue-500/10 to-indigo-500/5' },
  budgets: { icon: <PiggyBank size={48} />, gradient: 'from-emerald-500/10 to-teal-500/5' },
  savings: { icon: <Target size={48} />, gradient: 'from-violet-500/10 to-purple-500/5' },
  search: { icon: <SearchX size={48} />, gradient: 'from-amber-500/10 to-orange-500/5' },
  stats: { icon: <FileText size={48} />, gradient: 'from-cyan-500/10 to-sky-500/5' },
}

export default function EmptyState({ icon, title, description, action, variant = 'default' }: Props) {
  const ill = ILLUSTRATIONS[variant]

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center py-20 px-6 bg-surface-light border border-border rounded-2xl"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, duration: 0.3, ease: 'easeOut' }}
        className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${ill.gradient} border border-brand-500/10 flex items-center justify-center text-brand-400 mb-6 shadow-lg shadow-brand-500/5`}
      >
        {icon ?? ill.icon}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="text-center max-w-sm"
      >
        <h3 className="text-xl font-bold mb-2 text-text-primary">{title}</h3>
        <p className="text-sm text-text-muted leading-relaxed">{description}</p>
      </motion.div>

      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.3 }}
          className="mt-8"
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  )
}
