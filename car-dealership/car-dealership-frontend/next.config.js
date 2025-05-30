/** @type {import('next').NextConfig} */
const path = require('path');

// Dominios permitidos para imágenes
const allowedImageDomains = [
  'localhost',
  'res.cloudinary.com',
  'api.example.com',
];

// Configuración de CORS
const isDevelopment = process.env.NODE_ENV === 'development';
const allowedOrigins = isDevelopment
  ? ['http://localhost:3000', 'http://localhost:8000']
  : [process.env.NEXT_PUBLIC_API_URL || 'https://tu-dominio.com'];

const corsHeaders = [
  {
    key: 'Access-Control-Allow-Credentials',
    value: 'true',
  },
  {
    key: 'Access-Control-Allow-Methods',
    value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
  },
  {
    key: 'Access-Control-Allow-Headers',
    value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
  },
];

// Middleware para manejar CORS dinámicamente
const corsMiddleware = (req) => {
  const origin = req.headers.get('origin');
  const isAllowedOrigin = allowedOrigins.some(allowedOrigin => 
    origin && origin.startsWith(allowedOrigin)
  );

  const headers = new Headers();
  
  // Configurar las cabeceras CORS
  headers.set('Access-Control-Allow-Credentials', 'true');
  headers.set('Access-Control-Allow-Origin', isAllowedOrigin ? origin : allowedOrigins[0]);
  headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  headers.set(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  return headers;
};

const nextConfig = {
  // Configuración de imágenes
  images: {
    domains: allowedImageDomains,
  },
  
  // Variables de entorno
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    NODE_ENV: process.env.NODE_ENV || 'development',
  },
  
  // Habilitar React Strict Mode
  reactStrictMode: true,
  
  // Configuración de alias de rutas
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
  
  // Configuración de cabeceras HTTP
  async headers() {
    return [
      {
        // Aplicar CORS dinámico a todas las rutas de la API
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { 
            key: 'Access-Control-Allow-Origin',
            value: isDevelopment ? '*' : allowedOrigins[0] 
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
          },
        ],
      },
      {
        // Asegurar que las páginas puedan ser incrustadas en iframes del mismo origen
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Configuración de CSP (Content Security Policy)
          {
            key: 'Content-Security-Policy',
            value: [
              `default-src 'self' ${isDevelopment ? 'http://localhost:3000' : ''} ${process.env.NEXT_PUBLIC_API_URL || ''};`,
              `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${isDevelopment ? 'http://localhost:3000' : ''};`,
              `connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'} ${isDevelopment ? 'ws://localhost:3000' : ''};`,
              "style-src 'self' 'unsafe-inline';",
              "img-src 'self' data: blob: https:;",
              "font-src 'self';",
              "frame-ancestors 'self';",
              "form-action 'self';",
              "base-uri 'self';",
            ].join(' '),
          },
        ],
      },
    ];
  },
  
  // Configuración de compresión
  compress: true,
  
  // Configuración de caché HTTP
  generateEtags: true,
};

// Log de configuración cargada
if (process.env.NODE_ENV !== 'production') {
  console.log('Next.js config loaded with the following settings:', {
    nodeEnv: process.env.NODE_ENV,
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    imageDomains: allowedImageDomains,
  });
}

module.exports = nextConfig;
