// scripts/generateTagFrequency.mjs
import fs from 'fs';
import path from 'path';

// Load games.json
const gamesPath = path.resolve('./src/data/games.json');
const raw = fs.readFileSync(gamesPath, 'utf-8');
const games = JSON.parse(raw);

// Count tag frequencies
const tagCounts = {};

games.forEach(game => {
  const tags = game.Tags?.split(',').map(t => t.trim().toLowerCase()) || [];
  tags.forEach(tag => {
    if (tag) tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  });
});

// Sort tags by frequency
const sorted = Object.entries(tagCounts)
  .sort((a, b) => b[1] - a[1])
  .reduce((acc, [tag, count]) => {
    acc[tag] = count;
    return acc;
  }, {});

// Write output to JSON
const outPath = path.resolve('./src/data/tagFrequency.json');
fs.writeFileSync(outPath, JSON.stringify(sorted, null, 2), 'utf-8');

console.log(`✅ Tag frequency saved to ${outPath}`);
