import { useState, useMemo } from 'react'
import { TrendingUp, TrendingDown, PiggyBank, Wallet, Building, Link2, Unlink, Settings, ArrowRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import StatCard from '../components/ui/StatCard'
import BudgetCard from '../components/finance/BudgetCard'
import TransactionRow from '../components/finance/TransactionRow'
import BankConnector from '../components/finance/BankConnector'
import Icon from '../components/ui/Icon'
import { useApp } from '../store/AppContext'
import { fmt } from '../lib/utils'
import { CATEGORIES } from '../data/categories'
import { BANKS } from '../data/banks'


export default function Dashboard() {
  const { state, setBank } = useApp()
  const { transactions, budgets, preferences } = state
  const cur = preferences.currency
  const [bankOpen, setBankOpen] = useState(false)

  const monthTx = useMemo(() => {
    const now = new Date()
    return transactions.filter(t => {
      const d = new Date(t.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }, [transactions])

  const stats = useMemo(() => {
    const income = monthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expense = monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    const savings = income - expense
    const rate = income > 0 ? (savings / income) * 100 : 0
    return { income, expense, savings, rate }
  }, [monthTx])

  const pieData = useMemo(() => {
    const byCat: Record<string, number> = {}
    for (const t of monthTx.filter(t => t.type === 'expense')) byCat[t.category] = (byCat[t.category] ?? 0) + t.amount
    return CATEGORIES.map(c => ({ name: c.name, value: byCat[c.id] ?? 0, color: c.color })).filter(d => d.value > 0)
  }, [monthTx])

  const daily = useMemo(() => {
    const map: Record<string, number> = {}
    for (const t of monthTx.filter(t => t.type === 'expense')) {
      const day = new Date(t.date).getDate().toString()
      map[day] = (map[day] ?? 0) + t.amount
    }
    return Object.entries(map).map(([d, a]) => ({ day: d, amount: a })).sort((a, b) => Number(a.day) - Number(b.day))
  }, [monthTx])

  const recent = useMemo(() =>
    [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5),
    [transactions]
  )

  const totalBudget = budgets.reduce((s, b) => s + b.limit, 0)
  const bank = preferences.bank
  const bankMeta = bank ? BANKS.find(b => b.id === bank.bankId) : null

  return (
    <div className="space-y-6">
      {/* Income setup banner — shown when no income is configured */}
      {preferences.monthlyIncome <= 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
            <Settings size={20} className="text-amber-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Configura tus ingresos</p>
            <p className="text-xs text-text-muted mt-1">Define tu ingreso mensual para que BudgetIQ pueda optimizar tus finanzas. Puedes hacerlo manualmente o conectando tu banco.</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => setBankOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 text-sm font-medium rounded-xl border border-brand-500/20 transition-all">
              <Link2 size={16} /> Conectar banco
            </button>
            <a href="/settings" className="flex items-center gap-2 px-4 py-2.5 bg-surface-lighter/50 hover:bg-surface-lighter text-sm font-medium rounded-xl border border-border transition-all">
              <Settings size={16} /> Manual
            </a>
          </div>
        </div>
      )}

      {/* Bank connection status */}
      {bank && bankMeta && (
        <div className="bg-gradient-to-r from-brand-500/5 to-success/5 border border-brand-500/10 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${bankMeta.color}15` }}>
              <Icon name={bankMeta.logo} size={24} style={{ color: bankMeta.color }} />
            </div>
            <div>
              <p className="text-sm font-semibold">{bank.bankName} · Cuenta conectada</p>
              <p className="text-xs text-text-muted mt-0.5">
                {bank.accountNumber.slice(0, 4)} **** {bank.accountNumber.slice(-4)}
                <span className="ml-3">Nómina detectada: <span className="text-success font-medium">{fmt(preferences.monthlyIncome, cur)}/mes</span></span>
              </p>
            </div>
          </div>
          <button onClick={() => setBank(null)} className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-text-muted hover:text-danger hover:bg-danger/10 rounded-xl border border-border hover:border-danger/20 transition-all">
            <Unlink size={14} /> Desvincular
          </button>
        </div>
      )}

      {/* Connect bank prompt when no bank linked but income is set */}
      {!bank && preferences.monthlyIncome > 0 && (
        <button onClick={() => setBankOpen(true)} className="w-full flex items-center justify-between p-4 bg-surface-lighter/30 hover:bg-surface-lighter/50 border border-border hover:border-brand-500/30 rounded-2xl transition-all group">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <Building size={20} className="text-brand-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">Conecta tu banco</p>
              <p className="text-xs text-text-muted">Importa transacciones automáticamente y deja que la IA analice tus finanzas</p>
            </div>
          </div>
          <ArrowRight size={18} className="text-text-muted group-hover:text-brand-400 transition-colors" />
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Ingresos del mes" value={fmt(stats.income, cur)} icon={<TrendingUp size={18} />} trend={{ value: 12, up: true }} accent="success" />
        <StatCard title="Gastos del mes" value={fmt(stats.expense, cur)} icon={<TrendingDown size={18} />} trend={{ value: 8, up: false }} accent="danger" />
        <StatCard title="Ahorro del mes" value={fmt(stats.savings, cur)} icon={<PiggyBank size={18} />} trend={{ value: Math.round(stats.rate), up: stats.savings >= 0 }} />
        <StatCard title="Presupuesto total" value={fmt(totalBudget, cur)} icon={<Wallet size={18} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-light border border-border rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4">Gastos Diarios</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, color: '#f1f5f9' }} formatter={(v) => [fmt(Number(v), cur), 'Gasto']} />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  {daily.map((_, i) => <Cell key={i} fill="url(#barGrad)" />)}
                </Bar>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#818cf8" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface-light border border-border rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4">Distribución</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, color: '#f1f5f9' }} formatter={(v) => fmt(Number(v), cur)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {pieData.slice(0, 5).map(c => (
              <span key={c.name} className="flex items-center gap-1.5 text-xs text-text-muted">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                {c.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-light border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Presupuestos Activos</h3>
            <span className="text-xs text-text-muted bg-surface-lighter px-3 py-1 rounded-lg">
              {budgets.filter(b => b.spent <= b.limit).length}/{budgets.length} cumplidos
            </span>
          </div>
          <div className="space-y-3">
            {budgets.slice(0, 4).map(b => (
              <BudgetCard key={b.category} budget={b} currency={cur} />
            ))}
          </div>
        </div>

        <div className="bg-surface-light border border-border rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4">Transacciones Recientes</h3>
          <div className="divide-y divide-border">
            {recent.map(t => <TransactionRow key={t.id} transaction={t} />)}
          </div>
        </div>
      </div>

      <BankConnector open={bankOpen} onClose={() => setBankOpen(false)} />
    </div>
  )
}
