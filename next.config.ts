import type { NextConfig } from 'next';
const config: NextConfig = { distDir: 'dist', poweredByHeader: false, async headers() { return [{ source: '/sw.js', headers: [{ key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' }] }]; } };
export default config;
