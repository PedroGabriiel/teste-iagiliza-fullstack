import 'fastify'

declare module 'fastify' {
  // Extensão de tipos para propriedades adicionadas em tempo de execução
  interface FastifyRequest {
    // Conteúdo do token JWT decodificado 
    user?: any
    // Assinatura para compatibilidade com código que chamava jwtVerify
    jwtVerify?: () => Promise<any>
  }
}
