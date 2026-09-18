import type { Metadata } from 'next';
import React from 'react';
import { DeckTrackerContainer } from '@/components/deckTracker';

export const metadata: Metadata = {
  title: 'スレスパ2 リージェントデッキトラッカー | Bold Practice',
  description: 'スレスパ2のデッキ構築支援ツール',
};

// -----------------------------------
// スレスパ2 リージェントデッキトラッカー画面 (サーバーコンポーネント)
// -----------------------------------
const DeckTrackerPage = () => {
  return (
    <div>
      <DeckTrackerContainer />
    </div>
  );
};

export default DeckTrackerPage;
