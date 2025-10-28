-- ========================================
-- チームごとのステータス対応
-- user_statusにorganization_idを追加
-- ========================================

-- 1. organization_idカラムを追加
ALTER TABLE user_status 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

-- 2. 既存のUNIQUE制約を削除
ALTER TABLE user_status 
DROP CONSTRAINT IF EXISTS user_status_user_id_key;

-- 3. 新しいUNIQUE制約を追加（user_id + organization_idの組み合わせ）
ALTER TABLE user_status 
ADD CONSTRAINT user_status_user_org_unique UNIQUE(user_id, organization_id);

-- 4. インデックスを追加
CREATE INDEX IF NOT EXISTS idx_user_status_org ON user_status(organization_id);

-- 5. 既存データに現在のアクティブ組織IDを設定
UPDATE user_status us
SET organization_id = uo.organization_id
FROM user_organizations uo
WHERE us.user_id = uo.user_id 
  AND uo.is_active = true
  AND us.organization_id IS NULL;

-- 6. organization_idをNOT NULLに変更
ALTER TABLE user_status 
ALTER COLUMN organization_id SET NOT NULL;

