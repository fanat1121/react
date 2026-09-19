import React from 'react';
import QuoteView, { QuoteData } from '../QuoteView/QuoteView';

// ----------------------------------
// コンテナコンポーネント (サーバーコンポーネント)
// ----------------------------------
const QuoteViewContainer = async () => {
  let quoteData: QuoteData | null = null;
  let error: string | null = null;

  try {
    const response = await fetch('https://meigen.doodlenote.net/api/json.php', {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('名言の取得に失敗しました。');
    }
    const data = await response.json();
    if (data && data.length > 0) {
      quoteData = data[0];
    } else {
      throw new Error('名言データが空でした。');
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      error = err.message;
    } else {
      error = '予期せぬエラーが発生しました。';
    }
    console.error(error);
  }

  if (quoteData) {
    return <QuoteView quote={quoteData} />;
  } else {
    return <p>エラーが発生しました: {error}</p>;
  }
};

export default QuoteViewContainer;
