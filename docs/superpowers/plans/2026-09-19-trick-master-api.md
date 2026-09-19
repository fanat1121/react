# 技マスタ管理API 実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `go-service` に、道具(equipment)・道具カテゴリ(equipment_category)・状態(state)・技(trick)の4マスタに対する登録(Create)・取得(Get/List)・論理削除(Delete)のREST APIを追加する。

**Architecture:** 既存の `internal/user` ドメインと同じDDD構成（`types.go` → `query/`(SQL文字列) → `repository_*.go`(インターフェース+MySQL実装) → `service/`(ビジネスロジック) → `handler/`(HTTPハンドラ+ルーティング)）を1つの新規パッケージ `internal/trick` に4エンティティ分実装する。道具・カテゴリ・状態は独立したCRUDだが、技(Trick)の登録時のみ他3マスタへの参照整合性チェックを行う。

**Tech Stack:** Go 1.21, gorilla/mux, MySQL (`database/sql` + `go-sql-driver/mysql`), 既存の `pkg/response`・`pkg/validator`・`pkg/database` を再利用。

**Spec:** `docs/superpowers/specs/2026-09-19-trick-registration-design.md`（DBスキーマ詳細は `go-service/docs/db/`）

## Global Constraints

- 論理削除は `is_invalid` フラグ方式。物理DELETEは行わない（spec: 論理削除の方針）
- マスタのname列に `UNIQUE` 制約は付けない。重複チェックは「`is_invalid = 0` の行の中で」アプリケーション側（リポジトリのCOUNT問い合わせ）が行う
- 状態(State)は道具(equipment)単位でのみ区切る。カテゴリでは区切らない
- 技同士の連続性は保存しない。`start_state_id` / `end_state_id` の一致から導出する（本plan ではAPIのCRUDのみを実装し、接続関係を返すエンドポイントは対象外）
- 動画アップロード自体（マルチパートファイル受信・ストレージ抽象化の実装）は本planのスコープ外。`video_url` は文字列を受け取って保存するだけの項目として実装する
- 本planはGoバックエンドAPIのみが対象。Next.js側の画面実装は別plan

---

## File Structure

```
go-service/
  docker/mysql/init/02_trick_master.sql          [新規] マイグレーションSQL
  internal/trick/
    types.go                                     [新規] 4エンティティのstruct/Request/Response
    types_test.go                                [新規]
    query/
      equipment_query.go                         [新規]
      category_query.go                          [新規]
      state_query.go                             [新規]
      trick_query.go                             [新規]
    repository_equipment.go                      [新規] interface + MySQL実装
    repository_category.go                       [新規]
    repository_state.go                          [新規]
    repository_trick.go                          [新規]
    service/
      equipment_service.go                       [新規]
      category_service.go                        [新規]
      state_service.go                           [新規]
      trick_service.go                           [新規]
    handler/
      equipment_handler.go                       [新規] ハンドラ + RegisterRoutes
      equipment_handler_test.go                  [新規]
      category_handler.go                        [新規]
      category_handler_test.go                   [新規]
      state_handler.go                           [新規]
      state_handler_test.go                      [新規]
      trick_handler.go                           [新規]
      trick_handler_test.go                      [新規]
  main.go                                        [変更] setupTrickDomainを追加して呼び出す
  docs/api/README.md                             [変更] エンドポイント一覧に追記
  docs/api/tricks/                               [新規] 各エンドポイントの仕様書
```

---

### Task 1: DBマイグレーション

**Files:**
- Create: `go-service/docker/mysql/init/02_trick_master.sql`

**Interfaces:**
- Produces: `equipment_master`, `equipment_category_master`, `state_master`, `trick_master` の4テーブル（カラム定義は `go-service/docs/db/tricks/*.md` の通り）

- [ ] **Step 1: マイグレーションSQLを書く**

```sql
-- go-service/docker/mysql/init/02_trick_master.sql
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE equipment_master (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    is_invalid TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_is_invalid (is_invalid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE equipment_category_master (
    id INT AUTO_INCREMENT PRIMARY KEY,
    equipment_id INT NOT NULL,
    name VARCHAR(64) NOT NULL,
    is_invalid TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_equipment_id (equipment_id),
    INDEX idx_is_invalid (is_invalid),
    FOREIGN KEY (equipment_id) REFERENCES equipment_master(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE state_master (
    id INT AUTO_INCREMENT PRIMARY KEY,
    equipment_id INT NOT NULL,
    name VARCHAR(64) NOT NULL,
    description TEXT NULL,
    is_invalid TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_equipment_id (equipment_id),
    INDEX idx_is_invalid (is_invalid),
    FOREIGN KEY (equipment_id) REFERENCES equipment_master(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE trick_master (
    id INT AUTO_INCREMENT PRIMARY KEY,
    equipment_id INT NOT NULL,
    category_id INT NOT NULL,
    name VARCHAR(128) NOT NULL,
    description TEXT NULL,
    start_state_id INT NOT NULL,
    end_state_id INT NOT NULL,
    video_url VARCHAR(512) NULL,
    estimated_duration_seconds INT NOT NULL DEFAULT 0,
    is_invalid TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_equipment_id (equipment_id),
    INDEX idx_category_id (category_id),
    INDEX idx_start_state_id (start_state_id),
    INDEX idx_end_state_id (end_state_id),
    INDEX idx_is_invalid (is_invalid),
    FOREIGN KEY (equipment_id) REFERENCES equipment_master(id),
    FOREIGN KEY (category_id) REFERENCES equipment_category_master(id),
    FOREIGN KEY (start_state_id) REFERENCES state_master(id),
    FOREIGN KEY (end_state_id) REFERENCES state_master(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

- [ ] **Step 2: 既に起動中のdevコンテナのDBへ手動適用して確認する**

`docker-entrypoint-initdb.d` はボリューム初回作成時にしか実行されないため、既存の開発用DBには手動適用が必要。

Run:
```bash
docker exec -i devcontainer_mysql mysql -uroot -p"$MYSQL_ROOT_PASSWORD" go_service < go-service/docker/mysql/init/02_trick_master.sql
docker exec devcontainer_mysql mysql -uroot -p"$MYSQL_ROOT_PASSWORD" go_service -e "SHOW TABLES LIKE '%master';"
```

Expected: `equipment_master`, `equipment_category_master`, `state_master`, `trick_master`, `user_master` が全て表示される。

- [ ] **Step 3: コミット**

```bash
git add go-service/docker/mysql/init/02_trick_master.sql
git commit -m "feat(db): 技マスタ関連4テーブルのマイグレーションを追加"
```

---

### Task 2: 型定義（types.go）

**Files:**
- Create: `go-service/internal/trick/types.go`
- Test: `go-service/internal/trick/types_test.go`

**Interfaces:**
- Produces: `Equipment`, `EquipmentCategory`, `State`, `Trick` 構造体。`CreateEquipmentRequest`, `CreateEquipmentCategoryRequest`, `CreateStateRequest`, `CreateTrickRequest`。`EquipmentResponse`, `EquipmentCategoryResponse`, `StateResponse`, `TrickResponse`。各エンティティの `ToResponse() *XxxResponse` メソッド

- [ ] **Step 1: 失敗するテストを書く**

```go
// go-service/internal/trick/types_test.go
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
```

- [ ] **Step 2: テストが失敗することを確認する**

Run: `docker run --rm -v $(pwd)/go-service:/app -w /app golang:1.21-alpine go test ./internal/trick/...`
Expected: FAIL（`package trick` に `Equipment` 等が存在しないためコンパイルエラー）

- [ ] **Step 3: 最小実装を書く**

```go
// go-service/internal/trick/types.go
package trick

import "time"

// Equipment 道具エンティティ
type Equipment struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	IsInvalid bool      `json:"-"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// CreateEquipmentRequest 道具登録リクエスト
type CreateEquipmentRequest struct {
	Name string `json:"name" validate:"required,min=1,max=64"`
}

// EquipmentResponse 道具レスポンス
type EquipmentResponse struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// ToResponse EquipmentをEquipmentResponseに変換
func (e *Equipment) ToResponse() *EquipmentResponse {
	return &EquipmentResponse{ID: e.ID, Name: e.Name, CreatedAt: e.CreatedAt, UpdatedAt: e.UpdatedAt}
}

// EquipmentCategory 道具カテゴリエンティティ
type EquipmentCategory struct {
	ID          int       `json:"id"`
	EquipmentID int       `json:"equipment_id"`
	Name        string    `json:"name"`
	IsInvalid   bool      `json:"-"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// CreateEquipmentCategoryRequest 道具カテゴリ登録リクエスト
type CreateEquipmentCategoryRequest struct {
	EquipmentID int    `json:"equipment_id" validate:"required"`
	Name        string `json:"name" validate:"required,min=1,max=64"`
}

// EquipmentCategoryResponse 道具カテゴリレスポンス
type EquipmentCategoryResponse struct {
	ID          int       `json:"id"`
	EquipmentID int       `json:"equipment_id"`
	Name        string    `json:"name"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// ToResponse EquipmentCategoryをEquipmentCategoryResponseに変換
func (c *EquipmentCategory) ToResponse() *EquipmentCategoryResponse {
	return &EquipmentCategoryResponse{ID: c.ID, EquipmentID: c.EquipmentID, Name: c.Name, CreatedAt: c.CreatedAt, UpdatedAt: c.UpdatedAt}
}

// State 状態エンティティ（道具単位で一本化。カテゴリでは区切らない）
type State struct {
	ID          int       `json:"id"`
	EquipmentID int       `json:"equipment_id"`
	Name        string    `json:"name"`
	Description *string   `json:"description,omitempty"`
	IsInvalid   bool      `json:"-"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// CreateStateRequest 状態登録リクエスト
type CreateStateRequest struct {
	EquipmentID int    `json:"equipment_id" validate:"required"`
	Name        string `json:"name" validate:"required,min=1,max=64"`
	Description string `json:"description,omitempty"`
}

// StateResponse 状態レスポンス
type StateResponse struct {
	ID          int       `json:"id"`
	EquipmentID int       `json:"equipment_id"`
	Name        string    `json:"name"`
	Description *string   `json:"description,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// ToResponse StateをStateResponseに変換
func (s *State) ToResponse() *StateResponse {
	return &StateResponse{ID: s.ID, EquipmentID: s.EquipmentID, Name: s.Name, Description: s.Description, CreatedAt: s.CreatedAt, UpdatedAt: s.UpdatedAt}
}

// Trick 技エンティティ
type Trick struct {
	ID                       int       `json:"id"`
	EquipmentID              int       `json:"equipment_id"`
	CategoryID               int       `json:"category_id"`
	Name                     string    `json:"name"`
	Description              *string   `json:"description,omitempty"`
	StartStateID             int       `json:"start_state_id"`
	EndStateID               int       `json:"end_state_id"`
	VideoURL                 *string   `json:"video_url,omitempty"`
	EstimatedDurationSeconds int       `json:"estimated_duration_seconds"`
	IsInvalid                bool      `json:"-"`
	CreatedAt                time.Time `json:"created_at"`
	UpdatedAt                time.Time `json:"updated_at"`
}

// CreateTrickRequest 技登録リクエスト
type CreateTrickRequest struct {
	EquipmentID              int    `json:"equipment_id" validate:"required"`
	CategoryID               int    `json:"category_id" validate:"required"`
	Name                     string `json:"name" validate:"required,min=1,max=128"`
	Description              string `json:"description,omitempty"`
	StartStateID             int    `json:"start_state_id" validate:"required"`
	EndStateID               int    `json:"end_state_id" validate:"required"`
	VideoURL                 string `json:"video_url,omitempty"`
	EstimatedDurationSeconds int    `json:"estimated_duration_seconds" validate:"gte=0"`
}

// TrickResponse 技レスポンス
type TrickResponse struct {
	ID                       int       `json:"id"`
	EquipmentID              int       `json:"equipment_id"`
	CategoryID               int       `json:"category_id"`
	Name                     string    `json:"name"`
	Description              *string   `json:"description,omitempty"`
	StartStateID             int       `json:"start_state_id"`
	EndStateID               int       `json:"end_state_id"`
	VideoURL                 *string   `json:"video_url,omitempty"`
	EstimatedDurationSeconds int       `json:"estimated_duration_seconds"`
	CreatedAt                time.Time `json:"created_at"`
	UpdatedAt                time.Time `json:"updated_at"`
}

// ToResponse TrickをTrickResponseに変換
func (t *Trick) ToResponse() *TrickResponse {
	return &TrickResponse{
		ID:                       t.ID,
		EquipmentID:              t.EquipmentID,
		CategoryID:               t.CategoryID,
		Name:                     t.Name,
		Description:              t.Description,
		StartStateID:             t.StartStateID,
		EndStateID:               t.EndStateID,
		VideoURL:                 t.VideoURL,
		EstimatedDurationSeconds: t.EstimatedDurationSeconds,
		CreatedAt:                t.CreatedAt,
		UpdatedAt:                t.UpdatedAt,
	}
}
```

- [ ] **Step 4: テストが通ることを確認する**

Run: `docker run --rm -v $(pwd)/go-service:/app -w /app golang:1.21-alpine go test ./internal/trick/...`
Expected: PASS

- [ ] **Step 5: コミット**

```bash
git add go-service/internal/trick/types.go go-service/internal/trick/types_test.go
git commit -m "feat(trick): 技マスタ4エンティティの型定義を追加"
```

---

### Task 3: Equipment（道具マスタ）CRUD

**Files:**
- Create: `go-service/internal/trick/query/equipment_query.go`
- Create: `go-service/internal/trick/repository_equipment.go`
- Create: `go-service/internal/trick/service/equipment_service.go`
- Create: `go-service/internal/trick/handler/equipment_handler.go`
- Test: `go-service/internal/trick/handler/equipment_handler_test.go`

**Interfaces:**
- Consumes: `trick.Equipment`, `trick.CreateEquipmentRequest`, `trick.EquipmentResponse`（Task 2）、`pkg/response`, `pkg/validator`
- Produces: `trick.EquipmentRepository` interface（`Create(e *Equipment) error`, `GetAll() ([]*Equipment, error)`, `GetByID(id int) (*Equipment, error)`, `Delete(id int) error`）。`trick.NewMySQLEquipmentRepository(db *database.DB) EquipmentRepository`。`service.EquipmentService{repo}` と `service.NewEquipmentService(repo)`、メソッド `CreateEquipment`, `GetAllEquipments`, `GetEquipmentByID`, `DeleteEquipment`。`handler.EquipmentHandler` と `RegisterRoutes(router *mux.Router)`。ルート: `POST /api/equipments`, `GET /api/equipments`, `GET /api/equipments/{id}`, `DELETE /api/equipments/{id}`

- [ ] **Step 1: クエリを書く**

```go
// go-service/internal/trick/query/equipment_query.go
package query

// EquipmentQuery 道具マスタ関連のSQL文
type EquipmentQuery struct{}

// NewEquipmentQuery クエリビルダーを作成
func NewEquipmentQuery() *EquipmentQuery {
	return &EquipmentQuery{}
}

// Insert 道具挿入SQL
func (q *EquipmentQuery) Insert() string {
	return `
		INSERT INTO equipment_master (name, is_invalid, created_at, updated_at)
		VALUES (?, 0, ?, ?)
	`
}

// CheckNameExists 名前重複チェックSQL（有効な行のみ）
func (q *EquipmentQuery) CheckNameExists() string {
	return `
		SELECT COUNT(*) FROM equipment_master
		WHERE name = ? AND is_invalid = 0
	`
}

// SelectByID ID検索SQL
func (q *EquipmentQuery) SelectByID() string {
	return `
		SELECT id, name, is_invalid, created_at, updated_at
		FROM equipment_master
		WHERE id = ? AND is_invalid = 0
	`
}

// SelectAll 全件取得SQL
func (q *EquipmentQuery) SelectAll() string {
	return `
		SELECT id, name, is_invalid, created_at, updated_at
		FROM equipment_master
		WHERE is_invalid = 0
		ORDER BY id ASC
	`
}

// SoftDelete 論理削除SQL
func (q *EquipmentQuery) SoftDelete() string {
	return `
		UPDATE equipment_master
		SET is_invalid = 1, updated_at = ?
		WHERE id = ?
	`
}
```

- [ ] **Step 2: リポジトリを書く**

```go
// go-service/internal/trick/repository_equipment.go
package trick

import (
	"database/sql"
	"errors"
	"go-service/internal/trick/query"
	"go-service/pkg/database"
	"time"
)

// EquipmentRepository 道具マスタリポジトリのインターフェース
type EquipmentRepository interface {
	Create(equipment *Equipment) error
	GetByID(id int) (*Equipment, error)
	GetAll() ([]*Equipment, error)
	Delete(id int) error
}

// MySQLEquipmentRepository MySQL実装
type MySQLEquipmentRepository struct {
	db    *database.QueryBuilder
	query *query.EquipmentQuery
}

// NewMySQLEquipmentRepository MySQL接続を使用したリポジトリを作成
func NewMySQLEquipmentRepository(db *database.DB) EquipmentRepository {
	return &MySQLEquipmentRepository{
		db:    database.NewQueryBuilder(db),
		query: query.NewEquipmentQuery(),
	}
}

// Create 道具を作成
func (r *MySQLEquipmentRepository) Create(equipment *Equipment) error {
	var count int
	if err := r.db.QueryRow(r.query.CheckNameExists(), equipment.Name).Scan(&count); err != nil {
		return err
	}
	if count > 0 {
		return errors.New("equipment name already exists")
	}

	now := time.Now()
	result, err := r.db.Exec(r.query.Insert(), equipment.Name, now, now)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	equipment.ID = int(id)
	equipment.IsInvalid = false
	equipment.CreatedAt = now
	equipment.UpdatedAt = now
	return nil
}

// GetByID IDで道具を取得
func (r *MySQLEquipmentRepository) GetByID(id int) (*Equipment, error) {
	e := &Equipment{}
	err := r.db.QueryRow(r.query.SelectByID(), id).Scan(&e.ID, &e.Name, &e.IsInvalid, &e.CreatedAt, &e.UpdatedAt)
	if err == sql.ErrNoRows {
		return nil, errors.New("equipment not found")
	}
	if err != nil {
		return nil, err
	}
	return e, nil
}

// GetAll 全道具を取得
func (r *MySQLEquipmentRepository) GetAll() ([]*Equipment, error) {
	rows, err := r.db.Query(r.query.SelectAll())
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	equipments := make([]*Equipment, 0)
	for rows.Next() {
		e := &Equipment{}
		if err := rows.Scan(&e.ID, &e.Name, &e.IsInvalid, &e.CreatedAt, &e.UpdatedAt); err != nil {
			return nil, err
		}
		equipments = append(equipments, e)
	}
	return equipments, nil
}

// Delete 道具を論理削除
func (r *MySQLEquipmentRepository) Delete(id int) error {
	result, err := r.db.Exec(r.query.SoftDelete(), time.Now(), id)
	if err != nil {
		return err
	}
	affected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if affected == 0 {
		return errors.New("equipment not found")
	}
	return nil
}
```

- [ ] **Step 3: サービスを書く**

```go
// go-service/internal/trick/service/equipment_service.go
package service

import (
	"go-service/internal/trick"
	"go-service/pkg/validator"
)

// EquipmentService 道具マスタのビジネスロジック
type EquipmentService struct {
	repo trick.EquipmentRepository
}

// NewEquipmentService サービスを作成
func NewEquipmentService(repo trick.EquipmentRepository) *EquipmentService {
	return &EquipmentService{repo: repo}
}

// CreateEquipment 道具を登録
func (s *EquipmentService) CreateEquipment(req *trick.CreateEquipmentRequest) (*trick.EquipmentResponse, error) {
	if err := validator.Validate(req); err != nil {
		return nil, err
	}

	e := &trick.Equipment{Name: req.Name}
	if err := s.repo.Create(e); err != nil {
		return nil, err
	}
	return e.ToResponse(), nil
}

// GetAllEquipments 全道具を取得
func (s *EquipmentService) GetAllEquipments() ([]*trick.EquipmentResponse, error) {
	equipments, err := s.repo.GetAll()
	if err != nil {
		return nil, err
	}
	responses := make([]*trick.EquipmentResponse, len(equipments))
	for i, e := range equipments {
		responses[i] = e.ToResponse()
	}
	return responses, nil
}

// GetEquipmentByID IDで道具を取得
func (s *EquipmentService) GetEquipmentByID(id int) (*trick.EquipmentResponse, error) {
	e, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}
	return e.ToResponse(), nil
}

// DeleteEquipment 道具を論理削除
func (s *EquipmentService) DeleteEquipment(id int) error {
	return s.repo.Delete(id)
}
```

- [ ] **Step 4: ハンドラの失敗するテストを書く**

```go
// go-service/internal/trick/handler/equipment_handler_test.go
package handler

import (
	"bytes"
	"encoding/json"
	"errors"
	"go-service/internal/trick"
	"go-service/internal/trick/service"
	"net/http/httptest"
	"testing"

	"github.com/gorilla/mux"
)

// stubEquipmentRepository はテスト用のインメモリ実装
type stubEquipmentRepository struct {
	items  map[int]*trick.Equipment
	nextID int
}

func newStubEquipmentRepository() *stubEquipmentRepository {
	return &stubEquipmentRepository{items: make(map[int]*trick.Equipment), nextID: 1}
}

func (s *stubEquipmentRepository) Create(e *trick.Equipment) error {
	for _, existing := range s.items {
		if existing.Name == e.Name {
			return errors.New("equipment name already exists")
		}
	}
	e.ID = s.nextID
	s.items[e.ID] = e
	s.nextID++
	return nil
}

func (s *stubEquipmentRepository) GetByID(id int) (*trick.Equipment, error) {
	e, ok := s.items[id]
	if !ok {
		return nil, errors.New("equipment not found")
	}
	return e, nil
}

func (s *stubEquipmentRepository) GetAll() ([]*trick.Equipment, error) {
	result := make([]*trick.Equipment, 0)
	for _, e := range s.items {
		result = append(result, e)
	}
	return result, nil
}

func (s *stubEquipmentRepository) Delete(id int) error {
	if _, ok := s.items[id]; !ok {
		return errors.New("equipment not found")
	}
	delete(s.items, id)
	return nil
}

func TestCreateEquipment_Success(t *testing.T) {
	repo := newStubEquipmentRepository()
	h := NewEquipmentHandler(service.NewEquipmentService(repo))

	body, _ := json.Marshal(map[string]string{"name": "ディアボロ"})
	req := httptest.NewRequest("POST", "/api/equipments", bytes.NewReader(body))
	w := httptest.NewRecorder()

	h.CreateEquipment(w, req)

	if w.Code != 201 {
		t.Fatalf("expected status 201, got %d, body: %s", w.Code, w.Body.String())
	}
}

func TestGetEquipmentByID_NotFound(t *testing.T) {
	repo := newStubEquipmentRepository()
	h := NewEquipmentHandler(service.NewEquipmentService(repo))

	req := httptest.NewRequest("GET", "/api/equipments/999", nil)
	req = mux.SetURLVars(req, map[string]string{"id": "999"})
	w := httptest.NewRecorder()

	h.GetEquipmentByID(w, req)

	if w.Code != 404 {
		t.Fatalf("expected status 404, got %d, body: %s", w.Code, w.Body.String())
	}
}
```

- [ ] **Step 5: テストが失敗することを確認する**

Run: `docker run --rm -v $(pwd)/go-service:/app -w /app golang:1.21-alpine sh -c "go mod tidy && go test ./internal/trick/handler/..."`
Expected: FAIL（`NewEquipmentHandler` 等が未定義でコンパイルエラー）

- [ ] **Step 6: ハンドラを書く**

```go
// go-service/internal/trick/handler/equipment_handler.go
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
```

- [ ] **Step 7: テストが通ることを確認する**

Run: `docker run --rm -v $(pwd)/go-service:/app -w /app golang:1.21-alpine sh -c "go mod tidy && go test ./internal/trick/..."`
Expected: PASS

- [ ] **Step 8: コミット**

```bash
git add go-service/internal/trick/query/equipment_query.go go-service/internal/trick/repository_equipment.go go-service/internal/trick/service/equipment_service.go go-service/internal/trick/handler/equipment_handler.go go-service/internal/trick/handler/equipment_handler_test.go go-service/go.mod go-service/go.sum
git commit -m "feat(trick): 道具マスタ(equipment)のCRUD APIを追加"
```

---

### Task 4: EquipmentCategory（道具カテゴリマスタ）CRUD

**Files:**
- Create: `go-service/internal/trick/query/category_query.go`
- Create: `go-service/internal/trick/repository_category.go`
- Create: `go-service/internal/trick/service/category_service.go`
- Create: `go-service/internal/trick/handler/category_handler.go`
- Test: `go-service/internal/trick/handler/category_handler_test.go`

**Interfaces:**
- Consumes: `trick.EquipmentCategory`, `trick.CreateEquipmentCategoryRequest`, `trick.EquipmentCategoryResponse`（Task 2）
- Produces: `trick.EquipmentCategoryRepository` interface（Create/GetByID/GetAll/Delete、Task 3と同形）。`service.CategoryService`。`handler.CategoryHandler`。ルート: `POST /api/equipment-categories`, `GET /api/equipment-categories`, `GET /api/equipment-categories/{id}`, `DELETE /api/equipment-categories/{id}`

名前の重複チェックは **`equipment_id` でスコープする**（同じカテゴリ名が別の道具では存在してよい）。

- [ ] **Step 1: クエリを書く**

```go
// go-service/internal/trick/query/category_query.go
package query

// CategoryQuery 道具カテゴリマスタ関連のSQL文
type CategoryQuery struct{}

// NewCategoryQuery クエリビルダーを作成
func NewCategoryQuery() *CategoryQuery {
	return &CategoryQuery{}
}

// Insert カテゴリ挿入SQL
func (q *CategoryQuery) Insert() string {
	return `
		INSERT INTO equipment_category_master (equipment_id, name, is_invalid, created_at, updated_at)
		VALUES (?, ?, 0, ?, ?)
	`
}

// CheckNameExists 同一道具内での名前重複チェックSQL
func (q *CategoryQuery) CheckNameExists() string {
	return `
		SELECT COUNT(*) FROM equipment_category_master
		WHERE equipment_id = ? AND name = ? AND is_invalid = 0
	`
}

// SelectByID ID検索SQL
func (q *CategoryQuery) SelectByID() string {
	return `
		SELECT id, equipment_id, name, is_invalid, created_at, updated_at
		FROM equipment_category_master
		WHERE id = ? AND is_invalid = 0
	`
}

// SelectAll 全件取得SQL
func (q *CategoryQuery) SelectAll() string {
	return `
		SELECT id, equipment_id, name, is_invalid, created_at, updated_at
		FROM equipment_category_master
		WHERE is_invalid = 0
		ORDER BY id ASC
	`
}

// SoftDelete 論理削除SQL
func (q *CategoryQuery) SoftDelete() string {
	return `
		UPDATE equipment_category_master
		SET is_invalid = 1, updated_at = ?
		WHERE id = ?
	`
}
```

- [ ] **Step 2: リポジトリを書く**

```go
// go-service/internal/trick/repository_category.go
package trick

import (
	"database/sql"
	"errors"
	"go-service/internal/trick/query"
	"go-service/pkg/database"
	"time"
)

// EquipmentCategoryRepository 道具カテゴリマスタリポジトリのインターフェース
type EquipmentCategoryRepository interface {
	Create(category *EquipmentCategory) error
	GetByID(id int) (*EquipmentCategory, error)
	GetAll() ([]*EquipmentCategory, error)
	Delete(id int) error
}

// MySQLEquipmentCategoryRepository MySQL実装
type MySQLEquipmentCategoryRepository struct {
	db    *database.QueryBuilder
	query *query.CategoryQuery
}

// NewMySQLEquipmentCategoryRepository MySQL接続を使用したリポジトリを作成
func NewMySQLEquipmentCategoryRepository(db *database.DB) EquipmentCategoryRepository {
	return &MySQLEquipmentCategoryRepository{
		db:    database.NewQueryBuilder(db),
		query: query.NewCategoryQuery(),
	}
}

// Create カテゴリを作成
func (r *MySQLEquipmentCategoryRepository) Create(category *EquipmentCategory) error {
	var count int
	if err := r.db.QueryRow(r.query.CheckNameExists(), category.EquipmentID, category.Name).Scan(&count); err != nil {
		return err
	}
	if count > 0 {
		return errors.New("equipment category name already exists")
	}

	now := time.Now()
	result, err := r.db.Exec(r.query.Insert(), category.EquipmentID, category.Name, now, now)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	category.ID = int(id)
	category.IsInvalid = false
	category.CreatedAt = now
	category.UpdatedAt = now
	return nil
}

// GetByID IDでカテゴリを取得
func (r *MySQLEquipmentCategoryRepository) GetByID(id int) (*EquipmentCategory, error) {
	c := &EquipmentCategory{}
	err := r.db.QueryRow(r.query.SelectByID(), id).Scan(&c.ID, &c.EquipmentID, &c.Name, &c.IsInvalid, &c.CreatedAt, &c.UpdatedAt)
	if err == sql.ErrNoRows {
		return nil, errors.New("equipment category not found")
	}
	if err != nil {
		return nil, err
	}
	return c, nil
}

// GetAll 全カテゴリを取得
func (r *MySQLEquipmentCategoryRepository) GetAll() ([]*EquipmentCategory, error) {
	rows, err := r.db.Query(r.query.SelectAll())
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	categories := make([]*EquipmentCategory, 0)
	for rows.Next() {
		c := &EquipmentCategory{}
		if err := rows.Scan(&c.ID, &c.EquipmentID, &c.Name, &c.IsInvalid, &c.CreatedAt, &c.UpdatedAt); err != nil {
			return nil, err
		}
		categories = append(categories, c)
	}
	return categories, nil
}

// Delete カテゴリを論理削除
func (r *MySQLEquipmentCategoryRepository) Delete(id int) error {
	result, err := r.db.Exec(r.query.SoftDelete(), time.Now(), id)
	if err != nil {
		return err
	}
	affected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if affected == 0 {
		return errors.New("equipment category not found")
	}
	return nil
}
```

- [ ] **Step 3: サービスを書く**

```go
// go-service/internal/trick/service/category_service.go
package service

import (
	"go-service/internal/trick"
	"go-service/pkg/validator"
)

// CategoryService 道具カテゴリマスタのビジネスロジック
type CategoryService struct {
	repo trick.EquipmentCategoryRepository
}

// NewCategoryService サービスを作成
func NewCategoryService(repo trick.EquipmentCategoryRepository) *CategoryService {
	return &CategoryService{repo: repo}
}

// CreateCategory カテゴリを登録
func (s *CategoryService) CreateCategory(req *trick.CreateEquipmentCategoryRequest) (*trick.EquipmentCategoryResponse, error) {
	if err := validator.Validate(req); err != nil {
		return nil, err
	}

	c := &trick.EquipmentCategory{EquipmentID: req.EquipmentID, Name: req.Name}
	if err := s.repo.Create(c); err != nil {
		return nil, err
	}
	return c.ToResponse(), nil
}

// GetAllCategories 全カテゴリを取得
func (s *CategoryService) GetAllCategories() ([]*trick.EquipmentCategoryResponse, error) {
	categories, err := s.repo.GetAll()
	if err != nil {
		return nil, err
	}
	responses := make([]*trick.EquipmentCategoryResponse, len(categories))
	for i, c := range categories {
		responses[i] = c.ToResponse()
	}
	return responses, nil
}

// GetCategoryByID IDでカテゴリを取得
func (s *CategoryService) GetCategoryByID(id int) (*trick.EquipmentCategoryResponse, error) {
	c, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}
	return c.ToResponse(), nil
}

// DeleteCategory カテゴリを論理削除
func (s *CategoryService) DeleteCategory(id int) error {
	return s.repo.Delete(id)
}
```

- [ ] **Step 4: ハンドラの失敗するテストを書く**

```go
// go-service/internal/trick/handler/category_handler_test.go
package handler

import (
	"bytes"
	"encoding/json"
	"errors"
	"go-service/internal/trick"
	"go-service/internal/trick/service"
	"net/http/httptest"
	"testing"

	"github.com/gorilla/mux"
)

type stubCategoryRepository struct {
	items  map[int]*trick.EquipmentCategory
	nextID int
}

func newStubCategoryRepository() *stubCategoryRepository {
	return &stubCategoryRepository{items: make(map[int]*trick.EquipmentCategory), nextID: 1}
}

func (s *stubCategoryRepository) Create(c *trick.EquipmentCategory) error {
	for _, existing := range s.items {
		if existing.EquipmentID == c.EquipmentID && existing.Name == c.Name {
			return errors.New("equipment category name already exists")
		}
	}
	c.ID = s.nextID
	s.items[c.ID] = c
	s.nextID++
	return nil
}

func (s *stubCategoryRepository) GetByID(id int) (*trick.EquipmentCategory, error) {
	c, ok := s.items[id]
	if !ok {
		return nil, errors.New("equipment category not found")
	}
	return c, nil
}

func (s *stubCategoryRepository) GetAll() ([]*trick.EquipmentCategory, error) {
	result := make([]*trick.EquipmentCategory, 0)
	for _, c := range s.items {
		result = append(result, c)
	}
	return result, nil
}

func (s *stubCategoryRepository) Delete(id int) error {
	if _, ok := s.items[id]; !ok {
		return errors.New("equipment category not found")
	}
	delete(s.items, id)
	return nil
}

func TestCreateCategory_Success(t *testing.T) {
	repo := newStubCategoryRepository()
	h := NewCategoryHandler(service.NewCategoryService(repo))

	body, _ := json.Marshal(map[string]interface{}{"equipment_id": 1, "name": "2個"})
	req := httptest.NewRequest("POST", "/api/equipment-categories", bytes.NewReader(body))
	w := httptest.NewRecorder()

	h.CreateCategory(w, req)

	if w.Code != 201 {
		t.Fatalf("expected status 201, got %d, body: %s", w.Code, w.Body.String())
	}
}

func TestDeleteCategory_NotFound(t *testing.T) {
	repo := newStubCategoryRepository()
	h := NewCategoryHandler(service.NewCategoryService(repo))

	req := httptest.NewRequest("DELETE", "/api/equipment-categories/999", nil)
	req = mux.SetURLVars(req, map[string]string{"id": "999"})
	w := httptest.NewRecorder()

	h.DeleteCategory(w, req)

	if w.Code != 404 {
		t.Fatalf("expected status 404, got %d, body: %s", w.Code, w.Body.String())
	}
}
```

- [ ] **Step 5: テストが失敗することを確認する**

Run: `docker run --rm -v $(pwd)/go-service:/app -w /app golang:1.21-alpine go test ./internal/trick/handler/...`
Expected: FAIL（`NewCategoryHandler` 等が未定義）

- [ ] **Step 6: ハンドラを書く**

```go
// go-service/internal/trick/handler/category_handler.go
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
```

- [ ] **Step 7: テストが通ることを確認する**

Run: `docker run --rm -v $(pwd)/go-service:/app -w /app golang:1.21-alpine go test ./internal/trick/...`
Expected: PASS

- [ ] **Step 8: コミット**

```bash
git add go-service/internal/trick/query/category_query.go go-service/internal/trick/repository_category.go go-service/internal/trick/service/category_service.go go-service/internal/trick/handler/category_handler.go go-service/internal/trick/handler/category_handler_test.go
git commit -m "feat(trick): 道具カテゴリマスタ(equipment_category)のCRUD APIを追加"
```

---

### Task 5: State（状態マスタ）CRUD

**Files:**
- Create: `go-service/internal/trick/query/state_query.go`
- Create: `go-service/internal/trick/repository_state.go`
- Create: `go-service/internal/trick/service/state_service.go`
- Create: `go-service/internal/trick/handler/state_handler.go`
- Test: `go-service/internal/trick/handler/state_handler_test.go`

**Interfaces:**
- Consumes: `trick.State`, `trick.CreateStateRequest`, `trick.StateResponse`（Task 2）
- Produces: `trick.StateRepository` interface（Create/GetByID/GetAll/Delete）。`service.StateService`。`handler.StateHandler`。ルート: `POST /api/states`, `GET /api/states`, `GET /api/states/{id}`, `DELETE /api/states/{id}`

名前の重複チェックは `equipment_id` でスコープする（Task 4のカテゴリと同じ考え方）。

- [ ] **Step 1: クエリを書く**

```go
// go-service/internal/trick/query/state_query.go
package query

// StateQuery 状態マスタ関連のSQL文
type StateQuery struct{}

// NewStateQuery クエリビルダーを作成
func NewStateQuery() *StateQuery {
	return &StateQuery{}
}

// Insert 状態挿入SQL
func (q *StateQuery) Insert() string {
	return `
		INSERT INTO state_master (equipment_id, name, description, is_invalid, created_at, updated_at)
		VALUES (?, ?, ?, 0, ?, ?)
	`
}

// CheckNameExists 同一道具内での名前重複チェックSQL
func (q *StateQuery) CheckNameExists() string {
	return `
		SELECT COUNT(*) FROM state_master
		WHERE equipment_id = ? AND name = ? AND is_invalid = 0
	`
}

// SelectByID ID検索SQL
func (q *StateQuery) SelectByID() string {
	return `
		SELECT id, equipment_id, name, description, is_invalid, created_at, updated_at
		FROM state_master
		WHERE id = ? AND is_invalid = 0
	`
}

// SelectAll 全件取得SQL
func (q *StateQuery) SelectAll() string {
	return `
		SELECT id, equipment_id, name, description, is_invalid, created_at, updated_at
		FROM state_master
		WHERE is_invalid = 0
		ORDER BY id ASC
	`
}

// SoftDelete 論理削除SQL
func (q *StateQuery) SoftDelete() string {
	return `
		UPDATE state_master
		SET is_invalid = 1, updated_at = ?
		WHERE id = ?
	`
}
```

- [ ] **Step 2: リポジトリを書く**

```go
// go-service/internal/trick/repository_state.go
package trick

import (
	"database/sql"
	"errors"
	"go-service/internal/trick/query"
	"go-service/pkg/database"
	"time"
)

// StateRepository 状態マスタリポジトリのインターフェース
type StateRepository interface {
	Create(state *State) error
	GetByID(id int) (*State, error)
	GetAll() ([]*State, error)
	Delete(id int) error
}

// MySQLStateRepository MySQL実装
type MySQLStateRepository struct {
	db    *database.QueryBuilder
	query *query.StateQuery
}

// NewMySQLStateRepository MySQL接続を使用したリポジトリを作成
func NewMySQLStateRepository(db *database.DB) StateRepository {
	return &MySQLStateRepository{
		db:    database.NewQueryBuilder(db),
		query: query.NewStateQuery(),
	}
}

// Create 状態を作成
func (r *MySQLStateRepository) Create(state *State) error {
	var count int
	if err := r.db.QueryRow(r.query.CheckNameExists(), state.EquipmentID, state.Name).Scan(&count); err != nil {
		return err
	}
	if count > 0 {
		return errors.New("state name already exists")
	}

	now := time.Now()
	result, err := r.db.Exec(r.query.Insert(), state.EquipmentID, state.Name, state.Description, now, now)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	state.ID = int(id)
	state.IsInvalid = false
	state.CreatedAt = now
	state.UpdatedAt = now
	return nil
}

// GetByID IDで状態を取得
func (r *MySQLStateRepository) GetByID(id int) (*State, error) {
	s := &State{}
	err := r.db.QueryRow(r.query.SelectByID(), id).Scan(&s.ID, &s.EquipmentID, &s.Name, &s.Description, &s.IsInvalid, &s.CreatedAt, &s.UpdatedAt)
	if err == sql.ErrNoRows {
		return nil, errors.New("state not found")
	}
	if err != nil {
		return nil, err
	}
	return s, nil
}

// GetAll 全状態を取得
func (r *MySQLStateRepository) GetAll() ([]*State, error) {
	rows, err := r.db.Query(r.query.SelectAll())
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	states := make([]*State, 0)
	for rows.Next() {
		s := &State{}
		if err := rows.Scan(&s.ID, &s.EquipmentID, &s.Name, &s.Description, &s.IsInvalid, &s.CreatedAt, &s.UpdatedAt); err != nil {
			return nil, err
		}
		states = append(states, s)
	}
	return states, nil
}

// Delete 状態を論理削除
func (r *MySQLStateRepository) Delete(id int) error {
	result, err := r.db.Exec(r.query.SoftDelete(), time.Now(), id)
	if err != nil {
		return err
	}
	affected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if affected == 0 {
		return errors.New("state not found")
	}
	return nil
}
```

- [ ] **Step 3: サービスを書く**

```go
// go-service/internal/trick/service/state_service.go
package service

import (
	"go-service/internal/trick"
	"go-service/pkg/validator"
)

// StateService 状態マスタのビジネスロジック
type StateService struct {
	repo trick.StateRepository
}

// NewStateService サービスを作成
func NewStateService(repo trick.StateRepository) *StateService {
	return &StateService{repo: repo}
}

// CreateState 状態を登録
func (s *StateService) CreateState(req *trick.CreateStateRequest) (*trick.StateResponse, error) {
	if err := validator.Validate(req); err != nil {
		return nil, err
	}

	var description *string
	if req.Description != "" {
		description = &req.Description
	}

	state := &trick.State{EquipmentID: req.EquipmentID, Name: req.Name, Description: description}
	if err := s.repo.Create(state); err != nil {
		return nil, err
	}
	return state.ToResponse(), nil
}

// GetAllStates 全状態を取得
func (s *StateService) GetAllStates() ([]*trick.StateResponse, error) {
	states, err := s.repo.GetAll()
	if err != nil {
		return nil, err
	}
	responses := make([]*trick.StateResponse, len(states))
	for i, st := range states {
		responses[i] = st.ToResponse()
	}
	return responses, nil
}

// GetStateByID IDで状態を取得
func (s *StateService) GetStateByID(id int) (*trick.StateResponse, error) {
	state, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}
	return state.ToResponse(), nil
}

// DeleteState 状態を論理削除
func (s *StateService) DeleteState(id int) error {
	return s.repo.Delete(id)
}
```

- [ ] **Step 4: ハンドラの失敗するテストを書く**

```go
// go-service/internal/trick/handler/state_handler_test.go
package handler

import (
	"bytes"
	"encoding/json"
	"errors"
	"go-service/internal/trick"
	"go-service/internal/trick/service"
	"net/http/httptest"
	"testing"

	"github.com/gorilla/mux"
)

type stubStateRepository struct {
	items  map[int]*trick.State
	nextID int
}

func newStubStateRepository() *stubStateRepository {
	return &stubStateRepository{items: make(map[int]*trick.State), nextID: 1}
}

func (s *stubStateRepository) Create(st *trick.State) error {
	for _, existing := range s.items {
		if existing.EquipmentID == st.EquipmentID && existing.Name == st.Name {
			return errors.New("state name already exists")
		}
	}
	st.ID = s.nextID
	s.items[st.ID] = st
	s.nextID++
	return nil
}

func (s *stubStateRepository) GetByID(id int) (*trick.State, error) {
	st, ok := s.items[id]
	if !ok {
		return nil, errors.New("state not found")
	}
	return st, nil
}

func (s *stubStateRepository) GetAll() ([]*trick.State, error) {
	result := make([]*trick.State, 0)
	for _, st := range s.items {
		result = append(result, st)
	}
	return result, nil
}

func (s *stubStateRepository) Delete(id int) error {
	if _, ok := s.items[id]; !ok {
		return errors.New("state not found")
	}
	delete(s.items, id)
	return nil
}

func TestCreateState_Success(t *testing.T) {
	repo := newStubStateRepository()
	h := NewStateHandler(service.NewStateService(repo))

	body, _ := json.Marshal(map[string]interface{}{"equipment_id": 1, "name": "3ボール片手待機"})
	req := httptest.NewRequest("POST", "/api/states", bytes.NewReader(body))
	w := httptest.NewRecorder()

	h.CreateState(w, req)

	if w.Code != 201 {
		t.Fatalf("expected status 201, got %d, body: %s", w.Code, w.Body.String())
	}
}

func TestGetStateByID_NotFound(t *testing.T) {
	repo := newStubStateRepository()
	h := NewStateHandler(service.NewStateService(repo))

	req := httptest.NewRequest("GET", "/api/states/999", nil)
	req = mux.SetURLVars(req, map[string]string{"id": "999"})
	w := httptest.NewRecorder()

	h.GetStateByID(w, req)

	if w.Code != 404 {
		t.Fatalf("expected status 404, got %d, body: %s", w.Code, w.Body.String())
	}
}
```

- [ ] **Step 5: テストが失敗することを確認する**

Run: `docker run --rm -v $(pwd)/go-service:/app -w /app golang:1.21-alpine go test ./internal/trick/handler/...`
Expected: FAIL（`NewStateHandler` 等が未定義）

- [ ] **Step 6: ハンドラを書く**

```go
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
```

- [ ] **Step 7: テストが通ることを確認する**

Run: `docker run --rm -v $(pwd)/go-service:/app -w /app golang:1.21-alpine go test ./internal/trick/...`
Expected: PASS

- [ ] **Step 8: コミット**

```bash
git add go-service/internal/trick/query/state_query.go go-service/internal/trick/repository_state.go go-service/internal/trick/service/state_service.go go-service/internal/trick/handler/state_handler.go go-service/internal/trick/handler/state_handler_test.go
git commit -m "feat(trick): 状態マスタ(state)のCRUD APIを追加"
```

---

### Task 6: Trick（技マスタ）CRUD

**Files:**
- Create: `go-service/internal/trick/query/trick_query.go`
- Create: `go-service/internal/trick/repository_trick.go`
- Create: `go-service/internal/trick/service/trick_service.go`
- Create: `go-service/internal/trick/handler/trick_handler.go`
- Test: `go-service/internal/trick/handler/trick_handler_test.go`

**Interfaces:**
- Consumes: `trick.Trick`, `trick.CreateTrickRequest`, `trick.TrickResponse`（Task 2）、`trick.EquipmentRepository`（Task 3）、`trick.EquipmentCategoryRepository`（Task 4）、`trick.StateRepository`（Task 5）
- Produces: `trick.TrickRepository` interface（Create/GetByID/GetAll/Delete）。`service.TrickService`（`equipmentRepo`, `categoryRepo`, `stateRepo`, `trickRepo` を保持し登録時にFK整合性チェックを行う）。`handler.TrickHandler`。ルート: `POST /api/tricks`, `GET /api/tricks`, `GET /api/tricks/{id}`, `DELETE /api/tricks/{id}`

技登録時のバリデーション（サービス層で実施）:
1. `equipment_id` が存在するか
2. `category_id` が存在し、かつその `equipment_id` がリクエストの `equipment_id` と一致するか
3. `start_state_id` / `end_state_id` が存在し、かつその `equipment_id` がリクエストの `equipment_id` と一致するか

- [ ] **Step 1: クエリを書く**

```go
// go-service/internal/trick/query/trick_query.go
package query

// TrickQuery 技マスタ関連のSQL文
type TrickQuery struct{}

// NewTrickQuery クエリビルダーを作成
func NewTrickQuery() *TrickQuery {
	return &TrickQuery{}
}

// Insert 技挿入SQL
func (q *TrickQuery) Insert() string {
	return `
		INSERT INTO trick_master (
			equipment_id, category_id, name, description,
			start_state_id, end_state_id, video_url, estimated_duration_seconds,
			is_invalid, created_at, updated_at
		)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
	`
}

// SelectByID ID検索SQL
func (q *TrickQuery) SelectByID() string {
	return `
		SELECT id, equipment_id, category_id, name, description,
		       start_state_id, end_state_id, video_url, estimated_duration_seconds,
		       is_invalid, created_at, updated_at
		FROM trick_master
		WHERE id = ? AND is_invalid = 0
	`
}

// SelectAll 全件取得SQL
func (q *TrickQuery) SelectAll() string {
	return `
		SELECT id, equipment_id, category_id, name, description,
		       start_state_id, end_state_id, video_url, estimated_duration_seconds,
		       is_invalid, created_at, updated_at
		FROM trick_master
		WHERE is_invalid = 0
		ORDER BY id ASC
	`
}

// SoftDelete 論理削除SQL
func (q *TrickQuery) SoftDelete() string {
	return `
		UPDATE trick_master
		SET is_invalid = 1, updated_at = ?
		WHERE id = ?
	`
}
```

- [ ] **Step 2: リポジトリを書く**

```go
// go-service/internal/trick/repository_trick.go
package trick

import (
	"database/sql"
	"errors"
	"go-service/internal/trick/query"
	"go-service/pkg/database"
	"time"
)

// TrickRepository 技マスタリポジトリのインターフェース
type TrickRepository interface {
	Create(t *Trick) error
	GetByID(id int) (*Trick, error)
	GetAll() ([]*Trick, error)
	Delete(id int) error
}

// MySQLTrickRepository MySQL実装
type MySQLTrickRepository struct {
	db    *database.QueryBuilder
	query *query.TrickQuery
}

// NewMySQLTrickRepository MySQL接続を使用したリポジトリを作成
func NewMySQLTrickRepository(db *database.DB) TrickRepository {
	return &MySQLTrickRepository{
		db:    database.NewQueryBuilder(db),
		query: query.NewTrickQuery(),
	}
}

// Create 技を作成
func (r *MySQLTrickRepository) Create(t *Trick) error {
	now := time.Now()
	result, err := r.db.Exec(
		r.query.Insert(),
		t.EquipmentID, t.CategoryID, t.Name, t.Description,
		t.StartStateID, t.EndStateID, t.VideoURL, t.EstimatedDurationSeconds,
		now, now,
	)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	t.ID = int(id)
	t.IsInvalid = false
	t.CreatedAt = now
	t.UpdatedAt = now
	return nil
}

// GetByID IDで技を取得
func (r *MySQLTrickRepository) GetByID(id int) (*Trick, error) {
	t := &Trick{}
	err := r.db.QueryRow(r.query.SelectByID(), id).Scan(
		&t.ID, &t.EquipmentID, &t.CategoryID, &t.Name, &t.Description,
		&t.StartStateID, &t.EndStateID, &t.VideoURL, &t.EstimatedDurationSeconds,
		&t.IsInvalid, &t.CreatedAt, &t.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, errors.New("trick not found")
	}
	if err != nil {
		return nil, err
	}
	return t, nil
}

// GetAll 全技を取得
func (r *MySQLTrickRepository) GetAll() ([]*Trick, error) {
	rows, err := r.db.Query(r.query.SelectAll())
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	tricks := make([]*Trick, 0)
	for rows.Next() {
		t := &Trick{}
		if err := rows.Scan(
			&t.ID, &t.EquipmentID, &t.CategoryID, &t.Name, &t.Description,
			&t.StartStateID, &t.EndStateID, &t.VideoURL, &t.EstimatedDurationSeconds,
			&t.IsInvalid, &t.CreatedAt, &t.UpdatedAt,
		); err != nil {
			return nil, err
		}
		tricks = append(tricks, t)
	}
	return tricks, nil
}

// Delete 技を論理削除
func (r *MySQLTrickRepository) Delete(id int) error {
	result, err := r.db.Exec(r.query.SoftDelete(), time.Now(), id)
	if err != nil {
		return err
	}
	affected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if affected == 0 {
		return errors.New("trick not found")
	}
	return nil
}
```

- [ ] **Step 3: サービスを書く（FK整合性チェックを含む）**

```go
// go-service/internal/trick/service/trick_service.go
package service

import (
	"errors"
	"go-service/internal/trick"
	"go-service/pkg/validator"
)

// TrickService 技マスタのビジネスロジック
type TrickService struct {
	equipmentRepo trick.EquipmentRepository
	categoryRepo  trick.EquipmentCategoryRepository
	stateRepo     trick.StateRepository
	trickRepo     trick.TrickRepository
}

// NewTrickService サービスを作成
func NewTrickService(
	equipmentRepo trick.EquipmentRepository,
	categoryRepo trick.EquipmentCategoryRepository,
	stateRepo trick.StateRepository,
	trickRepo trick.TrickRepository,
) *TrickService {
	return &TrickService{
		equipmentRepo: equipmentRepo,
		categoryRepo:  categoryRepo,
		stateRepo:     stateRepo,
		trickRepo:     trickRepo,
	}
}

// CreateTrick 技を登録
func (s *TrickService) CreateTrick(req *trick.CreateTrickRequest) (*trick.TrickResponse, error) {
	if err := validator.Validate(req); err != nil {
		return nil, err
	}

	if _, err := s.equipmentRepo.GetByID(req.EquipmentID); err != nil {
		return nil, errors.New("equipment not found")
	}

	category, err := s.categoryRepo.GetByID(req.CategoryID)
	if err != nil {
		return nil, errors.New("equipment category not found")
	}
	if category.EquipmentID != req.EquipmentID {
		return nil, errors.New("category does not belong to the given equipment")
	}

	startState, err := s.stateRepo.GetByID(req.StartStateID)
	if err != nil {
		return nil, errors.New("start state not found")
	}
	if startState.EquipmentID != req.EquipmentID {
		return nil, errors.New("start state does not belong to the given equipment")
	}

	endState, err := s.stateRepo.GetByID(req.EndStateID)
	if err != nil {
		return nil, errors.New("end state not found")
	}
	if endState.EquipmentID != req.EquipmentID {
		return nil, errors.New("end state does not belong to the given equipment")
	}

	var description *string
	if req.Description != "" {
		description = &req.Description
	}
	var videoURL *string
	if req.VideoURL != "" {
		videoURL = &req.VideoURL
	}

	t := &trick.Trick{
		EquipmentID:              req.EquipmentID,
		CategoryID:               req.CategoryID,
		Name:                     req.Name,
		Description:              description,
		StartStateID:             req.StartStateID,
		EndStateID:               req.EndStateID,
		VideoURL:                 videoURL,
		EstimatedDurationSeconds: req.EstimatedDurationSeconds,
	}
	if err := s.trickRepo.Create(t); err != nil {
		return nil, err
	}
	return t.ToResponse(), nil
}

// GetAllTricks 全技を取得
func (s *TrickService) GetAllTricks() ([]*trick.TrickResponse, error) {
	tricks, err := s.trickRepo.GetAll()
	if err != nil {
		return nil, err
	}
	responses := make([]*trick.TrickResponse, len(tricks))
	for i, t := range tricks {
		responses[i] = t.ToResponse()
	}
	return responses, nil
}

// GetTrickByID IDで技を取得
func (s *TrickService) GetTrickByID(id int) (*trick.TrickResponse, error) {
	t, err := s.trickRepo.GetByID(id)
	if err != nil {
		return nil, err
	}
	return t.ToResponse(), nil
}

// DeleteTrick 技を論理削除
func (s *TrickService) DeleteTrick(id int) error {
	return s.trickRepo.Delete(id)
}
```

- [ ] **Step 4: ハンドラの失敗するテストを書く**

```go
// go-service/internal/trick/handler/trick_handler_test.go
package handler

import (
	"bytes"
	"encoding/json"
	"errors"
	"go-service/internal/trick"
	"go-service/internal/trick/service"
	"net/http/httptest"
	"testing"

	"github.com/gorilla/mux"
)

type stubTrickRepository struct {
	items  map[int]*trick.Trick
	nextID int
}

func newStubTrickRepository() *stubTrickRepository {
	return &stubTrickRepository{items: make(map[int]*trick.Trick), nextID: 1}
}

func (s *stubTrickRepository) Create(t *trick.Trick) error {
	t.ID = s.nextID
	s.items[t.ID] = t
	s.nextID++
	return nil
}

func (s *stubTrickRepository) GetByID(id int) (*trick.Trick, error) {
	t, ok := s.items[id]
	if !ok {
		return nil, errors.New("trick not found")
	}
	return t, nil
}

func (s *stubTrickRepository) GetAll() ([]*trick.Trick, error) {
	result := make([]*trick.Trick, 0)
	for _, t := range s.items {
		result = append(result, t)
	}
	return result, nil
}

func (s *stubTrickRepository) Delete(id int) error {
	if _, ok := s.items[id]; !ok {
		return errors.New("trick not found")
	}
	delete(s.items, id)
	return nil
}

// テスト用にequipment_id=1, category_id=1（equipment_id=1所属）,
// state id=1,2（equipment_id=1所属）を事前登録した状態を組み立てるヘルパー
func newTrickHandlerForTest() (*TrickHandler, *stubTrickRepository) {
	equipmentRepo := newStubEquipmentRepository()
	equipmentRepo.items[1] = &trick.Equipment{ID: 1, Name: "ディアボロ"}
	equipmentRepo.nextID = 2

	categoryRepo := newStubCategoryRepository()
	categoryRepo.items[1] = &trick.EquipmentCategory{ID: 1, EquipmentID: 1, Name: "2個"}
	categoryRepo.nextID = 2

	stateRepo := newStubStateRepository()
	stateRepo.items[1] = &trick.State{ID: 1, EquipmentID: 1, Name: "待機"}
	stateRepo.items[2] = &trick.State{ID: 2, EquipmentID: 1, Name: "カスケード中"}
	stateRepo.nextID = 3

	trickRepo := newStubTrickRepository()

	svc := service.NewTrickService(equipmentRepo, categoryRepo, stateRepo, trickRepo)
	return NewTrickHandler(svc), trickRepo
}

func TestCreateTrick_Success(t *testing.T) {
	h, _ := newTrickHandlerForTest()

	body, _ := json.Marshal(map[string]interface{}{
		"equipment_id":   1,
		"category_id":    1,
		"name":           "カスケード",
		"start_state_id": 1,
		"end_state_id":   2,
	})
	req := httptest.NewRequest("POST", "/api/tricks", bytes.NewReader(body))
	w := httptest.NewRecorder()

	h.CreateTrick(w, req)

	if w.Code != 201 {
		t.Fatalf("expected status 201, got %d, body: %s", w.Code, w.Body.String())
	}
}

func TestCreateTrick_StateBelongsToDifferentEquipment(t *testing.T) {
	h, _ := newTrickHandlerForTest()

	// equipment_id=1で登録するが、end_state_idに別道具の状態を混ぜる想定を
	// シミュレートするため、equipment_id=1に存在しないstate_idを指定する
	body, _ := json.Marshal(map[string]interface{}{
		"equipment_id":   1,
		"category_id":    1,
		"name":           "不正な技",
		"start_state_id": 1,
		"end_state_id":   999,
	})
	req := httptest.NewRequest("POST", "/api/tricks", bytes.NewReader(body))
	w := httptest.NewRecorder()

	h.CreateTrick(w, req)

	if w.Code != 400 {
		t.Fatalf("expected status 400, got %d, body: %s", w.Code, w.Body.String())
	}
}

func TestGetTrickByID_NotFound(t *testing.T) {
	h, _ := newTrickHandlerForTest()

	req := httptest.NewRequest("GET", "/api/tricks/999", nil)
	req = mux.SetURLVars(req, map[string]string{"id": "999"})
	w := httptest.NewRecorder()

	h.GetTrickByID(w, req)

	if w.Code != 404 {
		t.Fatalf("expected status 404, got %d, body: %s", w.Code, w.Body.String())
	}
}
```

- [ ] **Step 5: テストが失敗することを確認する**

Run: `docker run --rm -v $(pwd)/go-service:/app -w /app golang:1.21-alpine go test ./internal/trick/handler/...`
Expected: FAIL（`NewTrickHandler`, `service.NewTrickService` 等が未定義）

- [ ] **Step 6: ハンドラを書く**

```go
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
```

- [ ] **Step 7: テストが通ることを確認する**

Run: `docker run --rm -v $(pwd)/go-service:/app -w /app golang:1.21-alpine go test ./internal/trick/...`
Expected: PASS

- [ ] **Step 8: コミット**

```bash
git add go-service/internal/trick/query/trick_query.go go-service/internal/trick/repository_trick.go go-service/internal/trick/service/trick_service.go go-service/internal/trick/handler/trick_handler.go go-service/internal/trick/handler/trick_handler_test.go
git commit -m "feat(trick): 技マスタ(trick)のCRUD APIを追加（FK整合性チェック含む）"
```

---

### Task 7: main.goへの配線とAPI仕様書更新

**Files:**
- Modify: `go-service/main.go`
- Create: `go-service/docs/api/tricks/README.md`
- Modify: `go-service/docs/api/README.md`

**Interfaces:**
- Consumes: `handler.NewEquipmentHandler`, `handler.NewCategoryHandler`, `handler.NewStateHandler`, `handler.NewTrickHandler`（Task 3〜6）、各 `RegisterRoutes(router)`

- [ ] **Step 1: main.goに `setupTrickDomain` を追加する**

`go-service/main.go` の `setupUserDomain` の下に以下を追加し、`main()` 内の `setupUserDomain(router, db)` の次の行に `setupTrickDomain(router, db)` を追加する。

```go
// setupTrickDomain 技マスタドメインのセットアップ
func setupTrickDomain(router *mux.Router, db *database.DB) {
	equipmentRepo := trick.NewMySQLEquipmentRepository(db)
	categoryRepo := trick.NewMySQLEquipmentCategoryRepository(db)
	stateRepo := trick.NewMySQLStateRepository(db)
	trickRepo := trick.NewMySQLTrickRepository(db)

	equipmentHandler := handler.NewEquipmentHandler(service.NewEquipmentService(equipmentRepo))
	categoryHandler := handler.NewCategoryHandler(service.NewCategoryService(categoryRepo))
	stateHandler := handler.NewStateHandler(service.NewStateService(stateRepo))
	trickHandler := handler.NewTrickHandler(service.NewTrickService(equipmentRepo, categoryRepo, stateRepo, trickRepo))

	equipmentHandler.RegisterRoutes(router)
	categoryHandler.RegisterRoutes(router)
	stateHandler.RegisterRoutes(router)
	trickHandler.RegisterRoutes(router)
}
```

`import` 文には以下を追加する（`handler`, `service` は既存の `go-service/internal/user/handler`, `go-service/internal/user/service` と名前が衝突するため、エイリアスを付ける）。

```go
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
```

上記のエイリアスに合わせて `setupTrickDomain` 内の `handler.` を `trickHandler.`、`service.` を `trickService.` に置き換える。

```go
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
```

`main()` 内、`setupUserDomain(router, db)` の直後に追加:

```go
	setupUserDomain(router, db)
	setupTrickDomain(router, db)
	setupHealthDomain(router)
```

- [ ] **Step 2: ビルドが通ることを確認する**

Run: `docker run --rm -v $(pwd)/go-service:/app -w /app golang:1.21-alpine sh -c "go mod tidy && go vet ./... && go build -o /app/main_check ."`
Expected: エラーなくビルドが完了する

- [ ] **Step 3: 全テストを実行する**

Run: `docker run --rm -v $(pwd)/go-service:/app -w /app golang:1.21-alpine go test ./...`
Expected: 全PASS

- [ ] **Step 4: 動作中の開発コンテナへ反映して手動確認する**

Run:
```bash
docker cp go-service/main_check devcontainer_go_service:/root/main_new
docker exec devcontainer_go_service sh -c "chmod +x /root/main_new && mv /root/main /root/main_prev && mv /root/main_new /root/main"
docker restart devcontainer_go_service
docker exec devcontainer_react_app sh -c "wget -qO- --post-data='{\"name\":\"ディアボロ\"}' --header='Content-Type: application/json' http://go-service:8080/api/equipments"
```
Expected: `{"success":true,"data":{"id":1,"name":"ディアボロ",...}}` が返る

- [ ] **Step 5: API仕様書を追加する**

```markdown
<!-- go-service/docs/api/tricks/README.md -->
# 技マスタ関連API

道具(equipment)・道具カテゴリ(equipment_category)・状態(state)・技(trick)の4マスタに対するCRUD API。全て `internal/trick/handler/` で実装。

## エンドポイント一覧

| Method | Path | 説明 |
|---|---|---|
| POST | `/api/equipments` | 道具登録 |
| GET | `/api/equipments` | 道具一覧取得 |
| GET | `/api/equipments/{id}` | 道具単体取得 |
| DELETE | `/api/equipments/{id}` | 道具削除（論理削除） |
| POST | `/api/equipment-categories` | 道具カテゴリ登録 |
| GET | `/api/equipment-categories` | 道具カテゴリ一覧取得 |
| GET | `/api/equipment-categories/{id}` | 道具カテゴリ単体取得 |
| DELETE | `/api/equipment-categories/{id}` | 道具カテゴリ削除（論理削除） |
| POST | `/api/states` | 状態登録 |
| GET | `/api/states` | 状態一覧取得 |
| GET | `/api/states/{id}` | 状態単体取得 |
| DELETE | `/api/states/{id}` | 状態削除（論理削除） |
| POST | `/api/tricks` | 技登録 |
| GET | `/api/tricks` | 技一覧取得 |
| GET | `/api/tricks/{id}` | 技単体取得 |
| DELETE | `/api/tricks/{id}` | 技削除（論理削除） |

## 技登録時のバリデーション

`POST /api/tricks` は以下を満たさない場合 `400 BAD_REQUEST` を返す。

- `equipment_id` が存在する道具を指すこと
- `category_id` が存在し、その道具カテゴリの `equipment_id` がリクエストの `equipment_id` と一致すること
- `start_state_id` / `end_state_id` が存在し、その状態の `equipment_id` がリクエストの `equipment_id` と一致すること

## データモデル・DB定義

- リクエスト/レスポンスの型は `go-service/internal/trick/types.go`
- テーブル定義は [`go-service/docs/db/tricks/`](../../db/tricks/)
```

`go-service/docs/api/README.md` の「エンドポイント一覧」テーブルの下に1行追加する。

```markdown
| POST/GET/DELETE | `/api/equipments`, `/api/equipment-categories`, `/api/states`, `/api/tricks` | 技マスタ管理（道具/カテゴリ/状態/技） | [tricks/README.md](./tricks/README.md) |
```

- [ ] **Step 6: コミット**

```bash
git add go-service/main.go go-service/docs/api/tricks/README.md go-service/docs/api/README.md
git commit -m "feat(trick): 技マスタAPIをmain.goに配線しAPI仕様書を追加"
```

---

## Self-Review

- **Spec coverage:** design specの「スコープ（本sprint）」記載の4マスタCRUD APIはTask 3〜6で網羅。動画アップロード自体・S3移行・ルーチン編成画面・モバイルビューアはspec通りスコープ外として明記済み
- **Placeholder scan:** 全タスクのコードは実装済みのGoコードで、TODO/TBDは無い
- **Type consistency:** `EquipmentRepository`, `EquipmentCategoryRepository`, `StateRepository`, `TrickRepository` の各インターフェース名・メソッドシグネチャ（`Create`, `GetByID`, `GetAll`, `Delete`）はTask 3〜6で統一。`TrickService` が消費する4つのリポジトリの型もTask 3〜5で定義した型と一致させた
