import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name.en,
    short_name: siteConfig.name.en,
    description: siteConfig.description.en,
    start_url: "/ar",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4e0161",
    icons: [
      { src: "/images/brand/favicon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/images/brand/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
