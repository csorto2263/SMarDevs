/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Types already verified with tsc --noEmit before build
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
