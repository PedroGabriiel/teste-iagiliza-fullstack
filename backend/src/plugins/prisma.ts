import { PrismaClient } from "../../generated/prisma";

// Single Prisma client instance used across the app
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

// Lightweight timing middleware for queries (optional)
prisma.$use(async (params: any, next: any) => {
  const start = Date.now();
  const result = await next(params);
  const duration = Date.now() - start;
  // keep to console.log for dev visibility
  console.log(`Prisma ${params.model}.${params.action} took ${duration}ms`);
  return result;
});

export default prisma;

export const prismaPlugin = async (fastify: any, options: any) => {
  fastify.decorate("prisma", prisma);
  fastify.addHook("onClose", async (instance: any) => {
    await instance.prisma.$disconnect();
  });
};

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }

  interface FastifyRequest {
    prisma: PrismaClient;
  }
}