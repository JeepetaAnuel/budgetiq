import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Plus, UserPlus, DollarSign, Receipt, X, CheckCircle } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { useToast } from '../store/ToastContext'
import { fmt, uid } from '../lib/utils'
import { CATEGORIES } from '../data/categories'
import type { SharedGroup, SharedExpense } from '../types'

const SEED_GROUPS: SharedGroup[] = [
  {
    id: 'g1',
    name: 'Piso Centro',
    members: ['Ana', 'Bob', 'Carlos', 'Tú'],
    expenses: [
      { id: 'e1', description: 'Compra semanal', amount: 120.50, paidBy: 'Ana', date: '2026-05-01', category: 'food' },
      { id: 'e2', description: 'Electricidad', amount: 65.00, paidBy: 'Bob', date: '2026-05-03', category: 'utilities' },
      { id: 'e3', description: 'Internet', amount: 45.00, paidBy: 'Carlos', date: '2026-05-05', category: 'utilities' },
    ],
  },
]

export default function SharedFinances() {
  const { state } = useApp()
  const { toast } = useToast()
  const { preferences } = state
  const [groups, setGroups] = useState<SharedGroup[]>(SEED_GROUPS)
  const [activeGroup, setActiveGroup] = useState<string>(groups[0]?.id ?? '')
  const [open, setOpen] = useState(false)
  const [newGroup, setNewGroup] = useState(false)
  const [form, setForm] = useState({ name: '', members: '' })
  const [expenseForm, setExpenseForm] = useState({ description: '', amount: '', paidBy: '', category: 'food' })

  const group = groups.find(g => g.id === activeGroup)

  function totalByMember(member: string): number {
    if (!group) return 0
    return group.expenses.filter(e => e.paidBy === member).reduce((s, e) => s + e.amount, 0)
  }

  function calculateDebts(): { from: string; to: string; amount: number }[] {
    if (!group || group.members.length === 0) return []
    const perPerson = group.expenses.reduce((s, e) => s + e.amount, 0) / group.members.length
    const debts: { from: string; to: string; amount: number }[] = []
    for (const member of group.members) {
      const paid = totalByMember(member)
      if (paid < perPerson) {
        const debtor = member
        const owe = perPerson - paid
        for (const other of group.members) {
          if (other === debtor) continue
          const otherPaid = totalByMember(other)
          if (otherPaid > perPerson) {
            debts.push({ from: debtor, to: other, amount: Math.min(owe, otherPaid - perPerson) })
          }
        }
      }
    }
    return debts
  }

  function addExpense() {
    if (!group || !expenseForm.description || !expenseForm.amount || !expenseForm.paidBy) return
    const expense: SharedExpense = {
      id: uid(),
      description: expenseForm.description,
      amount: parseFloat(expenseForm.amount),
      paidBy: expenseForm.paidBy,
      date: new Date().toISOString().slice(0, 10),
      category: expenseForm.category,
    }
    setGroups(groups.map(g => g.id === activeGroup ? { ...g, expenses: [...g.expenses, expense] } : g))
    toast({ type: 'success', title: 'Gasto añadido', message: `${expenseForm.description} · ${fmt(parseFloat(expenseForm.amount), preferences.currency)}` })
    setExpenseForm({ description: '', amount: '', paidBy: '', category: 'food' })
    setOpen(false)
  }

  function createGroup() {
    if (!form.name || !form.members) return
    const members = [...form.members.split(',').map(m => m.trim()), 'Tú']
    setGroups([...groups, { id: uid(), name: form.name, members, expenses: [] }])
    toast({ type: 'success', title: 'Grupo creado', message: form.name })
    setForm({ name: '', members: '' })
    setNewGroup(false)
  }

  const totalExpenses = group?.expenses.reduce((s, e) => s + e.amount, 0) ?? 0
  const debts = calculateDebts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">Finanzas Compartidas</h3>
          <p className="text-sm text-text-muted">Gestiona gastos en grupo</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setNewGroup(true)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-brand-400 bg-brand-500/10 hover:bg-brand-500/20 rounded-xl border border-brand-500/20 transition-all">
            <UserPlus size={16} /> Nuevo grupo
          </button>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="bg-surface-light border border-border rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto mb-4"><Users size={32} className="text-brand-400" /></div>
          <p className="text-lg font-semibold">No hay grupos</p>
          <p className="text-sm text-text-muted mt-1">Crea un grupo para empezar a compartir gastos.</p>
          <button onClick={() => setNewGroup(true)} className="mt-4 px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-brand-500/20 inline-flex items-center gap-2">
            <UserPlus size={16} /> Crear grupo
          </button>
        </div>
      ) : (
        <>
          <div className="flex gap-2 flex-wrap">
            {groups.map(g => (
              <button key={g.id} onClick={() => setActiveGroup(g.id)} className={`px-4 py-2 text-sm font-medium rounded-xl border transition-all ${activeGroup === g.id ? 'bg-brand-500/10 text-brand-400 border-brand-500/20' : 'bg-surface-lighter/30 text-text-muted border-border hover:border-brand-500/30'}`}>
                {g.name}
              </button>
            ))}
          </div>

          {group && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-surface-light border-2 border-brand-500/20 rounded-2xl p-5">
                  <p className="text-xs text-text-muted uppercase font-semibold mb-1">Grupo</p>
                  <p className="text-lg font-bold">{group.name}</p>
                  <p className="text-xs text-text-muted mt-1">{group.members.join(' · ')}</p>
                </div>
                <div className="bg-surface-light border border-border rounded-2xl p-5">
                  <p className="text-xs text-text-muted uppercase font-semibold mb-1">Gasto total</p>
                  <p className="text-2xl font-bold">{fmt(totalExpenses, preferences.currency)}</p>
                </div>
                <div className="bg-surface-light border border-border rounded-2xl p-5">
                  <p className="text-xs text-text-muted uppercase font-semibold mb-1">Por persona</p>
                  <p className="text-2xl font-bold text-brand-400">{group.members.length > 0 ? fmt(totalExpenses / group.members.length, preferences.currency) : '$0'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-surface-light border border-border rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center"><Receipt size={20} className="text-brand-400" /></div>
                      <div><h4 className="font-semibold">Gastos</h4><p className="text-xs text-text-muted">{group.expenses.length} registros</p></div>
                    </div>
                    <button onClick={() => setOpen(true)} className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-brand-400 bg-brand-500/10 hover:bg-brand-500/20 rounded-xl border border-brand-500/20 transition-all"><Plus size={14} /> Añadir</button>
                  </div>
                  <div className="divide-y divide-border">
                    {group.expenses.map(e => {
                      const cat = CATEGORIES.find(c => c.id === e.category)
                      return (
                        <div key={e.id} className="flex items-center justify-between py-3">
                          <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat?.color ?? '#64748b' }} />
                            <div>
                              <p className="text-sm font-medium">{e.description}</p>
                              <p className="text-xs text-text-muted">{e.paidBy} · {e.date}</p>
                            </div>
                          </div>
                          <span className="text-sm font-semibold">{fmt(e.amount, preferences.currency)}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="bg-surface-light border border-border rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center"><DollarSign size={20} className="text-amber-400" /></div>
                    <div><h4 className="font-semibold">Liquidaciones</h4><p className="text-xs text-text-muted">Deudas pendientes</p></div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {group.members.map(m => (
                      <div key={m} className="flex items-center justify-between p-3 bg-surface-lighter/30 rounded-xl">
                        <span className="text-sm font-medium">{m}</span>
                        <span className="text-sm font-semibold">{fmt(totalByMember(m), preferences.currency)}</span>
                      </div>
                    ))}
                  </div>

                  {debts.length > 0 ? (
                    <div className="space-y-2">
                      {debts.map((d, i) => (
                        <div key={i} className="flex items-center gap-2 p-3 bg-danger/5 border border-danger/10 rounded-xl">
                          <span className="text-sm"><strong>{d.from}</strong> debe <strong>{fmt(d.amount, preferences.currency)}</strong> a <strong>{d.to}</strong></span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-success/5 border border-success/10 rounded-xl">
                      <CheckCircle size={16} className="text-success" />
                      <span className="text-sm text-success">Todo en orden — no hay deudas pendientes</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setOpen(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-surface-light border border-border rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Nuevo gasto compartido</h4>
                <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg bg-surface-lighter flex items-center justify-center"><X size={16} /></button>
              </div>
              <div className="space-y-3">
                <input type="text" value={expenseForm.description} onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })} className="w-full bg-surface text-text-primary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500/50" placeholder="Descripción" />
                <input type="number" value={expenseForm.amount} onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })} className="w-full bg-surface text-text-primary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500/50" placeholder="Importe" />
                <select value={expenseForm.paidBy} onChange={e => setExpenseForm({ ...expenseForm, paidBy: e.target.value })} className="w-full bg-surface text-text-primary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500/50">
                  <option value="">¿Quién pagó?</option>
                  {group?.members.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select value={expenseForm.category} onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value })} className="w-full bg-surface text-text-primary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500/50">
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <button onClick={addExpense} disabled={!expenseForm.description || !expenseForm.amount || !expenseForm.paidBy} className="w-full px-4 py-3 text-sm font-medium text-text-primary bg-gradient-to-r from-brand-500 to-brand-600 disabled:opacity-50 rounded-xl shadow-lg shadow-brand-500/20">Añadir gasto</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {newGroup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setNewGroup(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-surface-light border border-border rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Nuevo grupo</h4>
                <button onClick={() => setNewGroup(false)} className="w-8 h-8 rounded-lg bg-surface-lighter flex items-center justify-center"><X size={16} /></button>
              </div>
              <div className="space-y-3">
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-surface text-text-primary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500/50" placeholder="Nombre del grupo" />
                <input type="text" value={form.members} onChange={e => setForm({ ...form, members: e.target.value })} className="w-full bg-surface text-text-primary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500/50" placeholder="Miembros (separados por coma)" />
                <p className="text-xs text-text-muted">Tú serás añadido automáticamente.</p>
                <button onClick={createGroup} disabled={!form.name || !form.members} className="w-full px-4 py-3 text-sm font-medium text-text-primary bg-gradient-to-r from-brand-500 to-brand-600 disabled:opacity-50 rounded-xl shadow-lg shadow-brand-500/20">Crear grupo</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}