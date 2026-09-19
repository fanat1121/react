package query

// CategoryQuery 道具カテゴリマスタ関連のSQL文
type CategoryQuery struct{}

// NewCategoryQuery クエリビルダーを作成
func NewCategoryQuery() *CategoryQuery {
	return &CategoryQuery{}
}

// Insert カテゴリ挿入SQL
func (q *CategoryQuery) Insert() string {
	return `
		INSERT INTO equipment_category_master (equipment_id, name, is_invalid, created_at, updated_at)
		VALUES (?, ?, 0, ?, ?)
	`
}

// CheckNameExists 同一道具内での名前重複チェックSQL
func (q *CategoryQuery) CheckNameExists() string {
	return `
		SELECT COUNT(*) FROM equipment_category_master
		WHERE equipment_id = ? AND name = ? AND is_invalid = 0
	`
}

// SelectByID ID検索SQL
func (q *CategoryQuery) SelectByID() string {
	return `
		SELECT id, equipment_id, name, is_invalid, created_at, updated_at
		FROM equipment_category_master
		WHERE id = ? AND is_invalid = 0
	`
}

// SelectAll 全件取得SQL
func (q *CategoryQuery) SelectAll() string {
	return `
		SELECT id, equipment_id, name, is_invalid, created_at, updated_at
		FROM equipment_category_master
		WHERE is_invalid = 0
		ORDER BY id ASC
	`
}

// SoftDelete 論理削除SQL
func (q *CategoryQuery) SoftDelete() string {
	return `
		UPDATE equipment_category_master
		SET is_invalid = 1, updated_at = ?
		WHERE id = ?
	`
}
