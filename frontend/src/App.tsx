import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Chat from './pages/Chat'
import Profile from './pages/Profile'

function isAuth() {
  return Boolean(localStorage.getItem('token'))
}

function Protected({ children }: { children: JSX.Element }) {
  if (!isAuth()) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const logged = isAuth()

  function handleLogout() {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4">
        <nav className="container mx-auto flex gap-4 items-center">
          {logged ? (
            <>
              <Link to="/">Chat</Link>
              <Link to="/profile">Profile</Link>
              <button onClick={handleLogout} className="ml-auto text-sm text-red-600">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
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
