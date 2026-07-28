import type { MiddlewareHandler } from "hono";
import type { AppBindings } from "../context.js";
import { noindexHeader, resolveIndexing } from "./routes.js";
import { absoluteUrl } from "./urls.js";

export function indexingMiddleware(): MiddlewareHandler<AppBindings> {
  return async (c, next) => {
    const decision = resolveIndexing(c);

    try {
      await next();
    } finally {
      if (decision.index) {
        c.header("Link", `<${absoluteUrl(decision.canonicalPath)}>; rel="canonical"`);
      } else {
        c.header("X-Robots-Tag", noindexHeader);
      }
    }
  };
}