import { raw } from "hono/html";
import type { SiteSettings } from "../../settings/site.js";
import { sanitizeLinkedText } from "../../server/security/html.js";
import { Panel } from "../../ui/panels.js";
import { UserContent } from "../../ui/userContent.js";

export const landingCards = [
  {
    title: "Custom profiles",
    body: "Make your profile truly feel like your own. Customize your background, colors, and layout using custom HTML and CSS, and add your favorite profile song.",
    href: "/skins",
    cta: "Browse skins"
  },
  {
    title: "No feed algorithms",
    body: "See posts in the natural chronological order they are written. We do not use algorithms to manipulate your feed, push viral trends, or promote AI-generated content.",
    href: "/privacy",
    cta: "Read our privacy details"
  },
  {
    title: "Apps & games",
    body: "Launch simulators and classic Flash games directly in your browser. Play your favorite games, give props, leave comments, and join dedicated gaming communities.",
    href: "/arcade",
    cta: "Explore the arcade"
  },
  {
    title: "Cozy communities",
    body: "Join dedicated groups, write blog diaries, and find people who share your interests. Block, report, or restrict unwanted interactions easily.",
    href: "/rules",
    cta: "Review community rules"
  }
];

export function InfoCard(props: { title: string; body: string; href: string; cta: string }) {
  return (
    <div class="info-card">
      <h3>{props.title}</h3>
      <p>{props.body}</p>
      <p class="link">
        &raquo; <a href={props.href}>{props.cta}</a>
      </p>
    </div>
  );
}

export function AnnouncementBox({ settings }: { settings: SiteSettings }) {
  if (!settings.home.announcement) return null;
  return (
    <Panel className="summary-panel" title={`${settings.identity.name} announcements`} tone="soft">
      <UserContent html={sanitizeLinkedText(settings.home.announcement)} />
    </Panel>
  );
}

export function AdBanner() {
  return (
    <div style="text-align: center; overflow: hidden;">
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="ca-pub-9156391108980330"
           data-ad-slot="7238067622"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
      <script>{raw(`(adsbygoogle = window.adsbygoogle || []).push({});`)}</script>
    </div>
  );
}