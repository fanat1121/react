import type { Metadata } from 'next';
import React from 'react';
import { DemoNav, JevDemoContainer } from '@/_pages/jevDemo';
import { fetchTrickCandidates } from '@/_pages/jevDemo/api/fetchTrickCandidates';

export const metadata: Metadata = {
  title: 'Jev 動画判定デモ',
  description: 'アップロードしたディアボロ動画が、技マスタのどの技にどれくらいそれらしいかを Jev で判定するデモ',
};

const JevDemoPage: React.FC = async () => {
  const { candidates, isFallback } = await fetchTrickCandidates();

  return (
    <div className="p-32">
      <h1 className="mb-24">Jev 動画判定デモ</h1>
      <div className="mb-24">
        <DemoNav current="/jev-demo" />
      </div>
      <JevDemoContainer candidates={candidates} isFallbackCandidates={isFallback} />
    </div>
  );
};

export default JevDemoPage;
