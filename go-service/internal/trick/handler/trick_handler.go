// go-service/internal/trick/handler/trick_handler.go
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

// TrickHandler 技マスタハンドラー
type TrickHandler struct {
	service *service.TrickService
}

// NewTrickHandler ハンドラーを作成
func NewTrickHandler(service *service.TrickService) *TrickHandler {
	return &TrickHandler{service: service}
}

// CreateTrick 技登録
// POST /api/tricks
func (h *TrickHandler) CreateTrick(w http.ResponseWriter, r *http.Request) {
	var req trick.CreateTrickRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request body")
		return
	}

	created, err := h.service.CreateTrick(&req)
	if err != nil {
		response.BadRequest(w, err.Error())
		return
	}

	response.Created(w, created)
}

// GetTricks 技一覧取得
// GET /api/tricks
func (h *TrickHandler) GetTricks(w http.ResponseWriter, r *http.Request) {
	tricks, err := h.service.GetAllTricks()
	if err != nil {
		response.InternalServerError(w, "Failed to get tricks")
		return
	}
	response.Success(w, tricks)
}

// GetTrickByID 技単体取得
// GET /api/tricks/{id}
func (h *TrickHandler) GetTrickByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		response.BadRequest(w, "Invalid trick ID")
		return
	}

	t, err := h.service.GetTrickByID(id)
	if err != nil {
		response.NotFound(w, "Trick not found")
		return
	}
	response.Success(w, t)
}

// DeleteTrick 技削除（論理削除）
// DELETE /api/tricks/{id}
func (h *TrickHandler) DeleteTrick(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		response.BadRequest(w, "Invalid trick ID")
		return
	}

	if err := h.service.DeleteTrick(id); err != nil {
		response.NotFound(w, err.Error())
		return
	}
	response.Success(w, map[string]string{"message": "Trick deleted successfully"})
}

// RegisterRoutes ルートを登録
func (h *TrickHandler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/api/tricks", h.CreateTrick).Methods("POST")
	router.HandleFunc("/api/tricks", h.GetTricks).Methods("GET")
	router.HandleFunc("/api/tricks/{id}", h.GetTrickByID).Methods("GET")
	router.HandleFunc("/api/tricks/{id}", h.DeleteTrick).Methods("DELETE")
}
