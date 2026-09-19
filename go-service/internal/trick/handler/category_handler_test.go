package handler

import (
	"bytes"
	"encoding/json"
	"errors"
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
		return nil, errors.New("equipment category not found")
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
		return errors.New("equipment category not found")
	}
	delete(s.items, id)
	return nil
}

func TestCreateCategory_Success(t *testing.T) {
	repo := newStubCategoryRepository()
	h := NewCategoryHandler(service.NewCategoryService(repo))

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
	h := NewCategoryHandler(service.NewCategoryService(repo))

	req := httptest.NewRequest("DELETE", "/api/equipment-categories/999", nil)
	req = mux.SetURLVars(req, map[string]string{"id": "999"})
	w := httptest.NewRecorder()

	h.DeleteCategory(w, req)

	if w.Code != 404 {
		t.Fatalf("expected status 404, got %d, body: %s", w.Code, w.Body.String())
	}
}
