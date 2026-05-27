import type { Metadata } from "next";
import { LegacyMain } from "@/components/LegacyMain";
import { getLegacyPage, legacyMetadata } from "@/lib/legacy";

export function generateMetadata(): Metadata {
  return legacyMetadata();
}

export default function HomePage() {
  const page = getLegacyPage();
  return <LegacyMain html={page.main} jsonLd={page.jsonLd} />;
}
