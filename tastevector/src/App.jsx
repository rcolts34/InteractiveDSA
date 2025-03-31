import { useState } from 'react';
import TagLab from './apps/TagLab';
import TasteVector from './apps/TasteVector';

function App() {
  const [view, setView] = useState("taste");

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Navigation Bar */}
      <div className="bg-zinc-800 p-4 flex gap-4 items-center shadow">
        <button
          onClick={() => setView("taste")}
          className={`px-4 py-2 rounded ${
            view === "taste" ? "bg-purple-600" : "bg-zinc-700"
          } hover:bg-purple-700`}
        >
          🎯 TasteVector
        </button>
        <button
          onClick={() => setView("tags")}
          className={`px-4 py-2 rounded ${
            view === "tags" ? "bg-cyan-600" : "bg-zinc-700"
          } hover:bg-cyan-700`}
        >
          🧪 TagLab
        </button>
      </div>

      {/* Render Selected App */}
      <div className="p-6">
        {view === "taste" && <TasteVector />}
        {view === "tags" && <TagLab />}
      </div>
    </div>
  );
}

export default App;
