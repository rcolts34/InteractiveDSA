import { useState } from 'react';

export default function GameSelector({ games, onSelect }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);

  const handleToggle = (game) => {
    let updated;
    if (selected.some(g => g.Title === game.Title)) {
      updated = selected.filter(g => g.Title !== game.Title);
    } else {
      updated = [...selected, game];
    }

    setSelected(updated);
    onSelect(updated); // pass to parent
  };

  const filtered = games.filter(g =>
    g.Title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-zinc-800 p-4 rounded-lg mb-6">
      <h2 className="text-xl font-semibold mb-2">🎮 Select Favorite Games</h2>
      <input
        type="text"
        placeholder="Search games..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full p-2 mb-4 rounded bg-zinc-700 text-white"
      />

      <div className="max-h-60 overflow-y-auto">
        {filtered.map((game, index) => (
          <div
            key={index}
            onClick={() => handleToggle(game)}
            className={`cursor-pointer px-2 py-1 rounded mb-1 ${
              selected.some(g => g.Title === game.Title)
                ? 'bg-purple-500 text-white'
                : 'bg-zinc-700 hover:bg-zinc-600'
            }`}
          >
            {game.Title}
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm text-zinc-300">
        Selected: {selected.length} / 5
      </p>
    </div>
  );
}
