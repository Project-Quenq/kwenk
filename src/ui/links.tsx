import { pageLinks, type PageLinkKey } from "../navigation.js";
import type { ViewChild } from "./types.js";

export type LinkItem = readonly [label: string, href: string, rel?: string];

export function BackToPage(props: { page: PageLinkKey }) {
  const page = pageLinks[props.page];
  return <BackLink href={page.href} label={page.label} />;
}

export function BackLink(props: { href: string; label: string }) {
  return (
    <p class="page-back-link">
      <a href={props.href}><span class="page-back-link__arrow" aria-hidden="true">&larr;</span> Back to {props.label}</a>
    </p>
  );
}

const defaultNofollowPaths = new Set(["/login", "/signup", "/logout", "/reset", "/verify", "/search"]);

export function InlineLinks(props: { links: LinkItem[]; prefix?: ViewChild | readonly ViewChild[] }) {
  const prefixItems = props.prefix === undefined ? [] : Array.isArray(props.prefix) ? props.prefix : [props.prefix];
  return (
    <span class="inline-links">
      {prefixItems.map((item) => (
        <span class="inline-links__item">{item}</span>
      ))}
      {props.links.map(([label, href, rel]) => {
        const linkRel = rel ?? (defaultNofollowPaths.has(href) ? "nofollow" : undefined);
        return (
          <span class="inline-links__item">
            <a href={href} rel={linkRel}>{label}</a>
          </span>
        );
      })}
    </span>
  );
}
