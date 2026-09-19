// go-service/internal/trick/handler/state_handler_test.go
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

type stubStateRepository struct {
	items  map[int]*trick.State
	nextID int
}

func newStubStateRepository() *stubStateRepository {
	return &stubStateRepository{items: make(map[int]*trick.State), nextID: 1}
}

func (s *stubStateRepository) Create(st *trick.State) error {
	for _, existing := range s.items {
		if existing.EquipmentID == st.EquipmentID && existing.Name == st.Name {
			return errors.New("state name already exists")
		}
	}
	st.ID = s.nextID
	s.items[st.ID] = st
	s.nextID++
	return nil
}

func (s *stubStateRepository) GetByID(id int) (*trick.State, error) {
	st, ok := s.items[id]
	if !ok {
		return nil, errors.New("state not found")
	}
	return st, nil
}

func (s *stubStateRepository) GetAll() ([]*trick.State, error) {
	result := make([]*trick.State, 0)
	for _, st := range s.items {
		result = append(result, st)
	}
	return result, nil
}

func (s *stubStateRepository) Delete(id int) error {
	if _, ok := s.items[id]; !ok {
		return errors.New("state not found")
	}
	delete(s.items, id)
	return nil
}

func TestCreateState_Success(t *testing.T) {
	repo := newStubStateRepository()
	h := NewStateHandler(service.NewStateService(repo))

	body, _ := json.Marshal(map[string]interface{}{"equipment_id": 1, "name": "3ボール片手待機"})
	req := httptest.NewRequest("POST", "/api/states", bytes.NewReader(body))
	w := httptest.NewRecorder()

	h.CreateState(w, req)

	if w.Code != 201 {
		t.Fatalf("expected status 201, got %d, body: %s", w.Code, w.Body.String())
	}
}

func TestGetStateByID_NotFound(t *testing.T) {
	repo := newStubStateRepository()
	h := NewStateHandler(service.NewStateService(repo))

	req := httptest.NewRequest("GET", "/api/states/999", nil)
	req = mux.SetURLVars(req, map[string]string{"id": "999"})
	w := httptest.NewRecorder()

	h.GetStateByID(w, req)

	if w.Code != 404 {
		t.Fatalf("expected status 404, got %d, body: %s", w.Code, w.Body.String())
	}
}
