package service

import (
	"fmt"
	"go-service/internal/trick"
	"go-service/pkg/validator"
)

// CategoryService 道具カテゴリマスタのビジネスロジック
type CategoryService struct {
	repo      trick.EquipmentCategoryRepository
	trickRepo trick.TrickRepository
}

// NewCategoryService サービスを作成
// 削除時の参照チェックのため、カテゴリを参照する技のリポジトリも受け取る
func NewCategoryService(repo trick.EquipmentCategoryRepository, trickRepo trick.TrickRepository) *CategoryService {
	return &CategoryService{repo: repo, trickRepo: trickRepo}
}

// CreateCategory カテゴリを登録
func (s *CategoryService) CreateCategory(req *trick.CreateEquipmentCategoryRequest) (*trick.EquipmentCategoryResponse, error) {
	if err := validator.Validate(req); err != nil {
		return nil, err
	}

	c := &trick.EquipmentCategory{EquipmentID: req.EquipmentID, Name: req.Name}
	if err := s.repo.Create(c); err != nil {
		return nil, err
	}
	return c.ToResponse(), nil
}

// GetAllCategories 全カテゴリを取得
func (s *CategoryService) GetAllCategories() ([]*trick.EquipmentCategoryResponse, error) {
	categories, err := s.repo.GetAll()
	if err != nil {
		return nil, err
	}
	responses := make([]*trick.EquipmentCategoryResponse, len(categories))
	for i, c := range categories {
		responses[i] = c.ToResponse()
	}
	return responses, nil
}

// GetCategoriesByEquipmentID 指定した道具に属するカテゴリのみを取得
func (s *CategoryService) GetCategoriesByEquipmentID(equipmentID int) ([]*trick.EquipmentCategoryResponse, error) {
	categories, err := s.repo.GetAll()
	if err != nil {
		return nil, err
	}
	responses := make([]*trick.EquipmentCategoryResponse, 0)
	for _, c := range categories {
		if c.EquipmentID == equipmentID {
			responses = append(responses, c.ToResponse())
		}
	}
	return responses, nil
}

// GetCategoryByID IDでカテゴリを取得
func (s *CategoryService) GetCategoryByID(id int) (*trick.EquipmentCategoryResponse, error) {
	c, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}
	return c.ToResponse(), nil
}

// DeleteCategory カテゴリを論理削除
// 有効な技から参照されている場合は trick.ErrInUse を返す
// NOTE: チェックと削除の間の競合は許容している（docs/TODO-trick-master.md 参照）
func (s *CategoryService) DeleteCategory(id int) error {
	// 存在しない（削除済み含む）場合は参照チェックより先に not found を返す
	if _, err := s.repo.GetByID(id); err != nil {
		return err
	}

	n, err := s.trickRepo.CountByCategoryID(id)
	if err != nil {
		return err
	}
	if n > 0 {
		return fmt.Errorf("equipment category is in use: %w", trick.ErrInUse)
	}

	return s.repo.Delete(id)
}
