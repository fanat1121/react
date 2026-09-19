package main

import (
	"go-service/internal/health"
	"go-service/internal/trick"
	trickHandler "go-service/internal/trick/handler"
	trickService "go-service/internal/trick/service"
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
	sqlDB, err := database.NewConnectionFromEnv()
	if err != nil {
		log.Fatalf("❌ Database connection failed: %v", err)
	}
	db := database.NewDB(sqlDB)
	defer sqlDB.Close()

	// ルーター設定
	router := mux.NewRouter()

	// 各ドメインの初期化とルート登録
	setupUserDomain(router, db)
	setupTrickDomain(router, db)
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
	log.Println("  POST   /api/users/register                - ユーザー登録")
	log.Println("  GET    /api/users                         - 全ユーザー取得")
	log.Println("  GET    /api/users?user_code=1             - ユーザー取得（user_code指定）")
	log.Println("  POST   /api/users/search                  - ユーザー検索（メール・ログインID）")
	log.Println("  DELETE /api/users/{id}                    - ユーザー削除（論理削除）")

	if err := http.ListenAndServe(":"+port, corsHandler); err != nil {
		log.Fatal(err)
	}
}

// setupUserDomain ユーザードメインのセットアップ
func setupUserDomain(router *mux.Router, db *database.DB) {
	repo := user.NewMySQLRepository(db)

	// 更新系と取得系のサービスを分離
	commandService := service.NewCommandService(repo)
	queryService := service.NewQueryService(repo)
	
	userHandler := handler.NewHandler(commandService, queryService)
	userHandler.RegisterRoutes(router)
}

// setupTrickDomain 技マスタドメインのセットアップ
func setupTrickDomain(router *mux.Router, db *database.DB) {
	equipmentRepo := trick.NewMySQLEquipmentRepository(db)
	categoryRepo := trick.NewMySQLEquipmentCategoryRepository(db)
	stateRepo := trick.NewMySQLStateRepository(db)
	trickRepo := trick.NewMySQLTrickRepository(db)

	equipmentHandler := trickHandler.NewEquipmentHandler(trickService.NewEquipmentService(equipmentRepo))
	categoryHandler := trickHandler.NewCategoryHandler(trickService.NewCategoryService(categoryRepo))
	stateHandler := trickHandler.NewStateHandler(trickService.NewStateService(stateRepo))
	trickDomainHandler := trickHandler.NewTrickHandler(trickService.NewTrickService(equipmentRepo, categoryRepo, stateRepo, trickRepo))

	equipmentHandler.RegisterRoutes(router)
	categoryHandler.RegisterRoutes(router)
	stateHandler.RegisterRoutes(router)
	trickDomainHandler.RegisterRoutes(router)
}

// setupHealthDomain ヘルスチェックドメインのセットアップ
func setupHealthDomain(router *mux.Router) {
	handler := health.NewHandler()
	handler.RegisterRoutes(router)
}
