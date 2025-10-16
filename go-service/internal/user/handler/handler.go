package handler

import (
	"encoding/json"
	"go-service/internal/user"
	"go-service/internal/user/service"
	"go-service/pkg/response"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

// Handler ユーザーハンドラー
type Handler struct {
	commandService *service.CommandService
	queryService   *service.QueryService
}

// NewHandler ユーザーハンドラーを作成
func NewHandler(commandService *service.CommandService, queryService *service.QueryService) *Handler {
	return &Handler{
		commandService: commandService,
		queryService:   queryService,
	}
}

// CreateUser ユーザー登録
// POST /api/users
func (h *Handler) CreateUser(w http.ResponseWriter, r *http.Request) {
	var req user.CreateUserRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request body")
		return
	}

	createdUser, err := h.commandService.CreateUser(&req)
	if err != nil {
		if err.Error() == "email already exists" || err.Error() == "user_login_id already exists" {
			response.Conflict(w, err.Error())
			return
		}
		response.BadRequest(w, err.Error())
		return
	}

	response.Created(w, createdUser)
}

// GetUsers ユーザー検索（複数条件対応）
// GET /api/users                       - 全ユーザー取得
// GET /api/users?id=123                - ID指定
// GET /api/users?email=xxx             - メールアドレス指定
// GET /api/users?user_login_id=xxx     - ログインID指定
func (h *Handler) GetUsers(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()

	// ID指定
	if idStr := query.Get("id"); idStr != "" {
		id, err := strconv.Atoi(idStr)
		if err != nil {
			response.BadRequest(w, "Invalid user ID")
			return
		}

		foundUser, err := h.queryService.GetUserByID(id)
		if err != nil {
			response.NotFound(w, "User not found")
			return
		}

		response.Success(w, foundUser)
		return
	}

	// メールアドレス指定
	if email := query.Get("email"); email != "" {
		foundUser, err := h.queryService.GetUserByEmail(email)
		if err != nil {
			response.NotFound(w, "User not found")
			return
		}

		response.Success(w, foundUser)
		return
	}

	// ログインID指定
	if loginID := query.Get("user_login_id"); loginID != "" {
		foundUser, err := h.queryService.GetUserByLoginID(loginID)
		if err != nil {
			response.NotFound(w, "User not found")
			return
		}

		response.Success(w, foundUser)
		return
	}

	// パラメータなし = 全ユーザー取得
	users, err := h.queryService.GetAllUsers()
	if err != nil {
		response.InternalServerError(w, "Failed to get users")
		return
	}

	response.Success(w, users)
}

// DeleteUser ユーザー削除（論理削除）
// DELETE /api/users/{id}
func (h *Handler) DeleteUser(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]

	id, err := strconv.Atoi(idStr)
	if err != nil {
		response.BadRequest(w, "Invalid user ID")
		return
	}

	if err := h.commandService.DeleteUser(id); err != nil {
		response.NotFound(w, err.Error())
		return
	}

	response.Success(w, map[string]string{"message": "User deleted successfully"})
}

// RegisterRoutes ルートを登録
func (h *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/api/users", h.CreateUser).Methods("POST")
	router.HandleFunc("/api/users", h.GetUsers).Methods("GET")
	router.HandleFunc("/api/users/{id}", h.DeleteUser).Methods("DELETE")
}
