import { z } from "zod";

// Validação para criação de mensagem pelo usuário
export const createMessageSchema = z.object({
  content: z.string().min(1, "Conteúdo da mensagem é obrigatório"),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;
