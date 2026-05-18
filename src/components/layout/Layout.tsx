import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import Tutorial from '../ui/Tutorial'

export default function Layout() {
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
          <Outlet />
        </main>
      </div>
      {showTutorial && <Tutorial onClose={finishTutorial} />}
    </div>
  )
}
