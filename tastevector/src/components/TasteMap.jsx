import { useState } from "react";

// Normalize a value to a range
const scale = (value, min, max, outMin, outMax) =>
  ((value - min) / Math.max(1e-5, max - min)) * (outMax - outMin) + outMin;

// Convert metric to color (blue → green)
const getColor = (value, min, max) => {
  const norm = (value - min) / Math.max(1e-5, max - min);
  const r = Math.floor(50 * (1 - norm));
  const g = Math.floor(255 * norm);
  const b = Math.floor(255 * (1 - norm));
  return `rgb(${r},${g},${b})`;
};

export default function TasteMap({ games, activeSortKey = "matchScore", favorites = [] }) {
  const [selectedGame, setSelectedGame] = useState(null);
  const [colorEnabled, setColorEnabled] = useState(true);

  const favoriteIDs = new Set(favorites.map(g => g["ID#"]));

  const scores = games.map((g) => g.matchScore ?? 0);
  const distances = games.map((g) => g.fingerprintDistance ?? 0);
  const colorValues = games.map((g) => g[activeSortKey] ?? 0);

  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const minDist = Math.min(...distances);
  const maxDist = Math.max(...distances);
  const minColor = Math.min(...colorValues);
  const maxColor = Math.max(...colorValues);

  return (
    <div className="my-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold text-lime-400">🧬 Cartesian Taste Map</h2>
        <label className="flex items-center gap-2 text-sm text-white">
          <input
            type="checkbox"
            checked={colorEnabled}
            onChange={() => setColorEnabled(!colorEnabled)}
          />
          🎨 Enable Color Scaling
        </label>
      </div>

      <svg viewBox="100 0 700 500" className="w-full h-[800px] bg-zinc-800 rounded shadow">
        {games.map((g, i) => {
          const x = scale(g.matchScore ?? 0, minScore, maxScore, 50, 800);
          const y = scale(g.fingerprintDistance ?? 0, minDist, maxDist, 400, 100); // Inverted Y

          const isFavorite = favoriteIDs.has(g["ID#"]);
          const value = g[activeSortKey] ?? 0;
          const fillColor = colorEnabled ? getColor(value, minColor, maxColor) : "#aaa";

          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={isFavorite ? 7 : 4}
              fill={fillColor}
              stroke={isFavorite ? "gold" : "black"}
              strokeWidth={isFavorite ? 2 : 0.5}
              onClick={() => setSelectedGame(g)}
              style={isFavorite ? { filter: "drop-shadow(0 0 6px gold)" } : {}}
            >
              <title>{g.Title} ({Object.keys(g.tagVector || {}).length} tags)</title>
            </circle>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-2 text-sm text-white mt-4 ml-1">
        <div className="w-48 h-4 bg-gradient-to-r from-blue-500 to-green-500 rounded"></div>
        <div className="flex justify-between w-48 text-xs text-gray-400">
          <span>Low Match</span>
          <span>High Match</span>
        </div>
      </div>

      {/* Selected Game Info */}
      {selectedGame && (
        <div className="mt-4 p-4 bg-zinc-700 rounded shadow">
          <h3 className="text-lg font-bold text-white mb-1">{selectedGame.Title}</h3>
          <p className="text-sm text-gray-300 mb-1">
            🎯 Match Score: {selectedGame.matchScore?.toFixed(2)} |
            🔄 Echo: {selectedGame.echoScore?.toFixed(2)} |
            🧠 Cosine: {selectedGame.similarity?.toFixed(3)} |
            📏 Distance: {selectedGame.distance?.toFixed(2)}
          </p>
          <p className="text-sm text-gray-400">
            Tags: {Object.keys(selectedGame.tagVector || {}).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
