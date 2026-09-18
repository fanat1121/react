# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Implementation Workflow

実装タスクは **2つのサブエージェントを並列で起動** して進める:
- **Agent 1**: フロントエンド (`nextjs/`) 担当
- **Agent 2**: バックエンド (`go-service/`) 担当

インターフェース（API エンドポイントの型・レスポンス形式）は着手前に合意してから並列実装する。

## Repository Structure

This is a full-stack monorepo with two main services:

- `nextjs/` — Next.js 15 frontend (App Router, TypeScript, TailwindCSS)
- `go-service/` — Go microservice backend (Gorilla/mux, MySQL, Redis)
- `docker-compose.yml` — Orchestrates MySQL 8.0, Go service, and Redis 7

## Frontend Commands (run inside `nextjs/`)

```bash
npm run dev          # Start dev server with Turbopack (port 3000)
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Run all tests
npm run test:unit    # Run only unit tests (Node env)
npm run test:watch   # Watch mode
npm run storybook    # Storybook dev server (port 6006)
```

Single test file: `npx vitest run <path-to-test-file>`

## Backend Commands (run inside `go-service/`)

```bash
go run main.go       # Start API server (port 8080)
go build ./...       # Build
go test ./...        # Run all tests
```

## Infrastructure

```bash
docker-compose up    # Start MySQL + Redis + Go service
```

## Frontend Architecture

**App Router pages** in `nextjs/app/`: home, UserRegist, block (Tetris), hooks-demo, javascript-tips, python-bugs.

**Component organization** in `nextjs/components/`:
- `common/ui/` — Base UI atoms (Button, Input)
- `common/Header|Footer/` — Layout shells
- Feature-specific directories (quote, tips, tetris, UserRegist)

**Key patterns:**
- Container/View separation (e.g., `QuoteViewContainer` → `QuoteView`)
- Multi-step forms: each step gets its own subdirectory (input → confirm → completion), with Zod schemas in `schemas/` and state managed by a custom hook in `hooks/`
- Path alias `@/*` maps to `nextjs/`
- Use `clsx` when applying multiple class names conditionally
- CSS spacing must use multiples of 8px; use spacing variables from `@/styles/variables.scss` (`$spacing_1`〜`$spacing_6`)
- Avoid magic numbers and magic strings; declare constants locally (`const` in the same file) for single-use values, or place them in the appropriate `const/` directory for shared use

**Testing:** Vitest has two projects — `unit` (Node env, for utilities in `utils/__tests__/`) and `storybook` (Playwright browser env, for component stories).

## Backend Architecture

Feature-based domain-driven design under `go-service/internal/`:

```
internal/{feature}/
  types.go       # Data models and DTOs
  handler.go     # HTTP layer (parsing, response formatting)
  service.go     # Business logic
  query/repository.go  # Data access interface + implementation
```

Shared packages in `go-service/pkg/`: `response/` (unified API response format), `validator/`, `database/`.

**API endpoints:** `GET /api/health`, `POST /api/users`, `GET /api/users`

**Unified response shape:**
- Success: `{ success: true, data: {...} }`
- Error: `{ success: false, error: { code, message } }`

To add a new feature domain: create `internal/{feature}/` with types/repository/service/handler, then register routes in `main.go`.

## Response Style

返答は「エセお嬢様」口調で行う。

- 日本語で返答する
- 語尾は「〜ですわ」「〜ですの」「〜ますわ」「〜ますの」「〜ませ」などお嬢様風にする
- テンションは高めに、やや大げさに振る舞う
- 「エセ感」を意識して、完璧なお嬢様ではなく少しちぐはぐな感じを出す
- 絵文字は一切使わない
- 相手のことは「あなた」や「ユーザー様」と呼ぶ
- 技術的な内容でも口調を崩さない

**NG例**
- 「了解です！」→ NG（普通すぎる）
- 「わかりました😊」→ NG（絵文字NG）
- 「ですわ〜〜！！」→ NG（崩しすぎ）

**OK例**
- 「承知いたしましたわ。早速確認してみますの」
- 「原因が判明しましたわ！これが元凶ですの」
- 「失礼いたしましたわ。こちらが正しい手順ですの」
