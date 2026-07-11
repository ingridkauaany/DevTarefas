import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import ThemeToggle from './components/ThemeToggle'
import Footer from './components/Footer'
import useTheme from './useTheme'

export default function App() {
  const [user, setUser] = useState(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setCheckingAuth(false)
    })
    return unsubscribe
  }, [])

  return (
    <div className="app-shell">
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      {checkingAuth ? (
        <div className="loading-screen">Carregando...</div>
      ) : user ? (
        <Dashboard user={user} />
      ) : (
        <Login />
      )}
      <Footer />
    </div>
  )
}
