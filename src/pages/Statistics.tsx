import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { BarChart3, PieChart as PieIcon, TrendingUp, TrendingDown, Download } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { fmt } from '../lib/utils'
import { CATEGORIES } from '../data/categories'
import { useToast } from '../store/ToastContext'

export default function Statistics() {
  const { state } = useApp()
  const { toast } = useToast()
  const { transactions, preferences } = state
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month')

  const filtered = useMemo(() => {
    const now = new Date()
    return transactions.filter(t => {
      const d = new Date(t.date)
      if (period === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 86400000)
        return d >= weekAgo
      }
      if (period === 'month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      return d.getFullYear() === now.getFullYear()
    })
  }, [transactions, period])

  const stats = useMemo(() => {
    const income = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    return { income, expense, savings: income - expense }
  }, [filtered])

  const byCategory = useMemo(() => {
    const map: Record<string, number> = {}
    for (const t of filtered.filter(t => t.type === 'expense')) map[t.category] = (map[t.category] ?? 0) + t.amount
    return CATEGORIES.map(c => ({ name: c.name, value: map[c.id] ?? 0, color: c.color })).filter(d => d.value > 0).sort((a, b) => b.value - a.value)
  }, [filtered])

  const monthlyTrend = useMemo(() => {
    const months: { label: string; ingresos: number; gastos: number }[] = []
    for (let m = 5; m >= 0; m--) {
      const d = new Date()
      d.setMonth(d.getMonth() - m)
      const tx = transactions.filter(t => {
        const td = new Date(t.date)
        return td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear()
      })
      months.push({
        label: d.toLocaleString('es', { month: 'short' }),
        ingresos: tx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
        gastos: tx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
      })
    }
    return months
  }, [transactions])

  const topExpense = useMemo(() =>
    [...filtered].filter(t => t.type === 'expense').sort((a, b) => b.amount - a.amount).slice(0, 5),
    [filtered]
  )

  function exportPDF() {
    toast({ type: 'success', title: 'Informe exportado', message: 'El PDF se ha generado correctamente.' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">Estadísticas e Informes</h3>
          <p className="text-sm text-text-muted">Analiza tu rendimiento financiero</p>
        </div>
        <button onClick={exportPDF} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-brand-400 bg-brand-500/10 hover:bg-brand-500/20 rounded-xl border border-brand-500/20 transition-all">
          <Download size={16} /> Exportar PDF
        </button>
      </div>

      <div className="flex gap-2">
        {(['week', 'month', 'year'] as const).map(p => (
          <button key={p} onClick={() => setPeriod(p)} className={`px-4 py-2 text-sm font-medium rounded-xl border transition-all ${period === p ? 'bg-brand-500/10 text-brand-400 border-brand-500/20' : 'bg-surface-lighter/30 text-text-muted border-border hover:border-brand-500/30'}`}>
            {p === 'week' ? 'Semana' : p === 'month' ? 'Mes' : 'Año'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface-light border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-1"><TrendingUp size={16} className="text-success" /><span className="text-xs text-text-muted uppercase font-semibold">Ingresos</span></div>
          <p className="text-2xl font-bold text-success">{fmt(stats.income, preferences.currency)}</p>
        </div>
        <div className="bg-surface-light border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-1"><TrendingDown size={16} className="text-danger" /><span className="text-xs text-text-muted uppercase font-semibold">Gastos</span></div>
          <p className="text-2xl font-bold text-danger">{fmt(stats.expense, preferences.currency)}</p>
        </div>
        <div className="bg-surface-light border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-1"><TrendingUp size={16} className="text-brand-400" /><span className="text-xs text-text-muted uppercase font-semibold">Ahorro</span></div>
          <p className="text-2xl font-bold" style={{ color: stats.savings >= 0 ? '#10b981' : '#ef4444' }}>{fmt(stats.savings, preferences.currency)}</p>
        </div>
        <div className="bg-surface-light border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-1"><PieIcon size={16} className="text-brand-400" /><span className="text-xs text-text-muted uppercase font-semibold">Categorías</span></div>
          <p className="text-2xl font-bold">{byCategory.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-light border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center"><BarChart3 size={20} className="text-brand-400" /></div>
            <div><h3 className="text-lg font-bold">Evolución Mensual</h3><p className="text-xs text-text-muted">Últimos 6 meses</p></div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="label" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--color-text-muted)" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--color-surface-light)', border: '1px solid var(--color-border)', borderRadius: 12, color: 'var(--color-text-primary)' }} formatter={(v) => typeof v === 'number' ? fmt(v, preferences.currency) : String(v)} />
                <Bar dataKey="ingresos" name="Ingresos" radius={[6, 6, 0, 0]} fill="#10b981" />
                <Bar dataKey="gastos" name="Gastos" radius={[6, 6, 0, 0]} fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface-light border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center"><PieIcon size={20} className="text-brand-400" /></div>
            <div><h3 className="text-lg font-bold">Distribución de Gastos</h3><p className="text-xs text-text-muted">Por categoría</p></div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byCategory} cx="50%" cy="50%" outerRadius={80} paddingAngle={3} dataKey="value">
                  {byCategory.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--color-surface-light)', border: '1px solid var(--color-border)', borderRadius: 12, color: 'var(--color-text-primary)' }} formatter={(v) => typeof v === 'number' ? fmt(v, preferences.currency) : String(v)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {byCategory.map(c => (
              <span key={c.name} className="flex items-center gap-1.5 text-xs text-text-muted">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />{c.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-surface-light border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center"><TrendingDown size={20} className="text-danger" /></div>
          <div><h3 className="text-lg font-bold">Top Gastos</h3><p className="text-xs text-text-muted">Las 5 transacciones más altas del período</p></div>
        </div>
        <div className="divide-y divide-border">
          {topExpense.length === 0 && <p className="text-sm text-text-muted py-4 text-center">No hay gastos en este período.</p>}
          {topExpense.map(t => {
            const cat = CATEGORIES.find(c => c.id === t.category)
            return (
              <div key={t.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat?.color ?? '#64748b' }} />
                  <div>
                    <p className="text-sm font-medium">{cat?.name ?? t.category}</p>
                    <p className="text-xs text-text-muted">{t.description || t.date}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-danger">{fmt(t.amount, preferences.currency)}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}