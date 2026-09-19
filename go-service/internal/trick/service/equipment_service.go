package service

import (
	"go-service/internal/trick"
	"go-service/pkg/validator"
)

// EquipmentService 道具マスタのビジネスロジック
type EquipmentService struct {
	repo trick.EquipmentRepository
}

// NewEquipmentService サービスを作成
func NewEquipmentService(repo trick.EquipmentRepository) *EquipmentService {
	return &EquipmentService{repo: repo}
}

// CreateEquipment 道具を登録
func (s *EquipmentService) CreateEquipment(req *trick.CreateEquipmentRequest) (*trick.EquipmentResponse, error) {
	if err := validator.Validate(req); err != nil {
		return nil, err
	}

	e := &trick.Equipment{Name: req.Name}
	if err := s.repo.Create(e); err != nil {
		return nil, err
	}
	return e.ToResponse(), nil
}

// GetAllEquipments 全道具を取得
func (s *EquipmentService) GetAllEquipments() ([]*trick.EquipmentResponse, error) {
	equipments, err := s.repo.GetAll()
	if err != nil {
		return nil, err
	}
	responses := make([]*trick.EquipmentResponse, len(equipments))
	for i, e := range equipments {
		responses[i] = e.ToResponse()
	}
	return responses, nil
}

// GetEquipmentByID IDで道具を取得
func (s *EquipmentService) GetEquipmentByID(id int) (*trick.EquipmentResponse, error) {
	e, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}
	return e.ToResponse(), nil
}

// DeleteEquipment 道具を論理削除
func (s *EquipmentService) DeleteEquipment(id int) error {
	return s.repo.Delete(id)
}
