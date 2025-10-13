import React from 'react';
import { QuoteViewContainer } from '@/components/quote';

// ----------------------------------- 
// ホーム画面 (サーバーコンポーネント)
// -----------------------------------
const Home = () => {
  return (
    <div>
      <div id="content-wrapper">
        <main>
          <div id="inner">
          <QuoteViewContainer />
            <h2>記事ページ見出し・大</h2>
            <p>文章あれこれ</p>
            <h3>記事ページ見出し・中</h3>
            <p>文章あれこれ</p>
            <h4>記事ページ見出し・小</h4>
            <p>文章あれこれ</p>
          </div>
        </main>
        <aside>
          <div id="middle-inner">
            <div className="side-title">menu</div>
            <div className="side">
              <ul>
                <li>
                  <a href="/javascript-tips">JavaScript Tips</a>
                </li>
                <li>
                  <a href="/python-bugs">Python Bugs</a>
                </li>
                <li>
                  <a href="/hooks-demo">ドロップ期待値計算機</a>
                </li>
                <li>
                  <a href="/block">テトリス</a>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Home;

