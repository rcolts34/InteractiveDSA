// utils/scoreGamesDotProduct.js
export function scoreGamesDotProduct(games, fingerprint = {}) {
  const tags = Object.keys(fingerprint);

  return games.map((game) => {
    let dot = 0;

    for (const tag of tags) {
      const a = fingerprint[tag];
      const b = game.tagVector?.[tag] || 0;
      dot += a * b;
    }

    return {
      ...game,
      matchScore: dot,
    };
  });
}
