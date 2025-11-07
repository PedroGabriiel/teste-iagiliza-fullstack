import { FastifyInstance } from "fastify";
import prisma from "../plugins/prisma";
import { createMessageSchema } from "../schemas/message";
import { generateAiResponse } from "../services/ai";
import jwt from 'jsonwebtoken'

export default async function messagesRoutes(fastify: FastifyInstance) {
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

  fastify.get("/messages", { preHandler: verifyAuth }, async (request, reply) => {
    const userId = (request.user as any).sub;
    const messages = await prisma.message.findMany({ where: { userId }, orderBy: { createdAt: "asc" } });
    return reply.send(messages);
  });

  fastify.post("/message", { preHandler: verifyAuth }, async (request, reply) => {
    const userId = (request.user as any).sub;
    const body = createMessageSchema.parse(request.body);

    const userMessage = await prisma.message.create({ data: { content: body.content, role: "user", userId } });

    const aiContent = generateAiResponse(body.content);
    const aiMessage = await prisma.message.create({ data: { content: aiContent, role: "ai", userId } });

    return reply.status(201).send({ message: userMessage, aiResponse: aiMessage });
  });
}
