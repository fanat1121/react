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

// CategoryHandler 道具カテゴリマスタハンドラー
type CategoryHandler struct {
	service *service.CategoryService
}

// NewCategoryHandler ハンドラーを作成
func NewCategoryHandler(service *service.CategoryService) *CategoryHandler {
	return &CategoryHandler{service: service}
}

// CreateCategory カテゴリ登録
// POST /api/equipment-categories
func (h *CategoryHandler) CreateCategory(w http.ResponseWriter, r *http.Request) {
	var req trick.CreateEquipmentCategoryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request body")
		return
	}

	created, err := h.service.CreateCategory(&req)
	if err != nil {
		if err.Error() == "equipment category name already exists" {
			response.Conflict(w, err.Error())
			return
		}
		response.BadRequest(w, err.Error())
		return
	}

	response.Created(w, created)
}

// GetCategories カテゴリ一覧取得
// GET /api/equipment-categories
func (h *CategoryHandler) GetCategories(w http.ResponseWriter, r *http.Request) {
	if equipmentIDStr := r.URL.Query().Get("equipment_id"); equipmentIDStr != "" {
		equipmentID, err := strconv.Atoi(equipmentIDStr)
		if err != nil {
			response.BadRequest(w, "Invalid equipment_id")
			return
		}
		categories, err := h.service.GetCategoriesByEquipmentID(equipmentID)
		if err != nil {
			response.InternalServerError(w, "Failed to get equipment categories")
			return
		}
		response.Success(w, categories)
		return
	}

	categories, err := h.service.GetAllCategories()
	if err != nil {
		response.InternalServerError(w, "Failed to get equipment categories")
		return
	}
	response.Success(w, categories)
}

// GetCategoryByID カテゴリ単体取得
// GET /api/equipment-categories/{id}
func (h *CategoryHandler) GetCategoryByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		response.BadRequest(w, "Invalid category ID")
		return
	}

	c, err := h.service.GetCategoryByID(id)
	if err != nil {
		response.NotFound(w, "Equipment category not found")
		return
	}
	response.Success(w, c)
}

// DeleteCategory カテゴリ削除（論理削除）
// DELETE /api/equipment-categories/{id}
func (h *CategoryHandler) DeleteCategory(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		response.BadRequest(w, "Invalid category ID")
		return
	}

	if err := h.service.DeleteCategory(id); err != nil {
		response.NotFound(w, err.Error())
		return
	}
	response.Success(w, map[string]string{"message": "Equipment category deleted successfully"})
}

// RegisterRoutes ルートを登録
func (h *CategoryHandler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/api/equipment-categories", h.CreateCategory).Methods("POST")
	router.HandleFunc("/api/equipment-categories", h.GetCategories).Methods("GET")
	router.HandleFunc("/api/equipment-categories/{id}", h.GetCategoryByID).Methods("GET")
	router.HandleFunc("/api/equipment-categories/{id}", h.DeleteCategory).Methods("DELETE")
}
