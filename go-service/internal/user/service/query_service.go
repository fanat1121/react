package service

import (
	"go-service/internal/user"
)

// QueryService ユーザー取得系サービス（Get, List, Search）
type QueryService struct {
	repo user.Repository
}

// NewQueryService 取得系サービスを作成
func NewQueryService(repo user.Repository) *QueryService {
	return &QueryService{
		repo: repo,
	}
}

// GetUserByID IDでユーザーを取得
func (s *QueryService) GetUserByID(id int) (*user.UserResponse, error) {
	foundUser, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}

	return foundUser.ToResponse(), nil
}

// GetAllUsers 全ユーザーを取得
func (s *QueryService) GetAllUsers() ([]*user.UserResponse, error) {
	users, err := s.repo.GetAll()
	if err != nil {
		return nil, err
	}

	responses := make([]*user.UserResponse, len(users))
	for i, u := range users {
		responses[i] = u.ToResponse()
	}

	return responses, nil
}

// GetUserByEmail メールアドレスでユーザーを取得
func (s *QueryService) GetUserByEmail(email string) (*user.UserResponse, error) {
	foundUser, err := s.repo.GetByEmail(email)
	if err != nil {
		return nil, err
	}

	return foundUser.ToResponse(), nil
}

// GetUserByLoginID ログインIDでユーザーを取得
func (s *QueryService) GetUserByLoginID(loginID string) (*user.UserResponse, error) {
	foundUser, err := s.repo.GetByLoginID(loginID)
	if err != nil {
		return nil, err
	}

	return foundUser.ToResponse(), nil
}

// GetUserByUserCode ユーザーコードでユーザーを取得
func (s *QueryService) GetUserByUserCode(userCode int) (*user.UserResponse, error) {
	foundUser, err := s.repo.GetByUserCode(userCode)
	if err != nil {
		return nil, err
	}

	return foundUser.ToResponse(), nil
}
