import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name.en,
    short_name: siteConfig.name.en,
    description: siteConfig.description.en,
    start_url: "/ar",
    display: "standalone",
    background_color: "#f8faf9",
    theme_color: "#0e6b4e",
    icons: [{ src: "/images/brand/logo.png", sizes: "any", type: "image/png" }],
  };
}
