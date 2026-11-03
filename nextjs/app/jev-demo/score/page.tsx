import type { Metadata } from 'next';
import React from 'react';
import { DemoNav, ScoreSketchContainer } from '@/_pages/jevDemo';

export const metadata: Metadata = {
  title: 'Jev Score デモ',
  description: '手描きした丸がどれだけ円に近いかを、Jev の Score 質問で段階として判定するデモ',
};

const JevScorePage: React.FC = () => {
  return (
    <div className="p-32">
      <h1 className="mb-24">Jev Score デモ</h1>
      <div className="mb-24">
        <DemoNav current="/jev-demo/score" />
      </div>
      <ScoreSketchContainer />
    </div>
  );
};

export default JevScorePage;
