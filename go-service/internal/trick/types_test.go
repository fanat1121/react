package trick

import (
	"encoding/json"
	"testing"
	"time"
)

func TestEquipmentToResponse_ExcludesIsInvalid(t *testing.T) {
	e := &Equipment{ID: 1, Name: "ディアボロ", IsInvalid: true, CreatedAt: time.Now(), UpdatedAt: time.Now()}
	body, err := json.Marshal(e.ToResponse())
	if err != nil {
		t.Fatalf("marshal failed: %v", err)
	}
	var m map[string]interface{}
	if err := json.Unmarshal(body, &m); err != nil {
		t.Fatalf("unmarshal failed: %v", err)
	}
	if _, exists := m["is_invalid"]; exists {
		t.Errorf("expected is_invalid to be excluded from response, got: %s", body)
	}
	if m["name"] != "ディアボロ" {
		t.Errorf("expected name to be ディアボロ, got: %v", m["name"])
	}
}

func TestTrickToResponse_ExcludesIsInvalid(t *testing.T) {
	desc := "解説"
	video := "https://example.com/v.mp4"
	tr := &Trick{
		ID: 1, EquipmentID: 1, CategoryID: 1, Name: "カスケード",
		Description: &desc, StartStateID: 1, EndStateID: 2,
		VideoURL: &video, EstimatedDurationSeconds: 30, IsInvalid: true,
		CreatedAt: time.Now(), UpdatedAt: time.Now(),
	}
	body, err := json.Marshal(tr.ToResponse())
	if err != nil {
		t.Fatalf("marshal failed: %v", err)
	}
	var m map[string]interface{}
	if err := json.Unmarshal(body, &m); err != nil {
		t.Fatalf("unmarshal failed: %v", err)
	}
	if _, exists := m["is_invalid"]; exists {
		t.Errorf("expected is_invalid to be excluded from response, got: %s", body)
	}
	if m["estimated_duration_seconds"].(float64) != 30 {
		t.Errorf("expected estimated_duration_seconds to be 30, got: %v", m["estimated_duration_seconds"])
	}
}
