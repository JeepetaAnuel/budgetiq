import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, PiggyBank, Brain, ArrowLeftRight, Settings, Menu, X, Sparkles } from 'lucide-react'

const LINKS = [
  { to: '/', icon: LayoutDashboard, label: 'Panel' },
  { to: '/budgets', icon: PiggyBank, label: 'Presupuestos' },
  { to: '/ai-mode', icon: Brain, label: 'Modo IA' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transacciones' },
  { to: '/settings', icon: Settings, label: 'Ajustes' },
]

export default function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-surface-light p-2.5 rounded-xl border border-border shadow-lg"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setOpen(false)} />}

      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-surface-light border-r border-border flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-border">
          <NavLink to="/" className="flex items-center gap-3 group" onClick={() => setOpen(false)}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">BudgetIQ</h1>
              <p className="text-xs text-text-muted">Finanzas inteligentes</p>
            </div>
          </NavLink>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                    : 'text-text-secondary hover:text-white hover:bg-surface-lighter/50 border border-transparent'
                }`
              }
            >
              <link.icon size={18} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="bg-gradient-to-br from-brand-500/10 to-brand-600/5 rounded-xl p-4 border border-brand-500/10">
            <p className="text-xs text-text-muted mb-1">Versión</p>
            <p className="text-sm font-semibold">1.0.0</p>
          </div>
        </div>
      </aside>
    </>
  )
}
