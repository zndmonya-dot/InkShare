-- ========================================
-- マイグレーション002のロールバック
-- 問題が発生した場合に実行
-- ========================================

-- 1. NOT NULL制約を削除
ALTER TABLE user_status 
ALTER COLUMN organization_id DROP NOT NULL;

-- 2. UNIQUE制約を削除
ALTER TABLE user_status 
DROP CONSTRAINT IF EXISTS user_status_user_org_unique;

-- 3. インデックスを削除
DROP INDEX IF EXISTS idx_user_status_org;

-- 4. organization_idカラムを削除
ALTER TABLE user_status 
DROP COLUMN IF EXISTS organization_id;

-- 5. 元のUNIQUE制約を復元
ALTER TABLE user_status 
ADD CONSTRAINT user_status_user_id_key UNIQUE(user_id);

-- 完了メッセージ
DO $$
BEGIN
  RAISE NOTICE 'マイグレーション002がロールバックされました';
END $$;

