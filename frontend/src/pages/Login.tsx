import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const res = await fetch('http://localhost:3333/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      const { token } = data
      localStorage.setItem('token', token)
      alert('Logged in')
      window.location.href = '/'
    } catch (err: any) {
      alert(err.message || 'Login failed')
    }
  }

  useEffect(() => {
    // if already logged, go to chat
    if (localStorage.getItem('token')) {
      window.location.href = '/'
    }
  }, [])

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input className="border p-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" className="border p-2" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="bg-blue-600 text-white p-2 rounded mt-2">Login</button>
      </form>
      <div className="mt-4 text-sm">
        <p>Don't have an account? <Link to="/register" className="text-blue-600">Register here</Link></p>
      </div>
    </div>
  )
}
