/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['www.plantuml.com'],
  },
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
}

module.exports = nextConfig
