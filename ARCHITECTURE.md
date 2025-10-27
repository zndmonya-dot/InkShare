# アーキテクチャ設計書

## システム概要

「話しかけやすさ」に特化した在籍管理ツール
- エンジニア向けコミュニケーション支援
- リアルタイムステータス共有
- PWA対応のスマホアプリ

---

## 技術スタック

### フロントエンド
- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **PWA**: Service Worker + manifest.json
- **状態管理**: React Hooks
- **リアルタイム**: Supabase Realtime
- **デプロイ**: Vercel

### バックエンド（Supabase）
- **認証**: Supabase Auth
- **データベース**: PostgreSQL
- **セキュリティ**: RLS (Row Level Security)
- **リアルタイム**: Supabase Realtime
- **API**: 自動生成REST API

---

## システム構成図

```
┌─────────────────────────────────────────────┐
│         フロントエンド（Next.js）              │
│  ┌──────────────────────────────────────┐   │
│  │  PWA (スマホアプリ化)                  │   │
│  │  - ステータス変更画面（/）             │   │
│  │  - チーム一覧画面（/team）             │   │
│  │  - 通知機能                           │   │
│  └──────────────────────────────────────┘   │
└─────────────────┬───────────────────────────┘
                  │ HTTPS / WebSocket
                  ↓
┌─────────────────────────────────────────────┐
│         Supabase（BaaS）                     │
│  ┌──────────────────────────────────────┐   │
│  │  認証 (Auth)                          │   │
│  │  - メール認証                          │   │
│  │  - Google OAuth (将来)                │   │
│  └──────────────────────────────────────┘   │
│  ┌──────────────────────────────────────┐   │
│  │  データベース (PostgreSQL)             │   │
│  │  - organizations                      │   │
│  │  - users                              │   │
│  │  - user_status                        │   │
│  │  - notifications                      │   │
│  │  - RLS（行レベルセキュリティ）          │   │
│  └──────────────────────────────────────┘   │
│  ┌──────────────────────────────────────┐   │
│  │  Realtime (リアルタイム同期)           │   │
│  │  - ステータス変更を即座に反映           │   │
│  │  - 通知のリアルタイム配信               │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

---

## データベース設計

### organizations（組織）
```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  invite_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);
```

### users（ユーザー）
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_color TEXT NOT NULL,
  organization_id UUID REFERENCES organizations(id),
  role TEXT DEFAULT 'member', -- 'admin' | 'member'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### user_status（ユーザーステータス）
```sql
CREATE TABLE user_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) UNIQUE,
  organization_id UUID REFERENCES organizations(id),
  status TEXT NOT NULL DEFAULT 'available',
  custom_status_1_label TEXT DEFAULT 'カスタム1',
  custom_status_1_icon TEXT DEFAULT 'ri-star-line',
  custom_status_2_label TEXT DEFAULT 'カスタム2',
  custom_status_2_icon TEXT DEFAULT 'ri-star-line',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### notifications（通知）
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user_id UUID REFERENCES users(id),
  to_user_id UUID REFERENCES users(id),
  organization_id UUID REFERENCES organizations(id),
  type TEXT NOT NULL, -- 'want_to_talk' | 'help' | 'lunch' | 'chat'
  message TEXT,
  status TEXT DEFAULT 'pending', -- 'pending' | 'accepted' | 'declined'
  replied_at TIMESTAMPTZ,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX idx_notifications_to_user 
  ON notifications(to_user_id, status, created_at DESC);
```

---

## セキュリティ設計（RLS）

### user_status テーブル
```sql
-- 同じ組織のメンバーのステータスのみ閲覧可能
CREATE POLICY "view_organization_status"
  ON user_status FOR SELECT
  USING (
    organization_id = (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

-- 自分のステータスのみ更新可能
CREATE POLICY "update_own_status"
  ON user_status FOR UPDATE
  USING (user_id = auth.uid());
```

### notifications テーブル
```sql
-- 自分宛ての通知のみ閲覧可能
CREATE POLICY "view_own_notifications"
  ON notifications FOR SELECT
  USING (to_user_id = auth.uid());

-- 同じ組織のメンバーにのみ通知送信可能
CREATE POLICY "send_to_organization"
  ON notifications FOR INSERT
  WITH CHECK (
    organization_id = (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );
```

---

## データフロー

### ステータス変更
```
1. ユーザーがボタンタップ
   ↓
2. supabase.from('user_status').update()
   ↓
3. RLSチェック → データベース更新
   ↓
4. Realtime配信
   ↓
5. 他のユーザーの画面が自動更新
```

### 通知送信
```
1. ユーザーAがメンバーBをタップ
   ↓
2. アクションボタン選択
   ↓
3. supabase.from('notifications').insert()
   ↓
4. Realtime配信
   ↓
5. ユーザーBに通知ポップアップ
   ↓
6. ユーザーBが「はい/いいえ」返信
   ↓
7. supabase.from('notifications').update()
   ↓
8. ユーザーAに結果通知
```

---

## 画面遷移

```
/login (未認証時)
  ↓
/onboarding (初回のみ)
  ├─ 組織作成
  └─ 組織参加（招待コード入力）
  ↓
/ (メイン画面)
  - ステータス変更パネル（2×5グリッド）
  - 「チームを見る」ボタン
  ↓
/team (チーム一覧)
  - メンバーグリッド表示
  - ステータスフィルター
  - メンバー詳細モーダル
  ↓
/settings (設定画面)
  - プロフィール編集
  - 組織管理（管理者のみ）
```

---

## マネタイズ戦略

### プラン構成
```
無料プラン
├─ 10人まで
├─ 基本ステータス機能
├─ カスタムステータス（2個）
└─ PWA利用

有料プラン（¥980/月）
├─ 50人まで
├─ カスタムステータス無制限
├─ 通知機能
├─ 統計・分析
└─ メールサポート

企業プラン（¥9,800/月〜）
├─ 無制限
├─ 複数チーム管理
├─ API提供
├─ カスタムブランディング
└─ SLA保証
```

---

## 実装フェーズ

### Phase 1: MVP（最小機能）
- [ ] Supabase認証
- [ ] 組織作成・参加
- [ ] ステータスのリアルタイム同期
- [ ] 基本的なチーム表示

### Phase 2: 通知機能
- [ ] 通知送信
- [ ] はい/いいえ返信
- [ ] 通知履歴

### Phase 3: 有料化準備
- [ ] プラン管理
- [ ] 決済連携（Stripe）
- [ ] 使用量制限

### Phase 4: エンタープライズ
- [ ] 複数チーム管理
- [ ] API提供
- [ ] 統計・分析

