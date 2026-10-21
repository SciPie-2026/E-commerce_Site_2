import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://aidah.com";

  const staticRoutes = [
    "",
    "/shop",
    "/studio",
    "/lookbook",
    "/about",
    "/contact",
    "/size-guide",
    "/shipping-policy",
    "/returns",
    "/faq",
    "/terms",
    "/privacy",
    "/category/casual-dresses",
    "/category/party-wear",
    "/category/evening-gowns",
    "/category/floral-dresses",
    "/category/ethnic-wear",
    "/category/co-ord-sets",
    "/collections/new-arrivals",
    "/collections/best-sellers",
  ];

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/shop" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
