import React, { useState } from 'react'
import api from '../lib/api'
import { registerSchema } from '../schemas/auth'

// Componente de registro usando Axios + Zod
export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({})

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const parsed = registerSchema.safeParse({ name: name.trim(), email: email.trim(), password })
    if (!parsed.success) {
      // mapeia erros simples para exibir (ZodError.issues)
      const next: typeof errors = {}
      parsed.error.issues.forEach(er => {
        const path = String(er.path?.[0] || '')
        if (path) next[path as keyof typeof errors] = er.message
      })
      setErrors(next)
      return
    }

    try {
      await api.post('/register', parsed.data)
      alert('Registered, please login')
      window.location.href = '/login'
    } catch (err: any) {
      alert(err.message || 'Registration failed')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow">
      <h2 className="text-xl mb-4 text-gray-900 dark:text-gray-100">Register</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div>
          <input className="border p-2 w-full bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100" placeholder="Name" value={name} onChange={e => { setName(e.target.value); setErrors(prev => ({ ...prev, name: undefined })); }} />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
        </div>

        <div>
          <input className="border p-2 w-full bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100" placeholder="Email" value={email} onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })); }} />
          {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
        </div>

        <div>
          <input type="password" className="border p-2 w-full bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100" placeholder="Password" value={password} onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: undefined })); }} />
          {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
        </div>

  <button className="bg-green-600 hover:bg-green-700 text-white p-2 rounded mt-2">Register</button>
      </form>
    </div>
  )
}
