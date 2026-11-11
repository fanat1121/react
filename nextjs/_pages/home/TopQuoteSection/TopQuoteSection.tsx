import React from 'react';
import styles from './TopQuoteSection.module.scss';
import { QuoteViewContainer } from '@/_pages/quote';
import { NekoImageContainer } from '@/_pages/nekoImage';

// TOP の「本日の名言」と「本日の一枚」を横並びにする（狭い画面では縦に積む）
export const TopQuoteSection = () => (
  <div className={styles.topQuoteSection}>
    <div className={styles.quote}>
      <QuoteViewContainer />
    </div>
    <div className={styles.image}>
      <NekoImageContainer />
    </div>
  </div>
);
