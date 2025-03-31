import { euclideanDistance } from './euclideanDistance';

export function scoreGamesEuclidean(games, fingerprint) {
  const scoredGames = [];

  games.forEach((game) => {
    const tags = game.Tags?.split(",").map(t => t.trim().toLowerCase()) || [];

    // Convert game tags into a 1-hot vector
    const gameVector = {};
    tags.forEach(tag => {
      if (!tag) return;
      gameVector[tag] = 1;
    });

    const distance = euclideanDistance(fingerprint, gameVector);
    scoredGames.push({ ...game, distance });
  });

  // Sort by closest to furthest
  scoredGames.sort((a, b) => a.distance - b.distance);

  return scoredGames;
}
