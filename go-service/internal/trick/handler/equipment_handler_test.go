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
		return nil, fmt.Errorf("equipment %w", trick.ErrNotFound)
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
		return fmt.Errorf("equipment %w", trick.ErrNotFound)
	}
	delete(s.items, id)
	return nil
}

func TestCreateEquipment_Success(t *testing.T) {
	repo := newStubEquipmentRepository()
	h := NewEquipmentHandler(service.NewEquipmentService(repo, newStubCategoryRepository(), newStubStateRepository(), newStubTrickRepository()))

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
	h := NewEquipmentHandler(service.NewEquipmentService(repo, newStubCategoryRepository(), newStubStateRepository(), newStubTrickRepository()))

	req := httptest.NewRequest("GET", "/api/equipments/999", nil)
	req = mux.SetURLVars(req, map[string]string{"id": "999"})
	w := httptest.NewRecorder()

	h.GetEquipmentByID(w, req)

	if w.Code != 404 {
		t.Fatalf("expected status 404, got %d, body: %s", w.Code, w.Body.String())
	}
}

// newEquipmentHandlerForDeleteTest 削除テスト用に道具id=1を登録したハンドラーと参照側リポジトリを返す
func newEquipmentHandlerForDeleteTest() (*EquipmentHandler, *stubEquipmentRepository, *stubCategoryRepository, *stubStateRepository, *stubTrickRepository) {
	repo := newStubEquipmentRepository()
	repo.items[1] = &trick.Equipment{ID: 1, Name: "ディアボロ"}
	repo.nextID = 2
	categoryRepo := newStubCategoryRepository()
	stateRepo := newStubStateRepository()
	trickRepo := newStubTrickRepository()
	h := NewEquipmentHandler(service.NewEquipmentService(repo, categoryRepo, stateRepo, trickRepo))
	return h, repo, categoryRepo, stateRepo, trickRepo
}

func doDeleteEquipment(h *EquipmentHandler, id string) *httptest.ResponseRecorder {
	req := httptest.NewRequest("DELETE", "/api/equipments/"+id, nil)
	req = mux.SetURLVars(req, map[string]string{"id": id})
	w := httptest.NewRecorder()
	h.DeleteEquipment(w, req)
	return w
}

func TestDeleteEquipment_Success(t *testing.T) {
	h, repo, _, _, _ := newEquipmentHandlerForDeleteTest()

	w := doDeleteEquipment(h, "1")

	if w.Code != 200 {
		t.Fatalf("expected status 200, got %d, body: %s", w.Code, w.Body.String())
	}
	if _, ok := repo.items[1]; ok {
		t.Fatalf("expected equipment to be deleted")
	}
}

func TestDeleteEquipment_NotFound(t *testing.T) {
	h, _, _, _, _ := newEquipmentHandlerForDeleteTest()

	w := doDeleteEquipment(h, "999")

	if w.Code != 404 {
		t.Fatalf("expected status 404, got %d, body: %s", w.Code, w.Body.String())
	}
}

func TestDeleteEquipment_InvalidID(t *testing.T) {
	h, _, _, _, _ := newEquipmentHandlerForDeleteTest()

	w := doDeleteEquipment(h, "abc")

	if w.Code != 400 {
		t.Fatalf("expected status 400, got %d, body: %s", w.Code, w.Body.String())
	}
}

func TestDeleteEquipment_InUseByCategory(t *testing.T) {
	h, repo, categoryRepo, _, _ := newEquipmentHandlerForDeleteTest()
	categoryRepo.items[1] = &trick.EquipmentCategory{ID: 1, EquipmentID: 1, Name: "2個"}

	w := doDeleteEquipment(h, "1")

	if w.Code != 409 {
		t.Fatalf("expected status 409, got %d, body: %s", w.Code, w.Body.String())
	}
	if _, ok := repo.items[1]; !ok {
		t.Fatalf("expected equipment not to be deleted")
	}
}

func TestDeleteEquipment_InUseByState(t *testing.T) {
	h, _, _, stateRepo, _ := newEquipmentHandlerForDeleteTest()
	stateRepo.items[1] = &trick.State{ID: 1, EquipmentID: 1, Name: "待機"}

	w := doDeleteEquipment(h, "1")

	if w.Code != 409 {
		t.Fatalf("expected status 409, got %d, body: %s", w.Code, w.Body.String())
	}
}

func TestDeleteEquipment_InUseByTrick(t *testing.T) {
	h, _, _, _, trickRepo := newEquipmentHandlerForDeleteTest()
	trickRepo.items[1] = &trick.Trick{ID: 1, EquipmentID: 1, CategoryID: 1, Name: "技", StartStateID: 1, EndStateID: 1}

	w := doDeleteEquipment(h, "1")

	if w.Code != 409 {
		t.Fatalf("expected status 409, got %d, body: %s", w.Code, w.Body.String())
	}
}

func TestDeleteEquipment_ReferencedOnlyByOtherEquipment(t *testing.T) {
	h, _, categoryRepo, stateRepo, trickRepo := newEquipmentHandlerForDeleteTest()
	categoryRepo.items[1] = &trick.EquipmentCategory{ID: 1, EquipmentID: 2, Name: "3個"}
	stateRepo.items[1] = &trick.State{ID: 1, EquipmentID: 2, Name: "待機"}
	trickRepo.items[1] = &trick.Trick{ID: 1, EquipmentID: 2, CategoryID: 1, Name: "技", StartStateID: 1, EndStateID: 1}

	w := doDeleteEquipment(h, "1")

	if w.Code != 200 {
		t.Fatalf("expected status 200, got %d, body: %s", w.Code, w.Body.String())
	}
}

func TestDeleteEquipment_DBError(t *testing.T) {
	h, repo, _, _, trickRepo := newEquipmentHandlerForDeleteTest()
	trickRepo.countErr = errors.New("db connection refused")

	w := doDeleteEquipment(h, "1")

	if w.Code != 500 {
		t.Fatalf("expected status 500, got %d, body: %s", w.Code, w.Body.String())
	}
	if bytes.Contains(w.Body.Bytes(), []byte("db connection refused")) {
		t.Fatalf("expected driver error not to be exposed, body: %s", w.Body.String())
	}
	if _, ok := repo.items[1]; !ok {
		t.Fatalf("expected equipment not to be deleted")
	}
}
