const replies = [
  "Interessante! Conte mais.",
  "Não tenho certeza, mas parece legal!",
  "Hmm, e se tentássemos outra abordagem?",
  "Entendi parcialmente. Você pode explicar melhor?",
];

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Gera uma resposta de IA simulada com pequeno delay (assíncrono)
export async function generateAiResponse(_input: string) {
  // Simula pensamento/processamento: delay aleatório entre 400ms e 1200ms
  const delay = 400 + Math.floor(Math.random() * 800);
  await sleep(delay);

  // Retorna uma resposta aleatória simples
  const idx = Math.floor(Math.random() * replies.length);
  return replies[idx];
}
