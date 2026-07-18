import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hillaac ICT Solutions",
    short_name: "Hillaac",
    description: "Professional websites, apps, systems, branding, and cloud solutions for Somalia.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0057d9"
  };
}
