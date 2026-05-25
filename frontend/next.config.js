/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Keep trailing slashes intact so `/api/...` and `/health/` proxy straight
  // through to FastAPI instead of being 308-redirected (which would leak the
  // in-cluster backend host to the browser).
  skipTrailingSlashRedirect: true,
  async rewrites() {
    // Server-side proxy target. The browser always calls relative `/api/*`
    // and `/health/*` (so API_BASE stays ""); Next rewrites them to the
    // backend service inside the cluster. Overridable via BACKEND_URL.
    const backend = process.env.BACKEND_URL || 'http://dclaw-wiki-backend:8113';
    return [
      { source: '/api/:path*', destination: `${backend}/api/:path*` },
      { source: '/health/:path*', destination: `${backend}/health/:path*` },
    ];
  },
};
module.exports = nextConfig;
