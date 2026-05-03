import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    reactStrictMode: true,
    typescript: {
          ignoreBuildErrors: true,
    },
    eslint: {
          ignoreDuringBuilds: true,
    },
    images: {
          remotePatterns: [
            {
                      protocol: 'https',
                      hostname: '**',
            },
                ],
    },
    experimental: {
          optimizePackageImports: [],
    },
}

export default nextConfig
