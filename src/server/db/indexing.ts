import { isBlogCategory, limits } from "../../policy.js";
import { blogPath, groupPath, postPath, profilePath, skinPath } from "../../paths.js";
import { sqlite } from "./client.js";

const sitemapLimit = 50_000;

type HandleSitemapRow = { handle: string; lastmod: string };
type IdSitemapRow = { id: number; lastmod: string };
type CategoryRow = { category: string; lastmod: string };
type ArcadeSitemapRow = { url: string; lastmod: string };

export function publicProfileCanonicalPathByHandle(handle: string) {
  const row = sqlite
    .prepare(
      `SELECT p.handle
      FROM profiles p JOIN users u ON u.id = p.user_id
      WHERE p.handle = ? AND u.banned_at IS NULL AND p.private = 0`
    )
    .get(handle) as { handle: string } | undefined;
  return row ? profilePath(row.handle) : null;
}

export function publicBlogCanonicalPath(id: number) {
  const row = sqlite
    .prepare(
      `SELECT b.id
      FROM blogs b
      JOIN users u ON u.id = b.author_id
      JOIN profiles p ON p.user_id = u.id
      WHERE b.id = ? AND b.privacy_level = 0 AND u.banned_at IS NULL AND p.private = 0`
    )
    .get(id) as { id: number } | undefined;
  return row ? blogPath(row) : null;
}

export function publicPostCanonicalPath(id: number) {
  const row = sqlite
    .prepare(
      `SELECT po.id
      FROM posts po
      JOIN users author ON author.id = po.author_id
      JOIN users wall_owner ON wall_owner.id = po.wall_user_id
      JOIN profiles p ON p.user_id = wall_owner.id
      WHERE po.id = ?
        AND po.wall_user_id IS NOT NULL
        AND author.banned_at IS NULL
        AND wall_owner.banned_at IS NULL
        AND p.private = 0`
    )
    .get(id) as { id: number } | undefined;
  return row ? postPath(row) : null;
}

export function publicGroupCanonicalPath(id: number) {
  const row = sqlite
    .prepare(
      `SELECT g.id
      FROM groups g
      JOIN users u ON u.id = g.owner_id
      JOIN profiles p ON p.user_id = u.id
      WHERE g.id = ? AND u.banned_at IS NULL AND p.private = 0`
    )
    .get(id) as { id: number } | undefined;
  return row ? groupPath(row) : null;
}

export function publicSkinCanonicalPath(id: number) {
  const row = sqlite
    .prepare(
      `SELECT s.id
      FROM skins s
      LEFT JOIN users u ON u.id = s.author_id
      LEFT JOIN profiles p ON p.user_id = u.id
      WHERE s.id = ? AND (s.source_key IS NOT NULL OR (u.banned_at IS NULL AND p.private = 0))`
    )
    .get(id) as { id: number } | undefined;
  return row ? skinPath(row) : null;
}

export function publicProfileIndexPaths(limit = sitemapLimit) {
  const rows = sqlite
    .prepare(
      `SELECT p.handle, max(u.created_at, u.updated_at) AS lastmod
      FROM users u JOIN profiles p ON p.user_id = u.id
      WHERE u.banned_at IS NULL AND p.private = 0
      ORDER BY u.created_at DESC, u.id DESC LIMIT ?`
    )
    .all(limit) as HandleSitemapRow[];
  return rows.map((row) => ({ path: profilePath(row.handle), lastmod: row.lastmod }));
}

export function publicBlogIndexPaths(limit = sitemapLimit) {
  const rows = sqlite
    .prepare(
      `SELECT b.id, b.updated_at AS lastmod
      FROM blogs b
      JOIN users u ON u.id = b.author_id
      JOIN profiles p ON p.user_id = u.id
      WHERE b.privacy_level = 0 AND u.banned_at IS NULL AND p.private = 0
      ORDER BY b.created_at DESC, b.id DESC LIMIT ?`
    )
    .all(limit) as IdSitemapRow[];
  return rows.map((row) => ({ path: blogPath(row), lastmod: row.lastmod }));
}

export function publicSkinIndexPaths(limit = sitemapLimit) {
  const rows = sqlite
    .prepare(
      `SELECT s.id, s.updated_at AS lastmod
      FROM skins s
      LEFT JOIN users u ON u.id = s.author_id
      LEFT JOIN profiles p ON p.user_id = u.id
      WHERE s.source_key IS NOT NULL OR (u.banned_at IS NULL AND p.private = 0)
      ORDER BY s.updated_at DESC, s.id DESC LIMIT ?`
    )
    .all(limit) as IdSitemapRow[];
  return rows.map((row) => ({ path: skinPath(row), lastmod: row.lastmod }));
}

export function publicPostIndexPaths(limit = sitemapLimit) {
  const rows = sqlite
    .prepare(
      `SELECT po.id, po.updated_at AS lastmod
      FROM posts po
      JOIN users author ON author.id = po.author_id
      JOIN users wall_owner ON wall_owner.id = po.wall_user_id
      JOIN profiles p ON p.user_id = wall_owner.id
      WHERE po.wall_user_id IS NOT NULL
        AND author.banned_at IS NULL
        AND wall_owner.banned_at IS NULL
        AND p.private = 0
      ORDER BY po.created_at DESC, po.id DESC LIMIT ?`
    )
    .all(limit) as IdSitemapRow[];
  return rows.map((row) => ({ path: postPath(row), lastmod: row.lastmod }));
}

export function publicGroupIndexPaths(limit = sitemapLimit) {
  const rows = sqlite
    .prepare(
      `SELECT g.id, max(g.created_at, u.updated_at) AS lastmod
      FROM groups g
      JOIN users u ON u.id = g.owner_id
      JOIN profiles p ON p.user_id = u.id
      WHERE u.banned_at IS NULL AND p.private = 0
      ORDER BY g.created_at DESC, g.id DESC LIMIT ?`
    )
    .all(limit) as IdSitemapRow[];
  return rows.map((row) => ({ path: groupPath(row), lastmod: row.lastmod }));
}

export function publicBlogCategoryIndexPaths(limit = limits.listPage) {
  return (
    sqlite
      .prepare(
        `SELECT b.category, max(b.updated_at) AS lastmod
        FROM blogs b
        JOIN users u ON u.id = b.author_id
        JOIN profiles p ON p.user_id = u.id
        WHERE b.privacy_level = 0 AND u.banned_at IS NULL AND p.private = 0
        GROUP BY b.category
        ORDER BY b.category ASC LIMIT ?`
      )
      .all(limit) as CategoryRow[]
  )
    .filter((row) => isBlogCategory(row.category))
    .map((row) => ({ path: `/blog/category/${encodeURIComponent(row.category)}`, lastmod: row.lastmod }));
}

export function publicArcadeIndexPaths(limit = sitemapLimit) {
  const rows = sqlite
    .prepare(
      `SELECT url, updated_at AS lastmod
      FROM arcade_games
      ORDER BY name ASC LIMIT ?`
    )
    .all(limit) as ArcadeSitemapRow[];
  return rows.map((row) => {
    const slug = row.url.split("/").pop() ?? "";
    return { path: `/arcade/${slug}`, lastmod: row.lastmod };
  });
}