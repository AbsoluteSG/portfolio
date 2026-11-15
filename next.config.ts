import type { NextConfig } from "next";

/**
 * Old URLs that were shared publicly before the site was restructured. They redirect permanently
 * so links in resumes, applications and other sites keep working. Never delete an entry here.
 */
const legacyRedirects = [
  { source: "/blog/banana-clicker", destination: "/projects/banana-clicker" },
  { source: "/blog/metroidvania", destination: "/projects/no-dogs-allowed" },
  { source: "/blog/cv-automation", destination: "/projects/vision-bots" },
  { source: "/blog/environment-sim", destination: "/projects/critter-cove" },
  { source: "/blog/:slug*", destination: "/" },
  { source: "/blog", destination: "/" },
  { source: "/resume", destination: "/resume.pdf" },
  { source: "/cv", destination: "/resume.pdf" },
];

const nextConfig: NextConfig = {
  async redirects() {
    return legacyRedirects.map((r) => ({ ...r, permanent: true }));
  },
  async headers() {
    return [
      // Resume PDFs are read cross-origin by application forms.
      { source: "/resume.pdf", headers: [{ key: "Access-Control-Allow-Origin", value: "*" }] },
      { source: "/resumes/:file", headers: [{ key: "Access-Control-Allow-Origin", value: "*" }] },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
