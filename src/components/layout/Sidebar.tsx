import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, PiggyBank, Brain, ArrowLeftRight, Settings,
  Menu, X, Sparkles, Sun, Moon, BarChart3, ScanLine,
  Target, Users, CalendarDays, ExternalLink
} from 'lucide-react'
import { useTheme } from '../../store/ThemeContext'

const LINKS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Panel' },
  { to: '/budgets', icon: PiggyBank, label: 'Presupuestos' },
  { to: '/ai-mode', icon: Brain, label: 'Modo IA' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transacciones' },
  { to: '/statistics', icon: BarChart3, label: 'Estadísticas' },
  { to: '/scan-ticket', icon: ScanLine, label: 'Escanear Ticket' },
  { to: '/savings-goals', icon: Target, label: 'Metas de Ahorro' },
  { to: '/shared-finances', icon: Users, label: 'Finanzas Compartidas' },
  { to: '/calendar', icon: CalendarDays, label: 'Calendario' },
  { to: '/settings', icon: Settings, label: 'Ajustes' },
]

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()

  return (
    <>
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed top-4 left-4 z-50 flex items-center justify-center w-10 h-10 lg:hidden bg-surface-light text-text-primary rounded-lg border border-border shadow-sm hover:bg-surface-lighter active:scale-95 transition-all"
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      <div
        className={`fixed inset-0 bg-black/40 z-30 transition-all duration-300 lg:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
      />

      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-surface-light border-r border-border flex flex-col transition-all duration-300 ease-out ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="px-5 h-16 flex items-center border-b border-border">
          <NavLink to="/dashboard" className="flex items-center gap-2.5 group" onClick={() => setOpen(false)}>
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center flex-shrink-0">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-text-primary">BudgetIQ</h1>
            </div>
          </NavLink>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-50 text-brand-500 border-l-2 border-brand-500 pl-[10px]'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-lighter/60 border-l-2 border-transparent pl-[10px]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <link.icon size={17} className={isActive ? 'text-brand-500' : 'text-text-muted group-hover:text-text-primary'} />
                  <span>{link.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-3 border-t border-border space-y-1">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-lighter/60 transition-all"
          >
            <ExternalLink size={16} className="text-text-muted" />
            <span>Página de inicio</span>
          </button>
          <button
            onClick={toggle}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-lighter/60 transition-all"
          >
            {theme === 'dark' ? <Sun size={16} className="text-text-muted" /> : <Moon size={16} className="text-text-muted" />}
            <span>{theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>
          </button>
          <div className="pt-2 px-3">
            <p className="text-[11px] text-text-muted text-center">BudgetIQ v2.0.0</p>
          </div>
        </div>
      </aside>
    </>
  )
}
