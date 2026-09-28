import type { BlogItem, BlogListItem } from "../../models.js";
import { blogPath } from "../../paths.js";
import { absoluteUrl, xmlEscape } from "../indexing/urls.js";

type RssChannel = {
  title: string;
  link: string;
  description: string;
  feedUrl: string;
};

export function generateRssFeed(channel: RssChannel, blogs: Array<BlogListItem | BlogItem>) {
  const itemsXml = blogs.map((blog) => {
    const link = absoluteUrl(blogPath(blog));
    const pubDate = new Date(blog.createdAt.includes("T") ? blog.createdAt : `${blog.createdAt.replace(" ", "T")}Z`).toUTCString();
    const author = blog.username ? xmlEscape(blog.username) : "Kwenk User";

    return [
      "    <item>",
      `      <title>${xmlEscape(blog.title)}</title>`,
      `      <link>${xmlEscape(link)}</link>`,
      `      <guid isPermaLink="true">${xmlEscape(link)}</guid>`,
      `      <pubDate>${pubDate}</pubDate>`,
      `      <author>${author}</author>`,
      blog.category ? `      <category>${xmlEscape(blog.category)}</category>` : "",
      `      <description><![CDATA[${blog.bodyHtml}]]></description>`,
      "    </item>"
    ].filter(Boolean).join("\n");
  }).join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${xmlEscape(channel.title)}</title>`,
    `    <link>${xmlEscape(channel.link)}</link>`,
    `    <description>${xmlEscape(channel.description)}</description>`,
    "    <language>en-us</language>",
    `    <atom:link href="${xmlEscape(channel.feedUrl)}" rel="self" type="application/rss+xml" />`,
    itemsXml,
    "  </channel>",
    "</rss>",
    ""
  ].join("\n");
}
