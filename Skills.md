# Skills — Development Workflow Hub

開発ワークフローのエントリポイントですの。各フェーズのreferencesをたどって進めてください。

---

## Phase 1: 設計・合意

**References**
- @CLAUDE.md — リポジトリ構造・アーキテクチャ全体
- @go-service/internal/ — 既存バックエンドドメイン構造
- @nextjs/app/ — 既存ルーティング構造（page.tsx/layout.tsx/route.tsのみ）
- @nextjs/_pages/ — 既存フロントエンド機能構造（ルートごとのcomponents/hooks/const）

**チェックリスト**
- [ ] 実装するAPIエンドポイントのパス・メソッド・request/responseの型を合意する
- [ ] フロントエンド・バックエンド双方への影響範囲を確認する

---

## Phase 2: 並列実装

**References**
- @CLAUDE.md#implementation-workflow — サブエージェント並列起動の指針
- @nextjs/_pages/ — 機能固有のcomponents/hooks/const構造（フロントエンドAgent参照。新規機能は`_pages/<feature>/`配下に作成する）
- @nextjs/components/common/ — 共通UI部品（複数機能で使い回すもののみ）
- @go-service/pkg/ — 共有パッケージ（バックエンドAgent参照）
- @go-service/docs/api/README.md — APIエンドポイント仕様書（バックエンドAgentが変更時に更新）

**チェックリスト**
- [ ] Agent 1（フロントエンド）を起動
- [ ] Agent 2（バックエンド）を起動
- [ ] 両Agentに Phase 1 で合意したインターフェースを渡す
- [ ] go-service（ハンドラー・ルーティング・リクエスト/レスポンス型）を変更した場合、`go-service/docs/api/` 配下の該当mdを合わせて更新する

---

## Phase 3: テスト

**References**
- @nextjs/vitest.config.ts — フロントエンドテスト設定
- @go-service/ — バックエンドテスト（`go test ./...`）

**チェックリスト**
- [ ] `npm run test:unit` — フロントエンドユニットテスト
- [ ] `go test ./...` — バックエンドテスト
- [ ] 既存機能へのリグレッションがないか確認

---

## Phase 4: PR作成

**References**
- @CLAUDE.md — コミット・PR規約

**チェックリスト**
- [ ] 変更ファイルを確認（`git diff`）
- [ ] PR title・summary を作成
- [ ] `gh pr create` で提出
