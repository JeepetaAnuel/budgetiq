import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Target, AlertTriangle, Plus, BarChart3 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import BudgetCard from '../components/finance/BudgetCard'
import Modal from '../components/ui/Modal'
import { useApp } from '../store/AppContext'
import { CATEGORIES } from '../data/categories'
import { fmt, progress, status as getStatus } from '../lib/utils'
import { useToast } from '../store/ToastContext'
import type { Budget } from '../types'

export default function Budgets() {
  const { state, setBudget } = useApp()
  const { toast } = useToast()
  const { budgets, preferences } = state
  const [edit, setEdit] = useState<Budget | null>(null)
  const [newCategory, setNewCategory] = useState('')
  const [limit, setLimit] = useState('')
  const [open, setOpen] = useState(false)
  const [isNew, setIsNew] = useState(false)

  const totalBudget = budgets.reduce((s, b) => s + b.limit, 0)
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0)
  const dangerCount = budgets.filter(b => getStatus(progress(b.spent, b.limit)) === 'danger').length
  const safeCount = budgets.filter(b => getStatus(progress(b.spent, b.limit)) === 'safe').length

  const categoriesWithoutBudget = useMemo(() =>
    CATEGORIES.filter(c => !budgets.find(b => b.category === c.id)),
    [budgets]
  )

  const chartData = useMemo(() =>
    budgets.map(b => {
      const cat = CATEGORIES.find(c => c.id === b.category)
      return {
        name: cat?.name ?? b.category,
        limit: b.limit,
        spent: b.spent,
        color: cat?.color ?? '#64748b',
      }
    }),
    [budgets]
  )

  function handleEdit(b: Budget) {
    setEdit(b)
    setNewCategory('')
    setLimit(b.limit.toString())
    setIsNew(false)
    setOpen(true)
  }

  function handleAdd() {
    setEdit(null)
    setNewCategory(categoriesWithoutBudget[0]?.id ?? '')
    setLimit('')
    setIsNew(true)
    setOpen(true)
  }

  function handleSave() {
    if (isNew) {
      if (!newCategory || !limit) return
      const b: Budget = { category: newCategory, limit: parseFloat(limit), spent: 0 }
      setBudget(b)
      toast({ type: 'success', title: 'Presupuesto creado', message: `Nuevo presupuesto para "${CATEGORIES.find(c => c.id === newCategory)?.name}"` })
    } else if (edit && limit) {
      setBudget({ ...edit, limit: parseFloat(limit) })
      toast({ type: 'success', title: 'Presupuesto actualizado' })
    }
    setOpen(false)
    setEdit(null)
  }

  function resetAll() {
    budgets.forEach(b => setBudget({ ...b, spent: 0 }))
    toast({ type: 'info', title: 'Presupuestos reseteados', message: 'Todos los gastos se han puesto a cero.' })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        <div className="bg-surface-light border border-border rounded-2xl p-5">
          <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1">Sin presupuesto</p>
          <p className="text-2xl font-bold text-warning">{categoriesWithoutBudget.length}</p>
          <p className="text-xs text-text-muted mt-1">categorías</p>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="bg-surface-light border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center"><BarChart3 size={20} className="text-brand-400" /></div>
            <div><h3 className="text-lg font-bold">Comparativa Presupuesto vs Gasto</h3><p className="text-xs text-text-muted">Límite vs gasto actual por categoría</p></div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--color-text-muted)" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--color-surface-light)', border: '1px solid var(--color-border)', borderRadius: 12, color: 'var(--color-text-primary)' }} formatter={(v) => typeof v === 'number' ? fmt(v, preferences.currency) : String(v)} />
                <Bar dataKey="limit" name="Límite" radius={[4, 4, 0, 0]} fill="var(--color-text-muted)" opacity={0.3} />
                <Bar dataKey="spent" name="Gastado" radius={[4, 4, 0, 0]}>
                  {chartData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">Tus Presupuestos</h3>
          <p className="text-sm text-text-muted">Gestiona tus límites de gasto por categoría</p>
        </div>
        <div className="flex gap-2">
          {categoriesWithoutBudget.length > 0 && (
            <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all">
              <Plus size={16} /> Añadir
            </button>
          )}
          <button onClick={resetAll} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-text-muted hover:text-text-primary bg-surface-lighter/50 hover:bg-surface-lighter border border-border rounded-xl transition-all">
            <Target size={16} /> Resetear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {budgets.map((b, i) => (
          <motion.div key={b.category} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <BudgetCard budget={b} currency={preferences.currency} onEdit={handleEdit} />
          </motion.div>
        ))}
        {categoriesWithoutBudget.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (budgets.length + i) * 0.04 }}
            className="bg-surface-light border border-dashed border-border rounded-2xl p-5 flex flex-col items-center justify-center text-center min-h-[180px] hover:border-brand-500/30 transition-all group cursor-pointer"
            onClick={handleAdd}
          >
            <div className="w-10 h-10 rounded-xl bg-surface-lighter flex items-center justify-center mb-3 group-hover:bg-brand-500/10 transition-colors">
              <Plus size={20} className="text-text-muted group-hover:text-brand-400" />
            </div>
            <p className="text-sm font-semibold text-text-muted group-hover:text-text-primary transition-colors">{c.name}</p>
            <p className="text-xs text-text-muted mt-1">Sin presupuesto asignado</p>
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
              {dangerCount} categoría{dangerCount > 1 ? 's' : ''} está{dangerCount === 1 ? '' : 'n'} cerca de exceder el límite. Considera ajustar los límites o reducir gastos.
            </p>
          </div>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={isNew ? 'Nuevo Presupuesto' : 'Editar Presupuesto'}>
        <div className="space-y-4">
          {isNew ? (
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">Categoría</label>
              <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="w-full bg-surface text-text-primary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500/50">
                {categoriesWithoutBudget.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          ) : edit && (
            <div>
              <p className="text-sm font-medium text-text-muted mb-1">{CATEGORIES.find(c => c.id === edit.category)?.name}</p>
              <p className="text-xs text-text-muted">Gastado: {fmt(edit.spent, preferences.currency)}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-muted mb-1.5">Límite mensual</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">
                {preferences.currency === 'EUR' ? '€' : preferences.currency === 'USD' ? '$' : preferences.currency}
              </span>
              <input type="number" value={limit} onChange={e => setLimit(e.target.value)} className="w-full bg-surface text-text-primary border border-border rounded-xl px-8 py-3 text-sm focus:outline-none focus:border-brand-500/50" min="0" step="10" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setOpen(false)} className="flex-1 px-4 py-3 text-sm font-medium text-text-muted hover:text-text-primary bg-surface-lighter/50 hover:bg-surface-lighter border border-border rounded-xl">Cancelar</button>
            <button onClick={handleSave} disabled={!limit || (isNew && !newCategory)} className="flex-1 px-4 py-3 text-sm font-medium text-text-primary bg-gradient-to-r from-brand-500 to-brand-600 disabled:opacity-50 rounded-xl shadow-lg shadow-brand-500/20">
              {isNew ? 'Crear' : 'Guardar'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
