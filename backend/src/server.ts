import "dotenv/config";
import Fastify from "fastify";
import jwtPlugin from "./plugins/jwt";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import messagesRoutes from "./routes/messages";
import { handleError } from "./utils/errors";

const fastify = Fastify({ logger: true });

// registra os plugins
// habilita CORS para permitir chamadas do frontend (Vite) em http://localhost:5173
// Registra plugins
fastify.register(jwtPlugin);

// registra as rotas
fastify.register(authRoutes, { prefix: "/" });
fastify.register(userRoutes, { prefix: "/" });
fastify.register(messagesRoutes, { prefix: "/" });

// defini um manipulador de erros global
fastify.setErrorHandler(handleError as any);

// loga todas as requisições recebidas (ajuda no debug)
fastify.addHook("onRequest", async (request, reply) => {
  // Habilita CORS para requests vindas do frontend de desenvolvimento
  const origin = request.headers.origin || '*'
  // Permitir origem específica ou todas para desenvolvimento
  reply.header('Access-Control-Allow-Origin', origin === 'null' ? '*' : origin)
  reply.header('Access-Control-Allow-Credentials', 'true')
  reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  reply.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')

  // Se for preflight (OPTIONS), responda imediatamente
  if (request.method === 'OPTIONS') {
    reply.code(204).send()
    return
  }

  fastify.log.info({ method: request.method, url: request.url }, "incoming request");
});

// rota raiz simples para sanity check
fastify.get("/", async (request, reply) => {
  return reply.send({ message: "IA Chat backend running" });
});

// imprime todas as rotas registradas ao ficar pronto (ajuda a ver o que está disponível)
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
