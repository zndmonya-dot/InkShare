-- ========================================
-- Migration: 法人向け/個人向けの組織タイプをサポート
-- ========================================

-- 1. organizationsテーブルに新しいカラムを追加
ALTER TABLE organizations 
  ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'business' CHECK (type IN ('business', 'personal')),
  ADD COLUMN IF NOT EXISTS invite_code TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS is_open BOOLEAN DEFAULT false;

-- 2. user_organizationsテーブルを作成（複数組織への参加をサポート）
CREATE TABLE IF NOT EXISTS user_organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  is_active BOOLEAN DEFAULT true,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, organization_id)
);

-- 3. 既存のusersデータをuser_organizationsに移行
INSERT INTO user_organizations (user_id, organization_id, role, is_active)
SELECT id, organization_id, role, true
FROM users
WHERE organization_id IS NOT NULL
ON CONFLICT (user_id, organization_id) DO NOTHING;

-- 4. usersテーブルからorganization_idとroleカラムを削除
ALTER TABLE users 
  DROP COLUMN IF EXISTS organization_id,
  DROP COLUMN IF EXISTS role;

-- 5. インデックスを作成
CREATE INDEX IF NOT EXISTS idx_user_organizations_user ON user_organizations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_organizations_org ON user_organizations(organization_id);
CREATE INDEX IF NOT EXISTS idx_organizations_invite_code ON organizations(invite_code);

-- 6. コメントを更新
COMMENT ON TABLE organizations IS '組織（チーム）テーブル - 法人向けと個人向けをサポート';
COMMENT ON TABLE user_organizations IS 'ユーザー所属組織テーブル - 複数組織への参加をサポート';

