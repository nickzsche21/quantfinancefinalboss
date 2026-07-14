import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return ["", "/sources", "/legal/terms", "/legal/privacy", "/legal/disclaimer"].map((path) => ({ url: `${base}${path}`, changeFrequency: "weekly" as const }));
}
