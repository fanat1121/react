import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { TopQuoteSectionContainer } from '@/_pages/home';

export const metadata: Metadata = {
  title: 'Bold Practice',
  description: 'Bold Practiceのホームページ',
};

// ----------------------------------- 
// ホーム画面 (サーバーコンポーネント)
// -----------------------------------
const Home = () => {
  return (
    <div>
      <div id="content-wrapper">
        <main>
          <div id="inner">
          <TopQuoteSectionContainer />
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
                <li>
                  <a href="/deck-tracker">スレスパ2 リージェントデッキトラッカー</a>
                </li>
                <li>
                  <a href="/deck-build">スレスパ2 リージェントデッキビルド</a>
                </li>
                <li>
                  <Link href="/trick-master">技マスタ登録</Link>
                </li>
                <li>
                  <Link href="/trick-master/tricks">技検索</Link>
                </li>
                <li>
                  <Link href="/jev-demo">Jev 動画判定デモ</Link>
                </li>
                <li>
                  <Link href="/jev-demo/shapes">Jev 図形判定デモ</Link>
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

