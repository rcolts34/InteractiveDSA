export function scoreGamesDistanceFromFingerprint(games, fingerprint) {
      const tags = Object.keys(fingerprint);
    
      return games.map(game => {
        let sumSquares = 0;
    
        for (const tag of tags) {
          const gameValue = game.tagVector?.[tag] || 0;
          const userValue = fingerprint[tag];
          sumSquares += (gameValue - userValue) ** 2;
        }
    
        const distance = Math.sqrt(sumSquares);
    
        return {
          ...game,
          fingerprintDistance: distance
        };
      }).sort((a, b) => a.fingerprintDistance - b.fingerprintDistance); // smaller = closer
    }
    