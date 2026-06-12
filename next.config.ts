import type { NextConfig } from 'next';
import { securityHeaders } from '@/shared/lib/security';

const nextConfig: NextConfig = {
  async headers() {
    const headers = Object.entries(securityHeaders()).map(([key, value]) => ({
      key,
      value,
    }));

    return [{ source: '/:path*', headers }];
  },
};

export default nextConfig;
