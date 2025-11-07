import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import { loginSchema } from '../schemas/auth'

// Componente de Login usando Axios + Zod
export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // valida com Zod antes de enviar
    const parsed = loginSchema.safeParse({ email, password })
    if (!parsed.success) {
      // ZodError possui a propriedade issues com detalhes dos erros
      const first = parsed.error.issues?.[0]
      alert(first?.message || 'Entrada inválida')
      return
    }

    try {
      const data = await api.post('/login', parsed.data)
      const { token } = data
      localStorage.setItem('token', token)
      alert('Logged in')
      window.location.href = '/'
    } catch (err: any) {
      alert(err.message || 'Login failed')
    }
  }

  useEffect(() => {
    if (localStorage.getItem('token')) {
      window.location.href = '/'
    }
  }, [])

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow">
      <h2 className="text-xl mb-4 text-gray-900 dark:text-gray-100">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
  <input className="border p-2 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
  <input type="password" className="border p-2 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
  <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded mt-2">Login</button>
      </form>
      <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
        <p>Don't have an account? <Link to="/register" className="text-blue-600 dark:text-blue-400">Register here</Link></p>
      </div>
    </div>
  )
}
