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

// EquipmentHandler 道具マスタハンドラー
type EquipmentHandler struct {
	service *service.EquipmentService
}

// NewEquipmentHandler ハンドラーを作成
func NewEquipmentHandler(service *service.EquipmentService) *EquipmentHandler {
	return &EquipmentHandler{service: service}
}

// CreateEquipment 道具登録
// POST /api/equipments
func (h *EquipmentHandler) CreateEquipment(w http.ResponseWriter, r *http.Request) {
	var req trick.CreateEquipmentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request body")
		return
	}

	created, err := h.service.CreateEquipment(&req)
	if err != nil {
		if err.Error() == "equipment name already exists" {
			response.Conflict(w, err.Error())
			return
		}
		response.BadRequest(w, err.Error())
		return
	}

	response.Created(w, created)
}

// GetEquipments 道具一覧取得
// GET /api/equipments
func (h *EquipmentHandler) GetEquipments(w http.ResponseWriter, r *http.Request) {
	equipments, err := h.service.GetAllEquipments()
	if err != nil {
		response.InternalServerError(w, "Failed to get equipments")
		return
	}
	response.Success(w, equipments)
}

// GetEquipmentByID 道具単体取得
// GET /api/equipments/{id}
func (h *EquipmentHandler) GetEquipmentByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		response.BadRequest(w, "Invalid equipment ID")
		return
	}

	e, err := h.service.GetEquipmentByID(id)
	if err != nil {
		response.NotFound(w, "Equipment not found")
		return
	}
	response.Success(w, e)
}

// DeleteEquipment 道具削除（論理削除）
// DELETE /api/equipments/{id}
func (h *EquipmentHandler) DeleteEquipment(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		response.BadRequest(w, "Invalid equipment ID")
		return
	}

	if err := h.service.DeleteEquipment(id); err != nil {
		response.NotFound(w, err.Error())
		return
	}
	response.Success(w, map[string]string{"message": "Equipment deleted successfully"})
}

// RegisterRoutes ルートを登録
func (h *EquipmentHandler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/api/equipments", h.CreateEquipment).Methods("POST")
	router.HandleFunc("/api/equipments", h.GetEquipments).Methods("GET")
	router.HandleFunc("/api/equipments/{id}", h.GetEquipmentByID).Methods("GET")
	router.HandleFunc("/api/equipments/{id}", h.DeleteEquipment).Methods("DELETE")
}
