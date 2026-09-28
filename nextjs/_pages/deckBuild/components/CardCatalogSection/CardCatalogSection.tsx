import React from 'react';
import { CARD_TYPES, TYPE_LABELS } from '../../const/cardTypes';
import type { CardCounts, CardData, CardType, CardVariant } from '../../const/types';
import { CardRow } from '../CardRow/CardRow';
import styles from './CardCatalogSection.module.scss';

export type CardCatalogSectionProps = {
  /** 表示するカード（検索で絞り込み済み） */
  cards: CardData[];
  counts: CardCounts;
  onChange: (cardId: string, variant: CardVariant, delta: number) => void;
  /** 一覧全体の見出し。未指定なら出さない */
  heading?: string;
  /** 指定するとタイプ別の見出しに枚数を付ける */
  countByType?: Record<CardType, number>;
  /** trueならカードが1枚もないタイプの見出しを出さない */
  hideEmptyTypes?: boolean;
};

/**
 * UI層。1つのカード一覧（リージェント専用/無色/エンシェント等）を
 * アタック/スキル/パワーのタイプ別セクションに分けて、CardRowで描画する。
 */
export const CardCatalogSection: React.FC<CardCatalogSectionProps> = ({
  cards,
  counts,
  onChange,
  heading,
  countByType,
  hideEmptyTypes = false,
}) => {
  const visibleTypes = hideEmptyTypes
    ? CARD_TYPES.filter((type) => cards.some((card) => card.type === type))
    : CARD_TYPES;

  return (
    <>
      {heading && <h2 className={styles.heading}>{heading}</h2>}
      {visibleTypes.map((type) => (
        <section key={type} className={styles.section}>
          <h3 className={styles.sectionTitle}>
            {TYPE_LABELS[type]}
            {countByType && `（${countByType[type]}枚）`}
          </h3>
          <div className={styles.list}>
            {cards
              .filter((card) => card.type === type)
              .map((card) => (
                <CardRow
                  key={card.id}
                  card={card}
                  count={counts[card.id]}
                  onChange={(variant, delta) => onChange(card.id, variant, delta)}
                />
              ))}
          </div>
        </section>
      ))}
    </>
  );
};
