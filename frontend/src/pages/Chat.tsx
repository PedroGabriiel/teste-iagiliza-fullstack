import React, { useEffect, useState } from 'react'

type Message = {
  id: string
  content: string
  role: 'user' | 'ai'
  createdAt: string
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')

  async function load() {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:3333/messages', { headers: { authorization: `Bearer ${token}` } })
      if (!res.ok) {
        // try to read error message
        let errText = await res.text()
        try { errText = JSON.parse(errText).message || errText } catch { }
        throw new Error(String(errText || 'Failed to load messages'))
      }
      const data = await res.json()
      // Ensure we set an array
      setMessages(Array.isArray(data) ? data : [])
    } catch (err: any) {
      console.error('load messages error', err)
      setMessages([])
    }
  }

  useEffect(() => { load() }, [])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!text) return
    try {
      const res = await fetch('http://localhost:3333/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ content: text })
      })
      if (!res.ok) throw new Error('Send failed')
      setText('')
      load()
    } catch (err: any) {
      alert(err.message || 'Send failed')
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl mb-4">Chat</h2>
      <div className="space-y-2 mb-4">
        {messages.map(m => (
          <div key={m.id} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <div className="inline-block p-2 rounded bg-gray-100">{m.content}</div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="flex gap-2">
        <input value={text} onChange={e => setText(e.target.value)} className="flex-1 border p-2" />
        <button className="bg-blue-600 text-white p-2 rounded">Send</button>
      </form>
    </div>
  )
}
