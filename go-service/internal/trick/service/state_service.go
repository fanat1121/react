// go-service/internal/trick/service/state_service.go
package service

import (
	"go-service/internal/trick"
	"go-service/pkg/validator"
)

// StateService 状態マスタのビジネスロジック
type StateService struct {
	repo trick.StateRepository
}

// NewStateService サービスを作成
func NewStateService(repo trick.StateRepository) *StateService {
	return &StateService{repo: repo}
}

// CreateState 状態を登録
func (s *StateService) CreateState(req *trick.CreateStateRequest) (*trick.StateResponse, error) {
	if err := validator.Validate(req); err != nil {
		return nil, err
	}

	var description *string
	if req.Description != "" {
		description = &req.Description
	}

	state := &trick.State{EquipmentID: req.EquipmentID, Name: req.Name, Description: description}
	if err := s.repo.Create(state); err != nil {
		return nil, err
	}
	return state.ToResponse(), nil
}

// GetAllStates 全状態を取得
func (s *StateService) GetAllStates() ([]*trick.StateResponse, error) {
	states, err := s.repo.GetAll()
	if err != nil {
		return nil, err
	}
	responses := make([]*trick.StateResponse, len(states))
	for i, st := range states {
		responses[i] = st.ToResponse()
	}
	return responses, nil
}

// GetStateByID IDで状態を取得
func (s *StateService) GetStateByID(id int) (*trick.StateResponse, error) {
	state, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}
	return state.ToResponse(), nil
}

// DeleteState 状態を論理削除
func (s *StateService) DeleteState(id int) error {
	return s.repo.Delete(id)
}
