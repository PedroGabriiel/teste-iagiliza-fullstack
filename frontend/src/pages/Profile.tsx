import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { updateMeSchema } from '../schemas/auth'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import { useToast } from '../components/ui/Toast'

// Página de perfil do usuário (usa Axios + Zod)
export default function Profile() {
  const [user, setUser] = useState<{ id: string; name: string; email: string; createdAt: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { showToast } = useToast()

  // Busca perfil do backend; se não autenticado, redireciona
  async function load() {
    setLoading(true)
    try {
      const data = await api.get('/me')
      setUser(data)
      setName(data.name || '')
      setEmail(data.email || '')
    } catch (err: any) {
      if (String(err.message).toLowerCase().includes('unauthorized') || String(err.message).includes('401')) {
        return navigate('/login')
      }
      console.error(err)
      setError(err.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])


  function fmtDate(d: string) {
    try { return new Date(d).toLocaleString() } catch { return d }
  }

  // Validação com Zod e envio do PATCH /me
  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const parsed = updateMeSchema.safeParse({ name: name.trim(), email: email.trim() })
    if (!parsed.success) {
      const messages = parsed.error.issues.map(er => er.message).join('; ')
      return setError(messages)
    }

      try {
      setSaving(true)
      const updated = await api.patch('/me', parsed.data)
      setUser(updated)
      setName(updated.name)
      setEmail(updated.email)
      showToast?.({ title: 'Profile updated', type: 'success' })
    } catch (err: any) {
      if (String(err.message).toLowerCase().includes('unauthorized') || String(err.message).includes('401')) {
        return navigate('/login')
      }
      setError(err.message || 'Save failed')
      showToast?.({ title: 'Save failed', description: String(err?.message || 'Error'), type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Card className="max-w-md mx-auto">Loading...</Card>

  return (
    <Card className="max-w-md mx-auto">
      <h2 className="text-xl mb-4 text-gray-900 dark:text-gray-100">Profile</h2>
      {error && <p className="text-sm text-red-600 dark:text-red-400 mb-2">{error}</p>}

      {user ? (
        <form onSubmit={handleSave} className="flex flex-col gap-3">
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300">Name</label>
            <Input className="focus:ring-2 focus:ring-brand/30" value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300">Email</label>
            <Input className="focus:ring-2 focus:ring-brand/30" value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div className="flex gap-2">
            <Button disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      ) : (
        <p>Nao esta Logado</p>
      )}
    </Card>
  )
}
