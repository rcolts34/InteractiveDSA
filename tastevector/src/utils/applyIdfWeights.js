import allGames from '../data/games.json';
import tagFrequency from '../data/tagFrequency.json';

const totalGames = allGames.length;

export function applyIdfWeights(games) {
  return games.map((game) => {
    const tfidfVector = {};
    for (const [tag, tf] of Object.entries(game.tagVector || {})) {
      const idf = Math.log((totalGames + 1) / ((tagFrequency[tag] || 0) + 1)) + 1;
      tfidfVector[tag] = tf * idf;
    }
    return { ...game, tfidfVector };
  });
}
