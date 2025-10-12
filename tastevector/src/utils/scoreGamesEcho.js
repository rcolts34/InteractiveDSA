export function scoreGamesEcho(games, fingerprint) {
  const fingerprintTotal = Object.values(fingerprint || {}).reduce(
    (sum, value) => sum + value,
    0,
  );

  return games.map((game) => {
    const tagVector = game.tagVector || {};
    let overlapWeight = 0;
    let rareTagBoost = 0;

    Object.entries(tagVector).forEach(([tag, weight]) => {
      const userWeight = fingerprint?.[tag];
      if (!userWeight) return;
      overlapWeight += Math.min(weight, userWeight);
      rareTagBoost += userWeight;
    });

    const coverage = fingerprintTotal
      ? overlapWeight / fingerprintTotal
      : 0;

    const diversity = Object.keys(tagVector).length;
    const balance = diversity ? rareTagBoost / (diversity * (fingerprintTotal || 1)) : 0;

    const echoScore = coverage * 0.7 + balance * 0.3;

    return {
      ...game,
      echoScore,
    };
  });
}
