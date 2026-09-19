package user

// Repository ユーザーリポジトリのインターフェース
type Repository interface {
	Create(user *User) error
	GetByID(id int) (*User, error)
	GetByUserCode(userCode int) (*User, error)
	GetByEmail(email string) (*User, error)
	GetByLoginID(loginID string) (*User, error)
	GetAll() ([]*User, error)
	Update(user *User) error
	Delete(id int) error
}
