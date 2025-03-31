export function scoreGamesEcho(games, fingerprint) {
  return games.map(game => {
    let echoScore = 0;

    for (const tag in fingerprint) {
      if (game.tagVector?.[tag] > 0) {
        echoScore += fingerprint[tag];
      }
    }

    return {
      ...game,
      echoScore
    };
  });
}
