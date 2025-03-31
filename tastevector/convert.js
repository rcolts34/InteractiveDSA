import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import xlsx from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use the default import (CommonJS-style)
const { readFile, utils } = xlsx;

// Load Excel file
const workbook = readFile("GameDatabase.xlsm");
const sheet = workbook.Sheets["Games"];
const games = utils.sheet_to_json(sheet);

// Output directory
const outputDir = path.join(__dirname, "output_games");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Save each game as a separate JSON file
games.forEach((game, index) => {
  const fileName = `${game.Title || "game_" + index}.json`
    .replace(/[<>:"/\\|?*]+/g, "") // sanitize
    .replace(/\s+/g, "_")
    .toLowerCase();

  const filePath = path.join(outputDir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(game, null, 2));
});

console.log(`✅ Converted ${games.length} games to individual JSON files.`);

const combinedPath = path.join(__dirname, "games.json");
fs.writeFileSync(combinedPath, JSON.stringify(games, null, 2));

console.log(`✅ Master file written to: ${combinedPath}`);