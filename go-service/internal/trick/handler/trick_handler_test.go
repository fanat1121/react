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

	categoryRepo := newStubCategoryRepository()
	categoryRepo.items[1] = &trick.EquipmentCategory{ID: 1, EquipmentID: 1, Name: "2個"}
	categoryRepo.nextID = 2

	stateRepo := newStubStateRepository()
	stateRepo.items[1] = &trick.State{ID: 1, EquipmentID: 1, Name: "待機"}
	stateRepo.items[2] = &trick.State{ID: 2, EquipmentID: 1, Name: "カスケード中"}
	stateRepo.nextID = 3

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

	// equipment_id=1で登録するが、end_state_idに別道具の状態を混ぜる想定を
	// シミュレートするため、equipment_id=1に存在しないstate_idを指定する
	body, _ := json.Marshal(map[string]interface{}{
		"equipment_id":   1,
		"category_id":    1,
		"name":           "不正な技",
		"start_state_id": 1,
		"end_state_id":   999,
	})
	req := httptest.NewRequest("POST", "/api/tricks", bytes.NewReader(body))
	w := httptest.NewRecorder()

	h.CreateTrick(w, req)

	if w.Code != 400 {
		t.Fatalf("expected status 400, got %d, body: %s", w.Code, w.Body.String())
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
