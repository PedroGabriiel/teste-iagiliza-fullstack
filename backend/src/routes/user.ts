import { FastifyInstance } from "fastify";
import prisma from "../plugins/prisma";
import { updateMeSchema } from "../schemas/auth";
import jwt from 'jsonwebtoken'

export default async function userRoutes(fastify: FastifyInstance) {
  const verifyAuth = async (request: any, reply: any) => {
    const auth = (request.headers?.authorization as string) || ''
    if (!auth) throw (fastify as any).httpErrors.unauthorized('Missing authorization')
    const parts = auth.split(' ')
    if (parts.length !== 2) throw (fastify as any).httpErrors.unauthorized('Bad authorization header')
    const token = parts[1]
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change-this-in-env') as any
      request.user = decoded
      return decoded
    } catch (err) {
      throw (fastify as any).httpErrors.unauthorized('Invalid token')
    }
  }

  fastify.get("/me", { preHandler: verifyAuth }, async (request, reply) => {
    const userId = (request.user as any).sub;
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true, createdAt: true } });
    if (!user) return reply.status(404).send({ message: "User not found" });
    return reply.send(user);
  });

  fastify.patch("/me", { preHandler: verifyAuth }, async (request, reply) => {
    const userId = (request.user as any).sub;
    const body = updateMeSchema.parse(request.body);

    if (body.email) {
      const other = await prisma.user.findUnique({ where: { email: body.email } });
      if (other && other.id !== userId) return reply.status(409).send({ message: "Email already in use" });
    }

    const updated = await prisma.user.update({ where: { id: userId }, data: { ...body } });
    const { password: _p, ...safe } = updated as any;
    return reply.send(safe);
  });
}
