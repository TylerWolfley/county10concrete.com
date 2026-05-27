import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL } from "./site";

type LegacyPage = {
  slug: string;
  html: string;
  main: string;
  jsonLd: string[];
};

type ParsedMeta = {
  title?: string;
  description?: string;
  canonical?: string;
  robots?: string;
  openGraph: Record<string, string>;
  twitter: Record<string, string>;
};

const rootDir = process.cwd();

function normalizeSlug(slug: string | string[] | undefined): string {
  if (!slug) return "";
  const value = Array.isArray(slug) ? slug.join("/") : slug;
  return value.replace(/^\/+|\/+$/g, "");
}

function legacyPath(slug: string): string {
  return slug ? path.join(rootDir, slug, "index.html") : path.join(rootDir, "index.html");
}

function matchFirst(html: string, regex: RegExp): string | undefined {
  return html.match(regex)?.[1]?.trim();
}

function extractMain(html: string): string {
  const main = matchFirst(html, /<main id="main">([\s\S]*?)<\/main>/i);
  if (!main) return "";
  return `<main id="main">${main}</main>`;
}

function extractJsonLd(html: string): string[] {
  return Array.from(html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi))
    .map((match) => match[1].trim())
    .filter(Boolean);
}

function attr(html: string, selector: RegExp): string | undefined {
  return matchFirst(html, selector);
}

function parseMeta(html: string): ParsedMeta {
  const openGraph: Record<string, string> = {};
  const twitter: Record<string, string> = {};

  for (const match of html.matchAll(/<meta\s+property="(og:[^"]+)"\s+content="([^"]*)"/gi)) {
    openGraph[match[1]] = match[2];
  }

  for (const match of html.matchAll(/<meta\s+name="(twitter:[^"]+)"\s+content="([^"]*)"/gi)) {
    twitter[match[1]] = match[2];
  }

  return {
    title: matchFirst(html, /<title>([\s\S]*?)<\/title>/i),
    description: attr(html, /<meta\s+name="description"\s+content="([^"]*)"/i),
    canonical: attr(html, /<link\s+rel="canonical"\s+href="([^"]*)"/i),
    robots: attr(html, /<meta\s+name="robots"\s+content="([^"]*)"/i),
    openGraph,
    twitter
  };
}

export function getLegacyPage(slugInput?: string | string[]): LegacyPage {
  const slug = normalizeSlug(slugInput);
  const file = legacyPath(slug);

  if (!fs.existsSync(file)) notFound();

  const html = fs.readFileSync(file, "utf8");
  const main = extractMain(html);

  if (!main) notFound();

  return {
    slug,
    html,
    main,
    jsonLd: extractJsonLd(html)
  };
}

export function legacyMetadata(slugInput?: string | string[]): Metadata {
  const page = getLegacyPage(slugInput);
  const meta = parseMeta(page.html);
  const title = meta.title || "County 10 Concrete";
  const description = meta.description || "County 10 Concrete serves Fremont County and Natrona County with professional concrete services.";
  const canonical = meta.canonical || `${SITE_URL}/${page.slug ? `${page.slug}/` : ""}`;
  const ogImage = meta.openGraph["og:image"];
  const twitterImage = meta.twitter["twitter:image"] || ogImage;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    robots: meta.robots,
    alternates: {
      canonical
    },
    openGraph: {
      title: meta.openGraph["og:title"] || title,
      description: meta.openGraph["og:description"] || description,
      url: meta.openGraph["og:url"] || canonical,
      siteName: meta.openGraph["og:site_name"] || "County 10 Concrete",
      locale: meta.openGraph["og:locale"] || "en_US",
      type: "website",
      images: ogImage ? [{ url: ogImage }] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: meta.twitter["twitter:title"] || title,
      description: meta.twitter["twitter:description"] || description,
      images: twitterImage ? [twitterImage] : undefined
    }
  };
}
