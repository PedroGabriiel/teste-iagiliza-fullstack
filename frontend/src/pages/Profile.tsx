import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const [user, setUser] = useState<{ id: string; name: string; email: string; createdAt: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function load() {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) return navigate('/login')
      const res = await fetch('http://localhost:3333/me', { headers: { authorization: `Bearer ${token}` } })
      if (res.status === 401) return navigate('/login')
      if (!res.ok) throw new Error('Failed to load profile')
      const data = await res.json()
      setUser(data)
      setName(data.name || '')
      setEmail(data.email || '')
    } catch (err: any) {
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

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const nextErrors: string[] = []
    if (!name.trim()) nextErrors.push('Name is required')
    const emailTrim = email.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailTrim) nextErrors.push('Email is required')
    else if (!emailRegex.test(emailTrim)) nextErrors.push('Email is invalid')
    if (nextErrors.length) return setError(nextErrors.join('; '))

    try {
      setSaving(true)
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:3333/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: name.trim(), email: emailTrim })
      })
      if (res.status === 401) return navigate('/login')
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || 'Save failed')
      }
      const updated = await res.json()
      setUser(updated)
      setName(updated.name)
      setEmail(updated.email)
      alert('Profile updated')
    } catch (err: any) {
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
