// go-service/internal/trick/query/state_query.go
package query

// StateQuery 状態マスタ関連のSQL文
type StateQuery struct{}

// NewStateQuery クエリビルダーを作成
func NewStateQuery() *StateQuery {
	return &StateQuery{}
}

// Insert 状態挿入SQL
func (q *StateQuery) Insert() string {
	return `
		INSERT INTO state_master (equipment_id, name, description, media_url, is_invalid, created_at, updated_at)
		VALUES (?, ?, ?, ?, 0, ?, ?)
	`
}

// CheckNameExists 同一道具内での名前重複チェックSQL
func (q *StateQuery) CheckNameExists() string {
	return `
		SELECT COUNT(*) FROM state_master
		WHERE equipment_id = ? AND name = ? AND is_invalid = 0
	`
}

// SelectByID ID検索SQL
func (q *StateQuery) SelectByID() string {
	return `
		SELECT id, equipment_id, name, description, media_url, is_invalid, created_at, updated_at
		FROM state_master
		WHERE id = ? AND is_invalid = 0
	`
}

// SelectAll 全件取得SQL
func (q *StateQuery) SelectAll() string {
	return `
		SELECT id, equipment_id, name, description, media_url, is_invalid, created_at, updated_at
		FROM state_master
		WHERE is_invalid = 0
		ORDER BY id ASC
	`
}

// SoftDelete 論理削除SQL
func (q *StateQuery) SoftDelete() string {
	return `
		UPDATE state_master
		SET is_invalid = 1, updated_at = ?
		WHERE id = ?
	`
}
