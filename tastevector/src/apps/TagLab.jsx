import { useState } from 'react';
import games from '../data/games.json';
import { analyzeTagFrequency } from '../utils/analyzeTagFrequency';

function TagLab() {
  const [showStats, setShowStats] = useState(false);
  const { sorted } = analyzeTagFrequency(games);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold text-cyan-400 mb-4">🧪 TagLab</h1>

      <button
        onClick={() => setShowStats(!showStats)}
        className="mb-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded"
      >
        {showStats ? "Hide Tag Stats" : "Show Tag Stats"}
      </button>

      {showStats && (
        <div className="max-h-[500px] overflow-y-auto text-sm bg-zinc-800 p-4 rounded">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="text-left p-2">Tag</th>
                <th className="text-right p-2">Frequency</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(([tag, count]) => (
                <tr key={tag}>
                  <td className="p-2">{tag}</td>
                  <td className="p-2 text-right">{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TagLab;
