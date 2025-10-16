# マイグレーションガイド

## 🔄 機能ベース構造への移行

レイヤードアーキテクチャから機能ベース構造に移行しました。

### 削除すべき古いディレクトリ

以下のディレクトリは**削除してください**：

```
internal/handler/     # 削除
internal/service/     # 削除
internal/repository/  # 削除
internal/model/       # 削除
```

### PowerShellで削除する場合

```powershell
# go-serviceディレクトリで実行
Remove-Item -Recurse -Force internal\handler
Remove-Item -Recurse -Force internal\service
Remove-Item -Recurse -Force internal\repository
Remove-Item -Recurse -Force internal\model
```

### 新しい構造

```
internal/
├── user/           # ユーザー機能（すべてここに集約）
│   ├── types.go
│   ├── repository.go
│   ├── service.go
│   └── handler.go
└── health/         # ヘルスチェック機能
    └── handler.go
```

### 変更点

#### Before（レイヤードアーキテクチャ）
```
internal/
├── handler/
│   ├── health_handler.go
│   └── user_handler.go
├── service/
│   └── user_service.go
├── repository/
│   └── user_repository.go
└── model/
    └── user.go
```

#### After（機能ベース構造）
```
internal/
├── user/
│   ├── types.go       # モデル定義
│   ├── repository.go  # データアクセス
│   ├── service.go     # ビジネスロジック
│   └── handler.go     # HTTPハンドラー
└── health/
    └── handler.go
```

### メリット

1. **関連コードが1箇所に集約**
   - ユーザー機能の全コードが`internal/user/`にある
   - 機能の理解が容易

2. **機能の追加・削除が簡単**
   - 新機能は新しいディレクトリを追加するだけ
   - 不要な機能はディレクトリごと削除

3. **チーム開発で競合が少ない**
   - 異なる機能を開発する際、ファイルが重複しない

4. **マイクロサービス化が容易**
   - 各機能が独立しているため、分割しやすい

### 新しい機能の追加方法

例: Product（商品）機能を追加する場合

```
internal/product/
├── types.go       # Product, CreateProductRequest, ProductResponse
├── repository.go  # ProductRepository interface & implementation
├── service.go     # ProductService
└── handler.go     # ProductHandler with RegisterRoutes
```

main.goに追加：
```go
func setupProductDomain(router *mux.Router) {
    repo := product.NewInMemoryRepository()
    service := product.NewService(repo)
    handler := product.NewHandler(service)
    handler.RegisterRoutes(router)
}
```

main関数で呼び出し：
```go
setupProductDomain(router)
```

これだけで完了！
