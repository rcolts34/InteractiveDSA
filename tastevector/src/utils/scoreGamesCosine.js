import { cosineSimilarity } from './cosineSimilarity';

export function scoreGamesCosine(games, fingerprint) {
  return games.map((game) => {
    const gameVector = game.tagVector || {};
    const similarity = cosineSimilarity(fingerprint, gameVector);
    return { ...game, similarity };
  });
}
