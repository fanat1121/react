import type { Metadata } from 'next';
import React from 'react';
import { DemoNav, NoulSketchContainer } from '@/_pages/jevDemo';

export const metadata: Metadata = {
  title: 'Jev Noul デモ',
  description: '手描きした絵について入力した文が正しいかを、Jev の Noul 質問で yes の確率として判定するデモ',
};

const JevNoulPage: React.FC = () => {
  return (
    <div className="p-32">
      <h1 className="mb-24">Jev Noul デモ</h1>
      <div className="mb-24">
        <DemoNav current="/jev-demo/noul" />
      </div>
      <NoulSketchContainer />
    </div>
  );
};

export default JevNoulPage;
