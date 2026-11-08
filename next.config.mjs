/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Phase 2+: add Supabase storage hostnames here when real images are used
  // images: { remotePatterns: [{ protocol: "https", hostname: "YOUR-PROJECT.supabase.co" }] },
};

export default nextConfig;
