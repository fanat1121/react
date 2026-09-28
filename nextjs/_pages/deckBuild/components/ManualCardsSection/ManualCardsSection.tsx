import React from 'react';
import { CounterField } from '@/components/common/ui/CounterField';
import type { UseCounterResult } from '@/hooks/useCounter';
import { CARD_TYPES, TYPE_LABELS } from '../../const/cardTypes';
import type { CardType } from '../../const/types';
import styles from './ManualCardsSection.module.scss';

export type ManualCardsSectionProps = {
  junk: UseCounterResult;
  irregular: Record<CardType, UseCounterResult>;
};

/**
 * UI層。カタログに無いカードを手動で加算する枠（ごみ札・タイプ別イレギュラーカード）を描画する。
 * ここで加算した枚数はデッキ総数にのみ反映し、総威力/総ブロック等の集計には含めない。
 */
export const ManualCardsSection: React.FC<ManualCardsSectionProps> = ({ junk, irregular }) => {
  return (
    <>
      <div className={styles.junkRow}>
        <CounterField
          label="ごみ札"
          value={junk.value}
          unit="枚"
          onIncrement={junk.increment}
          onDecrement={junk.decrement}
        />
      </div>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>イレギュラーカード（手動追加）</h3>
        <div className={styles.list}>
          {CARD_TYPES.map((type) => (
            <CounterField
              key={type}
              label={TYPE_LABELS[type]}
              value={irregular[type].value}
              unit="枚"
              onIncrement={irregular[type].increment}
              onDecrement={irregular[type].decrement}
              onReset={irregular[type].reset}
            />
          ))}
        </div>
      </section>

      <p className={styles.note}>
        「集計対象外」タグのカードはXコスト・条件付き効果・パワーカードのため、枚数のみカウントし総威力/総ブロックには含めていないのです。
        イレギュラーカード・ごみ札はカタログに無いカードを手動で加算する枠で、枚数のみデッキ総数に反映し総威力/総ブロック等の集計には含めていないのです。
      </p>
    </>
  );
};
