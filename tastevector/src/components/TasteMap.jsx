import { useMemo, useState } from 'react';

function projectTo2D(games) {
  const tags = Object.keys(
    games.reduce((acc, g) => ({ ...acc, ...g.tagVector }), {})
  );

  const matrix = games.map((game) =>
    tags.map((tag) => game.tagVector?.[tag] ?? 0)
  );

  const mean = Array(tags.length).fill(0);
  matrix.forEach((vec) => {
    vec.forEach((val, i) => (mean[i] += val / matrix.length));
  });

  const centered = matrix.map((vec) =>
    vec.map((val, i) => val - mean[i])
  );

  const cov = centered[0].map((_, i) =>
    centered[0].map((_, j) =>
      centered.reduce((sum, row) => sum + row[i] * row[j], 0)
    )
  );

  const eigvec1 = cov.map((_, i) => 1);
  const eigvec2 = cov.map((_, i) => (i % 2 === 0 ? 1 : -1));

  const normalize = (v) => {
    const len = Math.sqrt(v.reduce((sum, x) => sum + x * x, 0));
    return v.map((x) => x / len);
  };

  const axis1 = normalize(eigvec1);
  const axis2 = normalize(eigvec2);

  const points = centered.map((vec, i) => {
    const x = vec.reduce((sum, v, j) => sum + v * axis1[j], 0);
    const y = vec.reduce((sum, v, j) => sum + v * axis2[j], 0);
    return {
      ...games[i],
      x,
      y,
    };
  });

  return points;
}

function scale(value, min, max, newMin, newMax) {
  if (max - min === 0) return (newMax + newMin) / 2;
  return ((value - min) / (max - min)) * (newMax - newMin) + newMin;
}

export default function TasteMap({ games, activeSortKey = "matchScore" }) {
  const [selectedGame, setSelectedGame] = useState(null);
  const [sortKey, setSortKey] = useState(activeSortKey);

  const projectedGames = useMemo(() => projectTo2D(games), [games]);

  const [minX, maxX] = useMemo(() => {
    const xs = projectedGames.map((g) => g.x);
    return [Math.min(...xs), Math.max(...xs)];
  }, [projectedGames]);

  const [minY, maxY] = useMemo(() => {
    const ys = projectedGames.map((g) => g.y);
    return [Math.min(...ys), Math.max(...ys)];
  }, [projectedGames]);

  const [minScore, maxScore] = useMemo(() => {
    const scores = games.map((g) => g[sortKey] ?? 0);
    return [Math.min(...scores), Math.max(...scores)];
  }, [games, sortKey]);

  const getColor = (score) => {
    const scaled = scale(score, minScore, maxScore, 0, 1);
    const hue = 120 * scaled;
    return `hsl(${hue}, 70%, 60%)`;
  };

  return (
    <div className="bg-zinc-900 p-4 rounded-md shadow mt-8 relative">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold text-cyan-300">🗺️ 2D Taste Map</h2>

        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="bg-zinc-800 text-white px-2 py-1 rounded"
        >
          <option value="matchScore">Dot Product</option>
          <option value="similarity">Cosine</option>
          <option value="echoScore">Echo</option>
          <option value="distance">Euclidean</option>
          <option value="fingerprintDistance">FP Distance</option>
        </select>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 text-xs mb-2">
        <span className="text-zinc-400">Low</span>
        <div className="flex-1 h-2 bg-gradient-to-r from-red-500 via-yellow-300 to-green-500 rounded" />
        <span className="text-zinc-400">High</span>
      </div>

      <svg viewBox="0 0 800 600" className="w-full h-[600px] bg-zinc-800 rounded shadow">
        {projectedGames.map((g, i) => {
          const x = scale(g.x, minX, maxX, 40, 760);
          const y = scale(g.y, minY, maxY, 40, 560);
          const score = g[sortKey] ?? 0;

          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={5}
              fill={getColor(score)}
              stroke="black"
              strokeWidth={0.5}
              onClick={() => setSelectedGame(g)}
            >
              <title>{g.Title} ({Object.keys(g.tagVector || {}).length} tags)</title>
            </circle>
          );
        })}
      </svg>

      {selectedGame && (
        <div className="absolute top-4 right-4 bg-zinc-800 border border-zinc-700 p-4 rounded-md w-80 shadow-md">
          <h3 className="text-lg text-purple-300 font-bold mb-2">{selectedGame.Title}</h3>
          <div className="text-sm space-y-1">
            <div><strong className="text-zinc-400">Dot:</strong> {selectedGame.matchScore}</div>
            <div><strong className="text-zinc-400">Cosine:</strong> {selectedGame.similarity?.toFixed(3)}</div>
            <div><strong className="text-zinc-400">Echo:</strong> {selectedGame.echoScore}</div>
            <div><strong className="text-zinc-400">Euclidean:</strong> {selectedGame.distance?.toFixed(3)}</div>
            <div><strong className="text-zinc-400">FP Distance:</strong> {selectedGame.fingerprintDistance?.toFixed(3)}</div>
            <div className="mt-2 text-zinc-300">
              <strong>Top Tags:</strong>
              <ul className="list-disc list-inside text-xs mt-1">
                {Object.entries(selectedGame.tagVector || {})
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 10)
                  .map(([tag, score]) => (
                    <li key={tag}>{tag} ({score})</li>
                  ))}
              </ul>
            </div>
            <button
              onClick={() => setSelectedGame(null)}
              className="mt-3 px-3 py-1 bg-zinc-700 rounded hover:bg-zinc-600 text-white text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
