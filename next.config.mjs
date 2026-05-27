import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  outputFileTracingRoot: path.resolve("."),
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
