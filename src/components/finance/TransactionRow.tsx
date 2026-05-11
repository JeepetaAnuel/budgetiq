import { motion } from 'framer-motion'
import { Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import type { Transaction } from '../../types'
import { getCategory } from '../../data/categories'
import { fmt, shortDate } from '../../lib/utils'
import { useApp } from '../../store/AppContext'
import Icon from '../ui/Icon'

interface Props {
  transaction: Transaction
}

export default function TransactionRow({ transaction }: Props) {
  const { deleteTransaction, state } = useApp()
  const cat = getCategory(transaction.category)
  const isIncome = transaction.type === 'income'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      layout
      className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-lighter/30 transition-colors group"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
        isIncome ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
      }`}>
        {isIncome ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold truncate">{transaction.description}</span>
          <span className="flex-shrink-0 text-xs text-text-muted bg-surface-lighter px-2 py-0.5 rounded-md">
            <Icon name={cat.icon} size={10} className="inline mr-1" />
            {cat.name}
          </span>
        </div>
        <p className="text-xs text-text-muted mt-0.5">{shortDate(transaction.date)}</p>
      </div>

      <div className="flex items-center gap-3">
        <span className={`text-sm font-bold ${isIncome ? 'text-success' : ''}`}>
          {isIncome ? '+' : '-'}{fmt(transaction.amount, state.preferences.currency)}
        </span>
        <button
          onClick={() => deleteTransaction(transaction.id)}
          className="p-2 opacity-0 group-hover:opacity-100 transition-all text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  )
}
