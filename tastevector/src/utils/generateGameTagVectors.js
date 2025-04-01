
export function generateGameTagVectors(games, fingerprint) {
  return games.map(game => {
    const tags = game.Tags?.split(',').map(t => t.trim().toLowerCase()) || [];

    const tagVector = {};
    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i];
      const baseWeight = Math.max(5 - Math.floor(i / 2), 1); // Positional decay
      tagVector[tag] = (tagVector[tag] || 0) + baseWeight
    }

    return {
      ...game,
      tagVector
    };
  });
}
