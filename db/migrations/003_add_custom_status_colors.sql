-- ========================================
-- カスタムステータスの色対応
-- user_statusにcustom1_color, custom2_colorを追加
-- ========================================

-- 1. custom1_colorカラムを追加
ALTER TABLE user_status 
ADD COLUMN IF NOT EXISTS custom1_color TEXT DEFAULT 'bg-fuchsia-400';

-- 2. custom2_colorカラムを追加
ALTER TABLE user_status 
ADD COLUMN IF NOT EXISTS custom2_color TEXT DEFAULT 'bg-purple-400';

-- 3. 既存のcustom1_icon, custom2_iconのデフォルト値を更新
ALTER TABLE user_status 
ALTER COLUMN custom1_icon SET DEFAULT 'ri-star-smile-fill';

ALTER TABLE user_status 
ALTER COLUMN custom2_icon SET DEFAULT 'ri-star-smile-fill';

-- 4. 既存データのアイコンを更新（ri-edit-line -> ri-star-smile-fill）
UPDATE user_status 
SET custom1_icon = 'ri-star-smile-fill'
WHERE custom1_icon = 'ri-edit-line';

UPDATE user_status 
SET custom2_icon = 'ri-star-smile-fill'
WHERE custom2_icon = 'ri-edit-line';

