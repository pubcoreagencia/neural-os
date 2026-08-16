import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://neuralos.pub",
      lastModified: new Date("2026-07-11"),
      changeFrequency: "weekly",
      priority: 1
    }
  ];
}
