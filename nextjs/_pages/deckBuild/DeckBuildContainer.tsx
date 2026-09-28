'use client';

import React, { useState } from 'react';
import { useDeckBuild } from './hooks/useDeckBuild';
import { DeckBuild } from './DeckBuild';

/**
 * Client層。useDeckBuildでカード一覧ごとの所持枚数・ごみ札・イレギュラーカード・
 * 総威力/総ブロック調整値・集計サマリを保持し（すべてlocalStorageに永続化）、
 * カード名検索クエリのstateとあわせてDeckBuild(UI層)へ値とハンドラを渡す。
 */
export const DeckBuildContainer: React.FC = () => {
  const {
    regent,
    colorless,
    ancient,
    junk,
    irregular,
    totalPowerAdjustment,
    totalBlockAdjustment,
    resetAll,
    summary,
  } = useDeckBuild();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <DeckBuild
      summary={summary}
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
      onResetAll={resetAll}
      regent={{ counts: regent.counts, onChange: regent.change }}
      colorless={{ counts: colorless.counts, onChange: colorless.change }}
      ancient={{ counts: ancient.counts, onChange: ancient.change }}
      junk={junk}
      irregular={irregular}
      totalPowerAdjustment={totalPowerAdjustment}
      totalBlockAdjustment={totalBlockAdjustment}
    />
  );
};
