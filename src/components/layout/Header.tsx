import { useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Sparkles, TrendingUp, Bell, Wallet } from 'lucide-react'
import { useApp } from '../../store/AppContext'
import { fmt } from '../../lib/utils'

const TITLES: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Panel de Control', subtitle: 'Resumen financiero general' },
  '/budgets': { title: 'Presupuestos', subtitle: 'Control de gastos por categoría' },
  '/ai-mode': { title: 'Optimizador IA', subtitle: 'Planificación financiera inteligente' },
  '/transactions': { title: 'Transacciones', subtitle: 'Historial de movimientos' },
  '/settings': { title: 'Configuración', subtitle: 'Personaliza tu experiencia' },
  '/statistics': { title: 'Estadísticas', subtitle: 'Análisis y reportes' },
  '/scan-ticket': { title: 'Escanear Ticket', subtitle: 'Reconocimiento automático de tickets' },
  '/savings-goals': { title: 'Metas de Ahorro', subtitle: 'Objetivos financieros personalizados' },
  '/shared-finances': { title: 'Finanzas Compartidas', subtitle: 'Gestión de gastos en grupo' },
  '/calendar': { title: 'Calendario Financiero', subtitle: 'Vista mensual de tus finanzas' },
}

export default function Header() {
  const { pathname } = useLocation()
  const { state } = useApp()
  const page = TITLES[pathname] ?? { title: 'BudgetIQ', subtitle: '' }
  const isAI = pathname === '/ai-mode'

  const monthExpense = useMemo(() => {
    const now = new Date()
    return state.transactions
      .filter(t => {
        const d = new Date(t.date)
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && t.type === 'expense'
      })
      .reduce((s, t) => s + t.amount, 0)
  }, [state.transactions])

  const alertCount = state.budgets.filter(b => b.spent > b.limit * 0.8).length

  return (
    <header className="sticky top-0 z-20 bg-surface/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight truncate">{page.title}</h2>
            {isAI && (
              <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-brand-500/10 text-brand-400 text-xs font-semibold rounded-full border border-brand-500/20 whitespace-nowrap">
                <Sparkles size={12} /> IA ACTIVA
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5 capitalize">
            {format(new Date(), "EEEE, d 'de' MMMM yyyy", { locale: es })}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {alertCount > 0 && (
            <div className="relative flex items-center gap-1.5 px-3 py-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20 text-xs font-semibold">
              <Bell size={14} />
              <span className="hidden sm:inline">{alertCount} alertas</span>
            </div>
          )}

          <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-surface-lighter/50 rounded-xl border border-border">
            <Wallet size={15} className="text-text-muted" />
            <span className="text-xs text-text-muted">Mes:</span>
            <span className="text-xs font-bold text-danger">{fmt(monthExpense, state.preferences.currency)}</span>
          </div>

          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-brand-500/10 to-brand-600/5 rounded-xl border border-brand-500/20">
            <TrendingUp size={15} className="text-brand-400" />
            <span className="text-xs text-text-muted hidden sm:inline">Balance:</span>
            <span className={`text-xs sm:text-sm font-bold ${state.preferences.monthlyIncome > 0 ? 'text-brand-400' : ''}`}>
              {fmt(state.preferences.monthlyIncome, state.preferences.currency)}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
