export function scoreGamesDistanceFromFingerprint(games, fingerprint) {
  return games.map((game) => {
    const gameVector = game.tfidfVector || {};
    const allTags = new Set([
      ...Object.keys(fingerprint || {}),
      ...Object.keys(gameVector),
    ]);

    let distance = 0;
    allTags.forEach((tag) => {
      const userValue = fingerprint?.[tag] || 0;
      const gameValue = gameVector[tag] || 0;
      distance += Math.abs(userValue - gameValue);
    });

    const normalizedDistance = distance / Math.max(1, allTags.size);

    return {
      ...game,
      fingerprintDistance: normalizedDistance,
    };
  });
}
    