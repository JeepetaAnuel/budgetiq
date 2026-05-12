import { Wallet, PiggyBank, RefreshCw, Trash2, Download, Upload, Sparkles, Target, Save, Sun, Moon, Eye } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { useTheme } from '../store/ThemeContext'
import { useToast } from '../store/ToastContext'
import { CURRENCIES } from '../lib/currencies'
import type { Currency, AIPersonality } from '../types'

const PERSONALITIES: { id: AIPersonality; title: string; desc: string; icon: typeof PiggyBank }[] = [
  { id: 'balanced', title: 'Balanceada', desc: 'Distribución equilibrada entre gasto, ahorro e inversión.', icon: PiggyBank },
  { id: 'aggressive_savings', title: 'Ahorro Agresivo', desc: 'Maximiza el ahorro reduciendo gastos discrecionales.', icon: Target },
  { id: 'flexible', title: 'Flexible', desc: 'Mayor libertad en gastos de ocio y compras.', icon: RefreshCw },
]

export default function Settings() {
  const { state, updatePreferences, loadState } = useApp()
  const { theme, toggle } = useTheme()
  const { toast } = useToast()
  const { preferences, transactions, budgets } = state

  function handleExport() {
    const blob = new Blob([JSON.stringify({ transactions, budgets, preferences, savingsGoals: state.savingsGoals, sharedGroups: state.sharedGroups, scannedTickets: state.scannedTickets, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `budgetiq-${new Date().toISOString().slice(0, 10)}.json`
    a.click(); URL.revokeObjectURL(url)
    toast({ type: 'success', title: 'Datos exportados', message: 'El archivo se descargó correctamente.' })
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
          loadState({ transactions: data.transactions, budgets: data.budgets, aiPlan: null, preferences: data.preferences, savingsGoals: data.savingsGoals ?? [], sharedGroups: data.sharedGroups ?? [], scannedTickets: data.scannedTickets ?? [] })
          toast({ type: 'success', title: 'Datos importados', message: `${data.transactions.length} transacciones y ${data.budgets.length} presupuestos cargados.` })
        }
      } catch {
        toast({ type: 'error', title: 'Error al importar', message: 'El archivo no tiene el formato correcto.' })
      }
    }
    input.click()
  }

  function handleReset() {
    if (window.confirm('¿Estás seguro? Se perderán todos tus datos de forma permanente.')) {
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
              <input type="number" value={preferences.monthlyIncome} onChange={e => updatePreferences({ monthlyIncome: parseFloat(e.target.value) || 0 })} className="w-full bg-surface text-text-primary border border-border rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:border-brand-500/50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">Moneda</label>
              <select value={preferences.currency} onChange={e => updatePreferences({ currency: e.target.value as Currency })} className="w-full bg-surface text-text-primary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500/50">
                {CURRENCIES.map(c => <option key={c.value} value={c.value}>{c.label} ({c.symbol})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">Período</label>
              <select value={preferences.period} onChange={e => updatePreferences({ period: e.target.value as 'monthly' | 'yearly' })} className="w-full bg-surface text-text-primary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500/50">
                <option value="monthly">Mensual</option>
                <option value="yearly">Anual</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface-light border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">{theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-amber-400" />}</div>
          <div><h3 className="text-lg font-bold">Apariencia</h3><p className="text-sm text-text-muted">Personaliza el aspecto visual</p></div>
        </div>
        <button onClick={toggle} className="flex items-center justify-between w-full p-4 rounded-xl border border-border hover:border-brand-500/30 bg-surface-lighter/20 hover:bg-surface-lighter/50 transition-all group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-lighter flex items-center justify-center group-hover:bg-brand-500/10 transition-colors">
              {theme === 'dark' ? <Sun size={20} className="text-text-muted group-hover:text-amber-400" /> : <Moon size={20} className="text-text-muted group-hover:text-amber-400" />}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">Modo {theme === 'dark' ? 'Oscuro' : 'Claro'}</p>
              <p className="text-xs text-text-muted">{theme === 'dark' ? 'Cambiar a interfaz clara' : 'Cambiar a interfaz oscura'}</p>
            </div>
          </div>
          <div className={`w-12 h-7 rounded-full border border-border relative transition-colors ${theme === 'dark' ? 'bg-surface-lighter' : 'bg-brand-500/30'}`}>
            <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-all ${theme === 'dark' ? 'left-0.5' : 'left-[calc(100%-26px)]'}`} />
          </div>
        </button>
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
              <button key={p.id} onClick={() => { updatePreferences({ aiPersonality: p.id }); toast({ type: 'info', title: `Personalidad cambiada a "${p.title}"`, message: 'La IA usará esta configuración en futuros planes.' }) }}
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
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-surface-lighter/50 hover:bg-surface-lighter border border-border rounded-xl transition-all"><Download size={16} /> Exportar</button>
          <button onClick={handleImport} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-surface-lighter/50 hover:bg-surface-lighter border border-border rounded-xl transition-all"><Upload size={16} /> Importar</button>
        </div>
        <div className="text-xs text-text-muted space-y-1">
          <p>{transactions.length} transacciones · {budgets.length} presupuestos</p>
          <p>Almacenamiento local en el navegador</p>
        </div>
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 mb-4">
            <Eye size={16} className="text-amber-400 flex-shrink-0" />
            <p className="text-xs text-text-muted">Los datos se guardan automáticamente en tu navegador. Usa Exportar/Importar para transferir entre dispositivos.</p>
          </div>
          <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-danger hover:bg-danger/10 border border-danger/20 rounded-xl transition-all"><Trash2 size={16} /> Restablecer datos</button>
          <p className="text-xs text-text-muted mt-2">Elimina todos los datos de forma permanente. Esta acción no se puede deshacer.</p>
        </div>
      </div>
    </div>
  )
}
