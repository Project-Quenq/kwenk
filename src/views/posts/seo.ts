import type { PostItem } from "../../models.js";
import { postImagePath, postPath, profilePath } from "../../paths.js";
import { plainTextFromHtml } from "../../server/security/html.js";
import { absoluteUrl } from "../../server/indexing/urls.js";
import { seoText, type PageSeo } from "../../settings/seo.js";

export function postSeo(post: PostItem): PageSeo {
  const path = postPath(post);
  const textContent = plainTextFromHtml(post.bodyHtml);
  const snippet = seoText(textContent, 180) || `${post.username}'s post on Kwenk`;
  const title = textContent ? `${post.username}: "${seoText(textContent, 60)}"` : `${post.username}'s post`;
  const authorUrl = absoluteUrl(profilePath(post.authorHandle));
  const imagePath = post.mediaFilename ? postImagePath(post.mediaFilename) : undefined;

  return {
    canonicalPath: path,
    title,
    description: snippet,
    type: "article",
    imagePath,
    publishedTime: post.createdAt,
    modifiedTime: post.updatedAt,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SocialMediaPosting",
      headline: title,
      articleBody: textContent,
      url: absoluteUrl(path),
      mainEntityOfPage: absoluteUrl(path),
      datePublished: post.createdAt,
      dateModified: post.updatedAt,
      author: {
        "@type": "Person",
        name: post.username,
        url: authorUrl
      },
      ...(imagePath ? { image: absoluteUrl(imagePath) } : {})
    }
  };
}
