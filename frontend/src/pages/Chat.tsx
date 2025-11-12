import React, { useEffect, useState } from 'react'
import api from '../lib/api'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import { useToast } from '../components/ui/Toast'

// Componente de Chat
// - Carrega mensagens do backend (GET /messages)
// - Envia mensagem do usuário (POST /message) e recarrega a lista
type Message = {
  id: string
  content: string
  role: 'user' | 'ai'
  createdAt: string
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const { showToast } = useToast()

  // Carrega mensagens do servidor e atualiza estado
  async function load() {
    try {
      const data = await api.get('/messages')
      setMessages(Array.isArray(data) ? data : [])
    } catch (err: any) {
      console.error('load messages error', err)
      setMessages([])
    }
  }

  useEffect(() => { load() }, [])

  // Envia a mensagem do usuário; a resposta da IA é criada no backend
  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!text) return
    try {
      await api.post('/message', { content: text })
      setText('')
      load()
    } catch (err: any) {
      showToast?.({ title: 'Send failed', description: String(err?.message || 'Error'), type: 'error' })
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <h2 className="text-xl mb-4 text-gray-900 dark:text-gray-100">Chat</h2>
      <div className="space-y-2 mb-4">
        {messages.map(m => (
          <div key={m.id} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <div className={
              (m.role === 'user'
                ? 'inline-block p-2 rounded bg-brand-50 text-gray-900 dark:bg-brand dark:text-white'
                : 'inline-block p-2 rounded bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100')
            }>{m.content}</div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="flex gap-2">
        <Input value={text} onChange={e => setText(e.target.value)} className="flex-1" />
        <Button>Send</Button>
      </form>
    </Card>
  )
}
