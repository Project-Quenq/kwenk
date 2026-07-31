import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { sqlite } from "../server/db/client.js";
import { createGame } from "../server/db/arcade.js";
import { env } from "../server/env.js";

type ImportGame = {
  name: string;
  url: string;
  thumbnail: string;
  genre: string[];
  description: string;
  width: number;
  height: number;
};

export function runArcadeImport() {
  const targetPath = process.argv[2] || process.env.KWENK_GAMES_JSON_PATH;

  if (!targetPath) {
    console.error("Error: Missing path to games JSON catalog file.");
    console.error("\nUsage via pnpm:");
    console.error("  pnpm db:import-arcade <path-to-games-db.json>");
    console.error("\nUsage via Env Variable:");
    console.error("  Set KWENK_GAMES_JSON_PATH=./data/games-db.json in your .env file");
    process.exit(1);
  }

  const resolvedPath = resolve(targetPath);

  if (!existsSync(resolvedPath)) {
    console.error(`Critical Error: Could not locate file at path: "${resolvedPath}"`);
    process.exit(1);
  }

  console.log(` Reading games catalog from: "${resolvedPath}"`);

  try {
    const rawData = readFileSync(resolvedPath, "utf8");
    const games = JSON.parse(rawData) as ImportGame[];

    if (!Array.isArray(games)) {
      throw new Error("Invalid schema inside JSON. Expected an array of game entries.");
    }

    console.log(` Ingesting ${games.length} games into the SQLite database...`);

    let importedCount = 0;
    const transact = sqlite.transaction(() => {
      for (const game of games) {
        createGame(
          game.name,
          game.url,
          game.thumbnail,
          game.description,
          game.genre,
          game.width,
          game.height
        );
        importedCount++;
      }
    });

    transact();
    console.log(` Successfully imported/updated ${importedCount} games inside ${env.databasePath}.`);
  } catch (error) {
    console.error("Error while running the database migration script:", error);
    process.exit(1);
  }
}

runArcadeImport();