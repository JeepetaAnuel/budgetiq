import { useState, useMemo } from 'react'
import { TrendingUp, TrendingDown, PiggyBank, Wallet, Building, Link2, Unlink, Settings, Target, Lightbulb, Activity, Brain, ArrowLeftRight, ArrowUpRight, ChevronRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import StatCard from '../components/ui/StatCard'
import BudgetCard from '../components/finance/BudgetCard'
import TransactionRow from '../components/finance/TransactionRow'
import BankConnector from '../components/finance/BankConnector'
import Icon from '../components/ui/Icon'
import { useApp } from '../store/AppContext'
import { fmt, progress, status as getStatus } from '../lib/utils'
import { CATEGORIES } from '../data/categories'
import { BANKS } from '../data/banks'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const { state, setBank } = useApp()
  const { transactions, budgets, preferences } = state
  const cur = preferences.currency
  const [bankOpen, setBankOpen] = useState(false)
  const navigate = useNavigate()

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

  const healthScore = useMemo(() => {
    if (preferences.monthlyIncome <= 0) return { score: 0, label: 'Sin datos', color: 'text-text-muted' }
    let score = 70
    if (stats.rate >= 20) score += 15
    else if (stats.rate >= 10) score += 8
    else score -= 10
    const budgetHealth = budgets.filter(b => getStatus(progress(b.spent, b.limit)) === 'safe').length / budgets.length
    score += Math.round(budgetHealth * 10)
    if (preferences.bank) score += 5
    score = Math.max(0, Math.min(100, score))
    const label = score >= 85 ? 'Excelente' : score >= 70 ? 'Buena' : score >= 50 ? 'Regular' : 'Precaria'
    const color = score >= 85 ? 'text-success' : score >= 70 ? 'text-brand-400' : score >= 50 ? 'text-warning' : 'text-danger'
    return { score, label, color }
  }, [stats, budgets, preferences])

  const topExpense = useMemo(() => {
    const byCat: Record<string, number> = {}
    for (const t of monthTx.filter(t => t.type === 'expense')) byCat[t.category] = (byCat[t.category] ?? 0) + t.amount
    return Object.entries(byCat).sort(([, a], [, b]) => b - a).slice(0, 3).map(([id, amount]) => {
      const cat = CATEGORIES.find(c => c.id === id)
      return { id, amount, name: cat?.name ?? id, color: cat?.color ?? '#64748b', icon: cat?.icon ?? 'circle' }
    })
  }, [monthTx])

  const weeklyTrend = useMemo(() => {
    const now = new Date()
    const weeks: { label: string; gastos: number; ingresos: number }[] = []
    for (let w = 3; w >= 0; w--) {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - w * 7)
      const end = new Date(start.getTime() + 6 * 86400000)
      const weekTx = transactions.filter(t => {
        const d = new Date(t.date)
        return d >= start && d <= end
      })
      weeks.push({
        label: `Sem ${4 - w}`,
        gastos: weekTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
        ingresos: weekTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
      })
    }
    return weeks
  }, [transactions])

  const pieData = useMemo(() => {
    const byCat: Record<string, number> = {}
    for (const t of monthTx.filter(t => t.type === 'expense')) byCat[t.category] = (byCat[t.category] ?? 0) + t.amount
    return CATEGORIES.map(c => ({ name: c.name, value: byCat[c.id] ?? 0, color: c.color })).filter(d => d.value > 0)
  }, [monthTx])

  const recent = useMemo(() =>
    [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5),
    [transactions]
  )

  const totalBudget = budgets.reduce((s, b) => s + b.limit, 0)
  const bank = preferences.bank
  const bankMeta = bank ? BANKS.find(b => b.id === bank.bankId) : null

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Hero card */}
      {preferences.monthlyIncome > 0 && (
        <div className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-900 rounded-2xl p-5 sm:p-8 text-white">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-400/10 rounded-full blur-3xl" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-white/70">Saldo disponible</p>
              <p className="text-3xl sm:text-4xl font-bold tracking-tight">{fmt(stats.savings, cur)}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-white/80 flex items-center gap-1.5">
                  <TrendingUp size={14} /> +{fmt(stats.income, cur)}
                </span>
                <span className="text-sm text-white/80 flex items-center gap-1.5">
                  <TrendingDown size={14} /> -{fmt(stats.expense, cur)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-white/70">Tasa de ahorro</p>
                <p className="text-2xl font-bold">{stats.rate.toFixed(0)}%</p>
              </div>
              <div className="w-16 h-16 relative">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="white" strokeWidth="3" strokeDasharray={`${healthScore.score} ${100 - healthScore.score}`} strokeLinecap="round" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">{healthScore.score}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Income setup banner */}
      {preferences.monthlyIncome <= 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
            <Settings size={20} className="text-amber-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Configura tus ingresos</p>
            <p className="text-xs text-text-muted mt-1">Define tu ingreso mensual para que BudgetIQ pueda optimizar tus finanzas.</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => setBankOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 text-sm font-medium rounded-xl border border-brand-500/20 transition-all">
              <Link2 size={16} /> Conectar banco
            </button>
            <button onClick={() => navigate('/settings')} className="flex items-center gap-2 px-4 py-2.5 bg-surface-lighter/50 hover:bg-surface-lighter text-sm font-medium rounded-xl border border-border transition-all">
              <Settings size={16} /> Manual
            </button>
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
                <span className="ml-3">Nómina: <span className="text-success font-medium">{fmt(preferences.monthlyIncome, cur)}/mes</span></span>
              </p>
            </div>
          </div>
          <button onClick={() => setBank(null)} className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-text-muted hover:text-danger hover:bg-danger/10 rounded-xl border border-border hover:border-danger/20 transition-all">
            <Unlink size={14} /> Desvincular
          </button>
        </div>
      )}

      {/* Connect bank prompt */}
      {!bank && preferences.monthlyIncome > 0 && (
        <button onClick={() => setBankOpen(true)} className="w-full flex items-center justify-between p-4 lg:p-5 bg-gradient-to-r from-surface-light to-surface-lighter/30 hover:from-brand-500/5 hover:to-brand-600/5 border border-border hover:border-brand-500/30 rounded-2xl transition-all group">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Building size={20} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm sm:text-base font-semibold">Conecta tu banco</p>
              <p className="text-xs sm:text-sm text-text-muted">Importa transacciones automáticamente con la IA</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-text-muted group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
        </button>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard title="Ingresos" value={fmt(stats.income, cur)} icon={<TrendingUp size={18} />} accent="success" />
        <StatCard title="Gastos" value={fmt(stats.expense, cur)} icon={<TrendingDown size={18} />} accent="danger" />
        <StatCard title="Ahorro" value={fmt(stats.savings, cur)} icon={<PiggyBank size={18} />} />
        <StatCard title="Presupuesto" value={fmt(totalBudget, cur)} icon={<Wallet size={18} />} />
        <div className="col-span-2 lg:col-span-1 bg-surface-light border border-border rounded-2xl p-4 sm:p-5 relative group">
          <div className={`absolute -inset-0.5 bg-gradient-to-r from-brand-500/20 to-brand-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Salud Financiera</span>
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center justify-center">
                <Activity size={18} />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <span className={`text-2xl font-bold ${healthScore.color}`}>{healthScore.score}</span>
              <span className="text-sm text-text-muted mb-1">/100</span>
            </div>
            <p className={`text-xs font-semibold mt-1 ${healthScore.color}`}>{healthScore.label}</p>
          </div>
        </div>
      </div>

      {/* Weekly trend chart + Top expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        <div className="lg:col-span-2 bg-surface-light border border-border rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                <Activity size={20} className="text-brand-400" />
              </div>
              <div>
                <h3 className="text-base font-bold">Tendencia Semanal</h3>
                <p className="text-xs text-text-muted">Ingresos vs gastos</p>
              </div>
            </div>
          </div>
          <div className="h-60 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="label" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--color-text-muted)" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--color-surface-light)', border: '1px solid var(--color-border)', borderRadius: 12, color: 'var(--color-text-primary)' }}
                  formatter={(v) => typeof v === 'number' ? [fmt(v, cur)] : [String(v)]}
                />
                <Bar dataKey="ingresos" name="Ingresos" radius={[6, 6, 0, 0]} fill="#10b981" />
                <Bar dataKey="gastos" name="Gastos" radius={[6, 6, 0, 0]} fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface-light border border-border rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <Target size={20} className="text-brand-400" />
            </div>
            <div>
              <h3 className="text-base font-bold">Distribución</h3>
              <p className="text-xs text-text-muted">Gastos por categoría</p>
            </div>
          </div>
          <div className="h-44 sm:h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                  {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--color-surface-light)', border: '1px solid var(--color-border)', borderRadius: 12, color: 'var(--color-text-primary)' }} formatter={(v) => typeof v === 'number' ? fmt(v, cur) : String(v)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {pieData.slice(0, 5).map(c => (
              <span key={c.name} className="flex items-center gap-1.5 text-xs text-text-muted">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                {c.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Insights + Active budgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        <div className="bg-surface-light border border-border rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Lightbulb size={20} className="text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold">Insights Rápidos</h3>
              <p className="text-xs text-text-muted">Basados en tus datos financieros</p>
            </div>
          </div>
          <div className="space-y-3">
            {stats.rate >= 15 ? (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-success/5 border border-success/10">
                <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0"><Target size={16} className="text-success" /></div>
                <div><p className="text-sm font-medium">Buena tasa de ahorro</p><p className="text-xs text-text-muted mt-0.5">Estás ahorrando un {stats.rate.toFixed(0)}% de tus ingresos. ¡Sigue así!</p></div>
              </div>
            ) : stats.rate <= 0 ? (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-danger/5 border border-danger/10">
                <div className="w-8 h-8 rounded-lg bg-danger/10 flex items-center justify-center flex-shrink-0"><TrendingDown size={16} className="text-danger" /></div>
                <div><p className="text-sm font-medium">Gastos superan ingresos</p><p className="text-xs text-text-muted mt-0.5">Revisa tus presupuestos para equilibrar tus finanzas.</p></div>
              </div>
            ) : (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-brand-500/5 border border-brand-500/10">
                <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0"><TrendingUp size={16} className="text-brand-400" /></div>
                <div><p className="text-sm font-medium">Ahorro moderado</p><p className="text-xs text-text-muted mt-0.5">Tu tasa de ahorro es del {stats.rate.toFixed(0)}%. Intenta llegar al 15-20%.</p></div>
              </div>
            )}
            {topExpense.length > 0 && (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-lighter/30 border border-border">
                <div className="w-8 h-8 rounded-lg bg-danger/10 flex items-center justify-center flex-shrink-0"><ArrowUpRight size={16} className="text-danger" /></div>
                <div><p className="text-sm font-medium">Mayor gasto del mes</p><p className="text-xs text-text-muted mt-0.5">{topExpense[0].name}: {fmt(topExpense[0].amount, cur)}</p></div>
              </div>
            )}
            {state.aiPlan && (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-brand-500/5 border border-brand-500/10">
                <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0"><Brain size={16} className="text-brand-400" /></div>
                <div><p className="text-sm font-medium">Plan IA disponible</p><p className="text-xs text-text-muted mt-0.5">Revisa las recomendaciones de tu Optimizador Inteligente.</p></div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-surface-light border border-border rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center"><Wallet size={20} className="text-brand-400" /></div>
              <div><h3 className="text-base font-bold">Presupuestos</h3><p className="text-xs text-text-muted">{budgets.filter(b => b.spent <= b.limit).length}/{budgets.length} cumplidos</p></div>
            </div>
            <button onClick={() => navigate('/budgets')} className="text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1">Ver todos <ChevronRight size={12} /></button>
          </div>
          <div className="space-y-3">
            {budgets.slice(0, 4).map(b => (
              <BudgetCard key={b.category} budget={b} currency={cur} />
            ))}
            {budgets.length === 0 && (
              <p className="text-sm text-text-muted text-center py-6">No hay presupuestos activos. Crea uno desde la sección Presupuestos.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="bg-surface-light border border-border rounded-2xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-lighter flex items-center justify-center"><ArrowLeftRight size={20} className="text-text-muted" /></div>
            <div><h3 className="text-base font-bold">Transacciones Recientes</h3><p className="text-xs text-text-muted">Últimos movimientos</p></div>
          </div>
          <button onClick={() => navigate('/transactions')} className="text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1">Ver todas <ChevronRight size={12} /></button>
        </div>
        <div className="divide-y divide-border">
          {recent.map(t => <TransactionRow key={t.id} transaction={t} />)}
          {recent.length === 0 && (
            <p className="text-sm text-text-muted text-center py-6">No hay transacciones recientes.</p>
          )}
        </div>
      </div>

      <BankConnector open={bankOpen} onClose={() => setBankOpen(false)} />
    </div>
  )
}