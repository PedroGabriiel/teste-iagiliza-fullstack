import { FastifyInstance } from "fastify";
import prisma from "../plugins/prisma";
import { updateMeSchema } from "../schemas/auth";

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.get("/me", { preHandler: async (request, reply) => await request.jwtVerify() }, async (request, reply) => {
    const userId = (request.user as any).sub;
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true, createdAt: true } });
    if (!user) return reply.status(404).send({ message: "User not found" });
    return reply.send(user);
  });

  fastify.patch("/me", { preHandler: async (request, reply) => await request.jwtVerify() }, async (request, reply) => {
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
