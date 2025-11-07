// Cliente Axios para o frontend
// - Centraliza baseURL e injeta Authorization: Bearer <token> automaticamente
// - Retorna os dados (response.data) ou lança Error com mensagem do servidor
import axios, { AxiosInstance, AxiosRequestConfig, AxiosHeaders } from 'axios'

const BASE = 'http://localhost:3333'

const client: AxiosInstance = axios.create({ baseURL: BASE })

// Interceptor para injetar token automaticamente
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    // Usa AxiosHeaders para manter a API de headers do axios e evitar erros de tipagem
    const headers = new AxiosHeaders(config.headers)
    headers.set('Authorization', `Bearer ${token}`)
    config.headers = headers
  }
  return config
})

async function request(method: string, path: string, data?: any, opts?: AxiosRequestConfig) {
  try {
    const res = await client.request({ method, url: path, data, ...(opts || {}) })
    return res.data
  } catch (err: any) {
    // Axios error: tenta extrair mensagem do body
    const message = err?.response?.data?.message || err?.message || String(err)
    throw new Error(message)
  }
}

export default {
  get: (p: string, opts?: AxiosRequestConfig) => request('get', p, undefined, opts),
  post: (p: string, d?: any, opts?: AxiosRequestConfig) => request('post', p, d, opts),
  patch: (p: string, d?: any, opts?: AxiosRequestConfig) => request('patch', p, d, opts),
}
