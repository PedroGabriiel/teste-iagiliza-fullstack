// Import the generated Prisma client directly from the project's generated output.
// The project previously used a custom generator output. Importing from the
// generated folder avoids the runtime error "@prisma/client did not initialize yet"
// when the generated client is not present under node_modules.
import { PrismaClient } from '../../generated/prisma';

// Usa o cliente gerado instalado via @prisma/client
const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

export default prisma;

// Plugin para expor prisma no contexto do Fastify
export const prismaPlugin = async (fastify: any, options: any) => {
  fastify.decorate('prisma', prisma);
  fastify.addHook('onClose', async (instance: any) => {
    await instance.prisma.$disconnect();
  });
};

// Declarações de tipo que adicionam prisma as instancias do Fastify
declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
  interface FastifyRequest {
    prisma: PrismaClient;
  }
}