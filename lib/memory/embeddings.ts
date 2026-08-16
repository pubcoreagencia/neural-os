export interface EmbeddingProvider {
  embed(text: string): Promise<number[]>;
}

const VECTOR_SIZE = 48;

function normalize(vector: number[]) {
  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  if (!magnitude) return vector;
  return vector.map((value) => value / magnitude);
}

function hashWord(word: string) {
  let hash = 2166136261;
  for (const char of word) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

export class DeterministicEmbeddingProvider implements EmbeddingProvider {
  async embed(text: string): Promise<number[]> {
    const vector = Array.from({ length: VECTOR_SIZE }, () => 0);
    const words = text.toLowerCase().match(/[a-z0-9À-ÿ]+/g) ?? [];

    for (const word of words) {
      const hash = hashWord(word);
      vector[hash % VECTOR_SIZE] += 1;
      vector[(hash >> 3) % VECTOR_SIZE] += 0.5;
    }

    return normalize(vector);
  }
}

