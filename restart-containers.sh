#!/bin/bash

# Dockerコンテナ再起動スクリプト（WSL用）

echo "========================================="
echo "Dockerコンテナを再起動します"
echo "========================================="

# コンテナ再起動
echo ""
echo "コンテナを再起動中..."
docker-compose restart

# 起動待機
echo ""
echo "起動を待機中..."
sleep 3

# コンテナ状態確認
echo ""
echo "コンテナ状態確認"
docker-compose ps

echo ""
echo "========================================="
echo "再起動完了"
echo "========================================="
echo ""
echo "MySQLログ確認: docker-compose logs mysql"
echo "Goサービスログ確認: docker-compose logs go-service"
