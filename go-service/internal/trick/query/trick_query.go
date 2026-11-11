// go-service/internal/trick/query/trick_query.go
package query

// TrickQuery 技マスタ関連のSQL文
type TrickQuery struct{}

// NewTrickQuery クエリビルダーを作成
func NewTrickQuery() *TrickQuery {
	return &TrickQuery{}
}

// Insert 技挿入SQL
func (q *TrickQuery) Insert() string {
	return `
		INSERT INTO trick_master (
			equipment_id, category_id, name, description,
			start_state_id, end_state_id, video_url, estimated_duration_seconds,
			is_invalid, created_at, updated_at
		)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
	`
}

// CheckNameExists 同一道具内での名前重複チェックSQL
func (q *TrickQuery) CheckNameExists() string {
	return `
		SELECT COUNT(*) FROM trick_master
		WHERE equipment_id = ? AND name = ? AND is_invalid = 0
	`
}

// SelectByID ID検索SQL
func (q *TrickQuery) SelectByID() string {
	return `
		SELECT id, equipment_id, category_id, name, description,
		       start_state_id, end_state_id, video_url, estimated_duration_seconds,
		       is_invalid, created_at, updated_at
		FROM trick_master
		WHERE id = ? AND is_invalid = 0
	`
}

// SelectAll 全件取得SQL
func (q *TrickQuery) SelectAll() string {
	return `
		SELECT id, equipment_id, category_id, name, description,
		       start_state_id, end_state_id, video_url, estimated_duration_seconds,
		       is_invalid, created_at, updated_at
		FROM trick_master
		WHERE is_invalid = 0
		ORDER BY id ASC
	`
}

// SoftDelete 論理削除SQL
func (q *TrickQuery) SoftDelete() string {
	return `
		UPDATE trick_master
		SET is_invalid = 1, updated_at = ?
		WHERE id = ?
	`
}

// CountByEquipmentID 指定した道具を参照する有効な技件数SQL
func (q *TrickQuery) CountByEquipmentID() string {
	return `
		SELECT COUNT(*) FROM trick_master
		WHERE equipment_id = ? AND is_invalid = 0
	`
}

// CountByCategoryID 指定したカテゴリを参照する有効な技件数SQL
func (q *TrickQuery) CountByCategoryID() string {
	return `
		SELECT COUNT(*) FROM trick_master
		WHERE category_id = ? AND is_invalid = 0
	`
}

// CountByStateID 指定した状態を開始・終了のいずれかで参照する有効な技件数SQL
func (q *TrickQuery) CountByStateID() string {
	return `
		SELECT COUNT(*) FROM trick_master
		WHERE (start_state_id = ? OR end_state_id = ?) AND is_invalid = 0
	`
}
