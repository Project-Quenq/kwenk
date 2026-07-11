import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const stylePath = resolve("public/static/css/style.css");

try {
  const css = readFileSync(stylePath, "utf8");
  const version = Date.now().toString(36);

  const updatedCss = css.replace(
    /(@import\s+url\(\s*(["']?))([^"'\s?)]+)(?:\?[^"'\s)]*)?(\2\s*\))/gi,
    (_match, prefix, quote, url, suffix) => {
      return `${prefix}${url}?v=${version}${suffix}`;
    }
  );

  writeFileSync(stylePath, updatedCss);
  console.log(`Successfully auto-versioned CSS imports with version: ${version}`);
} catch (error) {
  console.error("Failed to version CSS imports:", error);
}