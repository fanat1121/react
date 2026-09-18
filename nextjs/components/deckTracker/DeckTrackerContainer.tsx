'use client';

import React, { useMemo } from 'react';
import { useCounter } from '@/hooks/useCounter';
import { DeckTracker } from './DeckTracker';
import { DECK_TRACKER_INITIAL_VALUES } from './const/deckTrackerLabels';

/**
 * Client層。枚数カウント（アタック/ブロック/スキル/パワー/スター消費/スター回収/三日月の槍/+枚数）と
 * 総量管理（アタック総値/ブロック総数/スター消費総数/スター回収総数）を
 * それぞれ独立したuseCounterで保持し、DeckTracker(UI層)へ値とハンドラを渡す。
 * 一部項目はDECK_TRACKER_INITIAL_VALUESで初期値・リセット時の戻り値を指定する。
 */
export const DeckTrackerContainer: React.FC = () => {
  const attack = useCounter({ initialValue: DECK_TRACKER_INITIAL_VALUES.attack });
  const block = useCounter({ initialValue: DECK_TRACKER_INITIAL_VALUES.block });
  const skill = useCounter();
  const power = useCounter();
  const starCost = useCounter({ initialValue: DECK_TRACKER_INITIAL_VALUES.starCost });
  const starGain = useCounter({ initialValue: DECK_TRACKER_INITIAL_VALUES.starGain });
  const crescentSpearCount = useCounter();
  const crescentSpearPlusCount = useCounter();

  const attackTotal = useCounter({ initialValue: DECK_TRACKER_INITIAL_VALUES.attackTotal });
  const blockTotal = useCounter({ initialValue: DECK_TRACKER_INITIAL_VALUES.blockTotal });
  const starCostTotal = useCounter({ initialValue: DECK_TRACKER_INITIAL_VALUES.starCostTotal });
  const starGainTotal = useCounter({ initialValue: DECK_TRACKER_INITIAL_VALUES.starGainTotal });

  const allCounters = useMemo(
    () => [
      attack,
      block,
      skill,
      power,
      starCost,
      starGain,
      crescentSpearCount,
      crescentSpearPlusCount,
      attackTotal,
      blockTotal,
      starCostTotal,
      starGainTotal,
    ],
    [
      attack,
      block,
      skill,
      power,
      starCost,
      starGain,
      crescentSpearCount,
      crescentSpearPlusCount,
      attackTotal,
      blockTotal,
      starCostTotal,
      starGainTotal,
    ],
  );

  const handleResetAll = () => {
    allCounters.forEach((counter) => counter.reset());
  };

  return (
    <DeckTracker
      cardCountCounters={{
        attack,
        block,
        skill,
        power,
        starCost,
        starGain,
        crescentSpearCount,
        crescentSpearPlusCount,
      }}
      totalAmountCounters={{ attackTotal, blockTotal, starCostTotal, starGainTotal }}
      onResetAll={handleResetAll}
    />
  );
};
