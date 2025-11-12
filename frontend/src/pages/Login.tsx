import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { loginSchema } from '../schemas/auth'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import { useToast } from '../components/ui/Toast'
import Modal from '../components/ui/Modal'

// Componente de Login usando componentes UI (Button/Input/Card)
export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [showSuccess, setShowSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // valida com Zod antes de enviar
    const parsed = loginSchema.safeParse({ email, password })
    if (!parsed.success) {
      const first = parsed.error.issues?.[0]
      showToast?.({ title: first?.message || 'Entrada inválida', type: 'error' })
      return
    }

    try {
      const data = await api.post('/login', parsed.data)
      const { token } = data
    localStorage.setItem('token', token)
    // notify app that auth state changed
    window.dispatchEvent(new Event('authChanged'))
    showToast?.({ title: 'Logged in', type: 'success' })
    // show small translucent balloon and then redirect
    setShowSuccess(true)
    await new Promise((res) => setTimeout(res, 600))
    navigate('/')
    } catch (err: any) {
      showToast?.({ title: 'Login failed', description: String(err?.message || 'Error'), type: 'error' })
    }
  }

  useEffect(() => {
    if (localStorage.getItem('token')) {
      window.location.href = '/'
    }
  }, [])

  return (
    <>
      <Card className="max-w-md mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input className="focus:ring-2 focus:ring-brand/30" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <Input type="password" className="focus:ring-2 focus:ring-brand/30" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <Button className="mt-2">Login</Button>
        </form>
        <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
          <p>Você nao tem uma conta? <Link to="/register" className="text-brand hover:underline">Registre-se aqui</Link></p>
        </div>
      </Card>
      <Modal open={showSuccess} title="Login efetuado" description="Autenticado com sucesso" onClose={() => setShowSuccess(false)} variant="balloon" balloonClassName="bg-white/40 dark:bg-gray-800/30 backdrop-blur-sm text-xs p-1 w-36" />
    </>
  )
}
