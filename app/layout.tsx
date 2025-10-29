import type { Metadata, Viewport } from 'next'
import './globals.css'
import { RegisterServiceWorker } from './register-sw'
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt'
import { NotificationPermissionPrompt } from '@/components/NotificationPermissionPrompt'

export const metadata: Metadata = {
  title: 'Inkshare - 話しかけやすさを可視化',
  description: 'チームの今をリアルタイムで共有する、ステータス管理ツール。話しかけて良いかがすぐわかる。',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Inkshare',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#BFFF00',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <link href="https://cdn.jsdelivr.net/npm/remixicon@4.0.0/fonts/remixicon.css" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700;800;900&family=Kosugi+Maru&display=swap" rel="stylesheet" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-surface text-on-surface antialiased">
        <RegisterServiceWorker />
        <PWAInstallPrompt />
        <NotificationPermissionPrompt />
        {children}
      </body>
    </html>
  )
}
