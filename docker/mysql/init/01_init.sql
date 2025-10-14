-- 初期化用SQLファイル
-- このディレクトリ内のSQLファイルは、コンテナ起動時に自動実行されますわ

-- サンプルテーブルの作成
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- サンプルデータの挿入
INSERT INTO users (name, email) VALUES
    ('テストユーザー1', 'test1@example.com'),
    ('テストユーザー2', 'test2@example.com');
