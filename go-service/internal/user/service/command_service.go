package service

import (
	"errors"
	"go-service/internal/user"
	"go-service/pkg/validator"

	"golang.org/x/crypto/bcrypt"
)

// CommandService ユーザー更新系サービス（Create, Update, Delete）
type CommandService struct {
	repo user.Repository
}

// NewCommandService 更新系サービスを作成
func NewCommandService(repo user.Repository) *CommandService {
	return &CommandService{
		repo: repo,
	}
}

// CreateUser ユーザーを作成
func (s *CommandService) CreateUser(req *user.CreateUserRequest) (*user.UserResponse, error) {
	// バリデーション
	if err := validator.Validate(req); err != nil {
		return nil, err
	}

	// パスワードをハッシュ化
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, errors.New("failed to hash password")
	}

	newUser := &user.User{
		UserName:           req.UserName,
		UserLoginID:        req.UserLoginID,
		Email:              req.Email,
		PasswordHash:       string(hashedPassword),
		RegistrationSource: "web",
	}

	// ユーザーを保存
	if err := s.repo.Create(newUser); err != nil {
		return nil, err
	}

	return newUser.ToResponse(), nil
}

// DeleteUser ユーザーを削除（論理削除）
func (s *CommandService) DeleteUser(id int) error {
	// ユーザーの存在確認
	_, err := s.repo.GetByID(id)
	if err != nil {
		return errors.New("user not found")
	}

	// 論理削除実行
	if err := s.repo.Delete(id); err != nil {
		return err
	}

	return nil
}
