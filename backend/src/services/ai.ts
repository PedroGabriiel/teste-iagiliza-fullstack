const replies = [
  "Interessante! Conte mais.",
  "Não tenho certeza, mas parece legal!",
  "Hmm, e se tentássemos outra abordagem?",
  "Entendi parcialmente. Você pode explicar melhor?",
];

export function generateAiResponse(_input: string) {
  // For now return a random reply; can be improved later
  const idx = Math.floor(Math.random() * replies.length);
  return replies[idx];
}
