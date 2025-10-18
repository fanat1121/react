#!/bin/bash

# ユーザー登録API テストスクリプト（WSL用）

echo "========================================="
echo "ユーザー登録APIテスト"
echo "========================================="

# ユーザー登録
echo ""
echo "1. ユーザー登録"
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "user_name": "山田太郎",
    "user_login_id": "yamada",
    "email": "yamada@example.com",
    "password": "password123"
  }' | jq .

echo ""
echo "========================================="

# 2人目のユーザー登録
echo ""
echo "2. 2人目のユーザー登録"
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "user_name": "佐藤花子",
    "user_login_id": "sato",
    "email": "sato@example.com",
    "password": "password456"
  }' | jq .

echo ""
echo "========================================="

# 全ユーザー取得
echo ""
echo "3. 全ユーザー取得"
curl -X GET http://localhost:8080/api/users | jq .

echo ""
echo "========================================="

# user_code指定で取得
echo ""
echo "4. user_code指定でユーザー取得 (user_code=1)"
curl -X GET "http://localhost:8080/api/users?user_code=1" | jq .

echo ""
echo "========================================="

# メールアドレスで検索
echo ""
echo "5. メールアドレスでユーザー検索"
curl -X POST http://localhost:8080/api/users/search \
  -H "Content-Type: application/json" \
  -d '{
    "email": "yamada@example.com"
  }' | jq .

echo ""
echo "========================================="

# ログインIDで検索
echo ""
echo "6. ログインIDでユーザー検索"
curl -X POST http://localhost:8080/api/users/search \
  -H "Content-Type: application/json" \
  -d '{
    "user_login_id": "yamada"
  }' | jq .

echo ""
echo "========================================="

# ユーザー削除
echo ""
echo "7. ユーザー削除 (ID=2)"
curl -X DELETE http://localhost:8080/api/users/2 | jq .

echo ""
echo "========================================="

# 削除後の全ユーザー取得
echo ""
echo "8. 削除後の全ユーザー取得"
curl -X GET http://localhost:8080/api/users | jq .

echo ""
echo "========================================="
echo "テスト完了"
echo "========================================="
