import { messagesPath, notificationsPath, reportPathBase } from "../../paths.js";
import { absoluteUrl } from "./urls.js";

const privateRobotPaths = [
  "/admin",
  "/moderation",
  "/settings",
  "/account",
  messagesPath,
  notificationsPath,
  "/feed",
  "/friends",
  "/requests",
  "/blocks",
  "/favorites",
  "/props",
  reportPathBase,
  "/login",
  "/signup",
  "/search",
  "/logout",
  "/reset",
  "/verify",
  "/refresh",
  "/theme",
  "/media",
  "/account/profile",
  "/account/status",
  "/blog/new",
  "/b/*/edit",
  "/g",
  "/groups",
  "/p",
  "/skins/new",
  "/s/*/edit",
  "/s/*/preview"
] as const;

export function robotsText() {
  return [
    "User-agent: *",
    ...privateRobotPaths.map((path) => `Disallow: ${path}`),
    "Allow: /theme.css",
    "Allow: /",
    "",
    `Sitemap: ${absoluteUrl("/sitemap.xml")}`,
    ""
  ].join("\n");
}