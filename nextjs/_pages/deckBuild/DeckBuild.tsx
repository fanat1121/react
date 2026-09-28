import React from 'react';
import type { UseCounterResult } from '@/hooks/useCounter';
import { CARDS } from './const/cards';
import { COLORLESS_CARDS } from './const/colorlessCards';
import { ANCIENT_CARDS } from './const/ancientCards';
import type { CardCounts, CardType, CardVariant, DeckBuildSummary } from './const/types';
import { filterCardsByQuery } from './utils/filterCardsByQuery';
import { DeckBuildHeader } from './components/DeckBuildHeader/DeckBuildHeader';
import { DeckSummaryPanel } from './components/DeckSummaryPanel/DeckSummaryPanel';
import { AdjustmentPanel } from './components/AdjustmentPanel/AdjustmentPanel';
import { ManualCardsSection } from './components/ManualCardsSection/ManualCardsSection';
import { CardCatalogSection } from './components/CardCatalogSection/CardCatalogSection';
import styles from './DeckBuild.module.scss';

/** 1つのカード一覧の所持枚数と、その増減ハンドラ */
export type CardCountsControl = {
  counts: CardCounts;
  onChange: (cardId: string, variant: CardVariant, delta: number) => void;
};

export type DeckBuildProps = {
  summary: DeckBuildSummary;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onResetAll: () => void;
  regent: CardCountsControl;
  colorless: CardCountsControl;
  ancient: CardCountsControl;
  junk: UseCounterResult;
  irregular: Record<CardType, UseCounterResult>;
  totalPowerAdjustment: UseCounterResult;
  totalBlockAdjustment: UseCounterResult;
};

/**
 * UI層。stateを持たず、Container層から受け取った値/ハンドラを
 * ヘッダー・集計パネル・手動調整・カード一覧の各コンポーネントへ橋渡しして描画する。
 */
export const DeckBuild: React.FC<DeckBuildProps> = ({
  summary,
  searchQuery,
  onSearchQueryChange,
  onResetAll,
  regent,
  colorless,
  ancient,
  junk,
  irregular,
  totalPowerAdjustment,
  totalBlockAdjustment,
}) => {
  return (
    <div className={styles.container}>
      <DeckBuildHeader
        searchQuery={searchQuery}
        onSearchQueryChange={onSearchQueryChange}
        onResetAll={onResetAll}
      />

      <DeckSummaryPanel summary={summary} />

      <AdjustmentPanel
        totalPower={summary.totalPower}
        totalBlock={summary.totalBlock}
        totalPowerAdjustment={totalPowerAdjustment}
        totalBlockAdjustment={totalBlockAdjustment}
      />

      <ManualCardsSection junk={junk} irregular={irregular} />

      <CardCatalogSection
        cards={filterCardsByQuery(CARDS, searchQuery)}
        counts={regent.counts}
        onChange={regent.onChange}
        countByType={summary.countByType}
      />

      <CardCatalogSection
        heading="無色カード（全クラス共通）"
        cards={filterCardsByQuery(COLORLESS_CARDS, searchQuery)}
        counts={colorless.counts}
        onChange={colorless.onChange}
      />

      <CardCatalogSection
        heading="エンシェント入手カード"
        cards={filterCardsByQuery(ANCIENT_CARDS, searchQuery)}
        counts={ancient.counts}
        onChange={ancient.onChange}
        hideEmptyTypes
      />
    </div>
  );
};
