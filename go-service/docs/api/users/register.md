# POST /api/users/register

ユーザー新規登録。

## リクエストボディ

```json
{
  "user_name": "string (required, 1〜64文字)",
  "email": "string (required, email形式)",
  "password": "string (required, 6〜100文字)"
}
```

## レスポンス例 (201)

`UserResponse`（[model.md](./model.md) 参照）

```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_code": 1,
    "user_name": "taro",
    "user_login_id": "taro001",
    "email": "taro@example.com",
    "email_verified_at": null,
    "registered_at": "2026-09-18T12:00:00Z",
    "registration_source": "web",
    "update_count": 0,
    "updated_at": "2026-09-18T12:00:00Z"
  }
}
```

## エラー

| ステータス | code | 条件 |
|---|---|---|
| 400 | `BAD_REQUEST` | リクエストボディ不正・バリデーション違反 |
| 409 | `CONFLICT` | `email` または `user_login_id` が既に使用されている |

## 実装

`internal/user/handler/handler.go` — `Handler.CreateUser`
