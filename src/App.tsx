import { lazy, Suspense, useState, type ReactNode } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { AppProvider } from './store/AppContext'
import { ThemeProvider } from './store/ThemeContext'
import { ToastProvider } from './store/ToastContext'
import { AuthProvider, useAuth } from './store/AuthContext'
import Layout from './components/layout/Layout'
import Landing from './pages/Landing'
import { ErrorBoundary } from './components/ui/ErrorFallback'
import LoadingScreen from './components/ui/LoadingScreen'

const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
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

function GuestGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [guest, setGuest] = useState(() => sessionStorage.getItem('budgetiq-guest') === 'true')

  if (loading) return null

  if (!user && !guest) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50/80 via-white to-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <Sparkles size={32} className="text-emerald-600" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">BudgetIQ</h1>
        <p className="text-sm text-slate-500 max-w-sm mb-8">Inicia sesión para guardar tus datos, o entra como invitado para explorar la app.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => navigate('/login')} className="px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl text-sm hover:bg-emerald-600 transition-all shadow-lg">
            Iniciar sesión
          </button>
          <button onClick={() => { setGuest(true); sessionStorage.setItem('budgetiq-guest', 'true'); }} className="px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 font-semibold rounded-xl text-sm hover:border-slate-400 transition-all">
            Modo invitado (demo)
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-6 max-w-sm">El modo invitado guarda los datos en tu navegador. Se perderán al cerrar la ventana si no inicias sesión.</p>
      </div>
    )
  }

  return <>{children}</>
}

export default function App() {
  return (
    <>
      <a
        href="#main-content"
        className="fixed -top-20 left-4 z-[100] px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-b-lg shadow-lg transition-all focus:top-0 focus:outline-none"
      >
        Saltar al contenido principal
      </a>

      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <AppProvider>
                <Suspense fallback={<LoadingScreen />}>
                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route element={<GuestGate><Layout /></GuestGate>}>
                      <Route path="/dashboard" element={<ErrorBoundary page="Dashboard"><Dashboard /></ErrorBoundary>} />
                      <Route path="/budgets" element={<ErrorBoundary page="Presupuestos"><Budgets /></ErrorBoundary>} />
                      <Route path="/ai-mode" element={<ErrorBoundary page="Modo IA"><AIMode /></ErrorBoundary>} />
                      <Route path="/transactions" element={<ErrorBoundary page="Transacciones"><Transactions /></ErrorBoundary>} />
                      <Route path="/settings" element={<ErrorBoundary page="Ajustes"><Settings /></ErrorBoundary>} />
                      <Route path="/statistics" element={<ErrorBoundary page="Estadísticas"><Statistics /></ErrorBoundary>} />
                      <Route path="/scan-ticket" element={<ErrorBoundary page="Escanear Ticket"><ScanTicket /></ErrorBoundary>} />
                      <Route path="/savings-goals" element={<ErrorBoundary page="Metas de Ahorro"><SavingsGoals /></ErrorBoundary>} />
                      <Route path="/shared-finances" element={<ErrorBoundary page="Finanzas Compartidas"><SharedFinances /></ErrorBoundary>} />
                      <Route path="/calendar" element={<ErrorBoundary page="Calendario"><Calendar /></ErrorBoundary>} />
                    </Route>
                  </Routes>
                </Suspense>
              </AppProvider>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </>
  )
}
