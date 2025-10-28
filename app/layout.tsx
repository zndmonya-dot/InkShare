import type { Metadata, Viewport } from 'next'
import './globals.css'
import { RegisterServiceWorker } from './register-sw'
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt'
import { NotificationPermissionPrompt } from '@/components/NotificationPermissionPrompt'

export const metadata: Metadata = {
  title: 'InkLink - 話しかけやすさを可視化',
  description: 'チームの今をリアルタイムで共有する、ステータス管理ツール。話しかけて良いかがすぐわかる。',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'InkLink',
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
