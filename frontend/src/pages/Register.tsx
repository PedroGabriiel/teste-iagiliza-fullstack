import React, { useState } from 'react'
import api from '../lib/api'
import { registerSchema } from '../schemas/auth'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'

// Componente de registro usando componentes UI (Button/Input/Card)
export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({})

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const parsed = registerSchema.safeParse({ name: name.trim(), email: email.trim(), password })
    if (!parsed.success) {
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
    <Card className="max-w-md mx-auto">
      <h2 className="text-xl mb-4 text-gray-900 dark:text-gray-100">Register</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <Input placeholder="Name" value={name} onChange={e => { setName(e.target.value); setErrors(prev => ({ ...prev, name: undefined })); }} />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
        </div>

        <div>
          <Input placeholder="Email" value={email} onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })); }} />
          {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
        </div>

        <div>
          <Input type="password" className="focus:ring-2 focus:ring-brand/30" placeholder="Password" value={password} onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: undefined })); }} />
          {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
        </div>

        <Button className="mt-2">Register</Button>
      </form>
    </Card>
  )
}
