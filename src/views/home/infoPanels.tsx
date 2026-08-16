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
    body: "See posts in the order they were written. No algorithms manipulating your feed, pushing viral trends, or promoting slop.",
    href: "/privacy",
    cta: "Read our privacy details"
  },
  {
    title: "Flash arcade",
    body: "Play thousands of classic Flash games directly in your browser. Give props, leave comments, share reviews, and join dedicated gaming communities.",
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
      <script>{raw(`
        (function(fevnw){
        var d = document,
            s = d.createElement('script'),
            l = d.scripts[d.scripts.length - 1];
        s.settings = fevnw || {};
        s.src = "//shameful-farm.com/b.XUVmspdXGclc0/Y/WIcc/oeTm/9_u_ZPUnl/kEPHT/c/zhM/jhUO5sMTT/c/tRN/z/MHyoNpTxkHyvMzQS";
        s.async = true;
        s.referrerPolicy = 'no-referrer-when-downgrade';
        l.parentNode.insertBefore(s, l);
        })({})
      `)}</script>
    </div>
  );
}

export function AdBannerMain() {
  return (
    <div style="text-align: center; overflow: hidden;">
      <script>{raw(`
        (function(fevnw){
        var d = document,
            s = d.createElement('script'),
            l = d.scripts[d.scripts.length - 1];
        s.settings = fevnw || {};
        s.src = "//shameful-farm.com/b.XUVmspdXGclc0/Y/WIcc/oeTm/9_u_ZPUnl/kEPHT/c/zhM/jhUO5sMTT/c/tRN/z/MHyoNpTxkHyvMzQS";
        s.async = true;
        s.referrerPolicy = 'no-referrer-when-downgrade';
        l.parentNode.insertBefore(s, l);
        })({})
      `)}</script>
    </div>
  );
}