package user

import "time"

// User ユーザーエンティティ
type User struct {
	ID                 int        `json:"id"`
	UserCode           int        `json:"user_code"`
	UserName           string     `json:"user_name"`
	UserLoginID        string     `json:"user_login_id"`
	Email              string     `json:"email"`
	PasswordHash       string     `json:"-"` // JSONには含めない
	EmailVerifiedAt    *time.Time `json:"email_verified_at,omitempty"`
	RegisteredAt       time.Time  `json:"registered_at"`
	RegistrationSource string     `json:"registration_source"`
	UpdateCount        int        `json:"update_count"`
	UpdatedAt          time.Time  `json:"updated_at"`
	IsInvalid          bool       `json:"-"` // 論理削除フラグ（0: 有効, 1: 無効）
}

// CreateUserRequest ユーザー登録リクエスト
type CreateUserRequest struct {
	UserName    string `json:"user_name" validate:"required,min=1,max=64"`
	UserLoginID string `json:"user_login_id" validate:"required,min=3,max=64,alphanum"`
	Email       string `json:"email" validate:"required,email"`
	Password    string `json:"password" validate:"required,min=6,max=100"`
}

// SearchUserRequest ユーザー検索リクエスト
type SearchUserRequest struct {
	Email       string `json:"email,omitempty"`
	UserLoginID string `json:"user_login_id,omitempty"`
}

// UserResponse ユーザーレスポンス（パスワードを除外）
type UserResponse struct {
	ID                 int        `json:"id"`
	UserCode           int        `json:"user_code"`
	UserName           string     `json:"user_name"`
	UserLoginID        string     `json:"user_login_id"`
	Email              string     `json:"email"`
	EmailVerifiedAt    *time.Time `json:"email_verified_at,omitempty"`
	RegisteredAt       time.Time  `json:"registered_at"`
	RegistrationSource string     `json:"registration_source"`
	UpdateCount        int        `json:"update_count"`
	UpdatedAt          time.Time  `json:"updated_at"`
}

// ToResponse UserをUserResponseに変換
func (u *User) ToResponse() *UserResponse {
	return &UserResponse{
		ID:                 u.ID,
		UserCode:           u.UserCode,
		UserName:           u.UserName,
		UserLoginID:        u.UserLoginID,
		Email:              u.Email,
		EmailVerifiedAt:    u.EmailVerifiedAt,
		RegisteredAt:       u.RegisteredAt,
		RegistrationSource: u.RegistrationSource,
		UpdateCount:        u.UpdateCount,
		UpdatedAt:          u.UpdatedAt,
	}
}
