import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { AIAllocation, Currency } from '../../types'
import { getCategory } from '../../data/categories'
import { fmt } from '../../lib/utils'
import ProgressBar from '../ui/ProgressBar'

interface Props {
  allocation: AIAllocation
  currency: Currency
  index: number
  totalIncome: number
}

export default function AllocationItem({ allocation, currency, index }: Props) {
  const [open, setOpen] = useState(false)
  const cat = getCategory(allocation.category)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <div
        className="p-4 rounded-xl bg-surface-lighter/30 border border-border hover:border-brand-500/20 transition-all cursor-pointer"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
            <span className="text-sm font-semibold">{cat.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold">{fmt(allocation.amount, currency)}</span>
            <span className="text-xs font-medium text-text-muted bg-surface-lighter px-2 py-0.5 rounded-md">{allocation.percentage.toFixed(1)}%</span>
          </div>
        </div>

        <ProgressBar value={allocation.percentage} max={100} color={cat.color} height={6} />

        <AnimatePresence>
          {open && (
            <motion.p
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="text-xs text-text-muted mt-3 pt-3 border-t border-border overflow-hidden"
            >
              {allocation.reasoning}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
