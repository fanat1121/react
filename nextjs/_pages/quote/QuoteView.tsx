import React from 'react';
import styles from './QuoteView.module.scss';

const TITLE = '本日の名言';
const AUTHOR_FALLBACK = '作者不明';
const ERROR_PREFIX = '名言を取得できませんでした: ';

// 名言のデータ型
export interface QuoteData {
  meigen: string;
  auther: string;
}

type QuoteViewProps = {
  quote: QuoteData | null;
  // quote が null のときに出すメッセージ
  errorMessage?: string;
};

// ----------------------------------
// UIコンポーネント
// 取得に失敗したときも同じカードの中にメッセージを出し、成功時と余白を揃える
// ----------------------------------
export const QuoteView: React.FC<QuoteViewProps> = ({ quote, errorMessage }) => {
  return (
    <section className={styles.quoteView}>
      <h4 className={styles.title}>{TITLE}</h4>
      {quote ? (
        <blockquote className={styles.blockquote}>
          <p className={styles.text}>&quot;{quote.meigen}&quot;</p>
          <footer className={styles.author}>— {quote.auther || AUTHOR_FALLBACK}</footer>
        </blockquote>
      ) : (
        <p className={styles.error} role="alert">
          {ERROR_PREFIX}
          {errorMessage}
        </p>
      )}
    </section>
  );
};
