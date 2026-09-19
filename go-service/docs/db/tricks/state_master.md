# state_master

状態マスタ。技の開始状態・終了状態を表す。**道具(equipment)単位でのみ区切り、カテゴリでは区切らない**——同じ道具内でカテゴリをまたいで繋がる技（例: ディアボロ2個の状態→3個を増やす技→ディアボロ3個の状態）を表現するため。

```sql
CREATE TABLE state_master (
    id INT AUTO_INCREMENT PRIMARY KEY,
    equipment_id INT NOT NULL,
    name VARCHAR(64) NOT NULL,
    description TEXT NULL,
    is_invalid TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_equipment_id (equipment_id),
    INDEX idx_is_invalid (is_invalid),
    FOREIGN KEY (equipment_id) REFERENCES equipment_master(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

| カラム | 型 | 説明 |
|---|---|---|
| `id` | INT | 内部ID（PK） |
| `equipment_id` | INT | [equipment_master](./equipment_master.md) への外部キー |
| `name` | VARCHAR(64) | 状態名（例: 「3ボール片手待機」） |
| `description` | TEXT \| null | 補足説明 |
| `is_invalid` | TINYINT(1) | 論理削除フラグ |
| `created_at` / `updated_at` | DATETIME | |

## 技のつながりの表現

技同士の連続性はこのテーブルの行そのものではなく、[trick_master](./trick_master.md) の `start_state_id` / `end_state_id` によって**導出**される。技A（終了状態X）→技B（開始状態X）のように、状態が一致する技同士が自動的に繋がる。接続関係を個別に保存するテーブルは持たない。
