import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/th/dashboard", "/en/dashboard", "/th/plan", "/en/plan", "/th/login", "/en/login", "/th/register", "/en/register"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
