# DB仕様書

`go-service` が使用するMySQLのテーブル定義集です。実装（マイグレーションSQL・`internal/*/repository*.go`）から書き起こしています。スキーマ変更時はこのディレクトリのドキュメントも更新してください。

API側のレスポンス形状は [`../api/`](../api/README.md) を参照してください。こちらはDBの生のテーブル定義（カラム・型・FK・インデックス）が対象です。

## 論理削除の方針

このリポジトリのマスタ系テーブルは `is_invalid TINYINT(1)` による論理削除を採用しています。

- 削除操作は物理DELETEではなく `is_invalid = 1` への更新
- 一覧・選択肢取得は必ず `WHERE is_invalid = 0` を条件に含める
- **UNIQUE制約は極力付けない**：論理削除された行が物理的に残り続けるため、`UNIQUE`があると同じ値（例: 同じ名前）で再登録できなくなる。重複チェックが必要な場合はアプリケーション側で「有効な行（`is_invalid = 0`）の中で重複していないか」を確認する

## テーブル一覧

| テーブル | 説明 | 仕様書 |
|---|---|---|
| `user_master` | ユーザー | [user_master.md](./user_master.md) |
| `equipment_master` | 道具マスタ（ディアボロ/シガーボックス/ボール等） | [tricks/equipment_master.md](./tricks/equipment_master.md) |
| `equipment_category_master` | 道具カテゴリマスタ（道具ごとの分類タグ） | [tricks/equipment_category_master.md](./tricks/equipment_category_master.md) |
| `state_master` | 状態マスタ（道具単位、技の開始/終了状態） | [tricks/state_master.md](./tricks/state_master.md) |
| `trick_master` | 技マスタ | [tricks/trick_master.md](./tricks/trick_master.md) |
