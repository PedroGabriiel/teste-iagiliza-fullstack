import { FastifyInstance } from "fastify";
import prisma from "../plugins/prisma";
import { createMessageSchema } from "../schemas/message";
import { generateAiResponse } from "../services/ai";
import authPreHandler from "../plugins/auth";

// Rotas relacionadas a mensagens do usuário
//  GET /messages: retorna todas as mensagens do usuário autenticado
//  POST /message: cria a mensagem do usuário e gera uma resposta da IA simulada


export default async function messagesRoutes(fastify: FastifyInstance) {
  // Usa o decorator `request.jwtVerify()` (adicionado pelo plugin jwt)
  // Ex.: preHandler: async (request) => await request.jwtVerify?.()

  // Lista mensagens do usuário (ordenadas por data)
  fastify.get("/messages", { preHandler: authPreHandler }, async (request, reply) => {
    const userId = (request.user as any).sub;
    const messages = await prisma.message.findMany({ where: { userId }, orderBy: { createdAt: "asc" } });
    return reply.send(messages);
  });

  // Cria uma mensagem do usuário e grava também a resposta gerada pela IA simulada
  fastify.post("/message", { preHandler: authPreHandler }, async (request, reply) => {
    const userId = (request.user as any).sub;
    const body = createMessageSchema.parse(request.body);

    const userMessage = await prisma.message.create({ data: { content: body.content, role: "user", userId } });

  const aiContent = await generateAiResponse(body.content);
  const aiMessage = await prisma.message.create({ data: { content: aiContent, role: "ai", userId } });

    return reply.status(201).send({ message: userMessage, aiResponse: aiMessage });
  });
}
