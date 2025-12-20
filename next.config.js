/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Убеждаемся, что переменные окружения доступны на сервере
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
}

module.exports = nextConfig

