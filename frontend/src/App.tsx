import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Chat from './pages/Chat'
import Profile from './pages/Profile'
import Landing from './pages/Landing'
import ToastProvider from './components/ui/Toast'

// Verifica se há token salvo no localStorage
function isAuth() {
  return Boolean(localStorage.getItem('token'))
}

// Componente wrapper para rotas protegidas
//  Se não autenticado, redireciona para a Landing (/) em vez de /login
function Protected({ children }: { children: JSX.Element }) {
  if (!isAuth()) return <Navigate to="/" replace />
  return children
}

// Componente principal da App com navegação básica
//  Exibe links diferentes dependendo se o usuário está logado
//  Rotas: '/', '/profile' (protegidas), '/login', '/register'
export default function App() {
  const [logged, setLogged] = useState<boolean>(isAuth())
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null
    const initial = stored || 'light'
    setTheme(initial)
    try { document.documentElement.classList.toggle('dark', initial === 'dark') } catch {}
  }, [])

  // Keep `logged` state in sync when token changes (login/logout)
  useEffect(() => {
    function onAuthChange() {
      setLogged(isAuth())
    }

    // custom event dispatched on login/logout in the same tab
    window.addEventListener('authChanged', onAuthChange)
    // storage event covers other tabs
    window.addEventListener('storage', onAuthChange)
    return () => {
      window.removeEventListener('authChanged', onAuthChange)
      window.removeEventListener('storage', onAuthChange)
    }
  }, [])

  // Remove token e força redirecionamento para tela de login
  function handleLogout() {
    localStorage.removeItem('token')
    setLogged(false)
    // notify other listeners
    window.dispatchEvent(new Event('authChanged'))
    // Redirect to landing when logged out
    window.location.href = '/'
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-800 shadow p-4">
        <nav className="container mx-auto flex items-center text-gray-800 dark:text-gray-100">
          <div className="flex gap-4 items-center">
            {logged ? (
              <>
                <Link to="/" className="text-gray-700 dark:text-white hover:text-brand dark:hover:text-brand-50 hover:underline">Chat</Link>
                <Link to="/profile" className="text-gray-700 dark:text-white hover:text-brand dark:hover:text-brand-50 hover:underline">Profile</Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 dark:text-white hover:text-brand dark:hover:text-brand-50 hover:underline">Login</Link>
                <Link to="/register" className="text-gray-700 dark:text-white hover:text-brand dark:hover:text-brand-50 hover:underline">Register</Link>
              </>
            )}
          </div>

          <div className="ml-auto flex items-center gap-4">
            <button
              aria-label="Toggle theme"
              title="Toggle theme"
              onClick={() => {
                const next = theme === 'light' ? 'dark' : 'light'
                setTheme(next)
                try { document.documentElement.classList.toggle('dark', next === 'dark') } catch {}
                localStorage.setItem('theme', next)
              }}
              className="btn btn-secondary"
            >
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
            {logged && <button onClick={handleLogout} className="text-sm text-red-600 dark:text-red-400">Logout</button>}
          </div>
        </nav>
      </header>
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={
            logged ? (
              <Protected>
                <Chat />
              </Protected>
            ) : (
              <Landing />
            )
          } />
          <Route path="/profile" element={
            <Protected>
              <Profile />
            </Protected>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to={logged ? '/' : '/'} replace />} />
        </Routes>
      </main>
      </div>
    </ToastProvider>
  )
}
