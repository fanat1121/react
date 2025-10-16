package main

import (
	"go-service/internal/health"
	"go-service/internal/user"
	"go-service/internal/user/handler"
	"go-service/internal/user/service"
	"go-service/pkg/database"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	// データベース接続（環境変数から）
	var db *database.DB
	if os.Getenv("ENV") != "test" {
		sqlDB, err := database.NewConnectionFromEnv()
		if err != nil {
			log.Printf("⚠️  Database connection failed: %v", err)
			log.Println("📝 Using in-memory repository instead")
		} else {
			db = database.NewDB(sqlDB)
			defer sqlDB.Close()
		}
	}

	// ルーター設定
	router := mux.NewRouter()

	// 各ドメインの初期化とルート登録
	setupUserDomain(router, db)
	setupHealthDomain(router)

	// CORS設定
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:3001"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	corsHandler := c.Handler(router)

	// サーバー起動
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Go microservice starting on port %s", port)
	log.Println("📡 Available endpoints:")
	log.Println("  GET    /api/health")
	log.Println("  POST   /api/users                         - ユーザー登録")
	log.Println("  GET    /api/users                         - 全ユーザー取得")
	log.Println("  GET    /api/users?id=123                  - ユーザー取得（ID指定）")
	log.Println("  GET    /api/users?email=xxx               - ユーザー取得（メール指定）")
	log.Println("  GET    /api/users?user_login_id=xxx       - ユーザー取得（ログインID指定）")
	log.Println("  DELETE /api/users/{id}                    - ユーザー削除（論理削除）")

	if err := http.ListenAndServe(":"+port, corsHandler); err != nil {
		log.Fatal(err)
	}
}

// setupUserDomain ユーザードメインのセットアップ
func setupUserDomain(router *mux.Router, db *database.DB) {
	var repo user.Repository
	
	// DB接続がある場合はMySQL、ない場合はインメモリ
	if db != nil {
		repo = user.NewMySQLRepository(db)
		log.Println("✅ Using MySQL repository")
	} else {
		repo = user.NewInMemoryRepository()
		log.Println("✅ Using in-memory repository")
	}
	
	// 更新系と取得系のサービスを分離
	commandService := service.NewCommandService(repo)
	queryService := service.NewQueryService(repo)
	
	userHandler := handler.NewHandler(commandService, queryService)
	userHandler.RegisterRoutes(router)
}

// setupHealthDomain ヘルスチェックドメインのセットアップ
func setupHealthDomain(router *mux.Router) {
	handler := health.NewHandler()
	handler.RegisterRoutes(router)
}
