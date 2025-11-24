/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Outputs a Single-Page Application (SPA).
  distDir: './dist', // Changes the build output directory to './dist/'.
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true,
  // Handle environment variables from the Vite config
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
  // Configure Turbopack (Next.js 16)
  turbopack: {
    // Set the root directory to avoid workspace warning
    root: process.cwd(),
    // Path aliases
    resolveAlias: {
      '@': process.cwd(),
    },
  },
  // Path aliases to match the Vite config (for webpack fallback)
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': process.cwd(),
    }
    return config
  },
}

export default nextConfig