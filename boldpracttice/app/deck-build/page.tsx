import type { Metadata } from 'next';
import React from 'react';
import { DeckBuildContainer } from '@/components/deckBuild';

export const metadata: Metadata = {
  title: 'リージェント デッキビルド | Bold Practice',
  description: 'スレスパ2 リージェントの全カードから所持枚数を管理し、総威力・総ブロック等を自動集計するデッキビルドツール',
};

// -----------------------------------
// リージェント デッキビルド画面 (サーバーコンポーネント)
// -----------------------------------
const DeckBuildPage = () => {
  return (
    <div>
      <DeckBuildContainer />
    </div>
  );
};

export default DeckBuildPage;
