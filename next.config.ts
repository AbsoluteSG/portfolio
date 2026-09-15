import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    // Resume PDFs are read cross-origin by application forms.
    return [
      { source: "/resume.pdf", headers: [{ key: "Access-Control-Allow-Origin", value: "*" }] },
      { source: "/resumes/:file", headers: [{ key: "Access-Control-Allow-Origin", value: "*" }] },
    ];
  },
};

export default nextConfig;
