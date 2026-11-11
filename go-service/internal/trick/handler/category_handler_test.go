package handler

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"go-service/internal/trick"
	"go-service/internal/trick/service"
	"net/http/httptest"
	"testing"

	"github.com/gorilla/mux"
)

type stubCategoryRepository struct {
	items  map[int]*trick.EquipmentCategory
	nextID int
}

func newStubCategoryRepository() *stubCategoryRepository {
	return &stubCategoryRepository{items: make(map[int]*trick.EquipmentCategory), nextID: 1}
}

func (s *stubCategoryRepository) Create(c *trick.EquipmentCategory) error {
	for _, existing := range s.items {
		if existing.EquipmentID == c.EquipmentID && existing.Name == c.Name {
			return errors.New("equipment category name already exists")
		}
	}
	c.ID = s.nextID
	s.items[c.ID] = c
	s.nextID++
	return nil
}

func (s *stubCategoryRepository) GetByID(id int) (*trick.EquipmentCategory, error) {
	c, ok := s.items[id]
	if !ok {
		return nil, fmt.Errorf("equipment category %w", trick.ErrNotFound)
	}
	return c, nil
}

func (s *stubCategoryRepository) GetAll() ([]*trick.EquipmentCategory, error) {
	result := make([]*trick.EquipmentCategory, 0)
	for _, c := range s.items {
		result = append(result, c)
	}
	return result, nil
}

func (s *stubCategoryRepository) Delete(id int) error {
	if _, ok := s.items[id]; !ok {
		return fmt.Errorf("equipment category %w", trick.ErrNotFound)
	}
	delete(s.items, id)
	return nil
}

func (s *stubCategoryRepository) CountByEquipmentID(equipmentID int) (int, error) {
	count := 0
	for _, c := range s.items {
		if c.EquipmentID == equipmentID {
			count++
		}
	}
	return count, nil
}

func TestCreateCategory_Success(t *testing.T) {
	repo := newStubCategoryRepository()
	h := NewCategoryHandler(service.NewCategoryService(repo, newStubTrickRepository()))

	body, _ := json.Marshal(map[string]interface{}{"equipment_id": 1, "name": "2個"})
	req := httptest.NewRequest("POST", "/api/equipment-categories", bytes.NewReader(body))
	w := httptest.NewRecorder()

	h.CreateCategory(w, req)

	if w.Code != 201 {
		t.Fatalf("expected status 201, got %d, body: %s", w.Code, w.Body.String())
	}
}

func TestDeleteCategory_NotFound(t *testing.T) {
	repo := newStubCategoryRepository()
	h := NewCategoryHandler(service.NewCategoryService(repo, newStubTrickRepository()))

	req := httptest.NewRequest("DELETE", "/api/equipment-categories/999", nil)
	req = mux.SetURLVars(req, map[string]string{"id": "999"})
	w := httptest.NewRecorder()

	h.DeleteCategory(w, req)

	if w.Code != 404 {
		t.Fatalf("expected status 404, got %d, body: %s", w.Code, w.Body.String())
	}
}

// newCategoryHandlerForDeleteTest 削除テスト用にカテゴリid=1を登録したハンドラーと技リポジトリを返す
func newCategoryHandlerForDeleteTest() (*CategoryHandler, *stubCategoryRepository, *stubTrickRepository) {
	repo := newStubCategoryRepository()
	repo.items[1] = &trick.EquipmentCategory{ID: 1, EquipmentID: 1, Name: "2個"}
	repo.nextID = 2
	trickRepo := newStubTrickRepository()
	h := NewCategoryHandler(service.NewCategoryService(repo, trickRepo))
	return h, repo, trickRepo
}

func doDeleteCategory(h *CategoryHandler, id string) *httptest.ResponseRecorder {
	req := httptest.NewRequest("DELETE", "/api/equipment-categories/"+id, nil)
	req = mux.SetURLVars(req, map[string]string{"id": id})
	w := httptest.NewRecorder()
	h.DeleteCategory(w, req)
	return w
}

func TestDeleteCategory_Success(t *testing.T) {
	h, repo, _ := newCategoryHandlerForDeleteTest()

	w := doDeleteCategory(h, "1")

	if w.Code != 200 {
		t.Fatalf("expected status 200, got %d, body: %s", w.Code, w.Body.String())
	}
	if _, ok := repo.items[1]; ok {
		t.Fatalf("expected category to be deleted")
	}
}

func TestDeleteCategory_InvalidID(t *testing.T) {
	h, _, _ := newCategoryHandlerForDeleteTest()

	w := doDeleteCategory(h, "abc")

	if w.Code != 400 {
		t.Fatalf("expected status 400, got %d, body: %s", w.Code, w.Body.String())
	}
}

func TestDeleteCategory_InUseByTrick(t *testing.T) {
	h, repo, trickRepo := newCategoryHandlerForDeleteTest()
	trickRepo.items[1] = &trick.Trick{ID: 1, EquipmentID: 1, CategoryID: 1, Name: "技", StartStateID: 1, EndStateID: 1}

	w := doDeleteCategory(h, "1")

	if w.Code != 409 {
		t.Fatalf("expected status 409, got %d, body: %s", w.Code, w.Body.String())
	}
	if _, ok := repo.items[1]; !ok {
		t.Fatalf("expected category not to be deleted")
	}
}

func TestDeleteCategory_ReferencedTrickDeleted(t *testing.T) {
	h, _, trickRepo := newCategoryHandlerForDeleteTest()
	trickRepo.items[1] = &trick.Trick{ID: 1, EquipmentID: 1, CategoryID: 1, Name: "技", StartStateID: 1, EndStateID: 1}
	// 参照していた技を論理削除すると、カテゴリは削除可能になる
	if err := trickRepo.Delete(1); err != nil {
		t.Fatalf("failed to delete trick: %v", err)
	}

	w := doDeleteCategory(h, "1")

	if w.Code != 200 {
		t.Fatalf("expected status 200, got %d, body: %s", w.Code, w.Body.String())
	}
}

func TestDeleteCategory_DBError(t *testing.T) {
	h, repo, trickRepo := newCategoryHandlerForDeleteTest()
	trickRepo.countErr = errors.New("db connection refused")

	w := doDeleteCategory(h, "1")

	if w.Code != 500 {
		t.Fatalf("expected status 500, got %d, body: %s", w.Code, w.Body.String())
	}
	if _, ok := repo.items[1]; !ok {
		t.Fatalf("expected category not to be deleted")
	}
}
