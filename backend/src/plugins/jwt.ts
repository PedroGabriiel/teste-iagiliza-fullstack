import Fastify from "fastify";
import fastifyJwt from "fastify-jwt";

export default async function jwtPlugin(fastify: ReturnType<typeof Fastify>) {
  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || "change-this-in-env",
  });
}
