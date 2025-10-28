-- ========================================
-- マイグレーション002: ステップバイステップ版
-- 各ステップを確認しながら実行
-- ========================================

-- ============================================
-- ステップ1: カラムを追加
-- ============================================
ALTER TABLE user_status 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

-- 確認: カラムが追加されたか確認
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_status' AND column_name = 'organization_id';

-- ============================================
-- ステップ2: 既存のUNIQUE制約を削除
-- ============================================
ALTER TABLE user_status 
DROP CONSTRAINT IF EXISTS user_status_user_id_key;

-- ============================================
-- ステップ3: データを更新（アクティブな組織）
-- ============================================
UPDATE user_status us
SET organization_id = uo.organization_id
FROM user_organizations uo
WHERE us.user_id = uo.user_id 
  AND uo.is_active = true
  AND us.organization_id IS NULL;

-- 確認: まだNULLが残っているか確認
SELECT COUNT(*) as null_count 
FROM user_status 
WHERE organization_id IS NULL;

-- ============================================
-- ステップ4: フォールバック（最初の組織を設定）
-- ============================================
UPDATE user_status us
SET organization_id = (
  SELECT organization_id 
  FROM user_organizations uo 
  WHERE uo.user_id = us.user_id 
  LIMIT 1
)
WHERE us.organization_id IS NULL;

-- 確認: まだNULLが残っているか確認
SELECT COUNT(*) as null_count 
FROM user_status 
WHERE organization_id IS NULL;

-- ============================================
-- ステップ5: 孤立データを削除
-- ============================================
DELETE FROM user_status
WHERE organization_id IS NULL;

-- ============================================
-- ステップ6: UNIQUE制約を追加
-- ============================================
ALTER TABLE user_status 
ADD CONSTRAINT user_status_user_org_unique UNIQUE(user_id, organization_id);

-- ============================================
-- ステップ7: インデックスを追加
-- ============================================
CREATE INDEX IF NOT EXISTS idx_user_status_org ON user_status(organization_id);

-- ============================================
-- ステップ8: NOT NULL制約を追加
-- ============================================
ALTER TABLE user_status 
ALTER COLUMN organization_id SET NOT NULL;

-- ============================================
-- 完了確認
-- ============================================
SELECT 
  'Migration 002 completed successfully!' as status,
  COUNT(*) as total_records,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT organization_id) as unique_orgs
FROM user_status;

