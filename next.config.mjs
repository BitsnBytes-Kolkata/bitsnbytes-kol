import path from "path"

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Enable image optimization for Vercel
    domains: [],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Enable React strict mode for better development
  reactStrictMode: true,
  // Production source maps for better debugging
  productionBrowserSourceMaps: false,
  // Compress output
  compress: true,
  turbopack: {
    // Explicitly set the Turbopack root to the project root
    root: process.cwd(),
  },
  webpack(config) {
    if (!config.resolve) {
      config.resolve = {}
    }

    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "@public": path.resolve("./public"),
    }

    return config
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com https://tally.so; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; font-src 'self' data: https://r2cdn.perplexity.ai; connect-src 'self' https://vitals.vercel-insights.com; frame-src 'self' https://tally.so;"
          }
        ]
      }
    ]
  },
}

export default nextConfig
