import type { Metadata, Viewport } from 'next'
import './globals.css'
import { RegisterServiceWorker } from './register-sw'

export const metadata: Metadata = {
  title: '在籍管理ツール - 話しかけやすさの可視化',
  description: '「話しかけて良いかどうか」を可視化するエンジニア向けコミュニケーション支援ツール',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '在籍管理',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
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
        {children}
      </body>
    </html>
  )
}
