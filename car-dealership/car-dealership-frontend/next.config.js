/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  env: {
    API_URL: 'http://localhost:8000'
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
