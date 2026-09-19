// go-service/internal/trick/handler/trick_handler_test.go
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

type stubTrickRepository struct {
	items  map[int]*trick.Trick
	nextID int
}

func newStubTrickRepository() *stubTrickRepository {
	return &stubTrickRepository{items: make(map[int]*trick.Trick), nextID: 1}
}

func (s *stubTrickRepository) Create(t *trick.Trick) error {
	for _, existing := range s.items {
		if existing.EquipmentID == t.EquipmentID && existing.Name == t.Name {
			return errors.New("trick name already exists")
		}
	}
	t.ID = s.nextID
	s.items[t.ID] = t
	s.nextID++
	return nil
}

func (s *stubTrickRepository) GetByID(id int) (*trick.Trick, error) {
	t, ok := s.items[id]
	if !ok {
		return nil, errors.New("trick not found")
	}
	return t, nil
}

func (s *stubTrickRepository) GetAll() ([]*trick.Trick, error) {
	result := make([]*trick.Trick, 0)
	for _, t := range s.items {
		result = append(result, t)
	}
	return result, nil
}

func (s *stubTrickRepository) Delete(id int) error {
	if _, ok := s.items[id]; !ok {
		return errors.New("trick not found")
	}
	delete(s.items, id)
	return nil
}

// テスト用にequipment_id=1, category_id=1（equipment_id=1所属）,
// state id=1,2（equipment_id=1所属）を事前登録した状態を組み立てるヘルパー
func newTrickHandlerForTest() (*TrickHandler, *stubTrickRepository) {
	equipmentRepo := newStubEquipmentRepository()
	equipmentRepo.items[1] = &trick.Equipment{ID: 1, Name: "ディアボロ"}
	equipmentRepo.nextID = 2
	equipmentRepo.items[2] = &trick.Equipment{ID: 2, Name: "シガーボックス"}
	equipmentRepo.nextID = 3

	categoryRepo := newStubCategoryRepository()
	categoryRepo.items[1] = &trick.EquipmentCategory{ID: 1, EquipmentID: 1, Name: "2個"}
	categoryRepo.nextID = 2

	stateRepo := newStubStateRepository()
	stateRepo.items[1] = &trick.State{ID: 1, EquipmentID: 1, Name: "待機"}
	stateRepo.items[2] = &trick.State{ID: 2, EquipmentID: 1, Name: "カスケード中"}
	stateRepo.nextID = 3
	stateRepo.items[3] = &trick.State{ID: 3, EquipmentID: 2, Name: "別道具の状態"}
	stateRepo.nextID = 4

	trickRepo := newStubTrickRepository()

	svc := service.NewTrickService(equipmentRepo, categoryRepo, stateRepo, trickRepo)
	return NewTrickHandler(svc), trickRepo
}

func TestCreateTrick_Success(t *testing.T) {
	h, _ := newTrickHandlerForTest()

	body, _ := json.Marshal(map[string]interface{}{
		"equipment_id":   1,
		"category_id":    1,
		"name":           "カスケード",
		"start_state_id": 1,
		"end_state_id":   2,
	})
	req := httptest.NewRequest("POST", "/api/tricks", bytes.NewReader(body))
	w := httptest.NewRecorder()

	h.CreateTrick(w, req)

	if w.Code != 201 {
		t.Fatalf("expected status 201, got %d, body: %s", w.Code, w.Body.String())
	}
}

func TestCreateTrick_StateBelongsToDifferentEquipment(t *testing.T) {
	h, _ := newTrickHandlerForTest()

	// equipment_id=1で登録するが、end_state_idに別道具(equipment_id=2)の
	// 実在するstate_id=3を指定し、所有者不一致の分岐を検証する
	body, _ := json.Marshal(map[string]interface{}{
		"equipment_id":   1,
		"category_id":    1,
		"name":           "不正な技",
		"start_state_id": 1,
		"end_state_id":   3,
	})
	req := httptest.NewRequest("POST", "/api/tricks", bytes.NewReader(body))
	w := httptest.NewRecorder()

	h.CreateTrick(w, req)

	if w.Code != 400 {
		t.Fatalf("expected status 400, got %d, body: %s", w.Code, w.Body.String())
	}
}

func TestCreateTrick_DuplicateName(t *testing.T) {
	h, trickRepo := newTrickHandlerForTest()
	trickRepo.items[1] = &trick.Trick{ID: 1, EquipmentID: 1, CategoryID: 1, Name: "カスケード", StartStateID: 1, EndStateID: 2}
	trickRepo.nextID = 2

	body, _ := json.Marshal(map[string]interface{}{
		"equipment_id":   1,
		"category_id":    1,
		"name":           "カスケード",
		"start_state_id": 1,
		"end_state_id":   2,
	})
	req := httptest.NewRequest("POST", "/api/tricks", bytes.NewReader(body))
	w := httptest.NewRecorder()

	h.CreateTrick(w, req)

	if w.Code != 409 {
		t.Fatalf("expected status 409, got %d, body: %s", w.Code, w.Body.String())
	}
}

func TestGetTrickByID_NotFound(t *testing.T) {
	h, _ := newTrickHandlerForTest()

	req := httptest.NewRequest("GET", "/api/tricks/999", nil)
	req = mux.SetURLVars(req, map[string]string{"id": "999"})
	w := httptest.NewRecorder()

	h.GetTrickByID(w, req)

	if w.Code != 404 {
		t.Fatalf("expected status 404, got %d, body: %s", w.Code, w.Body.String())
	}
}
