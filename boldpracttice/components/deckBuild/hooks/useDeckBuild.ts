'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCounter } from '@/hooks/useCounter';
import { readLocalStorageJSON, writeLocalStorageJSON } from '@/utils/localStorage';
import { CARDS } from '../const/cards';
import { COLORLESS_CARDS } from '../const/colorlessCards';
import { ANCIENT_CARDS } from '../const/ancientCards';
import { CRESCENT_SPEAR, calculateCrescentSpearPower } from '../const/crescentSpear';
import type { CardData, CardType } from '../const/types';

export type CardCount = {
  base: number;
  plus: number;
};

export type CardCounts = Record<string, CardCount>;

export type DeckBuildSummary = {
  /** カタログカード（リージェント専用＋無色＋エンシェント）のみの合計枚数 */
  totalCardCount: number;
  /** カタログカード＋イレギュラーカード＋ごみ札の合計枚数 */
  totalDeckCount: number;
  countByType: Record<CardType, number>;
  /** スキルカードのうちブロックを得る効果を持つカードの枚数 */
  blockSkillCount: number;
  /** スキルカードのうちブロックを得ない効果のカードの枚数（イレギュラースキルもここに含む） */
  nonBlockSkillCount: number;
  totalPower: number;
  totalBlock: number;
  totalStarCost: number;
  totalStarGain: number;
  totalEnergyCost: number;
  /** ✦をコストに持つカードのデッキ内枚数（三日月の槍の威力算出に使用） */
  starCostCardCount: number;
  /** ✦を得る効果を持つカードのデッキ内枚数 */
  starGainCardCount: number;
  /** 三日月の槍/+ の現在の最大威力（deckの構成から動的算出） */
  crescentSpearPower: number;
  crescentSpearPlusPower: number;
  /** 平均値はカード0枚の場合0とする */
  averageAttackPower: number;
  averageBlock: number;
  averageStarCost: number;
  averageStarGain: number;
  averageEnergyCost: number;
};

/** localStorage保存キーの接頭辞。将来他機能と衝突しないよう名前空間を切る */
const STORAGE_PREFIX = 'deckBuild.';

/** 初期デッキ（スターター構成）。指定のないカードは0枚から開始する */
const INITIAL_BASE_COUNTS: Record<string, number> = {
  'attack-01': 4, // ストライク
  'attack-02': 1, // 落星
  'skill-01': 4, // 防御
  'skill-02': 1, // 畏敬
};

const createDefaultCounts = (cards: CardData[]): CardCounts => {
  const counts: CardCounts = {};
  cards.forEach((card) => {
    counts[card.id] = { base: INITIAL_BASE_COUNTS[card.id] ?? 0, plus: 0 };
  });
  return counts;
};

/** localStorageの保存内容とCARDS側の現行カード一覧をマージし、削除/追加されたカードにも対応する */
const loadCounts = (cards: CardData[], storageKey: string): CardCounts => {
  const defaults = createDefaultCounts(cards);
  const stored = readLocalStorageJSON<Partial<CardCounts>>(storageKey, {});
  cards.forEach((card) => {
    const savedCount = stored[card.id];
    if (savedCount) defaults[card.id] = savedCount;
  });
  return defaults;
};

const updateCount = (counts: CardCounts, cardId: string, key: keyof CardCount, delta: number): CardCounts => ({
  ...counts,
  [cardId]: {
    ...counts[cardId],
    [key]: Math.max(0, counts[cardId][key] + delta),
  },
});

const safeAverage = (total: number, count: number): number => (count === 0 ? 0 : total / count);

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

const accumulateCards = (cards: CardData[], counts: CardCounts, acc: Accumulator): void => {
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
 * カードごとの所持枚数（無印/+版）を、リージェント専用カード（CARDS）・無色カード
 * （COLORLESS_CARDS）・エンシェント入手カード（ANCIENT_CARDS）で別々のstateとして管理し、
 * カタログ外の「ごみ札」枚数・タイプ別に手動加算するイレギュラーカード枚数・
 * 総威力/総ブロックの手動調整値とあわせて、総枚数・総威力・総ブロック・
 * 総スター消費/回収・各種平均値を自動集計するデッキビルド用フック。
 * すべての状態はlocalStorageに保存し、再読み込み後も復元する。
 * aggregatable=falseのカード（条件付き効果・Xコスト・パワーカード）と
 * イレギュラーカード・ごみ札は威力/ブロック集計から除外する（枚数カウントには含む）。
 */
export const useDeckBuild = () => {
  // SSRとのHydration不整合を避けるため、初回レンダリングはデフォルト値で揃え、
  // マウント後のuseEffectでlocalStorageの内容を反映する。
  const [counts, setCounts] = useState<CardCounts>(() => createDefaultCounts(CARDS));
  const [colorlessCounts, setColorlessCounts] = useState<CardCounts>(() => createDefaultCounts(COLORLESS_CARDS));
  const [ancientCounts, setAncientCounts] = useState<CardCounts>(() => createDefaultCounts(ANCIENT_CARDS));
  const [junkCount, setJunkCount] = useState(0);

  const isFirstLoad = useRef(true);
  useEffect(() => {
    if (!isFirstLoad.current) return;
    isFirstLoad.current = false;
    setCounts(loadCounts(CARDS, `${STORAGE_PREFIX}counts`));
    setColorlessCounts(loadCounts(COLORLESS_CARDS, `${STORAGE_PREFIX}colorlessCounts`));
    setAncientCounts(loadCounts(ANCIENT_CARDS, `${STORAGE_PREFIX}ancientCounts`));
    setJunkCount(readLocalStorageJSON(`${STORAGE_PREFIX}junkCount`, 0));
  }, []);

  useEffect(() => {
    writeLocalStorageJSON(`${STORAGE_PREFIX}counts`, counts);
  }, [counts]);
  useEffect(() => {
    writeLocalStorageJSON(`${STORAGE_PREFIX}colorlessCounts`, colorlessCounts);
  }, [colorlessCounts]);
  useEffect(() => {
    writeLocalStorageJSON(`${STORAGE_PREFIX}ancientCounts`, ancientCounts);
  }, [ancientCounts]);
  useEffect(() => {
    writeLocalStorageJSON(`${STORAGE_PREFIX}junkCount`, junkCount);
  }, [junkCount]);

  const irregularAttack = useCounter({ persistKey: `${STORAGE_PREFIX}irregularAttack` });
  const irregularSkill = useCounter({ persistKey: `${STORAGE_PREFIX}irregularSkill` });
  const irregularPower = useCounter({ persistKey: `${STORAGE_PREFIX}irregularPower` });

  // エンチャント等でカード計算だけでは合わなくなった分を補正する手動調整値。負数も許容する。
  const totalPowerAdjustment = useCounter({ min: -999999, persistKey: `${STORAGE_PREFIX}totalPowerAdjustment` });
  const totalBlockAdjustment = useCounter({ min: -999999, persistKey: `${STORAGE_PREFIX}totalBlockAdjustment` });

  const incrementBase = useCallback((cardId: string) => {
    setCounts((prev) => updateCount(prev, cardId, 'base', 1));
  }, []);
  const decrementBase = useCallback((cardId: string) => {
    setCounts((prev) => updateCount(prev, cardId, 'base', -1));
  }, []);
  const incrementPlus = useCallback((cardId: string) => {
    setCounts((prev) => updateCount(prev, cardId, 'plus', 1));
  }, []);
  const decrementPlus = useCallback((cardId: string) => {
    setCounts((prev) => updateCount(prev, cardId, 'plus', -1));
  }, []);

  const incrementColorlessBase = useCallback((cardId: string) => {
    setColorlessCounts((prev) => updateCount(prev, cardId, 'base', 1));
  }, []);
  const decrementColorlessBase = useCallback((cardId: string) => {
    setColorlessCounts((prev) => updateCount(prev, cardId, 'base', -1));
  }, []);
  const incrementColorlessPlus = useCallback((cardId: string) => {
    setColorlessCounts((prev) => updateCount(prev, cardId, 'plus', 1));
  }, []);
  const decrementColorlessPlus = useCallback((cardId: string) => {
    setColorlessCounts((prev) => updateCount(prev, cardId, 'plus', -1));
  }, []);

  const incrementAncientBase = useCallback((cardId: string) => {
    setAncientCounts((prev) => updateCount(prev, cardId, 'base', 1));
  }, []);
  const decrementAncientBase = useCallback((cardId: string) => {
    setAncientCounts((prev) => updateCount(prev, cardId, 'base', -1));
  }, []);
  const incrementAncientPlus = useCallback((cardId: string) => {
    setAncientCounts((prev) => updateCount(prev, cardId, 'plus', 1));
  }, []);
  const decrementAncientPlus = useCallback((cardId: string) => {
    setAncientCounts((prev) => updateCount(prev, cardId, 'plus', -1));
  }, []);

  const incrementJunk = useCallback(() => {
    setJunkCount((prev) => prev + 1);
  }, []);
  const decrementJunk = useCallback(() => {
    setJunkCount((prev) => Math.max(0, prev - 1));
  }, []);

  const resetAll = useCallback(() => {
    setCounts(createDefaultCounts(CARDS));
    setColorlessCounts(createDefaultCounts(COLORLESS_CARDS));
    setAncientCounts(createDefaultCounts(ANCIENT_CARDS));
    setJunkCount(0);
    irregularAttack.reset();
    irregularSkill.reset();
    irregularPower.reset();
    totalPowerAdjustment.reset();
    totalBlockAdjustment.reset();
  }, [irregularAttack, irregularSkill, irregularPower, totalPowerAdjustment, totalBlockAdjustment]);

  const summary = useMemo<DeckBuildSummary>(() => {
    const acc = createAccumulator();
    accumulateCards(CARDS, counts, acc);
    accumulateCards(COLORLESS_CARDS, colorlessCounts, acc);
    accumulateCards(ANCIENT_CARDS, ancientCounts, acc);

    acc.countByType.attack += irregularAttack.value;
    acc.countByType.skill += irregularSkill.value;
    acc.countByType.power += irregularPower.value;
    acc.nonBlockSkillCount += irregularSkill.value;
    const irregularTotal = irregularAttack.value + irregularSkill.value + irregularPower.value;

    const totalPower = acc.totalPower + totalPowerAdjustment.value;
    const totalBlock = acc.totalBlock + totalBlockAdjustment.value;

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
  }, [
    counts,
    colorlessCounts,
    ancientCounts,
    junkCount,
    irregularAttack.value,
    irregularSkill.value,
    irregularPower.value,
    totalPowerAdjustment.value,
    totalBlockAdjustment.value,
  ]);

  return {
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
  };
};
