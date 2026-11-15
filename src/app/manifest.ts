import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "Alex Z.",
    description: siteConfig.description,
    start_url: "/",
    display: "browser",
    background_color: "#faf7f2",
    theme_color: "#faf7f2",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
