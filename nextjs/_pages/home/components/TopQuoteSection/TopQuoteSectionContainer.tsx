import React, { Suspense } from 'react';
import { TopQuoteSection } from './TopQuoteSection';
import { QuoteViewContainer } from '@/_pages/quote';
import { NekoImageContainer } from '../NekoImage/NekoImageContainer';

// ----------------------------------
// コンテナコンポーネント (サーバーコンポーネント)
// 画像は飾りなので Suspense で包み、取得を待たずにページを返す（届いたら後から差し込まれる）
// ----------------------------------
export const TopQuoteSectionContainer = () => (
  <TopQuoteSection
    quote={<QuoteViewContainer />}
    image={
      <Suspense fallback={null}>
        <NekoImageContainer />
      </Suspense>
    }
  />
);
