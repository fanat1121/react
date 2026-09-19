# equipment_category_master

道具カテゴリマスタ。道具ごとの分類タグ（絞り込み表示用）。状態(State)の区切りには使わない——道具内でカテゴリをまたいで技が繋がるケース（例: 2個→3個へ増やす技）があるため、State側は道具単位でのみ区切る（[state_master](./state_master.md)参照）。

```sql
CREATE TABLE equipment_category_master (
    id INT AUTO_INCREMENT PRIMARY KEY,
    equipment_id INT NOT NULL,
    name VARCHAR(64) NOT NULL,
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
| `name` | VARCHAR(64) | カテゴリ名（例: ディアボロなら「2個」「3個」等） |
| `is_invalid` | TINYINT(1) | 論理削除フラグ |
| `created_at` / `updated_at` | DATETIME | |

## 関連

- [trick_master](./trick_master.md)（`category_id` で参照）
