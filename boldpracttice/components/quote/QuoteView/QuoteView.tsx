import React from 'react';

// 名言のデータ型
export interface QuoteData {
  meigen: string;
  auther: string;
}

// ----------------------------------
// UIコンポーネント
// ----------------------------------
const QuoteView: React.FC<{ quote: QuoteData }> = ({ quote }) => {
  return (
    <div style={{ border: '1px solid #ddd', padding: '15px', margin: '20px 0', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
      <h4>本日の名言</h4>
      <blockquote style={{ margin: 0 }}>
        <p style={{ fontStyle: 'italic' }}>&quot;{quote.meigen}&quot;</p>
        <footer style={{ textAlign: 'right', marginTop: '10px' }}>— {quote.auther || '作者不明'}</footer>
      </blockquote>
    </div>
  );
};

export default QuoteView;
