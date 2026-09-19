# trick_master

技マスタ。ルーチン編成画面（将来のサブプロジェクト）でノードとして配置される最小単位。

```sql
CREATE TABLE trick_master (
    id INT AUTO_INCREMENT PRIMARY KEY,
    equipment_id INT NOT NULL,
    category_id INT NOT NULL,
    name VARCHAR(128) NOT NULL,
    description TEXT NULL,
    start_state_id INT NOT NULL,
    end_state_id INT NOT NULL,
    video_url VARCHAR(512) NULL,
    estimated_duration_seconds INT NOT NULL DEFAULT 0,
    is_invalid TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_equipment_id (equipment_id),
    INDEX idx_category_id (category_id),
    INDEX idx_start_state_id (start_state_id),
    INDEX idx_end_state_id (end_state_id),
    INDEX idx_is_invalid (is_invalid),
    FOREIGN KEY (equipment_id) REFERENCES equipment_master(id),
    FOREIGN KEY (category_id) REFERENCES equipment_category_master(id),
    FOREIGN KEY (start_state_id) REFERENCES state_master(id),
    FOREIGN KEY (end_state_id) REFERENCES state_master(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

| カラム | 型 | 説明 |
|---|---|---|
| `id` | INT | 内部ID（PK） |
| `equipment_id` | INT | [equipment_master](./equipment_master.md) への外部キー |
| `category_id` | INT | [equipment_category_master](./equipment_category_master.md) への外部キー |
| `name` | VARCHAR(128) | 技名 |
| `description` | TEXT \| null | 補足説明 |
| `start_state_id` | INT | 開始状態。[state_master](./state_master.md) への外部キー |
| `end_state_id` | INT | 終了状態。[state_master](./state_master.md) への外部キー |
| `video_url` | VARCHAR(512) \| null | 参考動画のパス/URL。ストレージ抽象化層（ローカル/将来S3）経由で解決する |
| `estimated_duration_seconds` | INT | 推定所要時間（秒）。ルーチン編成画面で技を配置する際のデフォルト値。配置後の個別調整はルーチン側のデータで持つ（本テーブルの値は上書きしない） |
| `is_invalid` | TINYINT(1) | 論理削除フラグ |
| `created_at` / `updated_at` | DATETIME | |

## アプリケーション側で担保する整合性

`start_state_id` / `end_state_id` が指す [state_master](./state_master.md) の行は、この技自身と同じ `equipment_id` に属していなければならない。これはDB制約（複合FK）では強制せず、登録・更新時のアプリケーションバリデーションで担保する。

## 既知の制限

道具・カテゴリ・状態の論理削除（`is_invalid=1`）は、それらを参照している既存の技（trick_master）の有無をチェックしない。参照されたまま親マスタが無効化されると、技側から見て「存在しない/無効な状態・カテゴリを参照する技」が残る可能性がある。これは複雑さを避けるための意図的な設計判断であり、実装漏れではない。UIやバッチで整合性を可視化・警告する仕組みは将来必要になれば別途検討する。
