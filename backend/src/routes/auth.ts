import { FastifyInstance } from "fastify";
import prisma from "../plugins/prisma";
import { registerSchema, loginSchema } from "../schemas/auth";
import { hashPassword, comparePassword } from "../services/auth";
import jwt from 'jsonwebtoken'

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/register", async (request, reply) => {
    const body = registerSchema.parse(request.body);

    const exists = await prisma.user.findUnique({ where: { email: body.email } });
    if (exists) return reply.status(409).send({ message: "Email already in use" });

    const password = await hashPassword(body.password);
    const user = await prisma.user.create({ data: { name: body.name, email: body.email, password } });

    const { password: _p, ...safe } = user as any;
    return reply.status(201).send(safe);
  });

  fastify.post("/login", async (request, reply) => {
    const body = loginSchema.parse(request.body);

    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) return reply.status(401).send({ message: "Invalid credentials" });

    const ok = await comparePassword(body.password, user.password);
    if (!ok) return reply.status(401).send({ message: "Invalid credentials" });

    const secret = process.env.JWT_SECRET || 'change-this-in-env'
    const token = jwt.sign({ sub: user.id }, secret, { expiresIn: '7d' })

    return reply.send({ token, user: { id: user.id, name: user.name, email: user.email } });
  });
}
