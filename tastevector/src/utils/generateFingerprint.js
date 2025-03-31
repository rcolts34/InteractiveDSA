import suppressionMap from '../data/suppressionMap.json';

export function generateFingerprint(favorites) {
  const tagCounts = {};

  favorites.forEach(game => {
    if (!game.tagVector) return;

    for (const tag in game.tagVector) {
      const suppression = suppressionMap[tag] ?? 1;
      const value = game.tagVector[tag] * suppression;
      tagCounts[tag] = (tagCounts[tag] || 0) + value;
    }
  });

  return tagCounts;
}
