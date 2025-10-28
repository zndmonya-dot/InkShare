/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // パフォーマンス最適化
  swcMinify: true, // SWCコンパイラで高速化
  
  // コンパイラ最適化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // 実験的機能（パフォーマンス向上）
  experimental: {
    optimizeCss: true, // CSS最適化
    optimizePackageImports: ['@/components', '@/lib'], // インポート最適化
  },
  
  // 画像最適化
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

module.exports = nextConfig
