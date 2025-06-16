/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: "drhyvorad",
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: "Lancer",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

module.exports = nextConfig;
