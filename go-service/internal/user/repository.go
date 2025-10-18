package user

import (
	"errors"
	"sync"
	"time"
)

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

// InMemoryRepository インメモリ実装（開発用）
type InMemoryRepository struct {
	users  map[int]*User
	nextID int
	mu     sync.RWMutex
}

// NewInMemoryRepository インメモリリポジトリを作成
func NewInMemoryRepository() Repository {
	return &InMemoryRepository{
		users:  make(map[int]*User),
		nextID: 1,
	}
}

// Create ユーザーを作成
func (r *InMemoryRepository) Create(user *User) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	// メールアドレスの重複チェック
	for _, u := range r.users {
		if u.Email == user.Email {
			return errors.New("email already exists")
		}
		if u.UserLoginID == user.UserLoginID {
			return errors.New("user_login_id already exists")
		}
	}

	// ユーザーコード生成（IDと同じ値）
	now := time.Now()

	user.ID = r.nextID
	user.UserCode = r.nextID
	user.RegisteredAt = now
	user.RegistrationSource = "web"
	user.UpdateCount = 0
	user.UpdatedAt = now
	user.IsInvalid = false
	r.users[user.ID] = user
	r.nextID++

	return nil
}

// GetByID IDでユーザーを取得
func (r *InMemoryRepository) GetByID(id int) (*User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	user, exists := r.users[id]
	if !exists || user.IsInvalid {
		return nil, errors.New("user not found")
	}

	return user, nil
}

// GetByUserCode ユーザーコードでユーザーを取得
func (r *InMemoryRepository) GetByUserCode(userCode int) (*User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	for _, user := range r.users {
		if user.UserCode == userCode && !user.IsInvalid {
			return user, nil
		}
	}

	return nil, errors.New("user not found")
}

// GetByEmail メールアドレスでユーザーを取得
func (r *InMemoryRepository) GetByEmail(email string) (*User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	for _, user := range r.users {
		if user.Email == email && !user.IsInvalid {
			return user, nil
		}
	}

	return nil, errors.New("user not found")
}

// GetByLoginID ログインIDでユーザーを取得
func (r *InMemoryRepository) GetByLoginID(loginID string) (*User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	for _, user := range r.users {
		if user.UserLoginID == loginID && !user.IsInvalid {
			return user, nil
		}
	}

	return nil, errors.New("user not found")
}

// GetAll 全ユーザーを取得（無効を除外）
func (r *InMemoryRepository) GetAll() ([]*User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	users := make([]*User, 0, len(r.users))
	for _, user := range r.users {
		if !user.IsInvalid {
			users = append(users, user)
		}
	}

	return users, nil
}

// Update ユーザーを更新
func (r *InMemoryRepository) Update(user *User) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, exists := r.users[user.ID]; !exists {
		return errors.New("user not found")
	}

	user.UpdatedAt = time.Now()
	user.UpdateCount++
	r.users[user.ID] = user

	return nil
}

// Delete ユーザーを論理削除（IsInvalidを1に設定）
func (r *InMemoryRepository) Delete(id int) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	user, exists := r.users[id]
	if !exists {
		return errors.New("user not found")
	}

	// 論理削除（IsInvalidを1に設定）
	user.IsInvalid = true
	user.UpdatedAt = time.Now()
	user.UpdateCount++
	r.users[id] = user

	return nil
}
