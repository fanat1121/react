# データモデル: UserResponse

| フィールド | 型 | 備考 |
|---|---|---|
| `id` | int | 内部ID |
| `user_code` | int | ユーザーコード（公開用の連番） |
| `user_name` | string | |
| `user_login_id` | string | |
| `email` | string | |
| `email_verified_at` | string (ISO8601) \| null | 未認証時は省略 |
| `registered_at` | string (ISO8601) | |
| `registration_source` | string | 登録経路 |
| `update_count` | int | 更新回数 |
| `updated_at` | string (ISO8601) | |

`password_hash` と `is_invalid`（論理削除フラグ）は `User` エンティティ内部のみで保持され、レスポンスには含まれません。

## 実装

`internal/user/types.go`
