package query

// EquipmentQuery 道具マスタ関連のSQL文
type EquipmentQuery struct{}

// NewEquipmentQuery クエリビルダーを作成
func NewEquipmentQuery() *EquipmentQuery {
	return &EquipmentQuery{}
}

// Insert 道具挿入SQL
func (q *EquipmentQuery) Insert() string {
	return `
		INSERT INTO equipment_master (name, is_invalid, created_at, updated_at)
		VALUES (?, 0, ?, ?)
	`
}

// CheckNameExists 名前重複チェックSQL（有効な行のみ）
func (q *EquipmentQuery) CheckNameExists() string {
	return `
		SELECT COUNT(*) FROM equipment_master
		WHERE name = ? AND is_invalid = 0
	`
}

// SelectByID ID検索SQL
func (q *EquipmentQuery) SelectByID() string {
	return `
		SELECT id, name, is_invalid, created_at, updated_at
		FROM equipment_master
		WHERE id = ? AND is_invalid = 0
	`
}

// SelectAll 全件取得SQL
func (q *EquipmentQuery) SelectAll() string {
	return `
		SELECT id, name, is_invalid, created_at, updated_at
		FROM equipment_master
		WHERE is_invalid = 0
		ORDER BY id ASC
	`
}

// SoftDelete 論理削除SQL
func (q *EquipmentQuery) SoftDelete() string {
	return `
		UPDATE equipment_master
		SET is_invalid = 1, updated_at = ?
		WHERE id = ?
	`
}
