import { FastifyInstance } from "fastify";
import prisma from "../plugins/prisma";
import { registerSchema, loginSchema } from "../schemas/auth";
import { hashPassword, comparePassword } from "../services/auth";
import jwt from 'jsonwebtoken'

// Rotas de autenticação: registro e login
//  POST /register: cria um novo usuário (valida com Zod, checa email único, salva senha hasheada)
//  POST /login: valida credenciais e retorna um token JWT + dados públicos do usuário


export default async function authRoutes(fastify: FastifyInstance) {
  // Registra um novo usuário
  fastify.post("/register", async (request, reply) => {
    const body = registerSchema.parse(request.body);

    // evita cadastro com email duplicado
    const exists = await prisma.user.findUnique({ where: { email: body.email } });
    if (exists) return reply.status(409).send({ message: "Email already in use" });

    // armazena senha como hash
    const password = await hashPassword(body.password);
    const user = await prisma.user.create({ data: { name: body.name, email: body.email, password } });

    // remove campo sensível antes de retornar
    const { password: _p, ...safe } = user as any;
    return reply.status(201).send(safe);
  });

  // Autentica usuário e retorna token JWT
  fastify.post("/login", async (request, reply) => {
    const body = loginSchema.parse(request.body);

    // busca usuário por email
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) return reply.status(401).send({ message: "Invalid credentials" });

    // compara hash da senha
    const ok = await comparePassword(body.password, user.password);
    if (!ok) return reply.status(401).send({ message: "Invalid credentials" });

    // gera token JWT com id do usuário no payload
    const secret = process.env.JWT_SECRET || 'change-this-in-env'
    const token = jwt.sign({ sub: user.id }, secret, { expiresIn: '7d' })

    return reply.send({ token, user: { id: user.id, name: user.name, email: user.email } });
  });
}
