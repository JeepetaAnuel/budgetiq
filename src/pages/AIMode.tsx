import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Brain, CheckCircle, Target, BarChart3, RefreshCw } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import AllocationItem from '../components/finance/AllocationItem'
import { useApp } from '../store/AppContext'
import { generatePlan } from '../lib/ai'
import { fmt } from '../lib/utils'
import { CATEGORIES } from '../data/categories'

export default function AIMode() {
  const { state, setAIPlan } = useApp()
  const preferences = state.preferences
  const { transactions, budgets, aiPlan } = state
  const [loading, setLoading] = useState(false)

  function handleGenerate() {
    setLoading(true)
    setTimeout(() => {
      const plan = generatePlan(transactions, budgets, preferences.monthlyIncome, preferences.aiPersonality)
      setAIPlan(plan)
      setLoading(false)
    }, 1200)
  }

  const chartData = useMemo(() =>
    aiPlan?.allocations
      .filter(a => a.amount > 0)
      .map(a => ({
        name: CATEGORIES.find(c => c.id === a.category)?.name ?? a.category,
        value: a.amount,
        color: CATEGORIES.find(c => c.id === a.category)?.color ?? '#64748b',
        pct: a.percentage,
      })) ?? []
  , [aiPlan])

  const top5 = useMemo(() =>
    aiPlan ? [...aiPlan.allocations].sort((a, b) => b.amount - a.amount).slice(0, 5) : []
  , [aiPlan])

  const currentSpent = useMemo(() => {
    const map: Record<string, number> = {}
    for (const t of transactions.filter(t => t.type === 'expense')) {
      map[t.category] = (map[t.category] ?? 0) + t.amount
    }
    return map
  }, [transactions])

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-500/10 via-surface-light to-brand-600/5 border border-brand-500/20 rounded-2xl p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl" />
        <div className="relative flex items-start justify-between flex-wrap gap-6">
          <div className="flex-1 min-w-[280px]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
                <Brain size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Optimizador Inteligente</h2>
                <p className="text-sm text-text-muted">Distribución optimizada por IA</p>
              </div>
            </div>
            <p className="text-text-secondary text-sm max-w-xl">
              Analiza tus ingresos y gastos para generar un plan de distribución personalizado que maximice tu ahorro.
            </p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-lg shadow-brand-500/25"
          >
            {loading ? <><RefreshCw size={18} className="animate-spin" /> Analizando...</> : <><Sparkles size={18} /> {aiPlan ? 'Regenerar' : 'Generar Plan IA'}</>}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center mb-6 animate-pulse shadow-lg"><Brain size={36} className="text-white" /></div>
            <p className="text-lg font-semibold mb-2">Analizando tus finanzas...</p>
            <p className="text-sm text-text-muted">Procesando transacciones y optimizando distribución</p>
          </motion.div>
        )}

        {!loading && !aiPlan && (
          <motion.div key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-20 bg-surface-light border border-border rounded-2xl">
            <div className="w-20 h-20 rounded-2xl bg-surface-lighter border border-border flex items-center justify-center mb-6"><BarChart3 size={36} className="text-text-muted" /></div>
            <h3 className="text-xl font-bold mb-2">Sin plan generado</h3>
            <p className="text-sm text-text-muted text-center max-w-md mb-6">Haz clic en "Generar Plan IA" para que el motor de IA analice tus datos y cree un plan optimizado.</p>
            <button onClick={handleGenerate} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-brand-500/25"><Sparkles size={18} /> Comenzar</button>
          </motion.div>
        )}

        {!loading && aiPlan && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-surface-light border border-border rounded-2xl p-5">
                <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1">Ingreso Mensual</p>
                <p className="text-2xl font-bold">{fmt(aiPlan.totalIncome, preferences.currency)}</p>
              </div>
              <div className="bg-surface-light border border-border rounded-2xl p-5">
                <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1">Ahorro Recomendado</p>
                <p className={`text-2xl font-bold ${preferences.aiPersonality === 'aggressive_savings' ? 'text-success' : 'text-brand-400'}`}>{fmt(aiPlan.savingsRecommendation, preferences.currency)}</p>
              </div>
              <div className="bg-surface-light border border-border rounded-2xl p-5">
                <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1">Tasa de Ahorro</p>
                <p className="text-2xl font-bold text-success">{aiPlan.savingsPercentage.toFixed(1)}%</p>
              </div>
              <div className="bg-surface-light border border-border rounded-2xl p-5">
                <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1">Personalidad</p>
                <p className="text-lg font-bold capitalize">{preferences.aiPersonality === 'balanced' ? 'Balanceada' : preferences.aiPersonality === 'aggressive_savings' ? 'Ahorro Agresivo' : 'Flexible'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-surface-light border border-border rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4">Distribución Recomendada</h3>
                <div className="space-y-3">
                  {aiPlan.allocations.filter(a => a.amount > 0).map((a, i) => (
                    <AllocationItem key={a.category} allocation={a} currency={preferences.currency} index={i} totalIncome={aiPlan.totalIncome} />
                  ))}
                </div>
              </div>

              <div className="bg-surface-light border border-border rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4">Visualización</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2} dataKey="value">
                        {chartData.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, color: '#f1f5f9' }} formatter={(v) => fmt(Number(v), preferences.currency)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                  {chartData.slice(0, 6).map(c => (
                    <div key={c.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} /><span className="text-text-muted">{c.name}</span></div>
                      <span className="font-medium">{c.pct.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface-light border border-border rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center"><CheckCircle size={20} className="text-success" /></div>
                  <div><h3 className="text-base font-bold">Recomendaciones Clave</h3><p className="text-xs text-text-muted">Basadas en tu perfil financiero</p></div>
                </div>
                <div className="space-y-3">
                  {top5.map((a, i) => {
                    const cat = CATEGORIES.find(c => c.id === a.category)
                    return (
                      <div key={a.category} className="flex items-start gap-3 p-3 rounded-xl bg-surface-lighter/30">
                        <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-brand-500/10 flex items-center justify-center text-xs font-bold text-brand-400">{i + 1}</span>
                        <div className="flex-1"><p className="text-sm font-medium">{cat?.name}</p><p className="text-xs text-text-muted mt-0.5">{a.reasoning}</p></div>
                        <span className="flex-shrink-0 text-sm font-bold text-brand-400">{a.percentage.toFixed(1)}%</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="bg-surface-light border border-border rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center"><Target size={20} className="text-brand-400" /></div>
                  <div><h3 className="text-base font-bold">Comparativa</h3><p className="text-xs text-text-muted">Gasto actual vs recomendación</p></div>
                </div>
                <div className="space-y-3">
                  {aiPlan.allocations.filter(a => a.amount > 0).slice(0, 6).map(a => {
                    const current = currentSpent[a.category] ?? 0
                    const diff = a.amount - current
                    const cat = CATEGORIES.find(c => c.id === a.category)
                    return (
                      <div key={a.category} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat?.color }} />
                          <span className="text-sm">{cat?.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-text-muted">{fmt(current, preferences.currency)}</span>
                          <span className="text-xs text-text-muted">→</span>
                          <span className="text-xs font-bold text-brand-400">{fmt(a.amount, preferences.currency)}</span>
                          <span className={`text-xs font-semibold ${diff >= 0 ? 'text-success' : 'text-danger'}`}>{diff >= 0 ? '+' : ''}{fmt(diff, preferences.currency)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-brand-500/25"><CheckCircle size={18} /> Aplicar Plan</button>
              <button onClick={handleGenerate} className="flex items-center gap-2 px-6 py-3.5 bg-surface-lighter/50 hover:bg-surface-lighter text-sm font-medium border border-border rounded-xl"><RefreshCw size={18} /> Regenerar</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
