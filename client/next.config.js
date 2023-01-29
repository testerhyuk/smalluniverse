/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "www.gravatar.com",
      'localhost', 
      'ec2-54-238-235-34.ap-northeast-1.compute.amazonaws.com'
    ],
  }
}

module.exports = nextConfig
