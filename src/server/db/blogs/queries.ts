import { limits, type BlogCategory } from "../../../policy.js";
import type { CurrentUser } from "../../../currentUser.js";
import { blogRows, blogPreviewRows } from "./sql.js";
import { blogVisibilitySql } from "./visibility.js";
import { profileVisibilitySql } from "../profileVisibility.js";
import { containsLikePattern, likeEscapeClause } from "../like.js";
import {
  decodeKeysetCursor,
  keysetBeforeCondition,
  normalizePageLimit,
  pageFromRows,
  type PageOptions
} from "../../pagination.js";

const blogDiscoveryOrder = `ORDER BY (propsCount + commentCount) DESC, propsCount DESC, commentCount DESC, b.created_at DESC, b.id DESC`;
const blogLatestOrder = "ORDER BY b.created_at DESC, b.id DESC";
const userBlogLatestOrder = "ORDER BY b.pinned DESC, b.created_at DESC, b.id DESC";

export type BlogSortOrder = "latest" | "popular";

export function blogsForUser(userId: number, viewer: CurrentUser | null, limit = limits.profileBlogPreview, order: BlogSortOrder = "latest") {
  const visibility = blogVisibilitySql(viewer);
  const orderBy = order === "popular" ? blogDiscoveryOrder : userBlogLatestOrder;
  return blogPreviewRows(
    `WHERE b.author_id = ? AND ${visibility.sql}
    ${orderBy} LIMIT ?`,
    viewer,
    userId,
    ...visibility.params,
    limit
  );
}

export function blogsForUserPage(
  userId: number,
  viewer: CurrentUser | null,
  options: PageOptions = {},
  order: BlogSortOrder = "latest",
  searchQuery = ""
) {
  const limit = normalizePageLimit(options.limit, limits.listPage, limits.listPage);
  const visibility = blogVisibilitySql(viewer);

  let filterSql = `WHERE b.author_id = ? AND ${visibility.sql}`;
  const params: unknown[] = [userId, ...visibility.params];

  if (searchQuery && searchQuery.trim()) {
    const pattern = containsLikePattern(searchQuery.trim());
    filterSql += ` AND (b.title LIKE ? ${likeEscapeClause} OR b.body_html LIKE ? ${likeEscapeClause})`;
    params.push(pattern, pattern);
  }

  const before = keysetBeforeCondition(decodeKeysetCursor(options.before), "b.created_at", "b.id");
  const orderBy = order === "popular" ? blogDiscoveryOrder : userBlogLatestOrder;

  const rows = blogPreviewRows(
    `${filterSql} ${before.sql} ${orderBy} LIMIT ?`,
    viewer,
    ...params,
    ...before.params,
    limit + 1
  );

  return pageFromRows(rows, limit);
}

export function allBlogsForUser(userId: number, limit = limits.exportRows) {
  return blogPreviewRows("WHERE b.author_id = ? ORDER BY b.pinned DESC, b.created_at DESC LIMIT ?", exportViewer(userId), userId, limit);
}

export function allBlogs(
  viewer: CurrentUser | null,
  options: PageOptions = {},
  order: BlogSortOrder = "latest",
  searchQuery = "",
  category?: BlogCategory
) {
  const limit = normalizePageLimit(options.limit, limits.listPage, limits.listPage);
  const visible = profileVisibilitySql(viewer);
  const visibility = blogVisibilitySql(viewer);

  let filterSql = `WHERE ${visible.sql} AND ${visibility.sql}`;
  const params: unknown[] = [...visible.params, ...visibility.params];

  if (category) {
    filterSql += " AND b.category = ?";
    params.push(category);
  }

  if (searchQuery && searchQuery.trim()) {
    const pattern = containsLikePattern(searchQuery.trim());
    filterSql += ` AND (b.title LIKE ? ${likeEscapeClause} OR b.body_html LIKE ? ${likeEscapeClause})`;
    params.push(pattern, pattern);
  }

  const before = keysetBeforeCondition(decodeKeysetCursor(options.before), "b.created_at", "b.id");
  const orderBy = order === "popular" ? blogDiscoveryOrder : blogLatestOrder;

  const rows = blogRows(
    `${filterSql} ${before.sql} ${orderBy} LIMIT ?`,
    viewer,
    ...params,
    ...before.params,
    limit + 1
  );

  return pageFromRows(rows, limit);
}

export function blogsByCategory(
  category: BlogCategory,
  viewer: CurrentUser | null,
  options: PageOptions = {},
  order: BlogSortOrder = "latest",
  searchQuery = ""
) {
  return allBlogs(viewer, options, order, searchQuery, category);
}

export function getBlog(id: number, viewer: CurrentUser | null = null) {
  return blogRows("WHERE b.id = ? LIMIT 1", viewer, id)[0];
}

export function proppedBlogsForUser(userId: number, limit = limits.exportRows) {
  const viewer = exportViewer(userId);
  return blogRows(
    `WHERE b.id IN (SELECT p.blog_id FROM blog_props p WHERE p.user_id = ?)
    ORDER BY b.created_at DESC, b.id DESC LIMIT ?`,
    viewer,
    userId,
    limit
  );
}

export function proppedBlogsForViewer(viewer: CurrentUser, limit = limits.listPage) {
  const visible = profileVisibilitySql(viewer);
  const visibility = blogVisibilitySql(viewer);
  return blogRows(
    `JOIN blog_props viewer_prop ON viewer_prop.blog_id = b.id AND viewer_prop.user_id = ?
    WHERE ${visible.sql} AND ${visibility.sql}
    ORDER BY viewer_prop.created_at DESC, b.id DESC LIMIT ?`,
    viewer,
    viewer.id,
    ...visible.params,
    ...visibility.params,
    limit
  );
}

export function searchBlogs(query: string, viewer: CurrentUser | null, limit = limits.listPage) {
  const page = allBlogs(viewer, { limit }, "latest", query);
  return {
    blogs: page.items
  };
}

function exportViewer(userId: number): CurrentUser {
  return {
    id: userId,
    username: "",
    email: "",
    role: "user",
    timeZone: "UTC",
    verifiedAt: null,
    bannedAt: null
  };
}
