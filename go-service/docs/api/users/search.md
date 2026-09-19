# POST /api/users/search

メールアドレスまたはログインIDでユーザーを検索（機密情報を含む検索用途）。

## リクエストボディ（いずれか必須）

```json
{
  "email": "string (optional)",
  "user_login_id": "string (optional)"
}
```

`email` が指定されていればそれを優先し、`email` が空で `user_login_id` があればそちらで検索。両方空なら `400`。

## レスポンス例 (200)

`UserResponse`（[model.md](./model.md) 参照）

## エラー

| ステータス | code | 条件 |
|---|---|---|
| 400 | `BAD_REQUEST` | `email`・`user_login_id` ともに未指定 |
| 404 | `NOT_FOUND` | 該当ユーザーなし |

## 実装

`internal/user/handler/handler.go` — `Handler.SearchUsers`
