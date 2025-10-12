import { euclideanDistance } from './euclideanDistance';

export function scoreGamesEuclidean(games, fingerprint) {
  return games.map((game) => {
    const vector = game.tfidfVector || {};
    const distance = euclideanDistance(fingerprint, vector);
    return { ...game, distance };
  });
}
