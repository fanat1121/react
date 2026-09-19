# API仕様書

`go-service` が提供するエンドポイントの仕様書です。実装（`internal/*/handler*.go`）から書き起こしています。実装変更時はこのディレクトリのドキュメントも更新してください。

## ベースURL

```
http://localhost:8080
```

## レスポンス形式

全エンドポイント共通の形式（`pkg/response/response.go`）。

**成功時**
```json
{
  "success": true,
  "data": { ... }
}
```

**失敗時**
```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "エラー内容"
  }
}
```

## エラーコード一覧

| HTTPステータス | code | 発生条件 |
|---|---|---|
| 400 | `BAD_REQUEST` | リクエストボディ不正・パラメータ不正・バリデーション違反 |
| 401 | `UNAUTHORIZED` | ログイン認証失敗（`user_login_id`/`password`不一致） |
| 404 | `NOT_FOUND` | 対象ユーザーが存在しない |
| 409 | `CONFLICT` | `email` または `user_login_id` が既に使用されている |
| 500 | `INTERNAL_SERVER_ERROR` | サーバー内部エラー |

## エンドポイント一覧

| Method | Path | 説明 | 仕様書 |
|---|---|---|---|
| GET | `/api/health` | 死活監視 | [health.md](./health.md) |
| POST | `/api/users/register` | ユーザー新規登録 | [users/register.md](./users/register.md) |
| POST | `/api/users/login` | ログイン認証 | [users/login.md](./users/login.md) |
| GET | `/api/users` | ユーザー取得（全件 / user_code指定） | [users/get.md](./users/get.md) |
| POST | `/api/users/search` | ユーザー検索（email / user_login_id） | [users/search.md](./users/search.md) |
| DELETE | `/api/users/{id}` | ユーザー削除（論理削除） | [users/delete.md](./users/delete.md) |

## データモデル

- [users/model.md](./users/model.md) — `UserResponse` のフィールド定義
