# 開発ガイド

## 🎯 今日の成果（完了）

### ✅ UI/UX実装
- [x] スプラトゥーン風デザイン
- [x] 2×5グリッドレイアウト
- [x] カスタムステータス（2個）
- [x] 自動時刻変更（17:00→定時で帰りたい）
- [x] チーム一覧画面
- [x] ステータスフィルター
- [x] メンバー詳細モーダル
- [x] ステータス別アクション制御
- [x] PWA対応

### ✅ リファクタリング
- [x] 型定義の整理（types/index.ts）
- [x] ステータス設定の共通化（config/status.ts）
- [x] 通知コンポーネント作成
  - NotificationModal（受信側）
  - NotificationResultModal（送信側結果）

### ✅ ドキュメント作成
- [x] ARCHITECTURE.md（アーキテクチャ設計書）
- [x] README.md（プロジェクト概要）
- [x] DEVELOPMENT.md（このファイル）

---

## 📋 次のステップ（優先順位）

### Phase 1: Supabaseセットアップ
**目標**: バックエンド基盤の構築

```bash
# 1. Supabaseプロジェクト作成
# https://supabase.com/dashboard

# 2. 環境変数設定
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# 3. Supabaseクライアントのインストール
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

**タスク**:
- [ ] Supabaseプロジェクト作成
- [ ] 環境変数設定
- [ ] Supabaseクライアント設定
- [ ] データベーステーブル作成
- [ ] RLSポリシー設定

### Phase 2: 認証実装
**目標**: ユーザー登録・ログイン機能

**タスク**:
- [ ] ログイン画面作成
- [ ] サインアップ画面作成
- [ ] 認証状態管理
- [ ] 保護されたルート設定
- [ ] ログアウト機能

### Phase 3: 組織管理
**目標**: マルチテナント機能

**タスク**:
- [ ] 組織作成画面
- [ ] 招待コード生成
- [ ] 組織参加画面
- [ ] 組織設定画面（管理者のみ）

### Phase 4: リアルタイム同期
**目標**: ステータスのリアルタイム共有

**タスク**:
- [ ] Supabase Realtimeセットアップ
- [ ] ステータス変更のリアルタイム反映
- [ ] チーム一覧の自動更新
- [ ] オンライン/オフライン表示

### Phase 5: 通知機能
**目標**: メンバー間の通知送受信

**タスク**:
- [ ] 通知データベース連携
- [ ] 通知送信機能
- [ ] 通知受信・表示
- [ ] 返信機能（はい/いいえ）
- [ ] 通知履歴表示
- [ ] 未読バッジ

---

## 🛠️ 開発ルール

### コーディング規約
```typescript
// ✅ Good: 明示的な型定義
export interface User {
  id: string
  name: string
}

// ❌ Bad: any型の使用
const data: any = {}

// ✅ Good: 共通設定の利用
import { STATUS_OPTIONS } from '@/config/status'

// ❌ Bad: ハードコーディング
const statuses = ['available', 'busy', ...]
```

### ファイル命名規則
- **コンポーネント**: PascalCase (StatusButton.tsx)
- **設定ファイル**: kebab-case (status.ts)
- **型定義**: index.ts（ディレクトリごと）
- **ドキュメント**: UPPER_SNAKE_CASE.md

### コミットメッセージ
```bash
# 機能追加
feat: 通知機能の実装

# バグ修正
fix: ステータス変更時のバグ修正

# リファクタリング
refactor: 型定義の整理

# ドキュメント
docs: README更新

# スタイル
style: スプラトゥーン風カラー適用
```

---

## 📁 ファイル構成のルール

### 新しいコンポーネントを追加する場合
```
components/
├── NewComponent.tsx          # コンポーネント本体
└── NewComponent.test.tsx     # テスト（将来）
```

### 新しい型を追加する場合
```typescript
// types/index.ts に追加
export interface NewType {
  // ...
}
```

### 新しい設定を追加する場合
```typescript
// config/settings.ts などに追加
export const NEW_CONFIG = {
  // ...
}
```

---

## 🐛 デバッグ

### 開発サーバーが起動しない場合
```bash
# ポート3000が使用中の場合
taskkill /F /IM node.exe  # Windows
kill -9 $(lsof -ti:3000)  # Mac/Linux

# キャッシュクリア
rm -rf .next
npm run dev
```

### PWAが更新されない場合
```bash
# Service Workerのキャッシュをクリア
# ブラウザの開発者ツール → Application → Clear storage
```

---

## 📊 パフォーマンス

### 最適化済み
- [x] Tailwind CSS（JIT）
- [x] Next.js Image最適化
- [x] Dynamic Import（コード分割）
- [x] Service Worker（キャッシング）

### 今後の最適化
- [ ] React Query（データフェッチング）
- [ ] Suspense（ローディング状態）
- [ ] Intersection Observer（遅延読み込み）

---

## 🧪 テスト（将来実装）

### テスト戦略
```bash
# ユニットテスト
npm run test:unit

# E2Eテスト
npm run test:e2e

# カバレッジ
npm run test:coverage
```

### テストフレームワーク（予定）
- **Jest**: ユニットテスト
- **React Testing Library**: コンポーネントテスト
- **Playwright**: E2Eテスト

---

## 📝 メモ

### 設計上の決定事項
1. **フリーミアムモデル**: 無料10人、Pro 50人、Enterprise無制限
2. **通知は「はい/いいえ」のみ**: シンプルさを保つ
3. **外部連携なし**: スタンドアロンで動作
4. **マルチテナント**: 組織ごとにデータ分離
5. **RLS**: Supabaseのセキュリティ機能を最大限活用

### 技術的な決定事項
1. **Supabase**: コスト効率とリアルタイム機能のため
2. **Vercel**: Next.jsとの相性が良い
3. **Tailwind CSS**: カスタマイズしやすい
4. **TypeScript**: 型安全性のため

---

## 🔗 参考リンク

### ドキュメント
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [PWA Guide](https://web.dev/progressive-web-apps/)

### デザイン参考
- [Splatoon公式](https://splatoon.nintendo.com/)
- [Material Design 3](https://m3.material.io/)
- [Remixicon](https://remixicon.com/)

---

Made with 🦑

