import { truncateText } from "../text.js";
import { headerChromeColor, type ColorPalette } from "../theme/colorPalette.js";
import type { SiteSettings } from "./site.js";
import { brandIconShapeSvg } from "../brand.js";

export const defaultSocialImagePath = "/og-image.png";
export const socialImageSize = {
  width: 1200,
  height: 630
} as const;

export type JsonLd = Record<string, unknown>;

export type PageSeo = {
  canonicalPath?: string;
  description?: string;
  imageAlt?: string;
  imagePath?: string;
  jsonLd?: JsonLd | JsonLd[];
  modifiedTime?: string;
  noindex?: boolean;
  publishedTime?: string;
  title?: string;
  type?: "article" | "profile" | "website";
};

export function siteSeoDescription(settings: SiteSettings) {
  return seoText(settings.home.welcomeText || siteMarketingDescription(settings), 180);
}

export function siteMarketingDescription(settings: Pick<SiteSettings, "identity">) {
  const name = settings.identity.name.trim() || "Quenq";
  return `${name} is a nostalgic social network inspired by the early days of the web.`;
}

export function seoText(input: string, maxLength = 180) {
  return truncateText(input.replace(/\s+/g, " ").trim(), maxLength);
}

export function siteSocialImageAlt(settings: SiteSettings) {
  return `${settings.identity.name} social preview`;
}

export function siteStructuredData(settings: SiteSettings, siteUrl: string, imageUrl: string): JsonLd[] {
  const organization = organizationStructuredData(settings, siteUrl);
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: settings.identity.name,
      description: siteSeoDescription(settings),
      url: siteUrl,
      image: imageUrl,
      ...(organization ? { publisher: { "@id": organization["@id"] } } : {})
    },
    ...(organization ? [organization] : [])
  ];
}

export function siteWebManifest(settings: SiteSettings, palette: ColorPalette) {
  return JSON.stringify(
    {
      name: settings.identity.name,
      short_name: truncateText(settings.identity.name, 24),
      description: siteSeoDescription(settings),
      start_url: "/",
      scope: "/",
      display: "standalone",
      background_color: palette.page,
      theme_color: headerChromeColor(palette),
      icons: [
        { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
        { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
        { src: "/icon-1024.png", sizes: "1024x1024", type: "image/png" }
      ]
    },
    null,
    2
  );
}

export function siteSocialPreviewSvg(settings: SiteSettings, palette: ColorPalette) {
  const background = headerChromeColor(palette);
  const foreground = palette.chromeText;
  const name = "quenq.com";
  const tagline = (settings.identity.tagline).toLowerCase();

  const nameSize = 96;
  const taglineSize = 36;

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${xmlAttribute(siteSocialImageAlt(settings))}">`,
    `<defs>`,
      `<radialGradient id="centerFade" cx="50%" cy="50%" r="50%">`,
        `<stop offset="0%" stop-color="#ffffff" stop-opacity="0.8" />`,
        `<stop offset="100%" stop-color="#ffffff" stop-opacity="0.1" />`,
      `</radialGradient>`,
      `<mask id="giantLogoMask">`,
        `<rect width="1200" height="630" fill="url(#centerFade)" />`,
      `</mask>`,
    `</defs>`,

    `<rect width="1200" height="630" fill="${background}" />`,

    `<g mask="url(#giantLogoMask)">`,
      `<g transform="translate(296, 11) scale(38)" color="#ffffff" fill="#ffffff" fill-opacity="0.14">`,
        brandIconShapeSvg,
      `</g>`,
    `</g>`,

    `<g transform="translate(536, 130) scale(8)" color="${foreground}" fill="${foreground}">`,
    brandIconShapeSvg,
    `</g>`,

    `<text x="600" y="380" text-anchor="middle" fill="${foreground}" font-family="Verdana, Arial, sans-serif" font-size="${nameSize}" font-weight="700">${xmlText(name)}</text>`,

    `<text x="600" y="445" text-anchor="middle" fill="${foreground}" fill-opacity="0.85" font-family="Verdana, Arial, sans-serif" font-size="${taglineSize}" font-weight="400">${xmlText(tagline)}</text>`,

    `</svg>`
  ].join("");
}

function organizationStructuredData(settings: SiteSettings, siteUrl: string): JsonLd | null {
  const name = settings.contact.companyName.trim();
  if (!name) return null;
  return {
    "@context": "https://schema.org",
    "@id": `${siteUrl}#organization`,
    "@type": "Organization",
    name,
    url: siteUrl,
    ...(settings.contact.email ? { email: settings.contact.email } : {})
  };
}

function xmlText(input: string) {
  return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function xmlAttribute(input: string) {
  return xmlText(input).replace(/"/g, "&quot;");
}