import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

const App = lazy(() => import('./App'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<Loader />}>
      <App />
    </Suspense>
  </StrictMode>,
)

function Loader() {
  return (
    <div className="fixed inset-0 bg-surface flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30 animate-pulse">
        <svg className="w-6 h-6 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
      </div>
      <p className="text-sm text-text-muted">Cargando BudgetIQ...</p>
    </div>
  )
}
