import { useLocation, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Sparkles, Bell, Wallet, LogIn } from 'lucide-react'
import { useApp } from '../../store/AppContext'
import { useAuth } from '../../store/AuthContext'
import { fmt } from '../../lib/utils'

const TITLES: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Panel de Control', subtitle: 'Resumen financiero general' },
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
  const navigate = useNavigate()
  const { state } = useApp()
  const { user, signOut } = useAuth()
  const isGuest = !user && sessionStorage.getItem('budgetiq-guest') === 'true'
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

  const monthIncome = useMemo(() => {
    const now = new Date()
    return state.transactions
      .filter(t => {
        const d = new Date(t.date)
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && t.type === 'income'
      })
      .reduce((s, t) => s + t.amount, 0)
  }, [state.transactions])

  const alertCount = state.budgets.filter(b => b.spent > b.limit * 0.8).length

  return (
    <header className="sticky top-0 z-20 bg-surface/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 lg:py-3.5">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base sm:text-lg font-semibold tracking-tight truncate text-text-primary">{page.title}</h2>
            {isAI && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-brand-50 text-brand-500 text-[11px] font-medium rounded-md border border-brand-200">
                <Sparkles size={11} /> IA
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            {format(new Date(), "EEEE, d 'de' MMMM yyyy", { locale: es })}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {alertCount > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-brand-50 text-brand-500 rounded-lg text-xs font-medium border border-brand-200">
              <Bell size={13} />
              <span>{alertCount} alertas</span>
            </div>
          )}

          <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-lighter/60 rounded-lg border border-border">
            <Wallet size={14} className="text-text-muted" />
            <span className="text-xs text-text-muted">Gastos:</span>
            <span className="text-xs font-semibold text-danger">{fmt(monthExpense, state.preferences.currency)}</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-50 rounded-lg border border-brand-200">
            <span className="text-xs text-text-muted">Balance:</span>
            <span className="text-xs font-semibold text-brand-500">
              {fmt(monthIncome - monthExpense, state.preferences.currency)}
            </span>
          </div>

          {isGuest && (
            <button onClick={() => navigate('/login')} className="flex items-center gap-1.5 px-3 py-1.5 bg-text-primary text-white rounded-lg text-xs font-medium hover:opacity-90 transition-all">
              <LogIn size={13} /> <span className="hidden sm:inline">Inicia sesión</span>
            </button>
          )}

          {!isGuest && user && (
            <button
              onClick={() => signOut()}
              className="px-3 py-1.5 text-xs font-medium text-text-muted hover:text-danger hover:bg-danger/5 rounded-lg border border-border hover:border-danger/20 transition-all"
              title="Cerrar sesión"
            >
              Salir
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
