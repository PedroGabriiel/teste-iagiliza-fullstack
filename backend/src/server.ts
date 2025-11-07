import "dotenv/config";
import Fastify from "fastify";
import jwtPlugin from "./plugins/jwt";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import messagesRoutes from "./routes/messages";
import { handleError } from "./utils/errors";

const fastify = Fastify({ logger: true });


fastify.register(jwtPlugin);

// Registra rotas da aplicação
fastify.register(authRoutes, { prefix: "/" });
fastify.register(userRoutes, { prefix: "/" });
fastify.register(messagesRoutes, { prefix: "/" });


fastify.setErrorHandler(handleError as any);

// Hook executado no início de cada requisição: aplica CORS e registra informações
fastify.addHook("onRequest", async (request, reply) => {
  const origin = request.headers.origin || '*'
  reply.header('Access-Control-Allow-Origin', origin === 'null' ? '*' : origin)
  reply.header('Access-Control-Allow-Credentials', 'true')
  reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  reply.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')

  if (request.method === 'OPTIONS') {
    reply.code(204).send()
    return
  }

  fastify.log.info({ method: request.method, url: request.url }, "incoming request");
});

// Rota de verificação simples
fastify.get("/", async (request, reply) => {
  return reply.send({ message: "IA Chat backend running" });
});

// Ao ficar pronto, imprime as rotas registradas
;(async () => {
  try {
    await fastify.ready();
    fastify.log.info('\n' + fastify.printRoutes());
  } catch (err: any) {
    fastify.log.error(err);
  }
})();

const port = Number(process.env.PORT || 3333);

const start = async () => {
  try {
    await fastify.listen({ port, host: "0.0.0.0" });
    fastify.log.info(`Server listening on ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
