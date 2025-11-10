import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-3xl text-center">
        <div className="card">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Chat IA Simulado</h1>
          <p className="text-gray-700 dark:text-gray-300 mb-6">Converse com uma IA simulada para testar fluxos, protótipos e validar ideias rapidamente — sem configurações.</p>

          <div className="flex gap-3 justify-center mb-6">
            <Link to="/register" className="btn btn-primary">Criar conta</Link>
            <Link to="/login" className="btn btn-secondary">Entrar</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded bg-gray-50 dark:bg-gray-700">
              <h3 className="font-semibold mb-1">Rápido</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Sem configurar APIs externas — comece em segundos.</p>
            </div>
            <div className="p-4 border rounded bg-gray-50 dark:bg-gray-700">
              <h3 className="font-semibold mb-1">Seguro</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Autenticação com JWT e senhas hasheadas.</p>
            </div>
            <div className="p-4 border rounded bg-gray-50 dark:bg-gray-700">
              <h3 className="font-semibold mb-1">Extensível</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Pronto para integrar LLM real e múltiplos chats por usuário.</p>
            </div>
          </div>
        </div>
        <p className="mt-6 text-xs text-gray-500">Feito com Fastify, Prisma, React e Tailwind — veja o código no repositório.</p>
      </div>
    </div>
  )
}
