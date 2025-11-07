import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { updateMeSchema } from '../schemas/auth'

// Página de perfil do usuário (usa Axios + Zod)
export default function Profile() {
  const [user, setUser] = useState<{ id: string; name: string; email: string; createdAt: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

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
      alert('Profile updated')
    } catch (err: any) {
      if (String(err.message).toLowerCase().includes('unauthorized') || String(err.message).includes('401')) {
        return navigate('/login')
      }
      setError(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="max-w-md mx-auto bg-white p-6 rounded shadow">Loading...</div>

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl mb-4">Profile</h2>
      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

      {user ? (
        <form onSubmit={handleSave} className="flex flex-col gap-3">
          <div>
            <label className="text-sm">Name</label>
            <input className="border p-2 w-full" value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div>
            <label className="text-sm">Email</label>
            <input className="border p-2 w-full" value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div>
            <label className="text-sm">Member since</label>
            <div className="p-2 bg-gray-50 rounded">{fmtDate(user.createdAt)}</div>
          </div>

          <div className="flex gap-2">
            <button disabled={saving} className="bg-green-600 text-white p-2 rounded">{saving ? 'Saving...' : 'Save'}</button>
            <button type="button" onClick={() => { setName(user.name); setEmail(user.email); setError(null) }} className="p-2 border rounded">Reset</button>
          </div>
        </form>
      ) : (
        <p>Not logged</p>
      )}
    </div>
  )
}
