import { useState, useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Plus, Search, ArrowUpDown, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import Modal from '../components/ui/Modal'
import TransactionRow from '../components/finance/TransactionRow'
import EmptyState from '../components/ui/EmptyState'
import { useApp } from '../store/AppContext'
import { CATEGORIES, INCOME_CATEGORIES } from '../data/categories'
import { fmt } from '../lib/utils'

export default function Transactions() {
  const { state, addTransaction } = useApp()
  const { transactions, preferences } = state

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [open, setOpen] = useState(false)

  const [form, setForm] = useState({ type: 'expense' as 'income' | 'expense', category: 'food', amount: '', description: '', date: new Date().toISOString().slice(0, 10) })

  const stats = useMemo(() => ({
    income: transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
    expense: transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    count: transactions.length,
  }), [transactions])

  const filtered = useMemo(() => {
    let r = [...transactions]
    if (filter !== 'all') r = r.filter(t => t.type === filter)
    if (search) { const q = search.toLowerCase(); r = r.filter(t => t.description.toLowerCase().includes(q) || t.category.includes(q)) }
    r.sort((a, b) => {
      const m = sortDir === 'asc' ? 1 : -1
      return sortBy === 'date'
        ? (new Date(a.date).getTime() - new Date(b.date).getTime()) * m
        : (a.amount - b.amount) * m
    })
    return r
  }, [transactions, filter, search, sortBy, sortDir])

  function toggleSort(field: 'date' | 'amount') {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(field); setSortDir('desc') }
  }

  function handleSubmit() {
    if (!form.amount || !form.description) return
    addTransaction({ type: form.type, category: form.category, amount: parseFloat(form.amount), description: form.description, date: form.date })
    setOpen(false)
    setForm({ type: 'expense', category: 'food', amount: '', description: '', date: new Date().toISOString().slice(0, 10) })
  }

  const cats = form.type === 'income' ? INCOME_CATEGORIES : CATEGORIES

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-light border border-border rounded-2xl p-5">
          <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1">Total Ingresos</p>
          <p className="text-2xl font-bold text-success">{fmt(stats.income, preferences.currency)}</p>
        </div>
        <div className="bg-surface-light border border-border rounded-2xl p-5">
          <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1">Total Gastos</p>
          <p className="text-2xl font-bold text-danger">{fmt(stats.expense, preferences.currency)}</p>
        </div>
        <div className="bg-surface-light border border-border rounded-2xl p-5">
          <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1">Transacciones</p>
          <p className="text-2xl font-bold">{stats.count}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." className="w-full bg-surface-lighter/50 text-white border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-500/50 placeholder:text-text-muted" />
          </div>
          <div className="flex bg-surface-lighter/50 border border-border rounded-xl p-1">
            {(['all', 'income', 'expense'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${filter === f ? 'bg-surface-lighter text-white shadow-sm' : 'text-text-muted hover:text-white'}`}>
                {f === 'all' ? 'Todas' : f === 'income' ? 'Ingresos' : 'Gastos'}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-brand-500/20">
          <Plus size={16} /> Nueva Transacción
        </button>
      </div>

      <div className="bg-surface-light border border-border rounded-2xl">
        <div className="flex items-center gap-4 px-5 py-3 border-b border-border text-xs font-semibold text-text-muted uppercase tracking-wider">
          <button onClick={() => toggleSort('date')} className="flex items-center gap-1 hover:text-white"><ArrowUpDown size={12} /> Fecha</button>
          <span className="flex-1">Descripción</span>
          <button onClick={() => toggleSort('amount')} className="flex items-center gap-1 hover:text-white"><ArrowUpDown size={12} /> Monto</button>
          <span className="w-8" />
        </div>
        <div className="divide-y divide-border">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0
              ? <EmptyState icon={<Search size={24} />} title="Sin resultados" description="No se encontraron transacciones." />
              : filtered.map(t => <TransactionRow key={t.id} transaction={t} />)
            }
          </AnimatePresence>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Nueva Transacción">
        <div className="space-y-4">
          <div className="flex bg-surface-lighter/50 border border-border rounded-xl p-1">
            {(['expense', 'income'] as const).map(t => (
              <button key={t} onClick={() => setForm(f => ({ ...f, type: t, category: t === 'income' ? 'salary' : 'food' }))}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg ${form.type === t ? (t === 'income' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger') : 'text-text-muted hover:text-white'}`}>
                {t === 'income' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {t === 'income' ? 'Ingreso' : 'Gasto'}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-muted mb-1.5">Categoría</label>
            <div className="grid grid-cols-2 gap-2">
              {cats.map(c => (
                <button key={c.id} onClick={() => setForm(f => ({ ...f, category: c.id }))}
                  className={`px-3 py-2.5 text-sm rounded-xl border ${form.category === c.id ? 'border-brand-500/50 bg-brand-500/10 text-brand-400' : 'border-border text-text-muted hover:text-white hover:border-text-muted'}`}>
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-muted mb-1.5">Descripción</label>
            <input type="text" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full bg-surface text-white border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500/50" placeholder="Ej: Supermercado" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">Monto</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">{preferences.currency === 'EUR' ? '€' : '$'}</span>
                <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} className="w-full bg-surface text-white border border-border rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:border-brand-500/50" step="0.01" min="0" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">Fecha</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full bg-surface text-white border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500/50" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setOpen(false)} className="flex-1 px-4 py-3 text-sm font-medium text-text-muted hover:text-white bg-surface-lighter/50 hover:bg-surface-lighter border border-border rounded-xl">Cancelar</button>
            <button onClick={handleSubmit} disabled={!form.amount || !form.description} className="flex-1 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-brand-500 to-brand-600 disabled:opacity-50 rounded-xl shadow-lg shadow-brand-500/20">Añadir</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
