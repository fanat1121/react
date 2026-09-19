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
