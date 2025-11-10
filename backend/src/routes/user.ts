import { FastifyInstance } from "fastify";
import prisma from "../plugins/prisma";
import { updateMeSchema } from "../schemas/auth";
import authPreHandler from "../plugins/auth";

// Rotas para o perfil do usuário autenticado
//  GET /me: retorna dados públicos do usuário (sem senha)
//  PATCH /me: atualiza campos permitidos (nome, email)


export default async function userRoutes(fastify: FastifyInstance) {
  // Usa o decorator `request.jwtVerify()` (adicionado pelo plugin jwt)
  // que valida o token Bearer e popula `request.user` com o payload decodificado.

  // Retorna informações públicas do usuário (sem senha)
  fastify.get("/me", { preHandler: authPreHandler }, async (request, reply) => {
    const userId = (request.user as any).sub;
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true, createdAt: true } });
    if (!user) return reply.status(404).send({ message: "User not found" });
    return reply.send(user);
  });

  // Atualiza campos permitidos do perfil. Verifica conflito de email antes de atualizar.
  fastify.patch("/me", { preHandler: authPreHandler }, async (request, reply) => {
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
