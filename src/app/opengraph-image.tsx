import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} — ${siteConfig.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default social card for every page that doesn't set its own (project pages do). Rendered at build time. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#faf7f2",
          color: "#1c1917",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 6, textTransform: "uppercase", color: "#c2410c" }}>
          {siteConfig.title}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 104, lineHeight: 1 }}>{siteConfig.name}</div>
          <div style={{ marginTop: 28, fontSize: 36, color: "#57534e", maxWidth: 980 }}>
            Games, game tooling, and the software around them. Rust, C#, TypeScript, Java.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#78716c" }}>{siteConfig.url.replace(/^https?:\/\//, "")}</div>
      </div>
    ),
    size,
  );
}
