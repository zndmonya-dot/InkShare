-- ========================================
-- ステータス初期化時刻をorganizationsテーブルに追加
-- ========================================

-- reset_timeカラムを追加（デフォルトは0時）
ALTER TABLE organizations
ADD COLUMN reset_time INTEGER DEFAULT 0;

COMMENT ON COLUMN organizations.reset_time IS 'ステータス自動初期化の時刻（0-23）。デフォルトは0時（深夜0時）';

-- 既存のデータにデフォルト値を設定
UPDATE organizations
SET reset_time = 0
WHERE reset_time IS NULL;

