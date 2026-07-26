import type { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { requireAuth } from "../../server/access.js";
import { csrfToken, currentUser } from "../../server/auth/session.js";
import { scanAutomodSubmission } from "../../server/db/automod.js";
import {
  getArcadePage,
  getGameBySlug,
  listGameGenres,
  getRelatedGames,
  addGameProp,
  removeGameProp,
  gameCommentsFor,
  addGameComment,
  deleteGameComment
} from "../../server/db/arcade.js";
import { notifyGameComment } from "../../server/db/notifications/comments.js";
import { addCommentFromForm, deleteCommentFromRoute } from "../../server/comments/actions.js";
import { field } from "../../server/forms.js";
import { localBack, routeId, verifiedActionForm } from "../../server/http.js";
import { anchors } from "../../anchors.js";
import type { AppBindings, AppContext } from "../../server/context.js";
import { ArcadeListPage } from "../../views/arcade/index.js";
import { GamePlayPage } from "../../views/arcade/game.js";

export function registerArcadeRoutes(app: Hono<AppBindings>) {
  
  // Public Catalog Page (Unauthenticated)
  app.get("/arcade", (c) => {
    const user = currentUser(c);
    const pageQuery = Number(c.req.query("page")) || 1;
    const genreQuery = c.req.query("genre") || "all";
    const searchQuery = c.req.query("search") || "";

    const { items, totalCount, totalPages, currentPage } = getArcadePage(
      pageQuery,
      genreQuery,
      searchQuery,
      user?.id ?? 0
    );

    return c.html(
      <ArcadeListPage
        user={user}
        csrf={csrfToken(c)}
        games={items}
        genres={listGameGenres()}
        currentPage={currentPage}
        totalPages={totalPages}
        currentGenre={genreQuery}
        currentSearch={searchQuery}
      />
    );
  });

  // Public Individual Game Page (Unauthenticated)
  app.get("/arcade/:slug", (c) => {
    const user = currentUser(c);
    const slug = c.req.param("slug");
    const game = getGameBySlug(slug, user?.id ?? 0);

    if (!game) {
      throw new HTTPException(404, { message: "Arcade game not found." });
    }

    const comments = gameCommentsFor(game.id, user);
    
    // SQLite lookup: find random games sharing at least one category, excluding self
    const genres = listGameGenres();
    let genresJson = "[]";
    try {
      // Find original stored genres_json for matching
      const raw = getGameBySlug(slug, 0);
      if (raw) {
        // Query to match JSON payload
        const check = getGameBySlug(slug, 0);
        if (check) genresJson = JSON.stringify(genres.filter(g => check.description.includes(g) || check.name.includes(g)));
      }
    } catch {
      // Fallback
    }

    const relatedGames = getRelatedGames(game.id, genresJson, user?.id ?? 0, 6);

    return c.html(
      <GamePlayPage
        user={user}
        csrf={csrfToken(c)}
        game={game}
        comments={comments}
        relatedGames={relatedGames}
        genres={genres}
      />
    );
  });

  // Authenticated Props & Commenting
  app.post("/arcade/:slug/prop", async (c) => handleGameProp(c, addGameProp));
  app.post("/arcade/:slug/unprop", async (c) => handleGameProp(c, removeGameProp));

  app.post("/arcade/:slug/comments", async (c) => {
    const user = requireAuth(c);
    const form = await verifiedActionForm(c, "comment.create");
    const slug = c.req.param("slug");
    const game = getGameBySlug(slug, user.id);

    if (!game) {
      throw new HTTPException(404, { message: "Arcade game not found." });
    }

    return addCommentFromForm(c, user, {
      form,
      subjectType: "game_comment",
      redirect: (commentId) => `/arcade/${slug}#${anchors.comment(commentId)}`,
      add: (textHtml, parentId) => addGameComment(game.id, user.id, textHtml, parentId, user),
      afterAdd: notifyGameComment
    });
  });

  // Comments Moderation and Deletions
  app.post("/arcade/comments/:id/delete", (c) =>
    deleteCommentFromRoute(c, {
      subjectType: "game_comment",
      delete: deleteGameComment,
      fallback: "/arcade",
      redirectFragment: anchors.comments
    })
  );
}

async function handleGameProp(
  c: AppContext,
  action: (gameId: number, userId: number) => boolean
) {
  const user = requireAuth(c);
  await verifiedActionForm(c, "engagement.write");
  const slug = c.req.param("slug");
  const game = getGameBySlug(slug, user.id);

  if (!game) {
    throw new HTTPException(404, { message: "Arcade game not found." });
  }

  action(game.id, user.id);
  return c.redirect(localBack(c, `/arcade/${slug}`));
}