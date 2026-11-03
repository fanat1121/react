import type { Metadata } from 'next';
import React from 'react';
import { DemoNav, ShapeSketchContainer } from '@/_pages/jevDemo';

export const metadata: Metadata = {
  title: 'Jev 図形判定デモ',
  description: '手描きした図形が丸・三角・四角のどれに見えるかを Jev で判定するデモ',
};

const JevShapePage: React.FC = () => {
  return (
    <div className="p-32">
      <h1 className="mb-24">Jev 図形判定デモ</h1>
      <div className="mb-24">
        <DemoNav current="/jev-demo/shapes" />
      </div>
      <ShapeSketchContainer />
    </div>
  );
};

export default JevShapePage;
