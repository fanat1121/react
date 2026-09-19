'use client';

import React, { useState } from 'react';
import { useDeckBuild } from './hooks/useDeckBuild';
import { DeckBuild } from './DeckBuild';

/**
 * Client層。useDeckBuildでリージェント専用カード・無色カード・エンシェント入手カードの
 * 所持枚数（無印/+版）・ごみ札枚数・イレギュラーカード枚数・総威力/総ブロック調整値・
 * 集計サマリを保持し（すべてlocalStorageに永続化）、カード名検索クエリのstateとあわせて
 * DeckBuild(UI層)へ値とハンドラを渡す。
 */
export const DeckBuildContainer: React.FC = () => {
  const {
    counts,
    colorlessCounts,
    ancientCounts,
    junkCount,
    irregularAttack,
    irregularSkill,
    irregularPower,
    totalPowerAdjustment,
    totalBlockAdjustment,
    incrementBase,
    decrementBase,
    incrementPlus,
    decrementPlus,
    incrementColorlessBase,
    decrementColorlessBase,
    incrementColorlessPlus,
    decrementColorlessPlus,
    incrementAncientBase,
    decrementAncientBase,
    incrementAncientPlus,
    decrementAncientPlus,
    incrementJunk,
    decrementJunk,
    resetAll,
    summary,
  } = useDeckBuild();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <DeckBuild
      counts={counts}
      colorlessCounts={colorlessCounts}
      ancientCounts={ancientCounts}
      junkCount={junkCount}
      irregularAttack={irregularAttack}
      irregularSkill={irregularSkill}
      irregularPower={irregularPower}
      totalPowerAdjustment={totalPowerAdjustment}
      totalBlockAdjustment={totalBlockAdjustment}
      summary={summary}
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
      onIncrementBase={incrementBase}
      onDecrementBase={decrementBase}
      onIncrementPlus={incrementPlus}
      onDecrementPlus={decrementPlus}
      onIncrementColorlessBase={incrementColorlessBase}
      onDecrementColorlessBase={decrementColorlessBase}
      onIncrementColorlessPlus={incrementColorlessPlus}
      onDecrementColorlessPlus={decrementColorlessPlus}
      onIncrementAncientBase={incrementAncientBase}
      onDecrementAncientBase={decrementAncientBase}
      onIncrementAncientPlus={incrementAncientPlus}
      onDecrementAncientPlus={decrementAncientPlus}
      onIncrementJunk={incrementJunk}
      onDecrementJunk={decrementJunk}
      onResetAll={resetAll}
    />
  );
};
