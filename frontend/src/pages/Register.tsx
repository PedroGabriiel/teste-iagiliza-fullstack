import React, { useState } from 'react'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({})

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // client-side validation to avoid server 400
    const nextErrors: typeof errors = {}
    if (!name.trim()) nextErrors.name = 'Nome é obrigatório'
    const emailTrim = email.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailTrim) nextErrors.email = 'Email é obrigatório'
    else if (!emailRegex.test(emailTrim)) nextErrors.email = 'Email inválido'
    if (!password || password.length < 6) nextErrors.password = 'Senha deve ter ao menos 6 caracteres'

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    try {
      const res = await fetch('http://localhost:3333/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: emailTrim, password })
      })
      if (!res.ok) {
        // try to parse error details from server
        let text = await res.text()
        try {
          const j = JSON.parse(text)
          if (j.message) text = j.message
          if (j.details) text += ' - ' + JSON.stringify(j.details)
        } catch {}
        throw new Error(String(text || 'Registration failed'))
      }
      alert('Registered, please login')
      window.location.href = '/login'
    } catch (err: any) {
      alert(err.message || 'Registration failed')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div>
          <input className="border p-2 w-full" placeholder="Name" value={name} onChange={e => { setName(e.target.value); setErrors(prev => ({ ...prev, name: undefined })); }} />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
        </div>

        <div>
          <input className="border p-2 w-full" placeholder="Email" value={email} onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })); }} />
          {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
        </div>

        <div>
          <input type="password" className="border p-2 w-full" placeholder="Password" value={password} onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: undefined })); }} />
          {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
        </div>

        <button className="bg-green-600 text-white p-2 rounded mt-2">Register</button>
      </form>
    </div>
  )
}
