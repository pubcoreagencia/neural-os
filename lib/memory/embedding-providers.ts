import { DeterministicEmbeddingProvider } from "./embeddings";

export interface EmbeddingProvider {
  embed(text: string): Promise<number[]>;
}

export type EmbeddingProviderStatus =
  | "DEVELOPMENT / TEST"
  | "REAL EMBEDDING PROVIDER NOT CONFIGURED"
  | "REAL EMBEDDING PROVIDER CONFIGURED";

export interface EmbeddingProviderSelection {
  provider: EmbeddingProvider;
  status: EmbeddingProviderStatus;
}

export function createEmbeddingProviderSelection(): EmbeddingProviderSelection {
  const configured = process.env.PUB_EMBEDDING_PROVIDER;

  if (configured && configured !== "deterministic") {
    return {
      provider: new DeterministicEmbeddingProvider(),
      status: "REAL EMBEDDING PROVIDER NOT CONFIGURED"
    };
  }

  return {
    provider: new DeterministicEmbeddingProvider(),
    status: "DEVELOPMENT / TEST"
  };
}

