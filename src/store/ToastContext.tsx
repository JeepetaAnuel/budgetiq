import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
}

interface ToastCtx {
  toast: (t: Omit<Toast, 'id'>) => void
}

const ctx = createContext<ToastCtx | null>(null)

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={18} className="text-success" />,
  error: <XCircle size={18} className="text-danger" />,
  warning: <AlertTriangle size={18} className="text-warning" />,
  info: <Info size={18} className="text-brand-400" />,
}

const BORDERS: Record<ToastType, string> = {
  success: 'border-success/30',
  error: 'border-danger/30',
  warning: 'border-warning/30',
  info: 'border-brand-500/30',
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([])

  const addToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = uid()
    setItems(prev => [...prev, { ...t, id }])
    setTimeout(() => {
      setItems(prev => prev.filter(item => item.id !== id))
    }, 4000)
  }, [])

  const remove = (id: string) => setItems(prev => prev.filter(item => item.id !== id))

  return (
    <ctx.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence mode="popLayout">
          {items.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className={`pointer-events-auto bg-surface-light border ${BORDERS[item.type]} rounded-2xl p-4 shadow-2xl shadow-black/30`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">{ICONS[item.type]}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{item.title}</p>
                  {item.message && <p className="text-xs text-text-muted mt-0.5">{item.message}</p>}
                </div>
                <button onClick={() => remove(item.id)} className="flex-shrink-0 p-1 hover:bg-surface-lighter rounded-lg text-text-muted hover:text-text-primary transition-colors">
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ctx.Provider>
  )
}

export function useToast(): ToastCtx {
  const c = useContext(ctx)
  if (!c) throw new Error('useToast debe usarse dentro de <ToastProvider>')
  return c
}
