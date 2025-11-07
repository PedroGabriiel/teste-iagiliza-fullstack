import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Chat from './pages/Chat'
import Profile from './pages/Profile'

// Verifica se há token salvo no localStorage
function isAuth() {
  return Boolean(localStorage.getItem('token'))
}

// Componente wrapper para rotas protegidas
//  Se não autenticado, redireciona para /login
function Protected({ children }: { children: JSX.Element }) {
  if (!isAuth()) return <Navigate to="/login" replace />
  return children
}

// Componente principal da App com navegação básica
//  Exibe links diferentes dependendo se o usuário está logado
//  Rotas: '/', '/profile' (protegidas), '/login', '/register'
export default function App() {
  const logged = isAuth()
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null
    const initial = stored || 'light'
    setTheme(initial)
    try { document.documentElement.classList.toggle('dark', initial === 'dark') } catch {}
  }, [])

  // Remove token e força redirecionamento para tela de login
  function handleLogout() {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-800 shadow p-4">
        <nav className="container mx-auto flex items-center text-gray-800 dark:text-gray-100">
          <div className="flex gap-4 items-center">
            {logged ? (
              <>
                <Link to="/" className="text-gray-700 dark:text-gray-100 hover:underline">Chat</Link>
                <Link to="/profile" className="text-gray-700 dark:text-gray-100 hover:underline">Profile</Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 dark:text-gray-100 hover:underline">Login</Link>
                <Link to="/register" className="text-gray-700 dark:text-gray-100 hover:underline">Register</Link>
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
              className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
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
            <Protected>
              <Chat />
            </Protected>
          } />
          <Route path="/profile" element={
            <Protected>
              <Profile />
            </Protected>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to={logged ? '/' : '/login'} replace />} />
        </Routes>
      </main>
    </div>
  )
}
