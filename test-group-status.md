# グループごとのステータス機能テスト手順

## ✅ マイグレーション完了後の確認

### 1. アプリケーションを再起動
```bash
npm run dev
```

### 2. テストシナリオ

#### シナリオA: 複数グループでステータスが独立しているか確認

1. **グループ1に参加**
   - ステータスを「取込中」に変更
   - カスタム1を「勉強中」に設定

2. **グループ2に切り替え**
   - ステータスが「話しかけてOK」（デフォルト）になっているか確認
   - カスタム1が「カスタム1」（デフォルト）になっているか確認
   - ステータスを「定時で帰りたい」に変更

3. **グループ1に戻る**
   - ステータスが「取込中」のままか確認
   - カスタム1が「勉強中」のままか確認

#### シナリオB: 新しいグループを作成した時

1. **新しいグループを作成**
   - デフォルトステータス「話しかけてOK」になっているか確認
   - デフォルトカスタムステータスになっているか確認

### 3. 期待される動作

✅ **グループごとに独立したステータス**
- グループAで「取込中」
- グループBで「定時で帰りたい」
- グループAに戻ると「取込中」のまま

✅ **カスタムステータスもグループごと**
- グループAのカスタム1: 「勉強中」
- グループBのカスタム1: 「会議中」
- それぞれ独立して保存される

### 4. トラブルシューティング

#### エラー: `column "organization_id" cannot be null`
→ マイグレーションのステップ5が正しく実行されていない可能性があります

```sql
-- 既存データの確認
SELECT * FROM user_status WHERE organization_id IS NULL;

-- 手動で修正
UPDATE user_status us
SET organization_id = (
  SELECT organization_id 
  FROM user_organizations uo 
  WHERE uo.user_id = us.user_id 
    AND uo.is_active = true 
  LIMIT 1
)
WHERE organization_id IS NULL;
```

#### エラー: `duplicate key value violates unique constraint`
→ 既存データに重複がある可能性があります

```sql
-- 重複データの確認
SELECT user_id, organization_id, COUNT(*) 
FROM user_status 
GROUP BY user_id, organization_id 
HAVING COUNT(*) > 1;

-- 古いレコードを削除（updated_atが古い方）
DELETE FROM user_status a
USING user_status b
WHERE a.user_id = b.user_id 
  AND a.organization_id = b.organization_id
  AND a.updated_at < b.updated_at;
```

## 🔍 データベース確認クエリ

```sql
-- ユーザーのステータス一覧を確認
SELECT 
  u.name AS user_name,
  o.name AS org_name,
  us.status,
  us.custom1_label,
  us.custom2_label,
  us.updated_at
FROM user_status us
JOIN users u ON us.user_id = u.id
JOIN organizations o ON us.organization_id = o.id
ORDER BY u.name, o.name;
```

```sql
-- テーブル構造を確認
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'user_status';
```

```sql
-- 制約を確認
SELECT conname, contype 
FROM pg_constraint 
WHERE conrelid = 'user_status'::regclass;
```

