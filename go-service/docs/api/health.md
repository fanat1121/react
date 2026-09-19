# GET /api/health

サービスの死活監視用。

## レスポンス例 (200)

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "service": "go-service",
    "time": "2026-09-18T12:00:00Z"
  }
}
```

## 実装

`internal/health/handler.go`
