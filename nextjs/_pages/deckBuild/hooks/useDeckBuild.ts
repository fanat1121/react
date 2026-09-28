'use client';

import { useCallback, useMemo } from 'react';
import { useCounter } from '@/hooks/useCounter';
import { CARDS } from '../const/cards';
import { COLORLESS_CARDS } from '../const/colorlessCards';
import { ANCIENT_CARDS } from '../const/ancientCards';
import type { DeckBuildSummary } from '../const/types';
import { calculateDeckSummary } from '../utils/calculateDeckSummary';
import { useCardCounts } from './useCardCounts';

/** localStorage保存キーの接頭辞。将来他機能と衝突しないよう名前空間を切る */
const STORAGE_PREFIX = 'deckBuild.';

/** 総威力/総ブロックの手動調整値は負数も許容する */
const ADJUSTMENT_MIN = -999999;

/**
 * デッキビルド画面の状態をまとめるフック。リージェント専用カード・無色カード・
 * エンシェント入手カードの所持枚数（useCardCounts）、カタログ外の「ごみ札」枚数、
 * タイプ別に手動加算するイレギュラーカード枚数、総威力/総ブロックの手動調整値を保持し、
 * それらから集計サマリを算出する。すべての状態はlocalStorageに保存し、再読み込み後も復元する。
 */
export const useDeckBuild = () => {
  const regent = useCardCounts(CARDS, `${STORAGE_PREFIX}counts`);
  const colorless = useCardCounts(COLORLESS_CARDS, `${STORAGE_PREFIX}colorlessCounts`);
  const ancient = useCardCounts(ANCIENT_CARDS, `${STORAGE_PREFIX}ancientCounts`);

  const junk = useCounter({ persistKey: `${STORAGE_PREFIX}junkCount` });

  const irregularAttack = useCounter({ persistKey: `${STORAGE_PREFIX}irregularAttack` });
  const irregularSkill = useCounter({ persistKey: `${STORAGE_PREFIX}irregularSkill` });
  const irregularPower = useCounter({ persistKey: `${STORAGE_PREFIX}irregularPower` });

  // エンチャント等でカード計算だけでは合わなくなった分を補正する手動調整値。
  const totalPowerAdjustment = useCounter({
    min: ADJUSTMENT_MIN,
    persistKey: `${STORAGE_PREFIX}totalPowerAdjustment`,
  });
  const totalBlockAdjustment = useCounter({
    min: ADJUSTMENT_MIN,
    persistKey: `${STORAGE_PREFIX}totalBlockAdjustment`,
  });

  const resetAll = useCallback(() => {
    regent.reset();
    colorless.reset();
    ancient.reset();
    junk.reset();
    irregularAttack.reset();
    irregularSkill.reset();
    irregularPower.reset();
    totalPowerAdjustment.reset();
    totalBlockAdjustment.reset();
  }, [
    regent.reset,
    colorless.reset,
    ancient.reset,
    junk.reset,
    irregularAttack.reset,
    irregularSkill.reset,
    irregularPower.reset,
    totalPowerAdjustment.reset,
    totalBlockAdjustment.reset,
  ]);

  const summary = useMemo<DeckBuildSummary>(
    () =>
      calculateDeckSummary({
        catalogs: [
          { cards: CARDS, counts: regent.counts },
          { cards: COLORLESS_CARDS, counts: colorless.counts },
          { cards: ANCIENT_CARDS, counts: ancient.counts },
        ],
        irregularCounts: {
          attack: irregularAttack.value,
          skill: irregularSkill.value,
          power: irregularPower.value,
        },
        junkCount: junk.value,
        totalPowerAdjustment: totalPowerAdjustment.value,
        totalBlockAdjustment: totalBlockAdjustment.value,
      }),
    [
      regent.counts,
      colorless.counts,
      ancient.counts,
      junk.value,
      irregularAttack.value,
      irregularSkill.value,
      irregularPower.value,
      totalPowerAdjustment.value,
      totalBlockAdjustment.value,
    ],
  );

  return {
    regent,
    colorless,
    ancient,
    junk,
    irregular: {
      attack: irregularAttack,
      skill: irregularSkill,
      power: irregularPower,
    },
    totalPowerAdjustment,
    totalBlockAdjustment,
    resetAll,
    summary,
  };
};
