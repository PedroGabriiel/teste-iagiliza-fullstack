import { FastifyInstance } from "fastify";
import prisma from "../plugins/prisma";
import { createMessageSchema } from "../schemas/message";
import { generateAiResponse } from "../services/ai";

export default async function messagesRoutes(fastify: FastifyInstance) {
  fastify.get("/messages", { preHandler: async (request, reply) => await request.jwtVerify() }, async (request, reply) => {
    const userId = (request.user as any).sub;
    const messages = await prisma.message.findMany({ where: { userId }, orderBy: { createdAt: "asc" } });
    return reply.send(messages);
  });

  fastify.post("/message", { preHandler: async (request, reply) => await request.jwtVerify() }, async (request, reply) => {
    const userId = (request.user as any).sub;
    const body = createMessageSchema.parse(request.body);

    const userMessage = await prisma.message.create({ data: { content: body.content, role: "user", userId } });

    const aiContent = generateAiResponse(body.content);
    const aiMessage = await prisma.message.create({ data: { content: aiContent, role: "ai", userId } });

    return reply.status(201).send({ message: userMessage, aiResponse: aiMessage });
  });
}
