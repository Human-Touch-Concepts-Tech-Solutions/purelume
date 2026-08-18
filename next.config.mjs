/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Adjust as needed (e.g., '10mb' or '25mb')
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Allows Supabase storage images in <Image />
      },
    ],
  },
};

export default nextConfig;