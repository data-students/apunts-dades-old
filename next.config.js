/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "*.googleusercontent.com",
      },
      {
        hostname: "uploadthing.com",
      },
    ],
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
