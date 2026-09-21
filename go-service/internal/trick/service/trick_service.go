// go-service/internal/trick/service/trick_service.go
package service

import (
	"errors"
	"go-service/internal/trick"
	"go-service/pkg/validator"
	"strings"
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

// SearchTricks 条件に一致する技を検索し、道具名・カテゴリ名・状態名を解決して返す
func (s *TrickService) SearchTricks(filter trick.TrickSearchFilter) ([]*trick.TrickDetailResponse, error) {
	tricks, err := s.trickRepo.GetAll()
	if err != nil {
		return nil, err
	}

	loweredName := strings.ToLower(filter.Name)

	equipmentNames := make(map[int]string)
	categoryNames := make(map[int]string)
	stateNames := make(map[int]string)

	responses := make([]*trick.TrickDetailResponse, 0)
	for _, t := range tricks {
		if loweredName != "" && !strings.Contains(strings.ToLower(t.Name), loweredName) {
			continue
		}
		if filter.EquipmentID != nil && t.EquipmentID != *filter.EquipmentID {
			continue
		}
		if filter.CategoryID != nil && t.CategoryID != *filter.CategoryID {
			continue
		}
		if filter.StateID != nil && *filter.StateID != t.StartStateID && *filter.StateID != t.EndStateID {
			continue
		}

		equipmentName, ok := equipmentNames[t.EquipmentID]
		if !ok {
			if equipment, err := s.equipmentRepo.GetByID(t.EquipmentID); err == nil {
				equipmentName = equipment.Name
			}
			equipmentNames[t.EquipmentID] = equipmentName
		}

		categoryName, ok := categoryNames[t.CategoryID]
		if !ok {
			if category, err := s.categoryRepo.GetByID(t.CategoryID); err == nil {
				categoryName = category.Name
			}
			categoryNames[t.CategoryID] = categoryName
		}

		startStateName, ok := stateNames[t.StartStateID]
		if !ok {
			if state, err := s.stateRepo.GetByID(t.StartStateID); err == nil {
				startStateName = state.Name
			}
			stateNames[t.StartStateID] = startStateName
		}

		endStateName, ok := stateNames[t.EndStateID]
		if !ok {
			if state, err := s.stateRepo.GetByID(t.EndStateID); err == nil {
				endStateName = state.Name
			}
			stateNames[t.EndStateID] = endStateName
		}

		responses = append(responses, &trick.TrickDetailResponse{
			ID:                       t.ID,
			EquipmentID:              t.EquipmentID,
			EquipmentName:            equipmentName,
			CategoryID:               t.CategoryID,
			CategoryName:             categoryName,
			Name:                     t.Name,
			Description:              t.Description,
			StartStateID:             t.StartStateID,
			StartStateName:           startStateName,
			EndStateID:               t.EndStateID,
			EndStateName:             endStateName,
			VideoURL:                 t.VideoURL,
			EstimatedDurationSeconds: t.EstimatedDurationSeconds,
			CreatedAt:                t.CreatedAt,
			UpdatedAt:                t.UpdatedAt,
		})
	}
	return responses, nil
}

// GetTrickByID IDで技を取得し、道具名・カテゴリ名・状態名を解決して返す
func (s *TrickService) GetTrickByID(id int) (*trick.TrickDetailResponse, error) {
	t, err := s.trickRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	equipment, err := s.equipmentRepo.GetByID(t.EquipmentID)
	if err != nil {
		return nil, err
	}
	category, err := s.categoryRepo.GetByID(t.CategoryID)
	if err != nil {
		return nil, err
	}
	startState, err := s.stateRepo.GetByID(t.StartStateID)
	if err != nil {
		return nil, err
	}
	endState, err := s.stateRepo.GetByID(t.EndStateID)
	if err != nil {
		return nil, err
	}

	return &trick.TrickDetailResponse{
		ID:                       t.ID,
		EquipmentID:              t.EquipmentID,
		EquipmentName:            equipment.Name,
		CategoryID:               t.CategoryID,
		CategoryName:             category.Name,
		Name:                     t.Name,
		Description:              t.Description,
		StartStateID:             t.StartStateID,
		StartStateName:           startState.Name,
		EndStateID:               t.EndStateID,
		EndStateName:             endState.Name,
		VideoURL:                 t.VideoURL,
		EstimatedDurationSeconds: t.EstimatedDurationSeconds,
		CreatedAt:                t.CreatedAt,
		UpdatedAt:                t.UpdatedAt,
	}, nil
}

// DeleteTrick 技を論理削除
func (s *TrickService) DeleteTrick(id int) error {
	return s.trickRepo.Delete(id)
}
