import { cosineSimilarity } from './cosineSimilarity';

export function scoreGamesCosine(games, fingerprint) {
  const scoredGames = [];

  games.forEach((game) => {
    const tags = game.Tags?.split(",").map(t => t.trim().toLowerCase()) || [];

    // Turn game tags into a vector with 1s
    const gameVector = {};
    tags.forEach(tag => {
      if (!tag) return;
      gameVector[tag] = 1;
    });

    const similarity = cosineSimilarity(fingerprint, gameVector);
    scoredGames.push({ ...game, similarity });
  });

  // Sort games by cosine similarity
  scoredGames.sort((a, b) => b.similarity - a.similarity);

  return scoredGames;
}
