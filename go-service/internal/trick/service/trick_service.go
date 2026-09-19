// go-service/internal/trick/service/trick_service.go
package service

import (
	"errors"
	"go-service/internal/trick"
	"go-service/pkg/validator"
)

// TrickService 技マスタのビジネスロジック
type TrickService struct {
	equipmentRepo trick.EquipmentRepository
	categoryRepo  trick.EquipmentCategoryRepository
	stateRepo     trick.StateRepository
	trickRepo     trick.TrickRepository
}

// NewTrickService サービスを作成
func NewTrickService(
	equipmentRepo trick.EquipmentRepository,
	categoryRepo trick.EquipmentCategoryRepository,
	stateRepo trick.StateRepository,
	trickRepo trick.TrickRepository,
) *TrickService {
	return &TrickService{
		equipmentRepo: equipmentRepo,
		categoryRepo:  categoryRepo,
		stateRepo:     stateRepo,
		trickRepo:     trickRepo,
	}
}

// CreateTrick 技を登録
func (s *TrickService) CreateTrick(req *trick.CreateTrickRequest) (*trick.TrickResponse, error) {
	if err := validator.Validate(req); err != nil {
		return nil, err
	}

	if _, err := s.equipmentRepo.GetByID(req.EquipmentID); err != nil {
		return nil, errors.New("equipment not found")
	}

	category, err := s.categoryRepo.GetByID(req.CategoryID)
	if err != nil {
		return nil, errors.New("equipment category not found")
	}
	if category.EquipmentID != req.EquipmentID {
		return nil, errors.New("category does not belong to the given equipment")
	}

	startState, err := s.stateRepo.GetByID(req.StartStateID)
	if err != nil {
		return nil, errors.New("start state not found")
	}
	if startState.EquipmentID != req.EquipmentID {
		return nil, errors.New("start state does not belong to the given equipment")
	}

	endState, err := s.stateRepo.GetByID(req.EndStateID)
	if err != nil {
		return nil, errors.New("end state not found")
	}
	if endState.EquipmentID != req.EquipmentID {
		return nil, errors.New("end state does not belong to the given equipment")
	}

	var description *string
	if req.Description != "" {
		description = &req.Description
	}
	var videoURL *string
	if req.VideoURL != "" {
		videoURL = &req.VideoURL
	}

	t := &trick.Trick{
		EquipmentID:              req.EquipmentID,
		CategoryID:               req.CategoryID,
		Name:                     req.Name,
		Description:              description,
		StartStateID:             req.StartStateID,
		EndStateID:               req.EndStateID,
		VideoURL:                 videoURL,
		EstimatedDurationSeconds: req.EstimatedDurationSeconds,
	}
	if err := s.trickRepo.Create(t); err != nil {
		return nil, err
	}
	return t.ToResponse(), nil
}

// GetAllTricks 全技を取得
func (s *TrickService) GetAllTricks() ([]*trick.TrickResponse, error) {
	tricks, err := s.trickRepo.GetAll()
	if err != nil {
		return nil, err
	}
	responses := make([]*trick.TrickResponse, len(tricks))
	for i, t := range tricks {
		responses[i] = t.ToResponse()
	}
	return responses, nil
}

// GetTrickByID IDで技を取得
func (s *TrickService) GetTrickByID(id int) (*trick.TrickResponse, error) {
	t, err := s.trickRepo.GetByID(id)
	if err != nil {
		return nil, err
	}
	return t.ToResponse(), nil
}

// DeleteTrick 技を論理削除
func (s *TrickService) DeleteTrick(id int) error {
	return s.trickRepo.Delete(id)
}
