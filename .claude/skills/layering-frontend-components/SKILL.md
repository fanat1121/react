---
name: layering-frontend-components
description: Use when creating or reviewing React/Next.js components under nextjs/ — deciding how to split a feature into Server/Client/UI layers, or choosing between `interface` and `type` for props.
---

# Layering Frontend Components

## Overview

`nextjs/` の各機能はContainer/Presentationalパターンを、Server/Client/UIの3層に落とし込んで実装するのです。すべての層が常に必要なわけではなく、機能に不要な層は省略するのです。

## 型定義: `interface` 禁止、`type` のみ使用

Props・戻り値・その他すべての型定義は `type` エイリアスで書くのです。`interface` は使用禁止なのです。

```ts
// ❌ NG
interface CounterFieldProps {
  label: string;
  value: number;
}

// ✅ OK
type CounterFieldProps = {
  label: string;
  value: number;
};
```

継承・拡張が必要な場合も交差型（`&`）で表現するのです。

```ts
type BaseButtonProps = { children: React.ReactNode };
type ButtonAsLink = BaseButtonProps & { href: string };
```

既存ファイル（Button.tsx / Input.tsx など）は `interface` のまま残っているが、新規作成・大幅改修時は `type` へ揃えるのです。既存コードを触っていないだけで一括置換する必要はないのです。

## エクスポート: `export default` 禁止、`export { default as X }` 禁止

コンポーネント・フック・定数はすべて named export で書くのです。`export default` および re-export 時の `as` によるリネームは禁止なのです。

```ts
// ❌ NG
const QuoteView: React.FC<Props> = (props) => { ... };
export default QuoteView;

// index.ts
export { default as QuoteView } from './QuoteView';
```

```ts
// ✅ OK
export const QuoteView: React.FC<Props> = (props) => { ... };

// index.ts
export { QuoteView } from './QuoteView';
```

理由: `export default` は import 側で任意の名前を付けられてしまい、`as` によるリネームは元の宣言名とバレル経由の名前がずれる温床になるのです。named export に統一することで、grep一発でどこからでも同じ名前を追えるのです。

**例外**: Storybook の CSF 形式が `export default meta` を要求するため、`*.stories.tsx` と `*.mdx` はこの禁止の対象外なのです。

## 3層構成

| 層 | 役割 | ディレクティブ | 配置先の例 |
|---|---|---|---|
| **Server** | データ取得・非同期処理。ページのエントリポイント | なし（`async` サーバーコンポーネント可） | `app/**/page.tsx`, `FooContainer.tsx`（サーバーfetch型） |
| **Client** | 状態管理・イベントハンドリング。UI層に値とハンドラを渡すだけ | `'use client'` | `FooContainer.tsx`（useState/useCounter等を保持） |
| **UI** | 純粋な表示。stateを持たずpropsのみで描画 | なし（Client層から呼ばれる限り不要） | `components/common/ui/*`, `Foo.tsx`（View） |

**判断フロー**

- 非同期データ取得が必要 → Server層（`async` コンポーネント、例: `QuoteViewContainer`）
- クリック等のイベント・ローカルstateが必要 → Client層（`'use client'` + Container、例: `DeckTrackerContainer`）
- 上記どちらも不要（静的表示のみ） → UI層のみで完結してよい。Server/Containerを無理に作らない
- 複数箇所で使い回すUI部品 → `components/common/ui/` に切り出す

## クイックリファレンス

- Server/Client層のファイル名は `〇〇Container.tsx`
- UI(View)層のファイル名は `View` 接尾辞を付けない（例: `DeckTracker.tsx`、`DeckTrackerView.tsx` にしない）
- UI層はstateを持たない。増減・送信等のロジックは受け取ったハンドラをそのまま呼ぶだけ
- 汎用UI部品（ボタン・数値表示など）は `components/common/ui/` に配置し、機能固有コンポーネントから参照する

## よくある間違い

- UI層に `useState` を書いてしまう → Client層(Container)に移動するのです
- 静的ページなのにContainerを作ってしまう → 不要な層は省略するのです
- Props型を `interface` で定義してしまう → `type` に直すのです
