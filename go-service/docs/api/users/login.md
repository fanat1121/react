# POST /api/users/login

ログイン認証。

## リクエストボディ

```json
{
  "user_login_id": "string (required)",
  "password": "string (required)"
}
```

## レスポンス例 (200)

`UserResponse`（[model.md](./model.md) 参照）

## エラー

| ステータス | code | 条件 |
|---|---|---|
| 400 | `BAD_REQUEST` | リクエストボディ不正 |
| 401 | `UNAUTHORIZED` | `user_login_id`/`password` が一致しない |

## 実装

`internal/user/handler/handler.go` — `Handler.Login`
