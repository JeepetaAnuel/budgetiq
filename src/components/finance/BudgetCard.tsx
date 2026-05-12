import { motion } from 'framer-motion'
import { Pencil } from 'lucide-react'
import type { Budget } from '../../types'
import { getCategory } from '../../data/categories'
import { fmt, progress, status as getStatus } from '../../lib/utils'
import Icon from '../ui/Icon'
import ProgressBar from '../ui/ProgressBar'
import Badge from '../ui/Badge'
import type { Currency } from '../../types'

interface Props {
  budget: Budget
  currency: Currency
  onEdit?: (b: Budget) => void
}

export default function BudgetCard({ budget, currency, onEdit }: Props) {
  const cat = getCategory(budget.category)
  const pct = progress(budget.spent, budget.limit)
  const st = getStatus(pct)
  const remaining = budget.limit - budget.spent

  const badgeVariant = st === 'danger' ? 'danger' : st === 'warning' ? 'warning' : 'success'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-surface-light border border-border rounded-2xl p-5 hover:border-brand-500/30 transition-all group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${cat.color}15` }}>
            <Icon name={cat.icon} size={20} style={{ color: cat.color }} />
          </div>
          <div>
            <p className="text-sm font-semibold">{cat.name}</p>
            <p className="text-xs text-text-muted">{fmt(budget.spent, currency)} / {fmt(budget.limit, currency)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={badgeVariant}>{pct.toFixed(0)}%</Badge>
          {onEdit && (
            <button onClick={() => onEdit(budget)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-surface-lighter rounded-lg text-text-muted hover:text-text-primary">
              <Pencil size={14} />
            </button>
          )}
        </div>
      </div>

      <ProgressBar value={budget.spent} max={budget.limit} color={cat.color} />

      <div className="flex justify-between mt-2">
        <span className="text-xs text-text-muted">
          {remaining >= 0 ? `${fmt(remaining, currency)} restantes` : `${fmt(Math.abs(remaining), currency)} excedido`}
        </span>
        <span className={`text-xs font-medium ${remaining >= 0 ? 'text-text-muted' : 'text-danger'}`}>
          {remaining >= 0 ? 'En camino' : 'Excedido'}
        </span>
      </div>
    </motion.div>
  )
}
