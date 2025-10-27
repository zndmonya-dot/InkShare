-- ========================================
-- 在籍管理ツール - Database Schema
-- PostgreSQL 16 / Supabase対応
-- ========================================

-- UUID拡張を有効化
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- Organizations (組織/チーム)
-- ========================================
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'business' CHECK (type IN ('business', 'personal')),
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  invite_code TEXT UNIQUE, -- 個人向けの参加コード
  is_open BOOLEAN DEFAULT false, -- オープン参加可能か
  max_members INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- Users (ユーザー)
-- Supabase auth.usersと連携
-- ========================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY, -- auth.users.idを参照（外部キーは設定しない）
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  avatar_color TEXT NOT NULL DEFAULT 'from-lime-400 to-green-500',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- User Organizations (ユーザー所属組織)
-- 複数組織への参加をサポート
-- ========================================
CREATE TABLE IF NOT EXISTS user_organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  is_active BOOLEAN DEFAULT true, -- 現在アクティブな組織か
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, organization_id)
);

-- ========================================
-- User Status (ユーザーステータス)
-- ========================================
CREATE TABLE IF NOT EXISTS user_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL CHECK (status IN (
    'available', 'busy', 'want-to-talk', 'want-lunch', 'need-help',
    'going-home', 'leaving', 'out', 'custom1', 'custom2'
  )),
  custom1_label TEXT DEFAULT 'カスタム1',
  custom1_icon TEXT DEFAULT 'ri-edit-line',
  custom2_label TEXT DEFAULT 'カスタム2',
  custom2_icon TEXT DEFAULT 'ri-edit-line',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ========================================
-- Indexes
-- ========================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_organizations_user ON user_organizations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_organizations_org ON user_organizations(organization_id);
CREATE INDEX IF NOT EXISTS idx_user_status_user ON user_status(user_id);
CREATE INDEX IF NOT EXISTS idx_organizations_invite_code ON organizations(invite_code);

-- ========================================
-- Functions
-- ========================================

-- 更新日時を自動更新する関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- トリガー設定
DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_status_updated_at ON user_status;
CREATE TRIGGER update_user_status_updated_at BEFORE UPDATE ON user_status
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- コメント
-- ========================================
COMMENT ON TABLE organizations IS '組織（チーム）テーブル - 法人向けと個人向けをサポート';
COMMENT ON TABLE users IS 'ユーザーテーブル';
COMMENT ON TABLE user_organizations IS 'ユーザー所属組織テーブル - 複数組織への参加をサポート';
COMMENT ON TABLE user_status IS 'ユーザーステータステーブル';

