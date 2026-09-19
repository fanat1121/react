package service

import (
	"go-service/internal/trick"
	"go-service/pkg/validator"
)

// CategoryService 道具カテゴリマスタのビジネスロジック
type CategoryService struct {
	repo trick.EquipmentCategoryRepository
}

// NewCategoryService サービスを作成
func NewCategoryService(repo trick.EquipmentCategoryRepository) *CategoryService {
	return &CategoryService{repo: repo}
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
func (s *CategoryService) DeleteCategory(id int) error {
	return s.repo.Delete(id)
}
