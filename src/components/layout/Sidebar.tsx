import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, PiggyBank, Brain, ArrowLeftRight, Settings, Menu, X, Sparkles, Sun, Moon, BarChart3, ScanLine, Target, Users, CalendarDays, ChevronRight, ExternalLink } from 'lucide-react'
import { useTheme } from '../../store/ThemeContext'

const LINKS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Panel', color: 'from-brand-400 to-brand-500' },
  { to: '/budgets', icon: PiggyBank, label: 'Presupuestos', color: 'from-emerald-400 to-emerald-500' },
  { to: '/ai-mode', icon: Brain, label: 'Modo IA', color: 'from-violet-400 to-violet-500' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transacciones', color: 'from-blue-400 to-blue-500' },
  { to: '/statistics', icon: BarChart3, label: 'Estadísticas', color: 'from-amber-400 to-amber-500' },
  { to: '/scan-ticket', icon: ScanLine, label: 'Escanear Ticket', color: 'from-rose-400 to-rose-500' },
  { to: '/savings-goals', icon: Target, label: 'Metas de Ahorro', color: 'from-teal-400 to-teal-500' },
  { to: '/shared-finances', icon: Users, label: 'Finanzas Compartidas', color: 'from-orange-400 to-orange-500' },
  { to: '/calendar', icon: CalendarDays, label: 'Calendario', color: 'from-pink-400 to-pink-500' },
  { to: '/settings', icon: Settings, label: 'Ajustes', color: 'from-slate-400 to-slate-500' },
]

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()

  return (
    <>
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed top-4 left-4 z-50 flex items-center justify-center w-11 h-11 lg:hidden bg-surface-light text-text-primary rounded-xl border border-border shadow-lg hover:bg-surface-lighter/50 active:scale-95 transition-all"
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-all duration-300 lg:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
      />

      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-surface-light border-r border-border flex flex-col transition-all duration-300 ease-out shadow-2xl lg:shadow-none ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-border">
          <NavLink to="/dashboard" className="flex items-center gap-3 group" onClick={() => setOpen(false)}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 group-hover:shadow-brand-500/30 transition-all duration-200">
              <Sparkles size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">BudgetIQ</h1>
              <p className="text-[11px] text-text-muted font-medium">Finanzas inteligentes</p>
            </div>
          </NavLink>
        </div>

        <div className="p-3 pb-1">
          <p className="text-[11px] text-text-muted font-semibold uppercase tracking-wider px-4">Navegación</p>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-2 space-y-0.5">
          {LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-lighter/50 border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${link.color} flex items-center justify-center flex-shrink-0 shadow-sm transition-transform duration-150 ${isActive ? 'scale-110 shadow-md' : 'group-hover:scale-105'}`}>
                    <link.icon size={15} className="text-white" />
                  </div>
                  <span className="flex-1">{link.label}</span>
                  {isActive && <ChevronRight size={14} className="text-brand-400" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-lighter/50 border border-transparent hover:border-border transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-surface-lighter/50 flex items-center justify-center flex-shrink-0">
              <ExternalLink size={16} className="text-brand-400" />
            </div>
            <span>Página de inicio</span>
          </button>
          <button
            onClick={toggle}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-lighter/50 border border-transparent hover:border-border transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-surface-lighter/50 flex items-center justify-center flex-shrink-0">
              {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-brand-400" />}
            </div>
            <span>{theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>
          </button>
          <div className="px-4 py-2">
            <p className="text-[11px] text-text-muted text-center">BudgetIQ v2.0.0</p>
          </div>
        </div>
      </aside>
    </>
  )
}
