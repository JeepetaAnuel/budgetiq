import { Wallet, PiggyBank, RefreshCw, Trash2, Download, Upload, Sparkles, Target, Save } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { CURRENCIES } from '../lib/currencies'
import type { Currency, AIPersonality } from '../types'

const PERSONALITIES: { id: AIPersonality; title: string; desc: string; icon: typeof PiggyBank }[] = [
  { id: 'balanced', title: 'Balanceada', desc: 'Distribución equilibrada entre gasto, ahorro e inversión.', icon: PiggyBank },
  { id: 'aggressive_savings', title: 'Ahorro Agresivo', desc: 'Maximiza el ahorro reduciendo gastos discrecionales.', icon: Target },
  { id: 'flexible', title: 'Flexible', desc: 'Mayor libertad en gastos de ocio y compras.', icon: RefreshCw },
]

export default function Settings() {
  const { state, updatePreferences, loadState } = useApp()
  const { preferences, transactions, budgets } = state

  function handleExport() {
    const blob = new Blob([JSON.stringify({ transactions, budgets, preferences, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `budgetiq-${new Date().toISOString().slice(0, 10)}.json`
    a.click(); URL.revokeObjectURL(url)
  }

  function handleImport() {
    const input = document.createElement('input')
    input.type = 'file'; input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      try {
        const text = await file.text()
        const data = JSON.parse(text)
        if (data.transactions && data.budgets && data.preferences) {
          loadState({ transactions: data.transactions, budgets: data.budgets, aiPlan: null, preferences: data.preferences })
        }
      } catch { /* empty */ }
    }
    input.click()
  }

  function handleReset() {
    if (window.confirm('¿Estás seguro? Se perderán todos tus datos.')) {
      localStorage.removeItem('budgetiq-state')
      window.location.reload()
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-surface-light border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center"><Wallet size={20} className="text-brand-400" /></div>
          <div><h3 className="text-lg font-bold">Información Financiera</h3><p className="text-sm text-text-muted">Configura tus datos base</p></div>
        </div>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1.5">Ingreso Mensual</label>
            <div className="relative max-w-xs">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-sm">{preferences.currency === 'EUR' ? '€' : '$'}</span>
              <input type="number" value={preferences.monthlyIncome} onChange={e => updatePreferences({ monthlyIncome: parseFloat(e.target.value) || 0 })} className="w-full bg-surface text-white border border-border rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:border-brand-500/50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">Moneda</label>
              <select value={preferences.currency} onChange={e => updatePreferences({ currency: e.target.value as Currency })} className="w-full bg-surface text-white border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500/50">
                {CURRENCIES.map(c => <option key={c.value} value={c.value}>{c.label} ({c.symbol})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">Período</label>
              <select value={preferences.period} onChange={e => updatePreferences({ period: e.target.value as 'monthly' | 'yearly' })} className="w-full bg-surface text-white border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500/50">
                <option value="monthly">Mensual</option>
                <option value="yearly">Anual</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface-light border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center"><Sparkles size={20} className="text-brand-400" /></div>
          <div><h3 className="text-lg font-bold">Personalidad de IA</h3><p className="text-sm text-text-muted">Define cómo la IA optimiza tus finanzas</p></div>
        </div>
        <div className="grid gap-3">
          {PERSONALITIES.map(p => {
            const Icon = p.icon
            const active = preferences.aiPersonality === p.id
            return (
              <button key={p.id} onClick={() => updatePreferences({ aiPersonality: p.id })}
                className={`flex items-start gap-4 p-4 rounded-xl border text-left ${active ? 'border-brand-500/50 bg-brand-500/10' : 'border-border hover:border-text-muted/30'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${active ? 'bg-brand-500/20 text-brand-400' : 'bg-surface-lighter text-text-muted'}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${active ? 'text-brand-400' : ''}`}>{p.title}</p>
                  <p className="text-xs text-text-muted mt-0.5">{p.desc}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="bg-surface-light border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-surface-lighter flex items-center justify-center"><Save size={20} className="text-text-muted" /></div>
          <div><h3 className="text-lg font-bold">Datos y Almacenamiento</h3><p className="text-sm text-text-muted">Gestiona tus datos financieros</p></div>
        </div>
        <div className="flex flex-wrap gap-3 mb-6">
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-surface-lighter/50 hover:bg-surface-lighter border border-border rounded-xl"><Download size={16} /> Exportar</button>
          <button onClick={handleImport} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-surface-lighter/50 hover:bg-surface-lighter border border-border rounded-xl"><Upload size={16} /> Importar</button>
        </div>
        <div className="text-xs text-text-muted space-y-1">
          <p>{transactions.length} transacciones · {budgets.length} presupuestos</p>
          <p>Almacenamiento local en el navegador</p>
        </div>
        <div className="mt-6 pt-6 border-t border-border">
          <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-danger hover:bg-danger/10 border border-danger/20 rounded-xl"><Trash2 size={16} /> Restablecer datos</button>
          <p className="text-xs text-text-muted mt-2">Elimina todos los datos de forma permanente.</p>
        </div>
      </div>
    </div>
  )
}
