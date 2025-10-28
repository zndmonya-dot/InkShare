-- ========================================
-- マイグレーション002の修正版
-- NULLデータを処理してから制約を追加
-- ========================================

-- 1. organization_idカラムを追加（既に追加済みの場合はスキップされる）
ALTER TABLE user_status 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

-- 2. 既存のUNIQUE制約を削除
ALTER TABLE user_status 
DROP CONSTRAINT IF EXISTS user_status_user_id_key;

-- 3. 既存データに現在のアクティブ組織IDを設定
UPDATE user_status us
SET organization_id = uo.organization_id
FROM user_organizations uo
WHERE us.user_id = uo.user_id 
  AND uo.is_active = true
  AND us.organization_id IS NULL;

-- 4. まだNULLが残っている場合、最初の組織を設定（フォールバック）
UPDATE user_status us
SET organization_id = (
  SELECT organization_id 
  FROM user_organizations uo 
  WHERE uo.user_id = us.user_id 
  LIMIT 1
)
WHERE us.organization_id IS NULL;

-- 5. それでもNULLが残っている場合は削除（孤立データ）
DELETE FROM user_status
WHERE organization_id IS NULL;

-- 6. 新しいUNIQUE制約を追加（user_id + organization_idの組み合わせ）
ALTER TABLE user_status 
DROP CONSTRAINT IF EXISTS user_status_user_org_unique;

ALTER TABLE user_status 
ADD CONSTRAINT user_status_user_org_unique UNIQUE(user_id, organization_id);

-- 7. インデックスを追加
CREATE INDEX IF NOT EXISTS idx_user_status_org ON user_status(organization_id);

-- 8. 最後にorganization_idをNOT NULLに変更
ALTER TABLE user_status 
ALTER COLUMN organization_id SET NOT NULL;

-- 完了メッセージ
DO $$
BEGIN
  RAISE NOTICE 'マイグレーション002が正常に完了しました';
END $$;

