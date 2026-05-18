import { useState, useMemo } from 'react'
import { TrendingUp, TrendingDown, PiggyBank, Wallet, Building, Settings, Target, Brain, ArrowUpRight, ChevronRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { motion } from 'framer-motion'

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
    if (preferences.monthlyIncome <= 0) return { score: 0, label: 'Sin datos', color: 'text-text-muted', ring: '#94a3b8' }
    let score = 70
    if (stats.rate >= 20) score += 15
    else if (stats.rate >= 10) score += 8
    else score -= 10
    const budgetHealth = budgets.filter(b => getStatus(progress(b.spent, b.limit)) === 'safe').length / budgets.length
    score += Math.round(budgetHealth * 10)
    if (preferences.bank) score += 5
    score = Math.max(0, Math.min(100, score))
    const label = score >= 85 ? 'Excelente' : score >= 70 ? 'Buena' : score >= 50 ? 'Regular' : 'Precaria'
    const color = score >= 85 ? 'text-success' : score >= 70 ? 'text-brand-500' : score >= 50 ? 'text-warning' : 'text-danger'
    const ring = score >= 85 ? '#059669' : score >= 70 ? '#1e3a5f' : score >= 50 ? '#d97706' : '#dc2626'
    return { score, label, color, ring }
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

  const lastMonthTx = useMemo(() => {
    const now = new Date()
    const last = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    return transactions.filter(t => {
      const d = new Date(t.date)
      return d.getMonth() === last.getMonth() && d.getFullYear() === last.getFullYear()
    })
  }, [transactions])

  const lastStats = useMemo(() => {
    const income = lastMonthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expense = lastMonthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    return { income, expense, savings: income - expense }
  }, [lastMonthTx])

  const totalBudget = budgets.reduce((s, b) => s + b.limit, 0)
  const bank = preferences.bank
  const bankMeta = bank ? BANKS.find(b => b.id === bank.bankId) : null
  const hasIncome = preferences.monthlyIncome > 0

  const forecast = useMemo(() => {
    if (stats.savings <= 0 || !hasIncome) return null
    const monthly = stats.savings
    const yearly = monthly * 12
    const in6Months = monthly * 6
    return { monthly, yearly, in6Months }
  }, [stats, hasIncome])

  const comparison = useMemo(() => {
    if (lastStats.expense === 0) return null
    const diff = stats.expense - lastStats.expense
    const pct = lastStats.expense > 0 ? (diff / lastStats.expense) * 100 : 0
    return { diff, pct, up: diff > 0 }
  }, [stats, lastStats])

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
  } as const
  const itemAnim = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
  } as const

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      {/* ── Top metrics bar ── */}
      <motion.div variants={itemAnim} className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="col-span-2 md:col-span-5 flex flex-wrap items-center justify-between gap-3 p-4 bg-surface-light border border-border rounded-xl">
          <div className="flex items-center gap-6 flex-wrap">
            <div>
              <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Balance</p>
              <p className="text-xl font-bold tracking-tight">{fmt(stats.savings, cur)}</p>
            </div>
            <div className="hidden sm:block w-px h-8 bg-border" />
            <div>
              <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Ingresos</p>
              <p className="text-base font-semibold text-success">{fmt(stats.income, cur)}</p>
            </div>
            <div className="hidden sm:block w-px h-8 bg-border" />
            <div>
              <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Gastos</p>
              <p className="text-base font-semibold text-danger">{fmt(stats.expense, cur)}</p>
            </div>
            <div className="hidden sm:block w-px h-8 bg-border" />
            <div>
              <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Ahorro</p>
              <p className="text-base font-semibold">{stats.rate.toFixed(0)}%</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!hasIncome && (
              <button onClick={() => navigate('/settings')} className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500 text-white text-xs font-medium rounded-lg hover:bg-brand-600 transition-all">
                <Settings size={13} /> Configurar
              </button>
            )}
            <div className="flex items-center gap-2">
              <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--color-surface-lighter)" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.5" fill="none" stroke={healthScore.ring} strokeWidth="3" strokeDasharray={`${healthScore.score} ${100 - healthScore.score}`} strokeLinecap="round" />
              </svg>
              <div>
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Salud</p>
                <p className={`text-sm font-bold ${healthScore.color}`}>{healthScore.score}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Setup / Bank connect row ── */}
      {(!hasIncome || !bank) && (
        <motion.div variants={itemAnim} className="flex flex-wrap gap-3">
          {!hasIncome && (
            <div className="flex-1 min-w-[240px] flex items-center gap-3 p-3.5 bg-surface-light border border-border rounded-xl">
              <div className="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                <Settings size={16} className="text-brand-500" />
              </div>
              <p className="text-sm flex-1">Configura tu ingreso mensual para activar la IA</p>
              <button onClick={() => navigate('/settings')} className="px-3 py-1.5 bg-brand-500 text-white text-xs font-medium rounded-lg hover:bg-brand-600 transition-all">Ir</button>
            </div>
          )}
          {!bank && hasIncome && (
            <button onClick={() => setBankOpen(true)} className="flex-1 min-w-[200px] flex items-center gap-3 p-3.5 bg-surface-light border border-border rounded-xl hover:border-brand-500/30 transition-all group">
              <div className="w-9 h-9 rounded-lg bg-surface-lighter flex items-center justify-center flex-shrink-0">
                <Building size={16} className="text-text-muted group-hover:text-brand-500 transition-colors" />
              </div>
              <span className="text-sm flex-1 text-left">Conecta tu banco</span>
              <ChevronRight size={14} className="text-text-muted group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all" />
            </button>
          )}
          {bank && bankMeta && (
            <div className="flex-1 min-w-[240px] flex items-center gap-3 p-3.5 bg-surface-light border border-border rounded-xl">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${bankMeta.color}15` }}>
                <Icon name={bankMeta.logo} size={18} style={{ color: bankMeta.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{bank.bankName}</p>
                <p className="text-xs text-text-muted truncate">{bank.accountNumber.slice(0,4)} **** {bank.accountNumber.slice(-4)}</p>
              </div>
              <button onClick={() => setBank(null)} className="px-2.5 py-1 text-xs font-medium text-text-muted hover:text-danger rounded-lg hover:bg-danger/5 transition-all">×</button>
            </div>
          )}
        </motion.div>
      )}

      {/* ── Main 2-column grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* ──────────── LEFT COLUMN ──────────── */}
        <div className="lg:col-span-7 space-y-5">

          {/* KPI mini-cards row */}
          <motion.div variants={itemAnim} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Ingresos', value: fmt(stats.income, cur), icon: TrendingUp, color: 'text-success', bg: 'bg-success/5' },
              { label: 'Gastos', value: fmt(stats.expense, cur), icon: TrendingDown, color: 'text-danger', bg: 'bg-danger/5' },
              { label: 'Ahorro', value: fmt(stats.savings, cur), icon: PiggyBank, color: 'text-brand-500', bg: 'bg-brand-500/5' },
              { label: 'Presupuesto', value: fmt(totalBudget, cur), icon: Wallet, color: 'text-brand-500', bg: 'bg-brand-500/5' },
            ].map((k, i) => (
              <div key={i} className="bg-surface-light border border-border rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">{k.label}</span>
                  <div className={`w-7 h-7 rounded-lg ${k.bg} flex items-center justify-center`}>
                    <k.icon size={14} className={k.color} />
                  </div>
                </div>
                <p className="text-base font-bold tracking-tight">{k.value}</p>
              </div>
            ))}
          </motion.div>

          {/* Weekly trend chart */}
          <motion.div variants={itemAnim} className="bg-surface-light border border-border rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold">Tendencia Semanal</h3>
                <p className="text-xs text-text-muted">Ingresos vs gastos</p>
              </div>
            </div>
            <div className="h-52 sm:h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.5} />
                  <XAxis dataKey="label" stroke="var(--color-text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: 'var(--color-surface-light)', border: '1px solid var(--color-border)', borderRadius: 10, color: 'var(--color-text-primary)', fontSize: 12 }}
                    formatter={(v) => typeof v === 'number' ? [fmt(v, cur)] : [String(v)]}
                  />
                  <Bar dataKey="ingresos" name="Ingresos" radius={[4, 4, 0, 0]} fill="#059669" maxBarSize={32} />
                  <Bar dataKey="gastos" name="Gastos" radius={[4, 4, 0, 0]} fill="#dc2626" maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Forecast card */}
          {forecast && (
            <motion.div variants={itemAnim} className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl p-4 sm:p-5 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Brain size={15} className="text-white/80" />
                <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">IA Predictiva</span>
              </div>
              <p className="text-sm text-white/80">Al ritmo actual, en <strong>6 meses</strong> tendrás</p>
              <p className="text-2xl font-bold tracking-tight mt-1">{fmt(forecast.in6Months, cur)}</p>
              <div className="flex gap-4 mt-2 text-xs text-white/70">
                <span>Por mes: {fmt(forecast.monthly, cur)}</span>
                <span>|</span>
                <span>Por año: {fmt(forecast.yearly, cur)}</span>
              </div>
            </motion.div>
          )}

          {/* Recent transactions */}
          <motion.div variants={itemAnim} className="bg-surface-light border border-border rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold">Transacciones Recientes</h3>
                <p className="text-xs text-text-muted">Últimos movimientos</p>
              </div>
              <button onClick={() => navigate('/transactions')} className="text-xs font-medium text-brand-500 hover:text-brand-600 transition-colors flex items-center gap-1">
                Ver todas <ChevronRight size={12} />
              </button>
            </div>
            <div className="divide-y divide-border -mx-1">
              {recent.map(t => <TransactionRow key={t.id} transaction={t} />)}
              {recent.length === 0 && (
                <p className="text-sm text-text-muted text-center py-8">No hay transacciones recientes.</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* ──────────── RIGHT COLUMN ──────────── */}
        <div className="lg:col-span-5 space-y-5">

          {/* Health Score card */}
          <motion.div variants={itemAnim} className="bg-surface-light border border-border rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold">Salud Financiera</h3>
                <p className="text-xs text-text-muted">Health Score general</p>
              </div>
              <div className="relative w-14 h-14">
                <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--color-surface-lighter)" strokeWidth="3.5" />
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke={healthScore.ring} strokeWidth="3.5" strokeDasharray={`${healthScore.score} ${100 - healthScore.score}`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.6s ease' }} />
                </svg>
                <span className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${healthScore.color}`}>{healthScore.score}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-2 bg-surface-lighter rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${healthScore.score}%`, background: healthScore.ring }} />
              </div>
              <span className={`text-xs font-semibold ${healthScore.color}`}>{healthScore.label}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
              <div className="p-2 rounded-lg bg-success/5"><p className="font-semibold text-success">{budgets.filter(b => getStatus(progress(b.spent, b.limit)) === 'safe').length}</p><p className="text-text-muted mt-0.5">Seguros</p></div>
              <div className="p-2 rounded-lg bg-warning/5"><p className="font-semibold text-warning">{budgets.filter(b => getStatus(progress(b.spent, b.limit)) === 'warning').length}</p><p className="text-text-muted mt-0.5">Riesgo</p></div>
              <div className="p-2 rounded-lg bg-danger/5"><p className="font-semibold text-danger">{budgets.filter(b => getStatus(progress(b.spent, b.limit)) === 'danger').length}</p><p className="text-text-muted mt-0.5">Excedidos</p></div>
            </div>
          </motion.div>

          {/* Distribution pie */}
          <motion.div variants={itemAnim} className="bg-surface-light border border-border rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold">Distribución</h3>
                <p className="text-xs text-text-muted">Gastos por categoría</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-32 w-32 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={30} outerRadius={52} paddingAngle={2} dataKey="value">
                      {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 min-w-0 space-y-1.5">
                {pieData.slice(0, 6).map(c => (
                  <div key={c.name} className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                    <span className="text-text-muted truncate flex-1">{c.name}</span>
                    <span className="font-medium">{fmt(c.value, cur)}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Insights + Budgets combined */}
          <motion.div variants={itemAnim} className="bg-surface-light border border-border rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold">Insights & Presupuestos</h3>
                <p className="text-xs text-text-muted">Alertas inteligentes</p>
              </div>
            </div>
            <div className="space-y-2 mb-3">
              {stats.rate >= 15 ? (
                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-success/5 border border-success/10">
                  <div className="w-7 h-7 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0"><Target size={13} className="text-success" /></div>
                  <div><p className="text-xs font-medium">Buena tasa de ahorro ({stats.rate.toFixed(0)}%)</p><p className="text-[11px] text-text-muted mt-0.5">Sigue así, vas por buen camino</p></div>
                </div>
              ) : stats.rate <= 0 ? (
                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-danger/5 border border-danger/10">
                  <div className="w-7 h-7 rounded-lg bg-danger/10 flex items-center justify-center flex-shrink-0"><TrendingDown size={13} className="text-danger" /></div>
                  <div><p className="text-xs font-medium">Gastos superan ingresos</p><p className="text-[11px] text-text-muted mt-0.5">Revisa tus presupuestos</p></div>
                </div>
              ) : (
                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-brand-500/5 border border-brand-500/10">
                  <div className="w-7 h-7 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0"><TrendingUp size={13} className="text-brand-500" /></div>
                  <div><p className="text-xs font-medium">Ahorro moderado ({stats.rate.toFixed(0)}%)</p><p className="text-[11px] text-text-muted mt-0.5">Intenta llegar al 15-20%</p></div>
                </div>
              )}
              {topExpense.length > 0 && (
                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-surface-lighter/30 border border-border">
                  <div className="w-7 h-7 rounded-lg bg-danger/10 flex items-center justify-center flex-shrink-0"><ArrowUpRight size={13} className="text-danger" /></div>
                  <div><p className="text-xs font-medium">Mayor gasto: {topExpense[0].name}</p><p className="text-[11px] text-text-muted mt-0.5">{fmt(topExpense[0].amount, cur)} este mes</p></div>
                </div>
              )}
              {comparison && (
                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-surface-lighter/30 border border-border">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${comparison.up ? 'bg-danger/10' : 'bg-success/10'}`}>
                    {comparison.up ? <TrendingDown size={13} className="text-danger" /> : <TrendingUp size={13} className="text-success" />}
                  </div>
                  <div><p className="text-xs font-medium">Comparativa mensual</p><p className="text-[11px] text-text-muted mt-0.5">Gastos {comparison.up ? 'subieron' : 'bajaron'} un {Math.abs(comparison.pct).toFixed(0)}% vs el mes anterior ({fmt(Math.abs(comparison.diff), cur)})</p></div>
                </div>
              )}
              {state.aiPlan && (
                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-brand-500/5 border border-brand-500/10">
                  <div className="w-7 h-7 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0"><Brain size={13} className="text-brand-500" /></div>
                  <div><p className="text-xs font-medium">Plan IA disponible</p><p className="text-[11px] text-text-muted mt-0.5">Revisa las recomendaciones</p></div>
                </div>
              )}
            </div>
            <div className="pt-3 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Presupuestos</p>
                <button onClick={() => navigate('/budgets')} className="text-xs font-medium text-brand-500 hover:text-brand-600 flex items-center gap-1">
                  Ver todos <ChevronRight size={11} />
                </button>
              </div>
              <div className="space-y-2">
                {budgets.slice(0, 3).map(b => (
                  <BudgetCard key={b.category} budget={b} currency={cur} />
                ))}
                {budgets.length === 0 && (
                  <p className="text-xs text-text-muted text-center py-4">No hay presupuestos activos.</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <BankConnector open={bankOpen} onClose={() => setBankOpen(false)} />
    </motion.div>
  )
}
