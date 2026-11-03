package service

import (
	"fmt"
	"go-service/internal/trick"
	"go-service/pkg/validator"
)

// EquipmentService 道具マスタのビジネスロジック
type EquipmentService struct {
	repo         trick.EquipmentRepository
	categoryRepo trick.EquipmentCategoryRepository
	stateRepo    trick.StateRepository
	trickRepo    trick.TrickRepository
}

// NewEquipmentService サービスを作成
// 削除時の参照チェックのため、道具を参照するカテゴリ・状態・技のリポジトリも受け取る
func NewEquipmentService(
	repo trick.EquipmentRepository,
	categoryRepo trick.EquipmentCategoryRepository,
	stateRepo trick.StateRepository,
	trickRepo trick.TrickRepository,
) *EquipmentService {
	return &EquipmentService{repo: repo, categoryRepo: categoryRepo, stateRepo: stateRepo, trickRepo: trickRepo}
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
// 有効なカテゴリ・状態・技から参照されている場合は trick.ErrInUse を返す
// NOTE: チェックと削除の間の競合は許容している（docs/TODO-trick-master.md 参照）
func (s *EquipmentService) DeleteEquipment(id int) error {
	// 存在しない（削除済み含む）場合は参照チェックより先に not found を返す
	if _, err := s.repo.GetByID(id); err != nil {
		return err
	}

	counters := []func(int) (int, error){
		s.categoryRepo.CountByEquipmentID,
		s.stateRepo.CountByEquipmentID,
		s.trickRepo.CountByEquipmentID,
	}
	for _, count := range counters {
		n, err := count(id)
		if err != nil {
			return err
		}
		if n > 0 {
			return fmt.Errorf("equipment is in use: %w", trick.ErrInUse)
		}
	}

	return s.repo.Delete(id)
}
