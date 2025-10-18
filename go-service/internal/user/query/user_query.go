package query

// UserQuery ユーザー関連のSQL文
type UserQuery struct{}

// NewUserQuery クエリビルダーを作成
func NewUserQuery() *UserQuery {
	return &UserQuery{}
}

// Insert ユーザー挿入SQL
func (q *UserQuery) Insert() string {
	return `
		INSERT INTO user_master (
			user_code, user_name, user_login_id, email, password_hash, 
			registered_at, registration_source, update_count, updated_at, is_invalid
		)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`
}

// SelectByID ID検索SQL
func (q *UserQuery) SelectByID() string {
	return `
		SELECT id, user_code, user_name, user_login_id, email, password_hash, 
		       email_verified_at, registered_at, registration_source, 
		       update_count, updated_at, is_invalid
		FROM user_master
		WHERE id = ? AND is_invalid = 0
	`
}

// SelectByUserCode ユーザーコード検索SQL
func (q *UserQuery) SelectByUserCode() string {
	return `
		SELECT id, user_code, user_name, user_login_id, email, password_hash, 
		       email_verified_at, registered_at, registration_source, 
		       update_count, updated_at, is_invalid
		FROM user_master
		WHERE user_code = ? AND is_invalid = 0
	`
}

// SelectByEmail メールアドレス検索SQL
func (q *UserQuery) SelectByEmail() string {
	return `
		SELECT id, user_code, user_name, user_login_id, email, password_hash, 
		       email_verified_at, registered_at, registration_source, 
		       update_count, updated_at, is_invalid
		FROM user_master
		WHERE email = ? AND is_invalid = 0
	`
}

// SelectByLoginID ログインID検索SQL
func (q *UserQuery) SelectByLoginID() string {
	return `
		SELECT id, user_code, user_name, user_login_id, email, password_hash, 
		       email_verified_at, registered_at, registration_source, 
		       update_count, updated_at, is_invalid
		FROM user_master
		WHERE user_login_id = ? AND is_invalid = 0
	`
}

// SelectAll 全件取得SQL
func (q *UserQuery) SelectAll() string {
	return `
		SELECT id, user_code, user_name, user_login_id, email, password_hash, 
		       email_verified_at, registered_at, registration_source, 
		       update_count, updated_at, is_invalid
		FROM user_master
		WHERE is_invalid = 0
		ORDER BY registered_at DESC
	`
}

// Update 更新SQL
func (q *UserQuery) Update() string {
	return `
		UPDATE user_master
		SET user_name = ?, email = ?, update_count = update_count + 1, updated_at = ?
		WHERE id = ? AND is_invalid = 0
	`
}

// SoftDelete 論理削除SQL
func (q *UserQuery) SoftDelete() string {
	return `
		UPDATE user_master
		SET is_invalid = 1, update_count = update_count + 1, updated_at = ?
		WHERE id = ?
	`
}

// CheckEmailExists メールアドレス重複チェックSQL
func (q *UserQuery) CheckEmailExists() string {
	return `
		SELECT COUNT(*) FROM user_master
		WHERE email = ? AND is_invalid = 0
	`
}

// CheckLoginIDExists ログインID重複チェックSQL
func (q *UserQuery) CheckLoginIDExists() string {
	return `
		SELECT COUNT(*) FROM user_master
		WHERE user_login_id = ? AND is_invalid = 0
	`
}

// GenerateUserCode ユーザーコード生成用（最大ID取得）
func (q *UserQuery) GetMaxID() string {
	return `
		SELECT COALESCE(MAX(id), 0) FROM user_master
	`
}
