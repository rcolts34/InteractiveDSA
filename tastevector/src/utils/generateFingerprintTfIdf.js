import suppressionMap from '../data/suppressionMap.json';

export function generateFingerprintTfIdf(favorites) {
  const fingerprint = {};
  favorites.forEach((game) => {
    if (!game.tfidfVector) return;
    for (const [tag, value] of Object.entries(game.tfidfVector)) {
      const suppression = suppressionMap[tag] ?? 1;
      fingerprint[tag] = (fingerprint[tag] || 0) + value * suppression;
    }
  });
  return fingerprint;
}
