import "dotenv/config";
import Fastify from "fastify";
import jwtPlugin from "./plugins/jwt";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import messagesRoutes from "./routes/messages";
import { handleError } from "./utils/errors";

const fastify = Fastify({ logger: true });

// registra os plugins
fastify.register(jwtPlugin);

// registra as rotas
fastify.register(authRoutes, { prefix: "/" });
fastify.register(userRoutes, { prefix: "/" });
fastify.register(messagesRoutes, { prefix: "/" });

// defini um manipulador de erros global
fastify.setErrorHandler(handleError as any);

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
