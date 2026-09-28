# 技マスタ リファクタ TODO

2026-09-28 の模擬面談（設計・コードの読み合わせ）で見つかった指摘。機能がまとまったらリファクタ時に対応する。

## セキュリティ

- [ ] **認証チェックがない**
  - `nextjs/middleware.ts:4` の `PROTECTED_PATHS` が `/dashboard` のみで、`/trick-master` はログインなしで開ける
  - Server Action（`nextjs/_pages/trickMaster/*/actions/register*.ts`）も認証チェックなし。Server Action は公開 HTTP エンドポイントなので、画面の保護とは別に Action 内で `auth()` を確認する
- [ ] **内部エラー文をそのままクライアントに返している**
  - `go-service/internal/trick/handler/*_handler.go` で `response.BadRequest(w, err.Error())` としているため、MySQL のエラー文（テーブル名・カラム名入り）がそのまま返る

## データ整合性

- [ ] **技名の重複登録を防げない**
  - `go-service/internal/trick/repository_trick.go:37` で「同名があるか」を SELECT してから INSERT しているが、DB に `UNIQUE` 制約がない
  - 登録ボタンのダブルクリックなど、同時リクエストで両方ともチェックを通過して同名が2件できる
  - トランザクションで囲むだけでは防げない（REPEATABLE READ の通常 SELECT はロックを取らない）
  - 対応: `UNIQUE (equipment_id, name, ...)` を付ける。論理削除（`is_invalid`）と両立させるため、削除済み行がユニーク判定から外れる形にする（例: 有効行のみ値が入る生成列をキーに含める）
  - 道具・カテゴリ・状態の各マスタも同じ構造なので合わせて見直す
- [ ] **チェックから INSERT までの間に参照先が論理削除されうる**
  - `go-service/internal/trick/service/trick_service.go:35-` の存在チェックと `Create` がトランザクション外
  - 論理削除は外部キーでは検出できないため、削除済みの状態・カテゴリを参照する技が登録されうる
  - 対応: トランザクション内で親行を `SELECT ... FOR SHARE` でロックしてから INSERT
- [ ] **`Transaction` の Commit エラーが呼び出し元に返らない**
  - `go-service/pkg/database/executor.go:25-43`。`err` が名前付き戻り値ではないため、`defer` 内の `err = tx.Commit()`（38行目）の結果は `return err`（43行目）の評価後に代入され、捨てられる
  - 対応: 戻り値を `(err error)` の名前付きにする

## バリデーション

- [ ] **Go 側のチェックが Zod より緩い**（Go を直接叩くと不正な値が入る）
  - `go-service/internal/trick/types.go:127` `Description` に文字数上限がない（Zod は 1000 文字、DB は `TEXT`）
  - `go-service/internal/trick/types.go:130` `VideoURL` に URL 形式チェックがない。値は `nextjs/app/trick-master/tricks/[id]/page.tsx:57` で `<a href>` にそのまま入る
  - ID が Zod は `positive`、Go は `required`（0以外）で `-1` が通る（後段の存在チェックで弾かれるので実害なし）
- [ ] **フロントと Go のルールがずれていく問題への対策**
  - 案1: OpenAPI を正として Go（oapi-codegen）と TS/Zod（orval など）を生成
  - 案2: Go を正とし、項目ごとのエラーを返してフォームに表示する（現状は `_form` 1個にまとめている）

## エラーハンドリング

- [ ] **エラーを文字列比較で判定している**
  - `go-service/internal/trick/handler/trick_handler.go:36` の `err.Error() == "trick name already exists"` など（各マスタの handler 共通）
  - メッセージを変えると黙って 409 → 400 になる
  - 対応: `var ErrTrickNameExists = errors.New(...)` のようなセンチネルエラーを定義し `errors.Is` で判定
- [ ] **想定外のエラーまで全部 400 になる**
  - DB 接続エラーなどのサーバー側の失敗は 500 にする

## フロントエンド

- [ ] **`useEffect` での fetch を TanStack Query に置き換える**
  - `nextjs/_pages/trickMaster/trick/hooks/useEquipmentScopedOptions.ts`
  - 現状の問題: `.catch` がなく、取得に失敗すると前の道具の選択肢が残る（そのまま登録すると Go 側で "does not belong" エラー）／キャッシュなし／登録タブと検索タブで同じデータを別々に取得／ローディング・エラー状態なし
  - `cancelled` フラグは古いレスポンスによる上書き（レースコンディション）対策で、リクエスト自体は止めていない
- [ ] **`TrickForm` に stories がない**
  - `nextjs/_pages/trickMaster/trick/components/TrickForm/` に `*.stories.tsx` がない（CLAUDE.md のルール違反）。技マスタで stories があるのは `TrickSearch` のみ
  - 道具・カテゴリ・状態のフォームも同様
- [ ] **Container → View の props がフラットで、項目追加時の修正箇所が多い**
  - Container 層自体は残す（複数 hook の合成・権限による出し分け・View 向けのデータ整形など、今後のロジックの置き場所として維持）
  - 問題は `TrickFormContainer.tsx:39-` が `TrickForm` に **23個のフラットな props** を渡していること（`TrickForm.tsx:22` の型定義も同様）
    - 内訳: 入力8項目 × 値 + `onXxxChange` = 16、選択肢配列 3、`errors` / `isSubmitting` / `isSuccess` / `onSubmit` = 4
    - `useTrickForm` も項目ごとに `useState` が8個あり、全体が「1項目 = 1 state = 2 props」の構造
    - 項目追加のたびに hook・Container・View・型の4か所を修正する必要がある
  - 単純にオブジェクト1つにまとめて渡す方法にも弱点がある
    - 毎回新しいオブジェクトを作ると `React.memo` が効かなくなる
    - View が hook の戻り値の構造に依存し、Container で分けた意味が薄れる
    - Storybook の args がオブジェクトになり、Controls で1項目ずつ操作しにくい
  - 対応案（どちらか）
    - 案1: `values` + `onChange(field, value)` にまとめる。props は `values` / `errors` / `onChange` / `onSubmit` 程度になり、項目を増やしても props の型は変わらない
    - 案2: react-hook-form + zodResolver にして、`control` か `register` を View に渡す。状態が hook 内に閉じ、再レンダリングも入力した項目だけで済む。クライアント側のリアルタイムバリデーション（現状なし）も同時に入る
