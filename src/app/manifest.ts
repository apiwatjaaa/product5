import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "แผนเกษียณของฉัน — My Retirement Plan",
    short_name: "แผนเกษียณ",
    description: "โปรแกรมวางแผนและคำนวณมูลค่าเงินเพื่อการเกษียณ",
    start_url: "/",
    display: "standalone",
    background_color: "#0b141f",
    theme_color: "#0b141f",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/pwa-icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/pwa-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
