# equipment_master

道具マスタ。ディアボロ/シガーボックス/ボールなど、技が属する道具種類のトップレベル分類。

```sql
CREATE TABLE equipment_master (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    is_invalid TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_is_invalid (is_invalid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

| カラム | 型 | 説明 |
|---|---|---|
| `id` | INT | 内部ID（PK） |
| `name` | VARCHAR(64) | 道具名（例: ディアボロ、シガーボックス、ボール）。`UNIQUE`は付けない（[README](../README.md)参照）。重複チェックは `is_invalid = 0` の範囲でアプリ側が行う |
| `is_invalid` | TINYINT(1) | 論理削除フラグ |
| `created_at` / `updated_at` | DATETIME | |

## 関連

- [equipment_category_master](./equipment_category_master.md)（`equipment_id` で参照）
- [state_master](./state_master.md)（`equipment_id` で参照）
- [trick_master](./trick_master.md)（`equipment_id` で参照）
