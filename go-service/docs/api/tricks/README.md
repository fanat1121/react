# 技マスタ関連API

道具(equipment)・道具カテゴリ(equipment_category)・状態(state)・技(trick)の4マスタに対するCRUD API。全て `internal/trick/handler/` で実装。

## エンドポイント一覧

| Method | Path | 説明 |
|---|---|---|
| POST | `/api/equipments` | 道具登録 |
| GET | `/api/equipments` | 道具一覧取得 |
| GET | `/api/equipments/{id}` | 道具単体取得 |
| DELETE | `/api/equipments/{id}` | 道具削除（論理削除） |
| POST | `/api/equipment-categories` | 道具カテゴリ登録 |
| GET | `/api/equipment-categories` | 道具カテゴリ一覧取得 |
| GET | `/api/equipment-categories/{id}` | 道具カテゴリ単体取得 |
| DELETE | `/api/equipment-categories/{id}` | 道具カテゴリ削除（論理削除） |
| POST | `/api/states` | 状態登録 |
| GET | `/api/states` | 状態一覧取得 |
| GET | `/api/states/{id}` | 状態単体取得 |
| DELETE | `/api/states/{id}` | 状態削除（論理削除） |
| POST | `/api/tricks` | 技登録 |
| GET | `/api/tricks` | 技一覧取得 |
| GET | `/api/tricks/{id}` | 技単体取得 |
| DELETE | `/api/tricks/{id}` | 技削除（論理削除） |

## 技登録時のバリデーション

`POST /api/tricks` は以下を満たさない場合 `400 BAD_REQUEST` を返す。

- `equipment_id` が存在する道具を指すこと
- `category_id` が存在し、その道具カテゴリの `equipment_id` がリクエストの `equipment_id` と一致すること
- `start_state_id` / `end_state_id` が存在し、その状態の `equipment_id` がリクエストの `equipment_id` と一致すること

## データモデル・DB定義

- リクエスト/レスポンスの型は `go-service/internal/trick/types.go`
- テーブル定義は [`go-service/docs/db/tricks/`](../../db/tricks/)
