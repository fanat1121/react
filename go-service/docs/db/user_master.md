# user_master

ユーザーマスタ。

```sql
CREATE TABLE user_master (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_code BIGINT UNIQUE NOT NULL,
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
```

| カラム | 型 | 説明 |
|---|---|---|
| `id` | INT | 内部ID（PK） |
| `user_code` | BIGINT | 公開用の連番。`user_login_id` 生成のベース（`user%06d`） |
| `user_name` | VARCHAR(64) | 表示名 |
| `user_login_id` | VARCHAR(64) | ログインID。`user%06d` 形式で自動採番 |
| `email` | VARCHAR(255) | メールアドレス |
| `password_hash` | VARCHAR(255) | bcryptハッシュ。平文は保持しない |
| `email_verified_at` | DATETIME \| null | メール認証日時（未実装機能、現状は常にnull） |
| `registered_at` | DATETIME | 登録日時 |
| `registration_source` | VARCHAR(50) | 登録経路（現状は常に `web`） |
| `update_count` | INT | 更新回数 |
| `updated_at` | DATETIME | 更新日時 |
| `is_invalid` | TINYINT(1) | 論理削除フラグ |

## 既知の注意点

`user_code` / `user_login_id` / `email` に `UNIQUE` 制約があるが、削除は `is_invalid` による論理削除のみのため、**一度使われたメールアドレス・ログインIDは論理削除後も再利用できない**（物理的に行が残り続けるため）。新規マスタ設計では [README](./README.md) の方針に従い、この問題を避けるため `UNIQUE` を付けない運用にしている。`user_master` は既存の本番スキーマのため現状維持とし、変更する場合は別途マイグレーション案件として扱う。

## 実装

- スキーマ: `docker/mysql/init/01_init.sql`
- エンティティ: `internal/user/types.go`
- リポジトリ: `internal/user/repository_mysql.go`
