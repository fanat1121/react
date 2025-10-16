# アーキテクチャ設計

## 📐 ディレクトリ構造

```
go-service/
├── main.go                          # エントリーポイント
├── go.mod                           # 依存関係管理
├── go.sum                           # 依存関係のチェックサム
├── Dockerfile                       # Dockerイメージ定義
├── .env.example                     # 環境変数サンプル
├── .gitignore                       # Git除外設定
├── README.md                        # プロジェクト説明
├── ARCHITECTURE.md                  # このファイル
├── MIGRATION.md                     # マイグレーションガイド
│
├── internal/                        # プライベートコード（機能ベース構造）
│   ├── user/                        # ユーザー機能ドメイン
│   │   ├── types.go                # データ型定義
│   │   ├── repository.go           # データアクセス層
│   │   ├── service.go              # ビジネスロジック層
│   │   └── handler.go              # HTTPハンドラー層
│   │
│   └── health/                      # ヘルスチェック機能
│       └── handler.go              # ヘルスチェックハンドラー
│
└── pkg/                             # 公開可能なコード
    └── response/                    # 共通レスポンス
        └── response.go              # APIレスポンス構造
```

## 🏗️ 機能ベースアーキテクチャ

このプロジェクトは**機能ベース（Feature-based）アーキテクチャ**を採用しています。

各機能（ドメイン）が独立したディレクトリに配置され、関連するすべてのコードが1箇所に集約されています。

### 機能ドメインの構成

各機能ドメイン内で、レイヤードアーキテクチャを維持：

```
internal/user/  (ユーザー機能ドメイン)
│
├── types.go       ← モデル層（データ構造定義）
│
├── handler.go     ← ハンドラー層（HTTPリクエスト/レスポンス）
│        ↓
├── service.go     ← サービス層（ビジネスロジック）
│        ↓
└── repository.go  ← リポジトリ層（データアクセス）
         ↓
    [Data Store]   ← インメモリ / MySQL
```

### データフロー

```
1. HTTPリクエスト
   ↓
2. handler.go (user/handler.go)
   - リクエストをパース
   - バリデーション
   ↓
3. service.go (user/service.go)
   - ビジネスロジック実行
   - パスワードハッシュ化など
   ↓
4. repository.go (user/repository.go)
   - データストアへの保存/取得
   ↓
5. service.go
   - レスポンス用データに変換
   ↓
6. handler.go
   - JSONレスポンス生成
   ↓
7. HTTPレスポンス
```

### 各レイヤーの責務

#### 1. Handler Layer（ハンドラー層）
- HTTPリクエストの受信
- リクエストのバリデーション
- サービス層の呼び出し
- HTTPレスポンスの生成

**例: user/handler.go**
```go
func (h *Handler) CreateUser(w http.ResponseWriter, r *http.Request) {
    var req CreateUserRequest
    json.NewDecoder(r.Body).Decode(&req)
    
    user, err := h.service.CreateUser(&req)
    if err != nil {
        response.BadRequest(w, err.Error())
        return
    }
    
    response.Created(w, user)
}
```

#### 2. Service Layer（サービス層）
- ビジネスロジックの実装
- データの検証
- リポジトリ層の呼び出し
- エラーハンドリング

**例:**
```go
func (s *UserService) CreateUser(req *CreateUserRequest) (*UserResponse, error) {
    // バリデーション
    if req.Username == "" {
        return nil, errors.New("user_name is required")
    }
    
    // パスワードハッシュ化
    hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
    
    // リポジトリ呼び出し
    user := &User{Username: req.Username, Password: string(hashedPassword)}
    s.repo.Create(user)
    
    return user.ToResponse(), nil
}
```

#### 3. Repository Layer（リポジトリ層）
- データの永続化
- データの取得・更新・削除
- データストアとのやり取り

**例:**
```go
func (r *InMemoryUserRepository) Create(user *User) error {
    r.mu.Lock()
    defer r.mu.Unlock()
    
    user.ID = r.nextID
    r.users[user.ID] = user
    r.nextID++
    
    return nil
}
```

#### 4. Model Layer（モデル層）
- データ構造の定義
- バリデーションルール
- データ変換メソッド

**例: user/types.go**
```go
type User struct {
    ID        int       `json:"id"`
    Username  string    `json:"user_name"`
    Email     string    `json:"email"`
    Password  string    `json:"-"`
    CreatedAt time.Time `json:"created_at"`
}
```

## 🔄 実際のデータフロー例

### ユーザー登録のフロー

```
1. クライアント
   ↓ POST /api/users
   
2. user/handler.go (Handler.CreateUser)
   - リクエストをパース
   - CreateUserRequest に変換
   ↓
   
3. user/service.go (Service.CreateUser)
   - バリデーション実行
   - パスワードをハッシュ化
   - User モデルを作成
   ↓
   
4. user/repository.go (Repository.Create)
   - データストアに保存
   - IDを自動採番
   ↓
   
5. user/service.go
   - UserResponse に変換
   ↓
   
6. user/handler.go
   - JSON レスポンスを生成
   ↓
   
7. クライアント
   - レスポンスを受信
```

すべてのコードが `internal/user/` ディレクトリに集約されています！

## 🎯 設計原則

### 1. 依存性の逆転（Dependency Inversion）
- 上位レイヤーは下位レイヤーのインターフェースに依存
- 具体的な実装ではなく抽象に依存

```go
// user/repository.go - インターフェース定義
type Repository interface {
    Create(user *User) error
    GetByID(id int) (*User, error)
}

// user/service.go - サービスはインターフェースに依存
type Service struct {
    repo Repository  // 具体的な実装ではなくインターフェース
}
```

### 2. 単一責任の原則（Single Responsibility）
- 各レイヤーは1つの責務のみを持つ
- Handler: HTTP処理のみ
- Service: ビジネスロジックのみ
- Repository: データアクセスのみ

### 3. 関心の分離（Separation of Concerns）
- ビジネスロジックとHTTP処理を分離
- データアクセスとビジネスロジックを分離

### 4. 機能の凝集性（Feature Cohesion）
- 関連するコードを1箇所に集約
- 機能ごとにディレクトリを分割
- 機能の追加・削除が容易

## 🔌 拡張性

### 新しい機能の追加

例: Product（商品）機能を追加する場合

**ステップ1: 新しいディレクトリを作成**
```
internal/product/
```

**ステップ2: 各ファイルを作成**

```go
// internal/product/types.go
package product

type Product struct {
    ID    int    `json:"id"`
    Name  string `json:"name"`
    Price int    `json:"price"`
}

type CreateProductRequest struct {
    Name  string `json:"name"`
    Price int    `json:"price"`
}
```

```go
// internal/product/repository.go
package product

type Repository interface {
    Create(product *Product) error
    GetByID(id int) (*Product, error)
}

type InMemoryRepository struct {
    // 実装
}

func NewInMemoryRepository() Repository {
    return &InMemoryRepository{}
}
```

```go
// internal/product/service.go
package product

type Service struct {
    repo Repository
}

func NewService(repo Repository) *Service {
    return &Service{repo: repo}
}
```

```go
// internal/product/handler.go
package product

type Handler struct {
    service *Service
}

func NewHandler(service *Service) *Handler {
    return &Handler{service: service}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {
    router.HandleFunc("/api/products", h.Create).Methods("POST")
    router.HandleFunc("/api/products", h.GetAll).Methods("GET")
}
```

**ステップ3: main.goに追加**
```go
// main.go
func setupProductDomain(router *mux.Router) {
    repo := product.NewInMemoryRepository()
    service := product.NewService(repo)
    handler := product.NewHandler(service)
    handler.RegisterRoutes(router)
}

func main() {
    router := mux.NewRouter()
    
    setupUserDomain(router)
    setupProductDomain(router)  // 追加！
    setupHealthDomain(router)
    
    // ...
}
```

**完了！** たった3ステップで新機能を追加できますわ！

## 🧪 テスト戦略

### ユニットテスト

各レイヤーを独立してテスト可能：

```go
// user/service_test.go
package user

func TestService_CreateUser(t *testing.T) {
    // モックリポジトリを使用
    mockRepo := &MockRepository{}
    service := NewService(mockRepo)
    
    req := &CreateUserRequest{
        Username: "test",
        Email: "test@example.com",
        Password: "password123",
    }
    
    user, err := service.CreateUser(req)
    assert.NoError(t, err)
    assert.Equal(t, "test", user.Username)
}
```

各機能ドメインごとにテストファイルを配置：
```
internal/user/
├── types.go
├── repository.go
├── repository_test.go  ← テスト
├── service.go
├── service_test.go     ← テスト
├── handler.go
└── handler_test.go     ← テスト
```

## 🎁 機能ベース構造のメリット

### ✅ 開発効率
- 関連コードが1箇所に集約され、探しやすい
- 機能追加時に複数ディレクトリを行き来する必要がない

### ✅ 保守性
- 機能の削除が容易（ディレクトリごと削除）
- 影響範囲が明確

### ✅ チーム開発
- 機能ごとに担当を分けやすい
- ファイルの競合が起きにくい

### ✅ マイクロサービス化
- 各機能が独立しているため、分割しやすい
- 将来的に別サービスに切り出すことも容易

## 📚 参考資料

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Go Project Layout](https://github.com/golang-standards/project-layout)
- [Feature-based Architecture](https://khalilstemmler.com/articles/software-design-architecture/organizing-app-logic/)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
