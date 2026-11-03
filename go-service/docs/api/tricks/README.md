# 技マスタ関連API

道具(equipment)・道具カテゴリ(equipment_category)・状態(state)・技(trick)の4マスタに対するCRUD API。全て `internal/trick/handler/` で実装。

## エンドポイント一覧

| Method | Path | 説明 |
|---|---|---|
| POST | `/api/equipments` | 道具登録 |
| GET | `/api/equipments` | 道具一覧取得 |
| GET | `/api/equipments/{id}` | 道具単体取得 |
| DELETE | `/api/equipments/{id}` | 道具削除（論理削除。参照中は 409） |
| POST | `/api/equipment-categories` | 道具カテゴリ登録 |
| GET | `/api/equipment-categories` | 道具カテゴリ一覧取得 |
| GET | `/api/equipment-categories/{id}` | 道具カテゴリ単体取得 |
| DELETE | `/api/equipment-categories/{id}` | 道具カテゴリ削除（論理削除。参照中は 409） |
| POST | `/api/states` | 状態登録 |
| GET | `/api/states` | 状態一覧取得 |
| GET | `/api/states/{id}` | 状態単体取得 |
| DELETE | `/api/states/{id}` | 状態削除（論理削除。参照中は 409） |
| POST | `/api/tricks` | 技登録 |
| GET | `/api/tricks` | 技一覧取得 |
| GET | `/api/tricks/{id}` | 技単体取得 |
| DELETE | `/api/tricks/{id}` | 技削除（論理削除） |

## 技登録時のバリデーション

`POST /api/tricks` は以下を満たさない場合 `400 BAD_REQUEST` を返す。

- `equipment_id` が存在する道具を指すこと
- `category_id` が存在し、その道具カテゴリの `equipment_id` がリクエストの `equipment_id` と一致すること
- `start_state_id` / `end_state_id` が存在し、その状態の `equipment_id` がリクエストの `equipment_id` と一致すること

## 削除時の参照チェック

道具・道具カテゴリ・状態の `DELETE` は、対象行が有効な行（`is_invalid = 0`）から参照されている場合は削除せず `409 CONFLICT` を返す。削除済み（`is_invalid = 1`）の行からの参照は数えない。

| 削除対象 | 参照元（有効な行のみ） | 409 時の `error.message` |
|---|---|---|
| `DELETE /api/equipments/{id}` | `equipment_category_master.equipment_id` / `state_master.equipment_id` / `trick_master.equipment_id` | `equipment is in use` |
| `DELETE /api/equipment-categories/{id}` | `trick_master.category_id` | `equipment category is in use` |
| `DELETE /api/states/{id}` | `trick_master.start_state_id` / `trick_master.end_state_id` | `state is in use` |

レスポンスステータス:

- `200` 削除成功
- `400 BAD_REQUEST` `{id}` が数値でない
- `404 NOT_FOUND` 対象が存在しない、または削除済み（参照チェックより先に判定）
- `409 CONFLICT` 有効な行から参照されている

参照チェックと論理削除はトランザクション外で行うため、チェック直後に参照行が登録されると参照されたまま削除されうる（当面は許容）。

`DELETE /api/tricks/{id}` は参照チェックなし（技を参照するテーブルがないため）。

## データモデル・DB定義

- リクエスト/レスポンスの型は `go-service/internal/trick/types.go`
- テーブル定義は [`go-service/docs/db/tricks/`](../../db/tricks/)
