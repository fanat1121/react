# GET /api/users

ユーザー取得。クエリパラメータの有無で挙動が変わる。

| クエリパラメータ | 挙動 |
|---|---|
| なし | 全ユーザー取得（配列） |
| `user_code` | 指定した `user_code` のユーザーを1件取得 |

## 例

```
GET /api/users
GET /api/users?user_code=1
```

## レスポンス例 (200, 全件)

```json
{
  "success": true,
  "data": [ { "id": 1, "user_code": 1, "...": "..." } ]
}
```

各要素は `UserResponse`（[model.md](./model.md) 参照）。`user_code` 指定時は配列ではなく単一オブジェクト。

## エラー

| ステータス | code | 条件 |
|---|---|---|
| 400 | `BAD_REQUEST` | `user_code` が数値でない |
| 404 | `NOT_FOUND` | 指定 `user_code` のユーザーが存在しない |

## 実装

`internal/user/handler/handler.go` — `Handler.GetUsers`
