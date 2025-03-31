import { useState } from 'react';
import games from "../data/games.json";

import { generateFingerprint } from '../utils/generateFingerprint';
import { generateGameTagVectors } from '../utils/generateGameTagVectors';

import { scoreGamesCosine } from '../utils/scoreGamesCosine';
import { scoreGamesDistanceFromFingerprint } from '../utils/scoreGamesDistanceFromFingerprint';
import { scoreGamesDotProduct } from '../utils/scoreGamesDotProduct';
import { scoreGamesEcho } from '../utils/scoreGamesEcho';
import { scoreGamesEuclidean } from '../utils/scoreGamesEuclidean';

import GameSelector from '../components/GameSelector';

function App() {
  const [fingerprint, setFingerprint] = useState({});
  const [selectedGames, setSelectedGames] = useState([]);
  const [scoredGames, setScoredGames] = useState([]);
  const [sortKey, setSortKey] = useState("matchScore");

  const [showGameSelector, setShowGameSelector] = useState(false);
  const [showFingerprint, setShowFingerprint] = useState(false);
  const [showGameVectors, setShowGameVectors] = useState(false);

  const handleGameSelection = (favorites) => {
    if (favorites.length < 5) {
      setSelectedGames(favorites);
      setFingerprint({});
      setScoredGames([]);
      return;
    }

    const rawFingerprint = generateFingerprint(favorites);[[]]
    const enrichedFavorites = generateGameTagVectors(favorites, rawFingerprint);
    setSelectedGames(enrichedFavorites);

    const fp = generateFingerprint(enrichedFavorites);
    setFingerprint(fp);

    const favoriteTitles = new Set(enrichedFavorites.map(g => g.Title));
    const gamesToScore = games.filter(g => !favoriteTitles.has(g.Title));
    const gamesWithVectors = generateGameTagVectors(gamesToScore, rawFingerprint);

    // 🧠 Decoupled scoring pipeline
    let allScored = gamesWithVectors;
    allScored = scoreGamesDotProduct(allScored, fp);
    allScored = scoreGamesCosine(allScored, fp);
    allScored = scoreGamesEuclidean(allScored, fp);
    allScored = scoreGamesEcho(allScored, fp);
    allScored = scoreGamesDistanceFromFingerprint(allScored, fp);

    setScoredGames(allScored);
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <h1 className="text-4xl font-bold text-purple-400 mb-6">TasteVector</h1>

      {/* 🎛️ Toggle Game Selector */}
      <button
        onClick={() => setShowGameSelector(!showGameSelector)}
        className="mb-4 px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white"
      >
        {showGameSelector ? 'Hide Game Selector' : 'Select Favorite Games'}
      </button>

      {showGameSelector && <GameSelector games={games} onSelect={handleGameSelection} />}

      {/* 🧬 Fingerprint */}
      <div className="mb-6">
        <button
          onClick={() => setShowFingerprint(!showFingerprint)}
          className="text-left w-full text-purple-300 hover:text-purple-200 font-semibold mb-2"
        >
          {showFingerprint ? '🔽 Hide Fingerprint Vector' : '▶ Show Fingerprint Vector'}
        </button>
        {showFingerprint && (
          <pre className="bg-zinc-800 p-4 rounded-md text-sm max-h-64 overflow-y-auto">
            {JSON.stringify(fingerprint, null, 2)}
          </pre>
        )}
      </div>

      {/* 🎯 Selected Games with Tag Vectors */}
      <div className="mb-6">
        <button
          onClick={() => setShowGameVectors(!showGameVectors)}
          className="text-left w-full text-purple-300 hover:text-purple-200 font-semibold mb-2"
        >
          {showGameVectors ? '🔽 Hide Favorite Game Vectors' : '▶ Show Favorite Game Vectors'}
        </button>
        {showGameVectors && selectedGames.length > 0 && (
          <div className="space-y-4">
            {selectedGames.map((g, i) => (
              <div key={i} className="bg-zinc-800 p-3 rounded-md">
                <h3 className="font-semibold text-purple-300 mb-1">{g.Title}</h3>
                <pre className="bg-zinc-900 p-2 rounded text-sm overflow-x-auto max-h-48">
                  {JSON.stringify(g.tagVector, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 📊 Game Recommendation Scores */}
      {scoredGames.length > 0 && (
        <>
          <h2 className="text-2xl mb-2">📊 Top Matches</h2>

          {/* Sort Strategy Selector */}
          <div className="mb-4">
            <label className="mr-2">Sort by:</label>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="bg-zinc-800 text-white p-1 rounded"
            >
              <option value="matchScore">Dot Product</option>
              <option value="similarity">Cosine Similarity</option>
              <option value="distance">Euclidean Distance</option>
              <option value="echoScore">Echo Score</option>
              <option value="fingerprintDistance">FP Distance</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="table-auto text-sm w-full border border-zinc-700">
              <thead className="bg-zinc-800 text-purple-300">
                <tr>
                  <th className="p-2 text-left">Game</th>
                  <th className="p-2 text-right">Dot Product</th>
                  <th className="p-2 text-right">Cosine</th>
                  <th className="p-2 text-right">Euclidean</th>
                  <th className="p-2 text-right">Echo</th>
                  <th className="p-2 text-right">FP Distance</th>
                </tr>
              </thead>
              <tbody>
                {[...scoredGames]
                  .sort((a, b) => {
                    if (sortKey === "distance" || sortKey === "fingerprintDistance") {
                      return a[sortKey] - b[sortKey]; // ascending
                    }
                    return b[sortKey] - a[sortKey]; // descending
                  })
                  .slice(0, 500)
                  .map((g, i) => (
                    <tr key={i} className="odd:bg-zinc-800 even:bg-zinc-900">
                      <td className="p-2">{g.Title}</td>
                      <td className="p-2 text-right text-green-400">{g.matchScore}</td>
                      <td className="p-2 text-right text-cyan-300">{g.similarity.toFixed(3)}</td>
                      <td className="p-2 text-right text-rose-300">{g.distance.toFixed(3)}</td>
                      <td className="p-2 text-right text-yellow-400">{g.echoScore}</td>
                      <td className="p-2 text-right text-fuchsia-400">{g.fingerprintDistance.toFixed(3)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
