import 'fastify'

declare module 'fastify' {
  // Extend FastifyRequest with our runtime-added properties
  interface FastifyRequest {
    // populated after verifying the JWT (holds the decoded token payload)
    user?: any
    // optional helper (kept for compatibility with earlier code)
    jwtVerify?: () => Promise<any>
  }
}
