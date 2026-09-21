import React from 'react';
import { notFound } from 'next/navigation';
import type { TrickDetailResponse } from '@/_pages/trickMaster/types';

const GO_API_URL = process.env.GO_API_URL ?? 'http://localhost:8080';

type TrickDetailPageProps = {
  params: Promise<{ id: string }>;
};

async function fetchTrick(id: string): Promise<TrickDetailResponse | null> {
  try {
    const response = await fetch(`${GO_API_URL}/api/tricks/${id}`, { cache: 'no-store' });
    const json = await response.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

const TrickDetailPage: React.FC<TrickDetailPageProps> = async ({ params }) => {
  const { id } = await params;
  const trick = await fetchTrick(id);

  if (!trick) {
    notFound();
  }

  return (
    <div className="p-32">
      <h1 className="mb-24">{trick.name}</h1>

      <dl>
        <dt>道具</dt>
        <dd className="mb-16">{trick.equipment_name}</dd>

        <dt>カテゴリ</dt>
        <dd className="mb-16">{trick.category_name}</dd>

        <dt>開始状態</dt>
        <dd className="mb-16">{trick.start_state_name}</dd>

        <dt>終了状態</dt>
        <dd className="mb-16">{trick.end_state_name}</dd>

        {trick.description && (
          <>
            <dt>説明</dt>
            <dd className="mb-16">{trick.description}</dd>
          </>
        )}

        {trick.video_url && (
          <>
            <dt>動画URL</dt>
            <dd className="mb-16">
              <a href={trick.video_url} target="_blank" rel="noopener noreferrer">
                {trick.video_url}
              </a>
            </dd>
          </>
        )}

        <dt>想定所要時間</dt>
        <dd className="mb-16">{trick.estimated_duration_seconds}秒</dd>
      </dl>
    </div>
  );
};

export default TrickDetailPage;
