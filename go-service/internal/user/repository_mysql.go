package user

import (
	"database/sql"
	"errors"
	"go-service/internal/user/query"
	"go-service/pkg/database"
	"time"
)

// MySQLRepository MySQL実装
type MySQLRepository struct {
	db    *database.QueryBuilder
	query *query.UserQuery
}

// NewMySQLRepository MySQL接続を使用したリポジトリを作成
func NewMySQLRepository(db *database.DB) Repository {
	return &MySQLRepository{
		db:    database.NewQueryBuilder(db),
		query: query.NewUserQuery(),
	}
}

// Create ユーザーを作成
func (r *MySQLRepository) Create(user *User) error {
	// メールアドレスの重複チェック
	var count int
	err := r.db.QueryRow(r.query.CheckEmailExists(), user.Email).Scan(&count)
	if err != nil {
		return err
	}
	if count > 0 {
		return errors.New("email already exists")
	}

	// ログインIDの重複チェック
	err = r.db.QueryRow(r.query.CheckLoginIDExists(), user.UserLoginID).Scan(&count)
	if err != nil {
		return err
	}
	if count > 0 {
		return errors.New("user_login_id already exists")
	}

	// ユーザーコード生成（IDと同じ値）
	var maxID int
	err = r.db.QueryRow(r.query.GetMaxID()).Scan(&maxID)
	if err != nil {
		return err
	}
	userCode := maxID + 1

	// ユーザー挿入
	now := time.Now()
	result, err := r.db.Exec(
		r.query.Insert(),
		userCode,
		user.UserName,
		user.UserLoginID,
		user.Email,
		user.PasswordHash,
		now,
		"web",
		0,
		now,
		false,
	)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	user.ID = int(id)
	user.UserCode = userCode
	user.RegisteredAt = now
	user.RegistrationSource = "web"
	user.UpdateCount = 0
	user.UpdatedAt = now
	user.IsInvalid = false

	return nil
}

// GetByID IDでユーザーを取得
func (r *MySQLRepository) GetByID(id int) (*User, error) {
	user := &User{}
	err := r.db.QueryRow(r.query.SelectByID(), id).Scan(
		&user.ID,
		&user.UserCode,
		&user.UserName,
		&user.UserLoginID,
		&user.Email,
		&user.PasswordHash,
		&user.EmailVerifiedAt,
		&user.RegisteredAt,
		&user.RegistrationSource,
		&user.UpdateCount,
		&user.UpdatedAt,
		&user.IsInvalid,
	)
	if err == sql.ErrNoRows {
		return nil, errors.New("user not found")
	}
	if err != nil {
		return nil, err
	}
	return user, nil
}

// GetByUserCode ユーザーコードでユーザーを取得
func (r *MySQLRepository) GetByUserCode(userCode int) (*User, error) {
	user := &User{}
	err := r.db.QueryRow(r.query.SelectByUserCode(), userCode).Scan(
		&user.ID,
		&user.UserCode,
		&user.UserName,
		&user.UserLoginID,
		&user.Email,
		&user.PasswordHash,
		&user.EmailVerifiedAt,
		&user.RegisteredAt,
		&user.RegistrationSource,
		&user.UpdateCount,
		&user.UpdatedAt,
		&user.IsInvalid,
	)
	if err == sql.ErrNoRows {
		return nil, errors.New("user not found")
	}
	if err != nil {
		return nil, err
	}
	return user, nil
}

// GetByEmail メールアドレスでユーザーを取得
func (r *MySQLRepository) GetByEmail(email string) (*User, error) {
	user := &User{}
	err := r.db.QueryRow(r.query.SelectByEmail(), email).Scan(
		&user.ID,
		&user.UserCode,
		&user.UserName,
		&user.UserLoginID,
		&user.Email,
		&user.PasswordHash,
		&user.EmailVerifiedAt,
		&user.RegisteredAt,
		&user.RegistrationSource,
		&user.UpdateCount,
		&user.UpdatedAt,
		&user.IsInvalid,
	)
	if err == sql.ErrNoRows {
		return nil, errors.New("user not found")
	}
	if err != nil {
		return nil, err
	}
	return user, nil
}

// GetByLoginID ログインIDでユーザーを取得
func (r *MySQLRepository) GetByLoginID(loginID string) (*User, error) {
	user := &User{}
	err := r.db.QueryRow(r.query.SelectByLoginID(), loginID).Scan(
		&user.ID,
		&user.UserCode,
		&user.UserName,
		&user.UserLoginID,
		&user.Email,
		&user.PasswordHash,
		&user.EmailVerifiedAt,
		&user.RegisteredAt,
		&user.RegistrationSource,
		&user.UpdateCount,
		&user.UpdatedAt,
		&user.IsInvalid,
	)
	if err == sql.ErrNoRows {
		return nil, errors.New("user not found")
	}
	if err != nil {
		return nil, err
	}
	return user, nil
}

// GetAll 全ユーザーを取得
func (r *MySQLRepository) GetAll() ([]*User, error) {
	rows, err := r.db.Query(r.query.SelectAll())
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	users := make([]*User, 0)
	for rows.Next() {
		user := &User{}
		err := rows.Scan(
			&user.ID,
			&user.UserCode,
			&user.UserName,
			&user.UserLoginID,
			&user.Email,
			&user.PasswordHash,
			&user.EmailVerifiedAt,
			&user.RegisteredAt,
			&user.RegistrationSource,
			&user.UpdateCount,
			&user.UpdatedAt,
			&user.IsInvalid,
		)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	return users, nil
}

// Update ユーザーを更新
func (r *MySQLRepository) Update(user *User) error {
	result, err := r.db.Exec(
		r.query.Update(),
		user.UserName,
		user.Email,
		time.Now(),
		user.ID,
	)
	if err != nil {
		return err
	}

	affected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if affected == 0 {
		return errors.New("user not found")
	}

	user.UpdatedAt = time.Now()
	user.UpdateCount++
	return nil
}

// Delete ユーザーを論理削除
func (r *MySQLRepository) Delete(id int) error {
	result, err := r.db.Exec(
		r.query.SoftDelete(),
		time.Now(),
		id,
	)
	if err != nil {
		return err
	}

	affected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if affected == 0 {
		return errors.New("user not found")
	}

	return nil
}
