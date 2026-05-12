import { lazy, Component, type ReactNode } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './store/AppContext'
import { ThemeProvider } from './store/ThemeContext'
import { ToastProvider } from './store/ToastContext'
import Layout from './components/layout/Layout'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Budgets = lazy(() => import('./pages/Budgets'))
const AIMode = lazy(() => import('./pages/AIMode'))
const Transactions = lazy(() => import('./pages/Transactions'))
const Settings = lazy(() => import('./pages/Settings'))
const Statistics = lazy(() => import('./pages/Statistics'))
const ScanTicket = lazy(() => import('./pages/ScanTicket'))
const SavingsGoals = lazy(() => import('./pages/SavingsGoals'))
const SharedFinances = lazy(() => import('./pages/SharedFinances'))
const Calendar = lazy(() => import('./pages/Calendar'))

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(e: Error) { return { error: e } }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-8">
          <div className="bg-surface-light border border-border rounded-2xl p-8 max-w-md w-full text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
            </div>
            <h2 className="text-lg font-bold">Algo salió mal</h2>
            <p className="text-sm text-text-muted">{this.state.error.message}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-text-primary text-sm font-medium rounded-xl transition-colors">
              Recargar página
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AppProvider>
            <ErrorBoundary>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/budgets" element={<Budgets />} />
                  <Route path="/ai-mode" element={<AIMode />} />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/statistics" element={<Statistics />} />
                  <Route path="/scan-ticket" element={<ScanTicket />} />
                  <Route path="/savings-goals" element={<SavingsGoals />} />
                  <Route path="/shared-finances" element={<SharedFinances />} />
                  <Route path="/calendar" element={<Calendar />} />
                </Route>
              </Routes>
            </ErrorBoundary>
          </AppProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
