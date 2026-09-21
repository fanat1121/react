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
	categoryRepo.items[2] = &trick.EquipmentCategory{ID: 2, EquipmentID: 2, Name: "3個"}
	categoryRepo.nextID = 3

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

// テスト用に検索対象となる技を複数登録するヘルパー
// trick1: equipment_id=1, category_id=1, start=1(待機), end=2(カスケード中)
// trick2: equipment_id=1, category_id=1, start=2(カスケード中), end=1(待機)
// trick3: equipment_id=2, category_id=2, start=3, end=3
func seedTricksForSearch(trickRepo *stubTrickRepository) {
	trickRepo.items[1] = &trick.Trick{ID: 1, EquipmentID: 1, CategoryID: 1, Name: "Cascade", StartStateID: 1, EndStateID: 2}
	trickRepo.items[2] = &trick.Trick{ID: 2, EquipmentID: 1, CategoryID: 1, Name: "Reverse Cascade", StartStateID: 2, EndStateID: 1}
	trickRepo.items[3] = &trick.Trick{ID: 3, EquipmentID: 2, CategoryID: 2, Name: "Box Catch", StartStateID: 3, EndStateID: 3}
	trickRepo.nextID = 4
}

type trickListBody struct {
	Success bool                         `json:"success"`
	Data    []*trick.TrickDetailResponse `json:"data"`
}

func decodeTrickList(t *testing.T, w *httptest.ResponseRecorder) []*trick.TrickDetailResponse {
	t.Helper()
	var body trickListBody
	if err := json.NewDecoder(w.Body).Decode(&body); err != nil {
		t.Fatalf("failed to decode response body: %v, body: %s", err, w.Body.String())
	}
	return body.Data
}

func TestGetTricks_FilterByNamePartialCaseInsensitive(t *testing.T) {
	h, trickRepo := newTrickHandlerForTest()
	seedTricksForSearch(trickRepo)

	req := httptest.NewRequest("GET", "/api/tricks?name=cascade", nil)
	w := httptest.NewRecorder()

	h.GetTricks(w, req)

	if w.Code != 200 {
		t.Fatalf("expected status 200, got %d, body: %s", w.Code, w.Body.String())
	}
	tricks := decodeTrickList(t, w)
	if len(tricks) != 2 {
		t.Fatalf("expected 2 tricks, got %d, body: %s", len(tricks), w.Body.String())
	}
}

func TestGetTricks_FilterByCategoryID(t *testing.T) {
	h, trickRepo := newTrickHandlerForTest()
	seedTricksForSearch(trickRepo)

	req := httptest.NewRequest("GET", "/api/tricks?category_id=2", nil)
	w := httptest.NewRecorder()

	h.GetTricks(w, req)

	if w.Code != 200 {
		t.Fatalf("expected status 200, got %d, body: %s", w.Code, w.Body.String())
	}
	tricks := decodeTrickList(t, w)
	if len(tricks) != 1 {
		t.Fatalf("expected 1 trick, got %d, body: %s", len(tricks), w.Body.String())
	}
	if tricks[0].ID != 3 {
		t.Fatalf("expected trick id 3, got %d", tricks[0].ID)
	}
}

func TestGetTricks_FilterByStateIDMatchesStartAndEnd(t *testing.T) {
	h, trickRepo := newTrickHandlerForTest()
	seedTricksForSearch(trickRepo)

	req := httptest.NewRequest("GET", "/api/tricks?state_id=1", nil)
	w := httptest.NewRecorder()

	h.GetTricks(w, req)

	if w.Code != 200 {
		t.Fatalf("expected status 200, got %d, body: %s", w.Code, w.Body.String())
	}
	tricks := decodeTrickList(t, w)
	if len(tricks) != 2 {
		t.Fatalf("expected 2 tricks, got %d, body: %s", len(tricks), w.Body.String())
	}
	foundStart, foundEnd := false, false
	for _, tr := range tricks {
		if tr.StartStateID == 1 {
			foundStart = true
		}
		if tr.EndStateID == 1 {
			foundEnd = true
		}
	}
	if !foundStart || !foundEnd {
		t.Fatalf("expected a trick matching as start_state and one matching as end_state, got: %s", w.Body.String())
	}
}

func TestGetTricks_CombinedFilters(t *testing.T) {
	h, trickRepo := newTrickHandlerForTest()
	seedTricksForSearch(trickRepo)

	req := httptest.NewRequest("GET", "/api/tricks?category_id=1&name=reverse", nil)
	w := httptest.NewRecorder()

	h.GetTricks(w, req)

	if w.Code != 200 {
		t.Fatalf("expected status 200, got %d, body: %s", w.Code, w.Body.String())
	}
	tricks := decodeTrickList(t, w)
	if len(tricks) != 1 {
		t.Fatalf("expected 1 trick, got %d, body: %s", len(tricks), w.Body.String())
	}
	if tricks[0].ID != 2 {
		t.Fatalf("expected trick id 2, got %d", tricks[0].ID)
	}
}

func TestGetTricks_ResolvesNames(t *testing.T) {
	h, trickRepo := newTrickHandlerForTest()
	seedTricksForSearch(trickRepo)

	req := httptest.NewRequest("GET", "/api/tricks?equipment_id=1", nil)
	w := httptest.NewRecorder()

	h.GetTricks(w, req)

	if w.Code != 200 {
		t.Fatalf("expected status 200, got %d, body: %s", w.Code, w.Body.String())
	}
	tricks := decodeTrickList(t, w)
	var target *trick.TrickDetailResponse
	for _, tr := range tricks {
		if tr.ID == 1 {
			target = tr
		}
	}
	if target == nil {
		t.Fatalf("expected trick id 1 in results, body: %s", w.Body.String())
	}
	if target.EquipmentName != "ディアボロ" {
		t.Fatalf("expected equipment_name ディアボロ, got %s", target.EquipmentName)
	}
	if target.CategoryName != "2個" {
		t.Fatalf("expected category_name 2個, got %s", target.CategoryName)
	}
	if target.StartStateName != "待機" {
		t.Fatalf("expected start_state_name 待機, got %s", target.StartStateName)
	}
	if target.EndStateName != "カスケード中" {
		t.Fatalf("expected end_state_name カスケード中, got %s", target.EndStateName)
	}
}

func TestGetTricks_InvalidCategoryID(t *testing.T) {
	h, _ := newTrickHandlerForTest()

	req := httptest.NewRequest("GET", "/api/tricks?category_id=abc", nil)
	w := httptest.NewRecorder()

	h.GetTricks(w, req)

	if w.Code != 400 {
		t.Fatalf("expected status 400, got %d, body: %s", w.Code, w.Body.String())
	}
}

func TestGetTricks_InvalidStateID(t *testing.T) {
	h, _ := newTrickHandlerForTest()

	req := httptest.NewRequest("GET", "/api/tricks?state_id=abc", nil)
	w := httptest.NewRecorder()

	h.GetTricks(w, req)

	if w.Code != 400 {
		t.Fatalf("expected status 400, got %d, body: %s", w.Code, w.Body.String())
	}
}

func TestGetTrickByID_ReturnsEnrichedDetail(t *testing.T) {
	h, trickRepo := newTrickHandlerForTest()
	seedTricksForSearch(trickRepo)

	req := httptest.NewRequest("GET", "/api/tricks/1", nil)
	req = mux.SetURLVars(req, map[string]string{"id": "1"})
	w := httptest.NewRecorder()

	h.GetTrickByID(w, req)

	if w.Code != 200 {
		t.Fatalf("expected status 200, got %d, body: %s", w.Code, w.Body.String())
	}

	var body struct {
		Success bool                      `json:"success"`
		Data    trick.TrickDetailResponse `json:"data"`
	}
	if err := json.NewDecoder(w.Body).Decode(&body); err != nil {
		t.Fatalf("failed to decode response body: %v, body: %s", err, w.Body.String())
	}
	if body.Data.EquipmentName != "ディアボロ" {
		t.Fatalf("expected equipment_name ディアボロ, got %s", body.Data.EquipmentName)
	}
	if body.Data.CategoryName != "2個" {
		t.Fatalf("expected category_name 2個, got %s", body.Data.CategoryName)
	}
	if body.Data.StartStateName != "待機" {
		t.Fatalf("expected start_state_name 待機, got %s", body.Data.StartStateName)
	}
	if body.Data.EndStateName != "カスケード中" {
		t.Fatalf("expected end_state_name カスケード中, got %s", body.Data.EndStateName)
	}
}
