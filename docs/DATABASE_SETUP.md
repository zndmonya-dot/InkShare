# 🦑 データベースセットアップガイド

## 📋 必要なもの

- PostgreSQL 16 (ローカル開発用)
- または Supabase アカウント (本番用)

---

## 🏠 ローカル開発環境のセットアップ

### 1. PostgreSQLがインストールされているか確認

```bash
psql --version
# PostgreSQL 16.x と表示されればOK
```

### 2. データベースを作成

```bash
# PostgreSQLに接続（Windows）
psql -U postgres

# データベースを作成
CREATE DATABASE presence_app;

# 接続確認
\c presence_app

# 終了
\q
```

### 3. スキーマを適用

```bash
# プロジェクトルートで実行
psql -U postgres -d presence_app -f db/schema.sql
```

### 4. 環境変数を設定

`.env.local` ファイルを作成：

```env
DATABASE_URL=postgresql://postgres:your-password@localhost:5432/presence_app
JWT_SECRET=dev-secret-key-for-local
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **💡 重要:** `your-password` を実際のPostgreSQLパスワードに変更してください

### 5. 接続テスト

開発サーバーを起動して確認：

```bash
npm run dev
```

コンソールにエラーが出なければ成功！🎉

---

## ☁️ Supabase (本番環境) セットアップ

### 1. Supabaseプロジェクトを作成

1. [Supabase](https://supabase.com) にアクセス
2. 「New Project」をクリック
3. プロジェクト情報を入力：
   - Name: `presence-app`
   - Database Password: 強力なパスワード（保存してください）
   - Region: `Northeast Asia (Tokyo)`（推奨）
4. 「Create new project」をクリック

### 2. スキーマを適用

1. Supabaseダッシュボードで「SQL Editor」を開く
2. `db/schema.sql` の内容をコピー＆ペースト
3. 「Run」をクリック

### 3. 接続情報を取得

1. 「Settings」→「Database」に移動
2. 「Connection string」の「URI」をコピー
3. Vercelの環境変数に設定：
   ```
   DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
   ```

---

## 🔧 トラブルシューティング

### PostgreSQLに接続できない

**Windows:**
```bash
# サービスが起動しているか確認
sc query postgresql-x64-16

# 起動していない場合
net start postgresql-x64-16
```

### パスワード認証エラー

`.env.local` のパスワードが正しいか確認してください。

### テーブルが作成されない

```sql
-- PostgreSQLに接続して確認
psql -U postgres -d presence_app

-- テーブル一覧を表示
\dt

-- 存在しない場合はスキーマを再実行
\i db/schema.sql
```

---

## 📊 データベース構造

```
organizations (組織)
  └─ users (ユーザー)
       └─ user_status (ステータス)
```

### テーブル数: 3
- `organizations`: チーム/組織情報
- `users`: ユーザー情報
- `user_status`: 各ユーザーの現在のステータス

---

## 🔐 セキュリティ

- パスワードはbcryptでハッシュ化
- JWT認証でセッション管理
- HTTPOnly Cookieで保護
- マルチテナント対応（組織ごとにデータ分離）

---

Made with 🦑 by エンジニアのためのエンジニア

