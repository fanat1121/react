// go-service/internal/trick/handler/state_handler.go
package handler

import (
	"encoding/json"
	"go-service/internal/trick"
	"go-service/internal/trick/service"
	"go-service/pkg/response"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

// StateHandler 状態マスタハンドラー
type StateHandler struct {
	service *service.StateService
}

// NewStateHandler ハンドラーを作成
func NewStateHandler(service *service.StateService) *StateHandler {
	return &StateHandler{service: service}
}

// CreateState 状態登録
// POST /api/states
func (h *StateHandler) CreateState(w http.ResponseWriter, r *http.Request) {
	var req trick.CreateStateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request body")
		return
	}

	created, err := h.service.CreateState(&req)
	if err != nil {
		if err.Error() == "state name already exists" {
			response.Conflict(w, err.Error())
			return
		}
		response.BadRequest(w, err.Error())
		return
	}

	response.Created(w, created)
}

// GetStates 状態一覧取得
// GET /api/states
func (h *StateHandler) GetStates(w http.ResponseWriter, r *http.Request) {
	if equipmentIDStr := r.URL.Query().Get("equipment_id"); equipmentIDStr != "" {
		equipmentID, err := strconv.Atoi(equipmentIDStr)
		if err != nil {
			response.BadRequest(w, "Invalid equipment_id")
			return
		}
		states, err := h.service.GetStatesByEquipmentID(equipmentID)
		if err != nil {
			response.InternalServerError(w, "Failed to get states")
			return
		}
		response.Success(w, states)
		return
	}

	states, err := h.service.GetAllStates()
	if err != nil {
		response.InternalServerError(w, "Failed to get states")
		return
	}
	response.Success(w, states)
}

// GetStateByID 状態単体取得
// GET /api/states/{id}
func (h *StateHandler) GetStateByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		response.BadRequest(w, "Invalid state ID")
		return
	}

	s, err := h.service.GetStateByID(id)
	if err != nil {
		response.NotFound(w, "State not found")
		return
	}
	response.Success(w, s)
}

// DeleteState 状態削除（論理削除）
// DELETE /api/states/{id}
func (h *StateHandler) DeleteState(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		response.BadRequest(w, "Invalid state ID")
		return
	}

	if err := h.service.DeleteState(id); err != nil {
		response.NotFound(w, err.Error())
		return
	}
	response.Success(w, map[string]string{"message": "State deleted successfully"})
}

// RegisterRoutes ルートを登録
func (h *StateHandler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/api/states", h.CreateState).Methods("POST")
	router.HandleFunc("/api/states", h.GetStates).Methods("GET")
	router.HandleFunc("/api/states/{id}", h.GetStateByID).Methods("GET")
	router.HandleFunc("/api/states/{id}", h.DeleteState).Methods("DELETE")
}
