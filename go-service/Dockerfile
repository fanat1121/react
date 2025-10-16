# ビルドステージ
FROM golang:1.21-alpine AS builder

WORKDIR /app

# 依存関係のコピーとダウンロード
COPY go.mod go.sum* ./
RUN go mod download && go mod tidy

# ソースコードのコピー
COPY . .

# 依存関係を再整理してビルド
RUN go mod tidy && CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# 実行ステージ
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# ビルドステージから実行ファイルをコピー
COPY --from=builder /app/main .

EXPOSE 8080

CMD ["./main"]
