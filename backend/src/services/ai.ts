const replies = [
  "Interessante! Conte mais.",
  "Não tenho certeza, mas parece legal!",
  "Hmm, e se tentássemos outra abordagem?",
  "Entendi parcialmente. Você pode explicar melhor?",
];

export function generateAiResponse(_input: string) {
  // Retorna uma resposta aleatória simples
  const idx = Math.floor(Math.random() * replies.length);
  return replies[idx];
}
