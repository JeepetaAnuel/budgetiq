import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Header from './Header'
import Tutorial from '../ui/Tutorial'

export default function Layout() {
  const location = useLocation()
  const [showTutorial, setShowTutorial] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem('budgetiq-tutorial-seen')
    if (!seen) {
      const timer = setTimeout(() => setShowTutorial(true), 600)
      return () => clearTimeout(timer)
    }
  }, [])

  function finishTutorial() {
    setShowTutorial(false)
    localStorage.setItem('budgetiq-tutorial-seen', 'true')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      {showTutorial && <Tutorial onClose={finishTutorial} />}
    </div>
  )
}
