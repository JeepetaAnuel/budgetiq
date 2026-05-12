import { useState } from 'react'
import { motion } from 'framer-motion'
import { Target, Plus, Trash2, TrendingUp, Sparkles } from 'lucide-react'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import { useApp } from '../store/AppContext'
import { useToast } from '../store/ToastContext'
import { fmt, uid } from '../lib/utils'
import type { SavingsGoal } from '../types'

const ICONS = ['🎯', '✈️', '🚗', '💰', '🏠', '🎓', '💻', '👶']

export default function SavingsGoals() {
  const { state, addGoal, updateGoal, deleteGoal } = useApp()
  const { toast } = useToast()
  const { savingsGoals, preferences } = state
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', targetAmount: '', deadline: '', priority: 'medium' as SavingsGoal['priority'], icon: '🎯' })

  const totalTarget = savingsGoals.reduce((s, g) => s + g.targetAmount, 0)
  const totalSaved = savingsGoals.reduce((s, g) => s + g.currentAmount, 0)

  const priorityColors: Record<string, string> = { low: '#64748b', medium: '#10b981', high: '#f59e0b', urgent: '#ef4444' }

  function handleSubmit() {
    if (!form.name || !form.targetAmount) return
    addGoal({
      id: uid(),
      name: form.name,
      targetAmount: parseFloat(form.targetAmount),
      currentAmount: 0,
      deadline: form.deadline,
      priority: form.priority,
      icon: form.icon,
    })
    toast({ type: 'success', title: 'Meta creada', message: `"${form.name}" — ¡empieza a ahorrar!` })
    setOpen(false)
    setForm({ name: '', targetAmount: '', deadline: '', priority: 'medium', icon: '🎯' })
  }

  function addContribution(goal: SavingsGoal) {
    const amount = Math.min(50, goal.targetAmount - goal.currentAmount)
    updateGoal({ ...goal, currentAmount: goal.currentAmount + amount })
    toast({ type: 'success', title: 'Aportación registrada', message: `+${fmt(amount, preferences.currency)} a "${goal.name}"` })
  }

  if (savingsGoals.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Metas de Ahorro</h3>
            <p className="text-sm text-text-muted">Define tus objetivos financieros</p>
          </div>
          <button onClick={() => setOpen(true)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all">
            <Plus size={16} /> Crear meta
          </button>
        </div>
        <EmptyState icon={<Target size={48} />} title="No hay metas de ahorro" description="Crea tu primera meta y empieza a ahorrar para lo que más te importa." />
        <Modal open={open} onClose={() => setOpen(false)} title="Nueva Meta de Ahorro">
          <GoalForm form={form} setForm={setForm} onSubmit={handleSubmit} onCancel={() => setOpen(false)} />
        </Modal>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">Metas de Ahorro</h3>
          <p className="text-sm text-text-muted">Define tus objetivos financieros</p>
        </div>
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all">
          <Plus size={16} /> Crear meta
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-light border border-border rounded-2xl p-5">
          <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1">Objetivo Total</p>
          <p className="text-2xl font-bold">{fmt(totalTarget, preferences.currency)}</p>
        </div>
        <div className="bg-surface-light border border-border rounded-2xl p-5">
          <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1">Ahorrado</p>
          <p className="text-2xl font-bold text-success">{fmt(totalSaved, preferences.currency)}</p>
        </div>
        <div className="bg-surface-light border border-border rounded-2xl p-5">
          <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1">Progreso Global</p>
          <p className="text-2xl font-bold text-brand-400">{totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {savingsGoals.map((goal, i) => {
          const pct = goal.targetAmount > 0 ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) : 0
          return (
            <motion.div key={goal.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-surface-light border border-border rounded-2xl p-5 relative group">
              <button onClick={() => { deleteGoal(goal.id); toast({ type: 'info', title: 'Meta eliminada' }) }} className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-danger/10 text-danger opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                <Trash2 size={14} />
              </button>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-lg">{goal.icon}</div>
                <div>
                  <p className="font-semibold">{goal.name}</p>
                  <p className="text-xs text-text-muted">{goal.deadline ? `📅 ${goal.deadline}` : 'Sin fecha límite'}</p>
                </div>
              </div>
              <div className="flex justify-between text-sm mb-1.5">
                <span>{fmt(goal.currentAmount, preferences.currency)}</span>
                <span className="text-text-muted">{fmt(goal.targetAmount, preferences.currency)}</span>
              </div>
              <div className="h-2 bg-surface-lighter rounded-full overflow-hidden mb-1.5">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: priorityColors[goal.priority] }} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${priorityColors[goal.priority]}20`, color: priorityColors[goal.priority] }}>
                  {goal.priority === 'urgent' ? 'Urgente' : goal.priority === 'high' ? 'Alta' : goal.priority === 'medium' ? 'Media' : 'Baja'}
                </span>
                <span className="text-sm font-semibold">{pct.toFixed(0)}%</span>
              </div>
              {pct < 100 && (
                <button onClick={() => addContribution(goal)} className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-brand-400 bg-brand-500/10 hover:bg-brand-500/20 rounded-xl border border-brand-500/20 transition-all">
                  <TrendingUp size={14} /> Aportar $50
                </button>
              )}
              {pct >= 100 && (
                <div className="mt-3 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-success bg-success/10 rounded-xl">
                  <Sparkles size={14} /> ¡Meta alcanzada!
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Nueva Meta de Ahorro">
        <GoalForm form={form} setForm={setForm} onSubmit={handleSubmit} onCancel={() => setOpen(false)} />
      </Modal>
    </div>
  )
}

function GoalForm({ form, setForm, onSubmit, onCancel }: {
  form: { name: string; targetAmount: string; deadline: string; priority: string; icon: string }
  setForm: (f: any) => void
  onSubmit: () => void
  onCancel: () => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text-muted mb-1.5">Icono</label>
        <div className="flex gap-2 flex-wrap">
          {ICONS.map(icon => (
            <button key={icon} onClick={() => setForm({ ...form, icon })} className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg border transition-all ${form.icon === icon ? 'border-brand-500 bg-brand-500/10' : 'border-border hover:border-brand-500/30'}`}>{icon}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-text-muted mb-1.5">Nombre de la meta</label>
        <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-surface text-text-primary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500/50" placeholder="Ej: Viaje a Japón" />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-muted mb-1.5">Monto objetivo</label>
        <input type="number" value={form.targetAmount} onChange={e => setForm({ ...form, targetAmount: e.target.value })} className="w-full bg-surface text-text-primary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500/50" placeholder="5000" />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-muted mb-1.5">Fecha límite (opcional)</label>
        <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} className="w-full bg-surface text-text-primary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500/50" />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-muted mb-1.5">Prioridad</label>
        <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="w-full bg-surface text-text-primary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500/50">
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
          <option value="urgent">Urgente</option>
        </select>
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={onCancel} className="flex-1 px-4 py-3 text-sm font-medium text-text-muted hover:text-text-primary bg-surface-lighter/50 hover:bg-surface-lighter border border-border rounded-xl">Cancelar</button>
        <button onClick={onSubmit} disabled={!form.name || !form.targetAmount} className="flex-1 px-4 py-3 text-sm font-medium text-text-primary bg-gradient-to-r from-brand-500 to-brand-600 disabled:opacity-50 rounded-xl shadow-lg shadow-brand-500/20">Crear meta</button>
      </div>
    </div>
  )
}