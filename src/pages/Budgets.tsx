import { useState } from 'react'
import { motion } from 'framer-motion'
import { Target, AlertTriangle } from 'lucide-react'
import BudgetCard from '../components/finance/BudgetCard'
import Modal from '../components/ui/Modal'
import { useApp } from '../store/AppContext'
import { CATEGORIES } from '../data/categories'
import { fmt, progress, status as getStatus } from '../lib/utils'
import type { Budget } from '../types'

export default function Budgets() {
  const { state, setBudget } = useApp()
  const { budgets, preferences } = state
  const [edit, setEdit] = useState<Budget | null>(null)
  const [limit, setLimit] = useState('')
  const [open, setOpen] = useState(false)

  const totalBudget = budgets.reduce((s, b) => s + b.limit, 0)
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0)
  const dangerCount = budgets.filter(b => getStatus(progress(b.spent, b.limit)) === 'danger').length
  const safeCount = budgets.filter(b => getStatus(progress(b.spent, b.limit)) === 'safe').length

  function handleEdit(b: Budget) {
    setEdit(b)
    setLimit(b.limit.toString())
    setOpen(true)
  }

  function handleSave() {
    if (edit && limit) setBudget({ ...edit, limit: parseFloat(limit) })
    setOpen(false)
    setEdit(null)
  }

  function resetAll() {
    budgets.forEach(b => setBudget({ ...b, spent: 0 }))
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-light border border-border rounded-2xl p-5">
          <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1">Presupuesto Total</p>
          <p className="text-2xl font-bold">{fmt(totalBudget, preferences.currency)}</p>
          <p className="text-xs text-text-muted mt-1">{fmt(totalSpent, preferences.currency)} gastado</p>
        </div>
        <div className="bg-surface-light border border-border rounded-2xl p-5">
          <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1">Saludables</p>
          <p className="text-2xl font-bold text-success">{safeCount}</p>
          <p className="text-xs text-text-muted mt-1">dentro del límite</p>
        </div>
        <div className="bg-surface-light border border-border rounded-2xl p-5">
          <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1">En Alerta</p>
          <p className="text-2xl font-bold text-danger">{dangerCount}</p>
          <p className="text-xs text-text-muted mt-1">cerca del límite</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">Tus Presupuestos</h3>
          <p className="text-sm text-text-muted">Gestiona tus límites de gasto por categoría</p>
        </div>
        <button onClick={resetAll} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-text-muted hover:text-white bg-surface-lighter/50 hover:bg-surface-lighter border border-border rounded-xl transition-all">
          <Target size={16} /> Resetear
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {budgets.map((b, i) => (
          <motion.div key={b.category} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <BudgetCard budget={b} currency={preferences.currency} onEdit={handleEdit} />
          </motion.div>
        ))}
      </div>

      {dangerCount > 0 && (
        <div className="bg-danger/5 border border-danger/20 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} className="text-danger" />
          </div>
          <div>
            <p className="text-sm font-semibold">Presupuestos en riesgo</p>
            <p className="text-xs text-text-muted mt-1">
              {dangerCount} categoría{dangerCount > 1 ? 's' : ''} está{dangerCount === 1 ? '' : 'n'} cerca de exceder el límite.
            </p>
          </div>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Editar Presupuesto">
        {edit && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-text-muted mb-1">{CATEGORIES.find(c => c.id === edit.category)?.name}</p>
              <p className="text-xs text-text-muted">Gastado: {fmt(edit.spent, preferences.currency)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">Nuevo límite</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">
                  {preferences.currency === 'EUR' ? '€' : preferences.currency === 'USD' ? '$' : preferences.currency}
                </span>
                <input type="number" value={limit} onChange={e => setLimit(e.target.value)} className="w-full bg-surface text-white border border-border rounded-xl px-8 py-3 text-sm focus:outline-none focus:border-brand-500/50" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setOpen(false)} className="flex-1 px-4 py-3 text-sm font-medium text-text-muted hover:text-white bg-surface-lighter/50 hover:bg-surface-lighter border border-border rounded-xl">Cancelar</button>
              <button onClick={handleSave} className="flex-1 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl">Guardar</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
