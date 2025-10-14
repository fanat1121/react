# MySQL Docker Compose セットアップ

## 起動方法

```bash
# MySQLコンテナを起動
docker-compose up -d

# ログを確認
docker-compose logs -f mysql

# 起動確認
docker-compose ps
```

## 接続方法

### コマンドラインから接続
```bash
# rootユーザーで接続
docker-compose exec mysql mysql -u root -prootpassword

# アプリケーションユーザーで接続
docker-compose exec mysql mysql -u myapp_user -pmyapp_password myapp_db
```

### アプリケーションから接続
```
Host: localhost
Port: 3306
Database: myapp_db
Username: myapp_user
Password: myapp_password
```

## 停止・削除

```bash
# コンテナを停止
docker-compose stop

# コンテナを停止して削除
docker-compose down

# ボリュームも含めて完全削除（データも消えますわ！）
docker-compose down -v
```

## 初期化SQLについて

`./docker/mysql/init/` ディレクトリ内のSQLファイルは、
コンテナ初回起動時に自動的に実行されますわ。
ファイル名の昇順で実行されますので、番号を付けて管理すると良いですわよ！

## データの永続化

MySQLのデータは `mysql_data` という名前付きボリュームに保存されますので、
コンテナを削除してもデータは保持されますわ。
