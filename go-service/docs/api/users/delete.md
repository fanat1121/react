# DELETE /api/users/{id}

ユーザー削除（論理削除。`is_invalid` フラグを立てるのみで物理削除はしない）。

## パスパラメータ

- `id`（`int`, ユーザーの内部ID）

## レスポンス例 (200)

```json
{
  "success": true,
  "data": { "message": "User deleted successfully" }
}
```

## エラー

| ステータス | code | 条件 |
|---|---|---|
| 400 | `BAD_REQUEST` | `id` が数値でない |
| 404 | `NOT_FOUND` | 対象ユーザーが存在しない |

## 実装

`internal/user/handler/handler.go` — `Handler.DeleteUser`
