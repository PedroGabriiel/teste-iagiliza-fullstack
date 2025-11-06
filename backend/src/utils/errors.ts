import { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";

export function handleError(err: any, request: FastifyRequest, reply: FastifyReply) {
  if (err instanceof ZodError) {
    return reply.status(400).send({ message: "Validation error", details: err.flatten() });
  }

  // Prisma unique constraint error code P2002
  if (err?.code === "P2002") {
    return reply.status(409).send({ message: "Resource already exists", meta: err.meta });
  }

  // Default
  console.error(err);
  return reply.status(err.statusCode || 500).send({ message: err.message || "Internal server error" });
}
