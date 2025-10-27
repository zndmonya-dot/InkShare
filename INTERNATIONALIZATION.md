# 国際化（i18n）設計書

## 🌍 概要

海外展開を見据えた多言語対応・タイムゾーン対応・文化的配慮の設計

---

## 🗣️ 多言語対応（i18n）

### 対応言語（優先順位）

1. **日本語（ja）**: 初期リリース ✅
2. **英語（en）**: Phase 1 - 最重要
3. **中国語簡体字（zh-CN）**: Phase 2
4. **韓国語（ko）**: Phase 2
5. **スペイン語（es）**: Phase 3
6. **フランス語（fr）**: Phase 3

---

## 📦 技術実装

### ライブラリ選定: next-intl

```bash
npm install next-intl
```

**理由**:
- Next.js App Routerと完全互換
- TypeScript完全対応
- ビルド時の型チェック
- 軽量（1.5KB gzipped）

---

## 📁 ディレクトリ構成

```
├── messages/               # 翻訳ファイル
│   ├── en.json            # 英語
│   ├── ja.json            # 日本語
│   ├── zh-CN.json         # 中国語
│   └── ko.json            # 韓国語
├── app/
│   └── [locale]/          # ロケール別ルーティング
│       ├── page.tsx       # メイン画面
│       └── team/          # チーム画面
└── middleware.ts          # 言語自動検出
```

---

## 🎯 ステータスの多言語対応

### 日本語（ja）
```json
{
  "status": {
    "available": "話しかけてOK",
    "busy": "取込中",
    "want_to_talk": "誰か雑談しましょう",
    "want_lunch": "お昼誘ってください",
    "need_help": "現在困っている",
    "going_home": "定時で帰りたい",
    "leaving": "帰宅",
    "out": "外出中"
  }
}
```

### 英語（en）
```json
{
  "status": {
    "available": "Available to talk",
    "busy": "Busy - Do not disturb",
    "want_to_talk": "Looking for a chat",
    "want_lunch": "Lunch anyone?",
    "need_help": "Need help",
    "going_home": "Wrapping up for the day",
    "leaving": "Left for the day",
    "out": "Out of office"
  }
}
```

### 中国語（zh-CN）
```json
{
  "status": {
    "available": "可以交谈",
    "busy": "忙碌中",
    "want_to_talk": "想聊天",
    "want_lunch": "一起吃午饭吗？",
    "need_help": "需要帮助",
    "going_home": "准备下班",
    "leaving": "已下班",
    "out": "外出中"
  }
}
```

### 韓国語（ko）
```json
{
  "status": {
    "available": "대화 가능",
    "busy": "바쁨 - 방해하지 마세요",
    "want_to_talk": "잡담하고 싶어요",
    "want_lunch": "점심 같이 드실래요?",
    "need_help": "도움이 필요해요",
    "going_home": "퇴근 준비 중",
    "leaving": "퇴근했어요",
    "out": "외출 중"
  }
}
```

---

## ⏰ タイムゾーン対応

### 自動時刻変更の課題

現在の実装:
```typescript
// 日本時間の17:00に固定
if (hours === 17 && minutes === 0) {
  setCurrentStatus('going-home')
}
```

### 解決策: ユーザー設定ベース

```typescript
import { formatInTimeZone } from 'date-fns-tz'

// ユーザー設定から退勤時刻を取得
const userSettings = {
  timezone: 'America/New_York',
  workEndTime: '17:00', // ユーザーのローカル時刻
}

// ユーザーのタイムゾーンで現在時刻を取得
const now = new Date()
const userTime = formatInTimeZone(now, userSettings.timezone, 'HH:mm')

if (userTime === userSettings.workEndTime) {
  setCurrentStatus('going-home')
}
```

---

## 🌏 文化的配慮

### ワークスタイルの違い

| 地域 | 特徴 | 対応 |
|-----|------|------|
| 🇯🇵 日本 | 残業文化、定時を気にする | 「定時で帰りたい」必須 |
| 🇺🇸 米国 | WFH文化、フレックス | 「在宅勤務」ステータス追加検討 |
| 🇪🇺 欧州 | ワークライフバランス重視 | 「休暇中」ステータス追加検討 |
| 🇨🇳 中国 | WeChat文化 | 絵文字・スタンプ検討 |

### ステータスの追加検討

```json
{
  "status": {
    "wfh": "在宅勤務（Working from home）",
    "vacation": "休暇中（On vacation）",
    "meeting": "会議中（In a meeting）",
    "focus": "集中時間（Focus time）"
  }
}
```

---

## 💰 決済の国際化

### 複数通貨対応

| 地域 | 通貨 | Pro | Enterprise |
|-----|------|-----|-----------|
| 🇯🇵 日本 | JPY | ¥980 | ¥9,800 |
| 🇺🇸 米国 | USD | $9.99 | $99.99 |
| 🇪🇺 欧州 | EUR | €8.99 | €89.99 |
| 🇬🇧 英国 | GBP | £7.99 | £79.99 |

### Stripe Pricing Tables

```typescript
const STRIPE_PRICING_TABLES = {
  ja: 'prctbl_xxxxx_ja',  // 円建て
  en: 'prctbl_xxxxx_en',  // ドル建て
  eu: 'prctbl_xxxxx_eu',  // ユーロ建て
}
```

---

## 📝 法規制対応

### GDPR（EU）
- [ ] Cookie同意バナー
- [ ] データポータビリティ
- [ ] 削除権（Right to be forgotten）
- [ ] データ処理の透明性

### CCPA（カリフォルニア）
- [ ] データ販売のオプトアウト
- [ ] 個人情報の開示請求

### プライバシーポリシー
- [ ] 多言語対応
- [ ] 地域別の法的要件

---

## 🚀 段階的な展開計画

### Phase 1: 英語対応（1-2ヶ月）
```
- [ ] next-intl導入
- [ ] 英語翻訳（ja → en）
- [ ] タイムゾーン対応
- [ ] 通貨選択（JPY/USD）
- [ ] プライバシーポリシー（英語版）
```

### Phase 2: アジア展開（3-6ヶ月）
```
- [ ] 中国語翻訳（zh-CN）
- [ ] 韓国語翻訳（ko）
- [ ] 各国の決済手段追加
- [ ] 現地サーバー検討（中国など）
```

### Phase 3: 欧州展開（6-12ヶ月）
```
- [ ] スペイン語・フランス語翻訳
- [ ] GDPR完全対応
- [ ] ユーロ建て決済
- [ ] 欧州サーバー（GDPR要件）
```

---

## 🛠️ 実装例

### middleware.ts（言語自動検出）
```typescript
import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['ja', 'en', 'zh-CN', 'ko'],
  defaultLocale: 'ja',
  localeDetection: true, // ブラウザ言語から自動検出
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
```

### app/[locale]/layout.tsx
```typescript
import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return [{ locale: 'ja' }, { locale: 'en' }]
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
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

### コンポーネントでの使用
```typescript
import { useTranslations } from 'next-intl'

export function StatusButton() {
  const t = useTranslations('status')
  
  return (
    <button>
      {t('available')} // 「話しかけてOK」or "Available to talk"
    </button>
  )
}
```

---

## 🌐 SEO・マーケティング

### 各言語のランディングページ
```
https://yourapp.com/ja       # 日本語
https://yourapp.com/en       # 英語
https://yourapp.com/zh-CN    # 中国語
```

### hreflang対応
```html
<link rel="alternate" hreflang="ja" href="https://yourapp.com/ja" />
<link rel="alternate" hreflang="en" href="https://yourapp.com/en" />
<link rel="alternate" hreflang="x-default" href="https://yourapp.com/en" />
```

---

## 💡 ローカライゼーションのベストプラクティス

### ✅ Do
- **文化的配慮**: 各国の働き方に合わせたステータス
- **日付・時刻**: ユーザーのタイムゾーンで表示
- **数値・通貨**: 各国のフォーマットに対応
- **アイコン**: 普遍的なものを使用

### ❌ Don't
- **直訳**: 文脈を考慮した自然な翻訳
- **日本特有の表現**: 「定時」は英語で "end of workday"
- **絵文字の多用**: 文化によって意味が異なる
- **色の意味**: 赤=危険は世界共通ではない

---

## 📊 市場別の優先度

### 市場規模予測
```
1. 🇺🇸 米国: 最大市場（英語圏全体）
2. 🇪🇺 欧州: 高単価市場
3. 🇯🇵 日本: 初期市場（実証済み）
4. 🇨🇳 中国: 成長市場（規制注意）
5. 🇮🇳 インド: 新興市場（英語OK）
```

### ターゲット
- **スタートアップ**: 10-50人規模
- **リモートワーク企業**: 分散チーム
- **エンジニアリングチーム**: プロダクト開発部門

---

Made with 🦑 for the world 🌍

