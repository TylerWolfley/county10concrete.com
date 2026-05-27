import type { Metadata } from "next";
import { LegacyMain } from "@/components/LegacyMain";
import { getLegacyPage, legacyMetadata } from "@/lib/legacy";
import { legacyRoutes } from "@/lib/site";

type RouteParams = {
  params: Promise<{ slug: string[] }>;
};

export function generateStaticParams() {
  return legacyRoutes
    .filter(Boolean)
    .map((route) => ({
      slug: route.split("/")
    }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  return legacyMetadata(slug);
}

export default async function LegacyRoutePage({ params }: RouteParams) {
  const { slug } = await params;
  const page = getLegacyPage(slug);
  return <LegacyMain html={page.main} jsonLd={page.jsonLd} />;
}
