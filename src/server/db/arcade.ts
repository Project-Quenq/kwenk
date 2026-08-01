import { sqlite } from "./client.js";
import { limits } from "../../policy.js";
import { commentsFor, addComment, deleteComment } from "./comments.js";
import type { CurrentUser } from "../../currentUser.js";
import type { GameItem, CommentItem } from "../../models.js";

type PagedGamesResult = {
  items: GameItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
};

let genresCache: string[] | null = null;

const gameColumns = (viewerId: number) => `g.id, g.name, g.url, g.thumbnail, g.description, g.genres_json AS genresJson, g.width, g.height,
  g.created_at AS createdAt, g.updated_at AS updatedAt,
  (SELECT COUNT(*) FROM game_props WHERE game_id = g.id) AS propsCount,
  (SELECT COUNT(*) FROM game_comments WHERE game_id = g.id) AS commentCount,
  EXISTS(SELECT 1 FROM game_props WHERE game_id = g.id AND user_id = ${viewerId}) AS proppedByViewer`;

export function getGameBySlug(slug: string, viewerId = 0): GameItem | undefined {
  const urlPattern = `games/${slug}`;
  return sqlite
    .prepare(
      `SELECT ${gameColumns(viewerId)}
      FROM arcade_games g
      WHERE g.url = ? LIMIT 1`
    )
    .get(urlPattern) as GameItem | undefined;
}

export function getGameById(id: number, viewerId = 0): GameItem | undefined {
  return sqlite
    .prepare(
      `SELECT ${gameColumns(viewerId)}
      FROM arcade_games g
      WHERE g.id = ? LIMIT 1`
    )
    .get(id) as GameItem | undefined;
}

export function getRelatedGames(gameId: number, genresJson: string, viewerId = 0, limit = 6): GameItem[] {
  let genres: string[] = [];
  try {
    genres = JSON.parse(genresJson);
  } catch {
    return [];
  }
  if (!genres.length) return [];

  const placeholders = genres.map(() => "g.genres_json LIKE ?").join(" OR ");
  const params = genres.map((g) => `%"${g}"%`);

  return sqlite
    .prepare(
      `SELECT ${gameColumns(viewerId)}
      FROM arcade_games g
      WHERE g.id <> ? AND (${placeholders})
      ORDER BY RANDOM() LIMIT ?`
    )
    .all(gameId, ...params, limit) as GameItem[];
}

export function listGameGenres(): string[] {
  if (genresCache) return genresCache;

  const rows = sqlite.prepare("SELECT genres_json FROM arcade_games").all() as { genres_json: string }[];
  const set = new Set<string>();
  for (const row of rows) {
    try {
      const genres = JSON.parse(row.genres_json) as string[];
      for (const g of genres) {
        set.add(g);
      }
    } catch {
      // Ignored
    }
  }

  genresCache = [...set].sort((a, b) => a.localeCompare(b));
  return genresCache;
}

export function clearGameGenresCache() {
  genresCache = null;
}

export function getPopularGames(limit = 12, viewerId = 0): GameItem[] {
  return sqlite
    .prepare(
      `SELECT ${gameColumns(viewerId)}
      FROM arcade_games g
      ORDER BY propsCount DESC, commentCount DESC, g.name ASC
      LIMIT ?`
    )
    .all(limit) as GameItem[];
}

export function userHasProppedGames(userId: number): boolean {
  if (!userId) return false;
  return Boolean(sqlite.prepare("SELECT 1 FROM game_props WHERE user_id = ? LIMIT 1").get(userId));
}

export function getArcadePage(
  page: number,
  genre = "all",
  searchQuery = "",
  viewerId = 0,
  sort = "popular"
): PagedGamesResult {
  const limit = limits.gamesPerPage;
  const currentPage = Math.max(1, Math.floor(page));
  const offset = (currentPage - 1) * limit;

  let filterSql = "WHERE 1=1";
  let joinSql = "";
  const params: unknown[] = [];

  if (genre === "propped" || genre === "props") {
    if (viewerId > 0) {
      joinSql = "JOIN game_props viewer_prop ON viewer_prop.game_id = g.id AND viewer_prop.user_id = ?";
      params.push(viewerId);
    } else {
      filterSql += " AND 1=0";
    }
  } else if (genre && genre !== "all") {
    filterSql += " AND g.genres_json LIKE ?";
    params.push(`%"${genre}"%`);
  }

  if (searchQuery && searchQuery.trim()) {
    const escaped = searchQuery.replace(/[\\%_]/g, "\\$&");
    filterSql += " AND g.name LIKE ? ESCAPE '\\'";
    params.push(`%${escaped}%`);
  }

  const countRow = sqlite
    .prepare(`SELECT COUNT(*) AS count FROM arcade_games g ${joinSql} ${filterSql}`)
    .get(...params) as { count: number };

  const totalCount = countRow.count;
  const totalPages = Math.ceil(totalCount / limit);

  let orderSql = "";
  if (sort === "alphabetical") {
    orderSql = "g.name ASC";
  } else if (sort === "popular") {
    orderSql = "propsCount DESC, commentCount DESC, g.name ASC";
  } else if (genre === "propped" || genre === "props") {
    orderSql = "viewer_prop.created_at DESC";
  } else {
    orderSql = "propsCount DESC, commentCount DESC, g.name ASC";
  }

  const queryParams = [...params, limit, offset];
  const items = sqlite
    .prepare(
      `SELECT ${gameColumns(viewerId)}
      FROM arcade_games g
      ${joinSql}
      ${filterSql}
      ORDER BY ${orderSql} LIMIT ? OFFSET ?`
    )
    .all(...queryParams) as GameItem[];

  return {
    items,
    totalCount,
    totalPages,
    currentPage: Math.min(currentPage, Math.max(1, totalPages))
  };
}

export function proppedGamesForViewer(viewer: CurrentUser, limit = limits.listPage): GameItem[] {
  return sqlite
    .prepare(
      `SELECT ${gameColumns(viewer.id)}
      FROM arcade_games g
      JOIN game_props viewer_prop ON viewer_prop.game_id = g.id AND viewer_prop.user_id = ?
      ORDER BY viewer_prop.created_at DESC, g.id DESC LIMIT ?`
    )
    .all(viewer.id, limit) as GameItem[];
}

export function addGameProp(gameId: number, userId: number): boolean {
  const info = sqlite.prepare("INSERT OR IGNORE INTO game_props (game_id, user_id) VALUES (?, ?)").run(gameId, userId);
  return info.changes > 0;
}

export function removeGameProp(gameId: number, userId: number): boolean {
  const info = sqlite.prepare("DELETE FROM game_props WHERE game_id = ? AND user_id = ?").run(gameId, userId);
  return info.changes > 0;
}

export function createGame(name: string, url: string, thumbnail: string, description: string, genres: string[], width: number, height: number): number {
  const info = sqlite
    .prepare(
      `INSERT INTO arcade_games (name, url, thumbnail, description, genres_json, width, height)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(url) DO UPDATE SET
        name = excluded.name,
        thumbnail = excluded.thumbnail,
        description = excluded.description,
        genres_json = excluded.genres_json,
        width = excluded.width,
        height = excluded.height,
        updated_at = CURRENT_TIMESTAMP`
    )
    .run(name, url, thumbnail, description, JSON.stringify(genres), width, height);

  clearGameGenresCache();
  return Number(info.lastInsertRowid);
}

export function gameCommentsFor(gameId: number, viewer: CurrentUser | null = null, limit?: number): CommentItem[] {
  return commentsFor("game", gameId, { viewer, limit, order: "oldest" });
}

export function addGameComment(gameId: number, authorId: number, textHtml: string, parentId?: number, viewer: CurrentUser | null = null): number | null {
  return addComment("game", gameId, authorId, textHtml, parentId, viewer);
}

export function deleteGameComment(commentId: number, actorId: number, isAdmin = false): boolean {
  return deleteComment("game", commentId, actorId, isAdmin);
}