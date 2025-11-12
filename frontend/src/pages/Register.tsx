import React, { useState } from 'react'
import api from '../lib/api'
import { registerSchema } from '../schemas/auth'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import { useToast } from '../components/ui/Toast'
import { useNavigate } from 'react-router-dom'

// Componente de registro usando componentes UI (Button/Input/Card)
export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({})
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [showConfirm, setShowConfirm] = React.useState(false)

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
      showToast?.({ title: 'Registered', description: 'Please login', type: 'success' })
      // show confirmation modal instead of immediate redirect
      setShowConfirm(true)
    } catch (err: any) {
      showToast?.({ title: 'Registration failed', description: String(err?.message || 'Error'), type: 'error' })
    }
  }

  return (
    <>
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

      <Modal
        open={showConfirm}
        title="Registrado com sucesso"
        description="Sua conta foi criada com sucesso."
        onClose={() => setShowConfirm(false)}
        variant="balloon"
      />
    </>
  )
}
