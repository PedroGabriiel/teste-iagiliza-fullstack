import { PrismaClient } from '../../generated/prisma';

// Cria uma única instância do Prisma Client
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Exporta a instância do Prisma
export default prisma;

// Opcional: Plugin para Fastify
export const prismaPlugin = async (fastify: any, options: any) => {
  // Adiciona prisma ao contexto do Fastify
  fastify.decorate('prisma', prisma);
  
  // Fecha a conexão quando o servidor parar
  fastify.addHook('onClose', async (instance: any) => {
    await instance.prisma.$disconnect();
  });
};

// Tipagem para o TypeScript
declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
  
  interface FastifyRequest {
    prisma: PrismaClient;
  }
}