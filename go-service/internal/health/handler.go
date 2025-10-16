package health

import (
	"go-service/pkg/response"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

// Handler ヘルスチェックハンドラー
type Handler struct{}

// NewHandler ヘルスチェックハンドラーを作成
func NewHandler() *Handler {
	return &Handler{}
}

// Response ヘルスチェックレスポンス
type Response struct {
	Status  string    `json:"status"`
	Service string    `json:"service"`
	Time    time.Time `json:"time"`
}

// Check ヘルスチェック
// GET /api/health
func (h *Handler) Check(w http.ResponseWriter, r *http.Request) {
	response.Success(w, Response{
		Status:  "healthy",
		Service: "go-service",
		Time:    time.Now(),
	})
}

// RegisterRoutes ルートを登録
func (h *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/api/health", h.Check).Methods("GET")
}
