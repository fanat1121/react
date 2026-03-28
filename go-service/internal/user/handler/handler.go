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
// POST /api/users/register
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

// GetUsers ユーザー取得
// GET /api/users              - 全ユーザー取得
// GET /api/users?user_code=1  - user_code指定取得
func (h *Handler) GetUsers(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()

	// user_code指定
	if userCodeStr := query.Get("user_code"); userCodeStr != "" {
		userCode, err := strconv.Atoi(userCodeStr)
		if err != nil {
			response.BadRequest(w, "Invalid user_code")
			return
		}

		foundUser, err := h.queryService.GetUserByUserCode(userCode)
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

// SearchUsers ユーザー検索（機密情報を含む）
// POST /api/users/search
func (h *Handler) SearchUsers(w http.ResponseWriter, r *http.Request) {
	var req user.SearchUserRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request body")
		return
	}

	// メールアドレスで検索
	if req.Email != "" {
		foundUser, err := h.queryService.GetUserByEmail(req.Email)
		if err != nil {
			response.NotFound(w, "User not found")
			return
		}
		response.Success(w, foundUser)
		return
	}

	// ログインIDで検索
	if req.UserLoginID != "" {
		foundUser, err := h.queryService.GetUserByLoginID(req.UserLoginID)
		if err != nil {
			response.NotFound(w, "User not found")
			return
		}
		response.Success(w, foundUser)
		return
	}

	response.BadRequest(w, "Search criteria required (email or user_login_id)")
}

// Login ログイン認証
// POST /api/users/login
func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	var req user.LoginRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request body")
		return
	}

	loggedInUser, err := h.commandService.LoginUser(&req)
	if err != nil {
		response.Unauthorized(w, "Invalid credentials")
		return
	}

	response.Success(w, loggedInUser)
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
	// 登録
	router.HandleFunc("/api/users/register", h.CreateUser).Methods("POST")

	// ログイン
	router.HandleFunc("/api/users/login", h.Login).Methods("POST")
	
	// 取得（クエリパラメータで条件指定）
	router.HandleFunc("/api/users", h.GetUsers).Methods("GET")
	
	// 検索（機密情報）
	router.HandleFunc("/api/users/search", h.SearchUsers).Methods("POST")
	
	// 削除
	router.HandleFunc("/api/users/{id}", h.DeleteUser).Methods("DELETE")
}
