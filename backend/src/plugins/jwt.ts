import { FastifyInstance } from 'fastify'
import jwt from 'jsonwebtoken'

export default async function jwtPlugin(fastify: FastifyInstance) {
  const secret = process.env.JWT_SECRET || 'change-this-in-env'

  fastify.decorateRequest('user', null)
  fastify.decorateRequest('jwtVerify', async function (this: any) {
    const auth = (this.headers?.authorization as string) || ''
  if (!auth) throw (fastify as any).httpErrors.unauthorized('Missing authorization')
    const parts = auth.split(' ')
  if (parts.length !== 2) throw (fastify as any).httpErrors.unauthorized('Bad authorization header')
    const token = parts[1]
    try {
      const decoded = jwt.verify(token, secret) as any
      this.user = decoded
      return decoded
    } catch (err) {
      throw (fastify as any).httpErrors.unauthorized('Invalid token')
    }
  })
}
