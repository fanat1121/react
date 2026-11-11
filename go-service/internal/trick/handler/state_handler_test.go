// go-service/internal/trick/handler/state_handler_test.go
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
		return nil, fmt.Errorf("state %w", trick.ErrNotFound)
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
		return fmt.Errorf("state %w", trick.ErrNotFound)
	}
	delete(s.items, id)
	return nil
}

func (s *stubStateRepository) CountByEquipmentID(equipmentID int) (int, error) {
	count := 0
	for _, st := range s.items {
		if st.EquipmentID == equipmentID {
			count++
		}
	}
	return count, nil
}

func TestCreateState_Success(t *testing.T) {
	repo := newStubStateRepository()
	h := NewStateHandler(service.NewStateService(repo, newStubTrickRepository()))

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
	h := NewStateHandler(service.NewStateService(repo, newStubTrickRepository()))

	req := httptest.NewRequest("GET", "/api/states/999", nil)
	req = mux.SetURLVars(req, map[string]string{"id": "999"})
	w := httptest.NewRecorder()

	h.GetStateByID(w, req)

	if w.Code != 404 {
		t.Fatalf("expected status 404, got %d, body: %s", w.Code, w.Body.String())
	}
}

// newStateHandlerForDeleteTest 削除テスト用に状態id=1,2を登録したハンドラーと技リポジトリを返す
func newStateHandlerForDeleteTest() (*StateHandler, *stubStateRepository, *stubTrickRepository) {
	repo := newStubStateRepository()
	repo.items[1] = &trick.State{ID: 1, EquipmentID: 1, Name: "待機"}
	repo.items[2] = &trick.State{ID: 2, EquipmentID: 1, Name: "カスケード中"}
	repo.nextID = 3
	trickRepo := newStubTrickRepository()
	h := NewStateHandler(service.NewStateService(repo, trickRepo))
	return h, repo, trickRepo
}

func doDeleteState(h *StateHandler, id string) *httptest.ResponseRecorder {
	req := httptest.NewRequest("DELETE", "/api/states/"+id, nil)
	req = mux.SetURLVars(req, map[string]string{"id": id})
	w := httptest.NewRecorder()
	h.DeleteState(w, req)
	return w
}

func TestDeleteState_Success(t *testing.T) {
	h, repo, _ := newStateHandlerForDeleteTest()

	w := doDeleteState(h, "1")

	if w.Code != 200 {
		t.Fatalf("expected status 200, got %d, body: %s", w.Code, w.Body.String())
	}
	if _, ok := repo.items[1]; ok {
		t.Fatalf("expected state to be deleted")
	}
}

func TestDeleteState_NotFound(t *testing.T) {
	h, _, _ := newStateHandlerForDeleteTest()

	w := doDeleteState(h, "999")

	if w.Code != 404 {
		t.Fatalf("expected status 404, got %d, body: %s", w.Code, w.Body.String())
	}
}

func TestDeleteState_InvalidID(t *testing.T) {
	h, _, _ := newStateHandlerForDeleteTest()

	w := doDeleteState(h, "abc")

	if w.Code != 400 {
		t.Fatalf("expected status 400, got %d, body: %s", w.Code, w.Body.String())
	}
}

func TestDeleteState_InUseAsStartState(t *testing.T) {
	h, repo, trickRepo := newStateHandlerForDeleteTest()
	trickRepo.items[1] = &trick.Trick{ID: 1, EquipmentID: 1, CategoryID: 1, Name: "技", StartStateID: 1, EndStateID: 2}

	w := doDeleteState(h, "1")

	if w.Code != 409 {
		t.Fatalf("expected status 409, got %d, body: %s", w.Code, w.Body.String())
	}
	if _, ok := repo.items[1]; !ok {
		t.Fatalf("expected state not to be deleted")
	}
}

func TestDeleteState_InUseAsEndState(t *testing.T) {
	h, _, trickRepo := newStateHandlerForDeleteTest()
	trickRepo.items[1] = &trick.Trick{ID: 1, EquipmentID: 1, CategoryID: 1, Name: "技", StartStateID: 1, EndStateID: 2}

	w := doDeleteState(h, "2")

	if w.Code != 409 {
		t.Fatalf("expected status 409, got %d, body: %s", w.Code, w.Body.String())
	}
}

func TestDeleteState_DBError(t *testing.T) {
	h, repo, trickRepo := newStateHandlerForDeleteTest()
	trickRepo.countErr = errors.New("db connection refused")

	w := doDeleteState(h, "1")

	if w.Code != 500 {
		t.Fatalf("expected status 500, got %d, body: %s", w.Code, w.Body.String())
	}
	if _, ok := repo.items[1]; !ok {
		t.Fatalf("expected state not to be deleted")
	}
}
