import React from 'react';
import { CounterField } from '@/components/common/ui/CounterField';
import type { CardData } from './const/types';
import styles from './CardRow.module.scss';

export type CardRowProps = {
  card: CardData;
  baseCount: number;
  plusCount: number;
  onIncrementBase: () => void;
  onDecrementBase: () => void;
  onIncrementPlus: () => void;
  onDecrementPlus: () => void;
};

const formatCost = (energy: number | null, star: number | null): string => {
  const energyLabel = energy === null ? 'X' : String(energy);
  if (star === null) return `${energyLabel}+✦X`;
  if (star > 0) return `${energyLabel}+✦${star}`;
  return energyLabel;
};

/**
 * UI層。カード1件分の情報表示と、無印/+版それぞれの所持枚数増減UIを合成する。
 * 状態は持たず、propsで受け取ったカウント/ハンドラをそのまま橋渡しする。
 */
export const CardRow: React.FC<CardRowProps> = ({
  card,
  baseCount,
  plusCount,
  onIncrementBase,
  onDecrementBase,
  onIncrementPlus,
  onDecrementPlus,
}) => {
  return (
    <div className={styles.row}>
      <div className={styles.info}>
        <div className={styles.titleLine}>
          <span className={styles.name}>{card.name}</span>
          <span className={styles.cost}>{formatCost(card.energyCostBase, card.starCostBase)}</span>
          <span className={styles.rarity}>{card.rarity}</span>
          {!card.aggregatable && <span className={styles.specialTag}>集計対象外</span>}
        </div>
        <p className={styles.effect}>{card.effectBase}</p>
      </div>
      <div className={styles.counters}>
        <CounterField
          label="無印"
          value={baseCount}
          unit="枚"
          onIncrement={onIncrementBase}
          onDecrement={onDecrementBase}
        />
        <CounterField
          label="+版"
          value={plusCount}
          unit="枚"
          onIncrement={onIncrementPlus}
          onDecrement={onDecrementPlus}
        />
      </div>
    </div>
  );
};
