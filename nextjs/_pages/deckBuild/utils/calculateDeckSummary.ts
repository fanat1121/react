import { CRESCENT_SPEAR, calculateCrescentSpearPower } from '@/lib/cards/crescentSpear';
import type { CardCounts, CardData, CardType, DeckBuildSummary } from '../const/types';

/** カード一覧と、その所持枚数の組 */
export type CardCatalog = {
  cards: CardData[];
  counts: CardCounts;
};

export type DeckSummaryInput = {
  catalogs: CardCatalog[];
  /** タイプ別に手動加算するイレギュラーカード枚数 */
  irregularCounts: Record<CardType, number>;
  junkCount: number;
  /** エンチャント等でカード計算だけでは合わなくなった分の手動調整値 */
  totalPowerAdjustment: number;
  totalBlockAdjustment: number;
};

type Accumulator = {
  countByType: Record<CardType, number>;
  blockSkillCount: number;
  nonBlockSkillCount: number;
  totalCardCount: number;
  totalPower: number;
  totalBlock: number;
  totalStarCost: number;
  totalStarGain: number;
  totalEnergyCost: number;
  starCostCardCount: number;
  starGainCardCount: number;
};

const createAccumulator = (): Accumulator => ({
  countByType: { attack: 0, skill: 0, power: 0 },
  blockSkillCount: 0,
  nonBlockSkillCount: 0,
  totalCardCount: 0,
  totalPower: 0,
  totalBlock: 0,
  totalStarCost: 0,
  totalStarGain: 0,
  totalEnergyCost: 0,
  starCostCardCount: 0,
  starGainCardCount: 0,
});

const safeAverage = (total: number, count: number): number => (count === 0 ? 0 : total / count);

const accumulateCards = ({ cards, counts }: CardCatalog, acc: Accumulator): void => {
  cards.forEach((card) => {
    const count = counts[card.id];
    const cardTotal = count.base + count.plus;
    if (cardTotal === 0) return;

    acc.totalCardCount += cardTotal;
    acc.countByType[card.type] += cardTotal;

    if (card.type === 'skill') {
      if (card.valueKind === 'block') {
        acc.blockSkillCount += cardTotal;
      } else {
        acc.nonBlockSkillCount += cardTotal;
      }
    }

    if (card.starCostBase !== null) acc.totalStarCost += card.starCostBase * count.base;
    if (card.starCostPlus !== null) acc.totalStarCost += card.starCostPlus * count.plus;

    if (card.starCostBase !== null && card.starCostBase > 0) acc.starCostCardCount += count.base;
    if (card.starCostPlus !== null && card.starCostPlus > 0) acc.starCostCardCount += count.plus;

    if (card.energyCostBase !== null) acc.totalEnergyCost += card.energyCostBase * count.base;
    if (card.energyCostPlus !== null) acc.totalEnergyCost += card.energyCostPlus * count.plus;

    if (card.starGainBase !== null) acc.totalStarGain += card.starGainBase * count.base;
    if (card.starGainPlus !== null) acc.totalStarGain += card.starGainPlus * count.plus;

    if (card.starGainBase !== null) acc.starGainCardCount += count.base;
    if (card.starGainPlus !== null) acc.starGainCardCount += count.plus;

    if (card.aggregatable) {
      if (card.valueKind === 'damage') {
        if (card.baseValue !== null) acc.totalPower += card.baseValue * count.base;
        if (card.plusValue !== null) acc.totalPower += card.plusValue * count.plus;
      } else if (card.valueKind === 'block') {
        if (card.baseValue !== null) acc.totalBlock += card.baseValue * count.base;
        if (card.plusValue !== null) acc.totalBlock += card.plusValue * count.plus;
      }
    }
  });
};

/**
 * カタログカードの所持枚数・イレギュラーカード・ごみ札・手動調整値から、
 * 総枚数・総威力・総ブロック・総スター消費/回収・各種平均値を算出する。
 * aggregatable=falseのカード（条件付き効果・Xコスト・パワーカード）と
 * イレギュラーカード・ごみ札は威力/ブロック集計から除外する（枚数カウントには含む）。
 */
export const calculateDeckSummary = ({
  catalogs,
  irregularCounts,
  junkCount,
  totalPowerAdjustment,
  totalBlockAdjustment,
}: DeckSummaryInput): DeckBuildSummary => {
  const acc = createAccumulator();
  catalogs.forEach((catalog) => accumulateCards(catalog, acc));

  acc.countByType.attack += irregularCounts.attack;
  acc.countByType.skill += irregularCounts.skill;
  acc.countByType.power += irregularCounts.power;
  acc.nonBlockSkillCount += irregularCounts.skill;
  const irregularTotal = irregularCounts.attack + irregularCounts.skill + irregularCounts.power;

  const totalPower = acc.totalPower + totalPowerAdjustment;
  const totalBlock = acc.totalBlock + totalBlockAdjustment;

  return {
    totalCardCount: acc.totalCardCount,
    totalDeckCount: acc.totalCardCount + irregularTotal + junkCount,
    countByType: acc.countByType,
    blockSkillCount: acc.blockSkillCount,
    nonBlockSkillCount: acc.nonBlockSkillCount,
    totalPower,
    totalBlock,
    totalStarCost: acc.totalStarCost,
    totalStarGain: acc.totalStarGain,
    totalEnergyCost: acc.totalEnergyCost,
    starCostCardCount: acc.starCostCardCount,
    starGainCardCount: acc.starGainCardCount,
    crescentSpearPower: calculateCrescentSpearPower(acc.starCostCardCount, CRESCENT_SPEAR.baseMultiplier),
    crescentSpearPlusPower: calculateCrescentSpearPower(acc.starCostCardCount, CRESCENT_SPEAR.plusMultiplier),
    averageAttackPower: safeAverage(totalPower, acc.countByType.attack),
    averageBlock: safeAverage(totalBlock, acc.blockSkillCount),
    averageStarCost: safeAverage(acc.totalStarCost, acc.totalCardCount),
    averageStarGain: safeAverage(acc.totalStarGain, acc.totalCardCount),
    averageEnergyCost: safeAverage(acc.totalEnergyCost, acc.totalCardCount),
  };
};
