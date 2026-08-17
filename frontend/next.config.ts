import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // In development, proxy /api/* to the FiscalForge backend Lambda server.
  // In production, NEXT_PUBLIC_API_URL points directly to the API Gateway endpoint.
  async rewrites() {
    if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_URL) {
      return [
        {
          source: '/api/:path*',
          destination: `${process.env.BACKEND_URL ?? 'http://localhost:8000'}/api/:path*`,
        },
      ]
    }
    return []
  },
}

export default nextConfig
