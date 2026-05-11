import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './store/AppContext'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Budgets from './pages/Budgets'
import AIMode from './pages/AIMode'
import Transactions from './pages/Transactions'
import Settings from './pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/ai-mode" element={<AIMode />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  )
}
