import type { Metadata } from 'next';
import React from 'react';
import { DemoNav, BoxSketchContainer } from '@/_pages/jevDemo';

export const metadata: Metadata = {
  title: 'Jev Box デモ',
  description: '手描きした絵の中で、入力したものがどこにあるかを Jev の Box 質問で探すデモ',
};

const JevBoxPage: React.FC = () => {
  return (
    <div className="p-32">
      <h1 className="mb-24">Jev Box デモ</h1>
      <div className="mb-24">
        <DemoNav current="/jev-demo/box" />
      </div>
      <BoxSketchContainer />
    </div>
  );
};

export default JevBoxPage;
