import React from 'react';
import { CountDisplay } from '@/components/common/ui/CountDisplay';
import { CRESCENT_SPEAR } from '@/lib/cards/crescentSpear';
import type { DeckBuildSummary } from '../../const/types';
import styles from './DeckSummaryPanel.module.scss';

export type DeckSummaryPanelProps = {
  summary: DeckBuildSummary;
};

type SummaryItem = {
  label: string;
  value: number;
  unit?: string;
};

const CARD_UNIT = '枚';
const STAR_UNIT = '✦';

/** 平均値は小数第1位までに丸めて表示する */
const roundToOneDecimal = (value: number): number => Math.round(value * 10) / 10;

const buildSummaryItems = (summary: DeckBuildSummary): SummaryItem[] => [
  { label: 'デッキ総数（ごみ札込み）', value: summary.totalDeckCount, unit: CARD_UNIT },
  { label: 'カード枚数（登録カードのみ）', value: summary.totalCardCount, unit: CARD_UNIT },
  { label: 'アタック枚数', value: summary.countByType.attack, unit: CARD_UNIT },
  { label: 'ブロック枚数', value: summary.blockSkillCount, unit: CARD_UNIT },
  { label: 'スキル枚数（非ブロック）', value: summary.nonBlockSkillCount, unit: CARD_UNIT },
  { label: 'パワー枚数', value: summary.countByType.power, unit: CARD_UNIT },
  { label: '総スター消費', value: summary.totalStarCost, unit: STAR_UNIT },
  { label: '総スター回収', value: summary.totalStarGain, unit: STAR_UNIT },
  { label: '✦コストカード枚数', value: summary.starCostCardCount, unit: CARD_UNIT },
  { label: '✦回収カード枚数', value: summary.starGainCardCount, unit: CARD_UNIT },
  { label: CRESCENT_SPEAR.label, value: summary.crescentSpearPower },
  { label: CRESCENT_SPEAR.plusLabel, value: summary.crescentSpearPlusPower },
  { label: '平均ATK', value: roundToOneDecimal(summary.averageAttackPower) },
  { label: '平均ブロック', value: roundToOneDecimal(summary.averageBlock) },
  { label: '平均コスト', value: roundToOneDecimal(summary.averageEnergyCost) },
  { label: '平均消費スター', value: roundToOneDecimal(summary.averageStarCost), unit: STAR_UNIT },
  { label: '平均回収スター', value: roundToOneDecimal(summary.averageStarGain), unit: STAR_UNIT },
];

/** UI層。デッキの集計サマリ（枚数・スター・三日月の槍・各種平均値）を一覧表示する */
export const DeckSummaryPanel: React.FC<DeckSummaryPanelProps> = ({ summary }) => {
  return (
    <div className={styles.summary}>
      {buildSummaryItems(summary).map((item) => (
        <CountDisplay key={item.label} label={item.label} value={item.value} unit={item.unit} />
      ))}
    </div>
  );
};
