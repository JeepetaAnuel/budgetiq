import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, LayoutDashboard, PiggyBank, Brain, ArrowLeftRight, Target, ChevronRight, X } from 'lucide-react'

const STEPS = [
  {
    icon: LayoutDashboard,
    title: 'Panel de Control',
    desc: 'Aquí ves un resumen de tus finanzas: saldo, ingresos, gastos, salud financiera y gráficos.',
  },
  {
    icon: PiggyBank,
    title: 'Presupuestos',
    desc: 'Define límites de gasto por categoría y sigue tu progreso con barras de colores.',
  },
  {
    icon: Brain,
    title: 'Modo IA',
    desc: 'La IA analiza tus datos y genera un plan de distribución óptimo del dinero.',
  },
  {
    icon: ArrowLeftRight,
    title: 'Transacciones',
    desc: 'Registra tus ingresos y gastos manualmente o desde un ticket escaneado.',
  },
  {
    icon: Target,
    title: 'Metas de Ahorro',
    desc: 'Crea objetivos financieros y la IA te ayuda a alcanzarlos con un plan personalizado.',
  },
]

export default function Tutorial({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.25 }}
          className="bg-surface-light border border-border rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
        >
          <button onClick={onClose} className="float-right w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-lighter transition-all">
            <X size={16} />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-brand-500 flex items-center justify-center">
              <Sparkles size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Bienvenido a BudgetIQ</h2>
              <p className="text-xs text-text-muted">Paso {step + 1} de {STEPS.length}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0">
              <current.icon size={26} className="text-brand-500" />
            </div>
            <div>
              <h3 className="text-base font-semibold">{current.title}</h3>
              <p className="text-sm text-text-muted mt-1">{current.desc}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {STEPS.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-brand-500 w-6' : 'bg-surface-lighter'}`} />
              ))}
            </div>
            <div className="flex gap-2">
              {step < STEPS.length - 1 ? (
                <button onClick={() => setStep(s => s + 1)} className="flex items-center gap-1.5 px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-all">
                  Siguiente <ChevronRight size={14} />
                </button>
              ) : (
                <button onClick={onClose} className="px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-all">
                  ¡Empezar!
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
