import { useLocation } from 'react-router-dom'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Sparkles } from 'lucide-react'
import { useApp } from '../../store/AppContext'
import { fmt } from '../../lib/utils'

const TITLES: Record<string, string> = {
  '/': 'Panel de Control',
  '/budgets': 'Presupuestos',
  '/ai-mode': 'Optimizador IA',
  '/transactions': 'Transacciones',
  '/settings': 'Configuración',
}

export default function Header() {
  const { pathname } = useLocation()
  const { state } = useApp()
  const isAI = pathname === '/ai-mode'

  return (
    <header className="sticky top-0 z-20 bg-surface/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between px-6 lg:px-8 py-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold capitalize">{TITLES[pathname] ?? 'BudgetIQ'}</h2>
            {isAI && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-brand-500/10 text-brand-400 text-xs font-semibold rounded-full border border-brand-500/20">
                <Sparkles size={12} /> IA ACTIVA
              </span>
            )}
          </div>
          <p className="text-sm text-text-muted mt-0.5 capitalize">
            {format(new Date(), "EEEE, d 'de' MMMM yyyy", { locale: es })}
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-surface-lighter/50 rounded-xl border border-border">
          <span className="text-sm text-text-muted">Balance:</span>
          <span className={`text-sm font-bold ${state.preferences.monthlyIncome > 0 ? 'text-success' : ''}`}>
            {fmt(state.preferences.monthlyIncome, state.preferences.currency)}
          </span>
        </div>
      </div>
    </header>
  )
}
