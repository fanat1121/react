# Go Microservice

シンプルなGoマイクロサービスの実装です。

## 🚀 機能

- RESTful API エンドポイント
- CORS対応（Next.jsアプリケーションとの連携）
- ヘルスチェックエンドポイント
- Docker対応
- MySQL連携可能

## 📁 プロジェクト構造

```
go-service/
├── main.go           # メインアプリケーション
├── go.mod            # Go依存関係管理
├── Dockerfile        # Dockerイメージ定義
├── .env.example      # 環境変数のサンプル
├── .gitignore        # Git除外設定
└── README.md         # このファイル
```

## 🛠️ セットアップ

### ローカル開発

1. **依存関係のインストール**
```bash
cd go-service
go mod download
```

2. **環境変数の設定**
```bash
cp .env.example .env
```

3. **アプリケーションの起動**
```bash
go run main.go
```

サーバーは `http://localhost:8080` で起動します。

### Docker での起動

プロジェクトルート（reactディレクトリ）から：

```bash
# Goサービスのみ起動
docker-compose up go-service

# すべてのサービスを起動（MySQL含む）
docker-compose up

# バックグラウンドで起動
docker-compose up -d
```

## 📡 API エンドポイント

### ヘルスチェック

#### GET /api/health
サービスのヘルスチェック。

**レスポンス例:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "service": "go-service",
    "time": "2024-10-15T10:15:00Z"
  }
}
```

### ユーザーAPI

#### POST /api/users
新しいユーザーを登録します。

**リクエスト例:**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

**レスポンス例（成功）:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "created_at": "2024-10-15T10:15:00Z",
    "updated_at": "2024-10-15T10:15:00Z"
  }
}
```

**レスポンス例（エラー）:**
```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "email already exists"
  }
}
```

#### GET /api/users
ユーザー情報を取得します（クエリパラメータで条件指定可能）。

**パラメータなし - 全ユーザー取得:**
```bash
GET /api/users
```

**レスポンス例:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "created_at": "2024-10-15T10:15:00Z",
      "updated_at": "2024-10-15T10:15:00Z"
    }
  ]
}
```

**ID指定:**
```bash
GET /api/users?id=1
```

**メールアドレス指定:**
```bash
GET /api/users?email=test@example.com
```

**ユーザー名指定:**
```bash
GET /api/users?username=testuser
```

**レスポンス例（単一ユーザー）:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "created_at": "2024-10-15T10:15:00Z",
    "updated_at": "2024-10-15T10:15:00Z"
  }
}
```

## 🧪 テスト

### cURLでのテスト

```bash
# ヘルスチェック
curl http://localhost:8080/api/health

# ユーザー登録
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'

# 全ユーザー取得
curl http://localhost:8080/api/users

# ID指定でユーザー取得
curl "http://localhost:8080/api/users?id=1"

# メールアドレス指定でユーザー取得
curl "http://localhost:8080/api/users?email=test@example.com"

# ユーザー名指定でユーザー取得
curl "http://localhost:8080/api/users?username=testuser"
```

## 🔧 環境変数

| 変数名 | 説明 | デフォルト値 |
|--------|------|--------------|
| PORT | サーバーのポート番号 | 8080 |

## 📦 使用ライブラリ

- [gorilla/mux](https://github.com/gorilla/mux) - HTTPルーター
- [rs/cors](https://github.com/rs/cors) - CORS対応
- [golang.org/x/crypto](https://pkg.go.dev/golang.org/x/crypto) - パスワードハッシュ化（bcrypt）

## 🔗 Next.jsアプリケーションとの連携

Next.jsアプリケーションから以下のようにAPIを呼び出せます：

```typescript
// ユーザー登録
const registerUser = async (username: string, email: string, password: string) => {
  const response = await fetch('http://localhost:8080/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  });
  const data = await response.json();
  
  if (data.success) {
    console.log('User registered:', data.data);
  } else {
    console.error('Error:', data.error.message);
  }
};

// 全ユーザー取得
const getAllUsers = async () => {
  const response = await fetch('http://localhost:8080/api/users');
  const data = await response.json();
  
  if (data.success) {
    console.log('Users:', data.data);
  }
};

// ID指定でユーザー取得
const getUserById = async (id: number) => {
  const response = await fetch(`http://localhost:8080/api/users?id=${id}`);
  const data = await response.json();
  
  if (data.success) {
    console.log('User:', data.data);
  }
};

// メールアドレスでユーザー取得
const getUserByEmail = async (email: string) => {
  const response = await fetch(`http://localhost:8080/api/users?email=${encodeURIComponent(email)}`);
  const data = await response.json();
  
  if (data.success) {
    console.log('User:', data.data);
  }
};

// ユーザー名でユーザー取得
const getUserByUsername = async (username: string) => {
  const response = await fetch(`http://localhost:8080/api/users?username=${username}`);
  const data = await response.json();
  
  if (data.success) {
    console.log('User:', data.data);
  }
};
```

## 📝 開発のヒント

### 新しいAPIエンドポイントの追加方法

1. **モデル定義** - `internal/model/` にデータ構造を追加
2. **リポジトリ** - `internal/repository/` にデータアクセス層を追加
3. **サービス** - `internal/service/` にビジネスロジックを追加
4. **ハンドラー** - `internal/handler/` にHTTPハンドラーを追加
5. **ルーティング** - `main.go` にルートを登録

### データベース連携

現在はインメモリストレージを使用していますが、MySQLと連携する場合：

1. `pkg/database/mysql.go` でDB接続を実装
2. `internal/repository/` でMySQLリポジトリを実装
3. `main.go` でリポジトリを切り替え

### 本番環境での注意点

- 環境変数を適切に設定
- パスワードのバリデーションを強化
- レート制限の実装
- ログ管理の強化

## 🐛 トラブルシューティング

### ポートが既に使用されている
```bash
# Windowsの場合
netstat -ano | findstr :8080
taskkill /PID <プロセスID> /F

# または、.envファイルでポートを変更
PORT=8081
```

### Dockerビルドエラー
```bash
# キャッシュをクリアして再ビルド
docker-compose build --no-cache go-service
```

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。
