import { Sparkles } from 'lucide-react'

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-surface flex flex-col items-center justify-center z-50">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
          <Sparkles size={28} className="text-white" />
        </div>
        <div className="absolute -inset-2 rounded-2xl border-2 border-brand-500/20 animate-pulse" />
      </div>
      <p className="mt-4 text-sm font-medium text-text-muted animate-pulse">Cargando BudgetIQ...</p>
    </div>
  )
}
