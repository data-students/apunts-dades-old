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
  output: "standalone",
}

module.exports = nextConfig
