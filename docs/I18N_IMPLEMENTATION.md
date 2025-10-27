# 多言語対応 実装ガイド

## 📦 セットアップ完了

### インストール済み
```bash
✅ next-intl
```

### 作成済みファイル
```
✅ messages/ja.json          # 日本語
✅ messages/en.json          # 英語
✅ messages/zh-CN.json       # 中国語
✅ messages/ko.json          # 韓国語
✅ i18n.ts                   # 設定
✅ middleware.ts             # 言語自動検出
✅ next.config.js            # Next.js設定
```

---

## 🚀 次のステップ

### 1. アプリ構造の変更

現在の構造:
```
app/
├── page.tsx
├── team/
│   └── page.tsx
└── layout.tsx
```

変更後:
```
app/
└── [locale]/              # ← 言語ごとのルーティング
    ├── page.tsx
    ├── team/
    │   └── page.tsx
    └── layout.tsx
```

### 2. 各ファイルの移動

```bash
# 手動で移動
mkdir app/[locale]
mv app/page.tsx app/[locale]/page.tsx
mv app/team app/[locale]/team
mv app/layout.tsx app/[locale]/layout.tsx
```

### 3. layout.tsx の更新

```typescript
// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import './globals.css'
import { RegisterServiceWorker } from './register-sw'

export function generateStaticParams() {
  return [
    { locale: 'ja' },
    { locale: 'en' },
    { locale: 'zh-CN' },
    { locale: 'ko' },
  ]
}

export const metadata: Metadata = {
  title: '在籍管理ツール - 話しかけやすさの可視化',
  description: '「話しかけて良いかどうか」を可視化するエンジニア向けコミュニケーション支援ツール',
  manifest: '/manifest.json',
  themeColor: '#BFFF00',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '在籍管理',
  },
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  let messages
  try {
    messages = (await import(`@/messages/${locale}.json`)).default
  } catch (error) {
    notFound()
  }

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <link href="https://cdn.jsdelivr.net/npm/remixicon@4.0.0/fonts/remixicon.css" rel="stylesheet" />
      </head>
      <body className="bg-surface text-on-surface antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <RegisterServiceWorker />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

---

## 📝 コンポーネントでの使用方法

### サーバーコンポーネント
```typescript
import { useTranslations } from 'next-intl'

export default function ServerComponent() {
  const t = useTranslations('status')
  
  return <h1>{t('available')}</h1>
}
```

### クライアントコンポーネント
```typescript
'use client'

import { useTranslations } from 'next-intl'

export default function ClientComponent() {
  const t = useTranslations('status')
  
  return <button>{t('available')}</button>
}
```

### config/status.ts の更新例

現在:
```typescript
export const STATUS_OPTIONS: StatusConfig[] = [
  {
    status: 'available',
    label: '話しかけてOK',
    icon: 'ri-checkbox-circle-line',
    activeColor: 'bg-lime-400',
    glowColor: 'shadow-lime-400/50',
  },
  // ...
]
```

多言語対応後:
```typescript
// ラベルは翻訳キーに変更
export const STATUS_OPTIONS: StatusConfig[] = [
  {
    status: 'available',
    labelKey: 'status.available',  // ← 翻訳キー
    icon: 'ri-checkbox-circle-line',
    activeColor: 'bg-lime-400',
    glowColor: 'shadow-lime-400/50',
  },
  // ...
]

// 使用側で翻訳
function StatusButton() {
  const t = useTranslations()
  
  return STATUS_OPTIONS.map(option => (
    <button key={option.status}>
      {t(option.labelKey)}
    </button>
  ))
}
```

---

## 🌐 言語切り替えの実装

### LanguageSwitcher コンポーネント

```typescript
'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  
  const changeLanguage = (newLocale: string) => {
    // 現在のパスから言語部分を置き換え
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPath)
  }
  
  return (
    <select
      value={locale}
      onChange={(e) => changeLanguage(e.target.value)}
      className="px-3 py-2 bg-white/10 text-white rounded-lg"
    >
      <option value="ja">🇯🇵 日本語</option>
      <option value="en">🇺🇸 English</option>
      <option value="zh-CN">🇨🇳 简体中文</option>
      <option value="ko">🇰🇷 한국어</option>
    </select>
  )
}
```

### ヘッダーに追加
```typescript
// app/[locale]/page.tsx
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

export default function Home() {
  return (
    <header>
      <h1>在籍管理</h1>
      <LanguageSwitcher />
    </header>
  )
}
```

---

## 🔗 リンクの更新

### 従来
```typescript
<Link href="/team">チームを見る</Link>
```

### 多言語対応後
```typescript
import { Link } from '@/navigation'  // next-intlのLink

<Link href="/team">チームを見る</Link>
// 自動で /ja/team、/en/team などに変換される
```

### navigation.ts を作成
```typescript
// navigation.ts
import { createSharedPathnamesNavigation } from 'next-intl/navigation'
import { locales } from './i18n'

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales })
```

---

## 📱 タイムゾーン対応

### date-fns-tz のインストール
```bash
npm install date-fns date-fns-tz
```

### 自動時刻変更の更新

従来:
```typescript
// 日本時間固定
if (hours === 17 && minutes === 0) {
  setCurrentStatus('going-home')
}
```

更新後:
```typescript
import { formatInTimeZone } from 'date-fns-tz'

// ユーザーのタイムゾーンを取得（ブラウザから）
const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

// ユーザー設定から退勤時刻を取得（デフォルト17:00）
const workEndTime = '17:00'

useEffect(() => {
  const checkTime = () => {
    const now = new Date()
    const userTime = formatInTimeZone(now, userTimezone, 'HH:mm')
    
    if (userTime === workEndTime) {
      setCurrentStatus('going-home')
    }
  }
  
  const interval = setInterval(checkTime, 60000)
  return () => clearInterval(interval)
}, [])
```

---

## 🧪 テスト

### 言語切り替えのテスト
1. ブラウザで http://localhost:3000 にアクセス
2. 自動で http://localhost:3000/ja にリダイレクトされる
3. 手動で http://localhost:3000/en にアクセス
4. 英語表示されることを確認

### ブラウザ言語による自動検出
1. ブラウザの言語設定を英語に変更
2. http://localhost:3000 にアクセス
3. 自動で /en にリダイレクトされる

---

## ⚠️ 注意点

### 1. 既存のパスが変わる
- 従来: `/team`
- 変更後: `/ja/team`, `/en/team`, ...

### 2. Service Worker の更新が必要
```javascript
// public/sw.js
const urlsToCache = [
  '/ja/',
  '/en/',
  '/zh-CN/',
  '/ko/',
  '/manifest.json',
  '/icon.svg',
]
```

### 3. manifest.json の多言語対応
```json
{
  "name": "在籍管理ツール",
  "short_name": "在籍管理",
  "lang": "ja",
  ...
}
```

各言語ごとにmanifestを用意するか、動的に生成する必要がある

---

## 📊 実装の優先順位

### Phase 1: 基本実装（今すぐ）
- [x] next-intlインストール
- [x] 翻訳ファイル作成（ja, en, zh-CN, ko）
- [x] 設定ファイル作成
- [ ] app構造の変更（[locale]フォルダ）
- [ ] 既存コンポーネントの更新

### Phase 2: UI改善（1週間以内）
- [ ] 言語切り替えボタン
- [ ] タイムゾーン対応
- [ ] 日付・時刻のフォーマット

### Phase 3: 最適化（2週間以内）
- [ ] SEO対応（hreflang）
- [ ] 多言語sitemap
- [ ] 各言語のランディングページ

---

## 🎯 実装チェックリスト

- [x] next-intlインストール
- [x] 翻訳ファイル作成
- [x] i18n.ts作成
- [x] middleware.ts作成
- [x] next.config.js更新
- [ ] appフォルダ構造変更
- [ ] layout.tsx更新
- [ ] page.tsx更新（'use client'追加）
- [ ] config/status.ts更新
- [ ] LanguageSwitcher作成
- [ ] タイムゾーン対応
- [ ] Service Worker更新
- [ ] テスト

---

次のステップ: `app/[locale]` フォルダ構造への移行を実施しますか？

