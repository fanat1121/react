-- 初期化用SQLファイル
-- このディレクトリ内のSQLファイルは、コンテナ起動時に自動実行されます

-- ユーザーマスターテーブルの作成
CREATE TABLE user_master (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_code VARCHAR(20) UNIQUE NOT NULL,
    user_name VARCHAR(64) NOT NULL,
    user_login_id VARCHAR(64) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email_verified_at DATETIME NULL,
    registered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    registration_source VARCHAR(50) DEFAULT 'web',
    update_count INT DEFAULT 0,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_invalid TINYINT(1) DEFAULT 0,
    
    INDEX idx_is_invalid (is_invalid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- サンプルデータ（開発用）
INSERT INTO user_master (user_code, user_name, user_login_id, email, password_hash, is_invalid) VALUES
('USR001', 'テストユーザー', 'testuser', 'test@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 0),
('USR002', '管理者', 'admin', 'admin@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 0);
-- パスワードは両方とも "password123" のハッシュ値
