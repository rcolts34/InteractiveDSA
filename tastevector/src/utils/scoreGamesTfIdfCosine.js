import { cosineSimilarity } from './cosineSimilarity';

export function scoreGamesTfIdfCosine(games, fingerprint) {
  const scored = games.map((game) => {
    const similarity = cosineSimilarity(fingerprint, game.tfidfVector || {});
    return { ...game, tfidfSimilarity: similarity };
  });
  scored.sort((a, b) => b.tfidfSimilarity - a.tfidfSimilarity);
  return scored;
}
