'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { readLocalStorageJSON, writeLocalStorageJSON } from '@/utils/localStorage';
import type { CardCounts, CardData, CardVariant } from '../const/types';

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

/** localStorageの保存内容と現行カード一覧をマージし、削除/追加されたカードにも対応する */
const loadCounts = (cards: CardData[], storageKey: string): CardCounts => {
  const defaults = createDefaultCounts(cards);
  const stored = readLocalStorageJSON<Partial<CardCounts>>(storageKey, {});
  cards.forEach((card) => {
    const savedCount = stored[card.id];
    if (savedCount) defaults[card.id] = savedCount;
  });
  return defaults;
};

const updateCount = (counts: CardCounts, cardId: string, variant: CardVariant, delta: number): CardCounts => ({
  ...counts,
  [cardId]: {
    ...counts[cardId],
    [variant]: Math.max(0, counts[cardId][variant] + delta),
  },
});

export type UseCardCountsResult = {
  counts: CardCounts;
  /** 指定カードの無印/+版の枚数をdelta分増減する（0未満にはならない） */
  change: (cardId: string, variant: CardVariant, delta: number) => void;
  /** 初期デッキの枚数に戻す */
  reset: () => void;
};

/**
 * 1つのカード一覧（リージェント専用/無色/エンシェント等）について、カードごとの
 * 所持枚数（無印/+版）を管理し、localStorageに保存して再読み込み後も復元するフック。
 * SSRとのHydration不整合を避けるため、初回レンダリングはデフォルト値で揃え、
 * マウント後のuseEffectでlocalStorageの内容を反映する。
 */
export const useCardCounts = (cards: CardData[], storageKey: string): UseCardCountsResult => {
  const [counts, setCounts] = useState<CardCounts>(() => createDefaultCounts(cards));

  const isFirstLoad = useRef(true);
  useEffect(() => {
    if (!isFirstLoad.current) return;
    isFirstLoad.current = false;
    setCounts(loadCounts(cards, storageKey));
  }, [cards, storageKey]);

  useEffect(() => {
    writeLocalStorageJSON(storageKey, counts);
  }, [storageKey, counts]);

  const change = useCallback((cardId: string, variant: CardVariant, delta: number) => {
    setCounts((prev) => updateCount(prev, cardId, variant, delta));
  }, []);

  const reset = useCallback(() => {
    setCounts(createDefaultCounts(cards));
  }, [cards]);

  return { counts, change, reset };
};
