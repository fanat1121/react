import React from 'react';
import styles from './TopQuoteSection.module.scss';

type TopQuoteSectionProps = {
  quote: React.ReactNode;
  // 画像カード。null（取得失敗・読み込み中）なら何も置かず、名言が横幅を使い切る
  image?: React.ReactNode;
};

// TOP の「本日の名言」と「本日の一枚」を横並びにする（狭い画面では縦に積む）
export const TopQuoteSection: React.FC<TopQuoteSectionProps> = ({ quote, image }) => (
  <div className={styles.topQuoteSection} data-testid="top-quote-section">
    <div className={styles.quote}>{quote}</div>
    {image}
  </div>
);
