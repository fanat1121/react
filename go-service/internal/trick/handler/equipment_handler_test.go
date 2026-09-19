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

// stubEquipmentRepository はテスト用のインメモリ実装
type stubEquipmentRepository struct {
	items  map[int]*trick.Equipment
	nextID int
}

func newStubEquipmentRepository() *stubEquipmentRepository {
	return &stubEquipmentRepository{items: make(map[int]*trick.Equipment), nextID: 1}
}

func (s *stubEquipmentRepository) Create(e *trick.Equipment) error {
	for _, existing := range s.items {
		if existing.Name == e.Name {
			return errors.New("equipment name already exists")
		}
	}
	e.ID = s.nextID
	s.items[e.ID] = e
	s.nextID++
	return nil
}

func (s *stubEquipmentRepository) GetByID(id int) (*trick.Equipment, error) {
	e, ok := s.items[id]
	if !ok {
		return nil, errors.New("equipment not found")
	}
	return e, nil
}

func (s *stubEquipmentRepository) GetAll() ([]*trick.Equipment, error) {
	result := make([]*trick.Equipment, 0)
	for _, e := range s.items {
		result = append(result, e)
	}
	return result, nil
}

func (s *stubEquipmentRepository) Delete(id int) error {
	if _, ok := s.items[id]; !ok {
		return errors.New("equipment not found")
	}
	delete(s.items, id)
	return nil
}

func TestCreateEquipment_Success(t *testing.T) {
	repo := newStubEquipmentRepository()
	h := NewEquipmentHandler(service.NewEquipmentService(repo))

	body, _ := json.Marshal(map[string]string{"name": "ディアボロ"})
	req := httptest.NewRequest("POST", "/api/equipments", bytes.NewReader(body))
	w := httptest.NewRecorder()

	h.CreateEquipment(w, req)

	if w.Code != 201 {
		t.Fatalf("expected status 201, got %d, body: %s", w.Code, w.Body.String())
	}
}

func TestGetEquipmentByID_NotFound(t *testing.T) {
	repo := newStubEquipmentRepository()
	h := NewEquipmentHandler(service.NewEquipmentService(repo))

	req := httptest.NewRequest("GET", "/api/equipments/999", nil)
	req = mux.SetURLVars(req, map[string]string{"id": "999"})
	w := httptest.NewRecorder()

	h.GetEquipmentByID(w, req)

	if w.Code != 404 {
		t.Fatalf("expected status 404, got %d, body: %s", w.Code, w.Body.String())
	}
}
