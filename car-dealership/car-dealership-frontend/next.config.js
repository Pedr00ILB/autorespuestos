/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  env: {
    API_URL: 'http://localhost:8000'
  },
  reactStrictMode: true,
  // Configuración de logging para depuración
  async rewrites() {
    console.log('Next.js config loaded - rewrites function called');
    return [];
  },
  async redirects() {
    console.log('Next.js config loaded - redirects function called');
    return [];
  },
};

// Log cuando se carga la configuración
console.log('Next.js config loaded');

module.exports = nextConfig;
