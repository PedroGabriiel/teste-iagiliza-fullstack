import { PrismaClient } from '../../generated/prisma';

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