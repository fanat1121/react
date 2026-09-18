import React from 'react';
import { CounterField } from '@/components/common/ui/CounterField';
import { CountDisplay } from '@/components/common/ui/CountDisplay';
import { Button } from '@/components/common/ui/Button';
import { BUTTON_VARIANTS, BUTTON_SIZES } from '@/components/common/ui/Button/const/buttonVariants';
import type { UseCounterResult } from '@/hooks/useCounter';
import {
  DECK_TRACKER_LABELS,
  DECK_TRACKER_SECTION_TITLES,
  DECK_TRACKER_COLORS,
  CARD_UNIT,
  BIG_STEP,
} from './const/deckTrackerLabels';
import { CRESCENT_SPEAR, calculateCrescentSpearPower } from './const/crescentSpear';
import styles from './DeckTracker.module.scss';

type CardCountCounters = {
  attack: UseCounterResult;
  block: UseCounterResult;
  skill: UseCounterResult;
  power: UseCounterResult;
  starCost: UseCounterResult;
  starGain: UseCounterResult;
  crescentSpearCount: UseCounterResult;
  crescentSpearPlusCount: UseCounterResult;
};

type TotalAmountCounters = {
  attackTotal: UseCounterResult;
  blockTotal: UseCounterResult;
  starCostTotal: UseCounterResult;
  starGainTotal: UseCounterResult;
};

export type DeckTrackerProps = {
  cardCountCounters: CardCountCounters;
  totalAmountCounters: TotalAmountCounters;
  onResetAll: () => void;
};

/**
 * UI層。stateを持たず、Container層から受け取ったvalue/ハンドラを
 * CounterFieldへそのまま橋渡しして描画するだけの純粋コンポーネント。
 */
export const DeckTracker: React.FC<DeckTrackerProps> = ({
  cardCountCounters,
  totalAmountCounters,
  onResetAll,
}) => {
  const crescentSpearTotalCount =
    cardCountCounters.crescentSpearCount.value + cardCountCounters.crescentSpearPlusCount.value;
  const attackCountWithCrescentSpear = cardCountCounters.attack.value + crescentSpearTotalCount;
  const starConsumedCountWithCrescentSpear = cardCountCounters.starCost.value + crescentSpearTotalCount;

  const crescentSpearPower = calculateCrescentSpearPower(
    starConsumedCountWithCrescentSpear,
    CRESCENT_SPEAR.baseMultiplier,
  );
  const crescentSpearPlusPower = calculateCrescentSpearPower(
    starConsumedCountWithCrescentSpear,
    CRESCENT_SPEAR.plusMultiplier,
  );

  const crescentSpearAttackContribution =
    cardCountCounters.crescentSpearCount.value * crescentSpearPower +
    cardCountCounters.crescentSpearPlusCount.value * crescentSpearPlusPower;
  const attackTotalWithCrescentSpear = totalAmountCounters.attackTotal.value + crescentSpearAttackContribution;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>スレスパ2 リージェントデッキトラッカー</h2>
        <Button variant={BUTTON_VARIANTS.PRIMARY} size={BUTTON_SIZES.SMALL} onClick={onResetAll}>
          全項目リセット
        </Button>
      </div>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{DECK_TRACKER_SECTION_TITLES.cardCount}</h3>
        <div className={styles.list}>
          <CounterField
            label={DECK_TRACKER_LABELS.attack}
            value={attackCountWithCrescentSpear}
            unit={CARD_UNIT}
            accentColor={DECK_TRACKER_COLORS.attack}
            onIncrement={cardCountCounters.attack.increment}
            onDecrement={cardCountCounters.attack.decrement}
            onReset={cardCountCounters.attack.reset}
          />
          <CounterField
            label={DECK_TRACKER_LABELS.block}
            value={cardCountCounters.block.value}
            unit={CARD_UNIT}
            accentColor={DECK_TRACKER_COLORS.block}
            onIncrement={cardCountCounters.block.increment}
            onDecrement={cardCountCounters.block.decrement}
            onReset={cardCountCounters.block.reset}
          />
          <CounterField
            label={DECK_TRACKER_LABELS.skill}
            value={cardCountCounters.skill.value}
            unit={CARD_UNIT}
            accentColor={DECK_TRACKER_COLORS.skill}
            onIncrement={cardCountCounters.skill.increment}
            onDecrement={cardCountCounters.skill.decrement}
            onReset={cardCountCounters.skill.reset}
          />
          <CounterField
            label={DECK_TRACKER_LABELS.power}
            value={cardCountCounters.power.value}
            unit={CARD_UNIT}
            accentColor={DECK_TRACKER_COLORS.power}
            onIncrement={cardCountCounters.power.increment}
            onDecrement={cardCountCounters.power.decrement}
            onReset={cardCountCounters.power.reset}
          />
          <CounterField
            label={DECK_TRACKER_LABELS.starCost}
            value={starConsumedCountWithCrescentSpear}
            unit={CARD_UNIT}
            accentColor={DECK_TRACKER_COLORS.starCost}
            onIncrement={cardCountCounters.starCost.increment}
            onDecrement={cardCountCounters.starCost.decrement}
            onReset={cardCountCounters.starCost.reset}
          />
          <CounterField
            label={DECK_TRACKER_LABELS.starGain}
            value={cardCountCounters.starGain.value}
            unit={CARD_UNIT}
            accentColor={DECK_TRACKER_COLORS.starGain}
            onIncrement={cardCountCounters.starGain.increment}
            onDecrement={cardCountCounters.starGain.decrement}
            onReset={cardCountCounters.starGain.reset}
          />
          <CounterField
            label={DECK_TRACKER_LABELS.crescentSpearCount}
            value={cardCountCounters.crescentSpearCount.value}
            unit={CARD_UNIT}
            accentColor={DECK_TRACKER_COLORS.crescentSpearCount}
            onIncrement={cardCountCounters.crescentSpearCount.increment}
            onDecrement={cardCountCounters.crescentSpearCount.decrement}
            onReset={cardCountCounters.crescentSpearCount.reset}
          />
          <CounterField
            label={DECK_TRACKER_LABELS.crescentSpearPlusCount}
            value={cardCountCounters.crescentSpearPlusCount.value}
            unit={CARD_UNIT}
            accentColor={DECK_TRACKER_COLORS.crescentSpearPlusCount}
            onIncrement={cardCountCounters.crescentSpearPlusCount.increment}
            onDecrement={cardCountCounters.crescentSpearPlusCount.decrement}
            onReset={cardCountCounters.crescentSpearPlusCount.reset}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{DECK_TRACKER_SECTION_TITLES.totalAmount}</h3>
        <div className={styles.list}>
          <CounterField
            label={DECK_TRACKER_LABELS.attackTotal}
            value={attackTotalWithCrescentSpear}
            accentColor={DECK_TRACKER_COLORS.attackTotal}
            bigStep={BIG_STEP}
            onIncrement={totalAmountCounters.attackTotal.increment}
            onDecrement={totalAmountCounters.attackTotal.decrement}
            onIncrementBy={totalAmountCounters.attackTotal.incrementBy}
            onDecrementBy={totalAmountCounters.attackTotal.decrementBy}
            onReset={totalAmountCounters.attackTotal.reset}
          />
          <CounterField
            label={DECK_TRACKER_LABELS.blockTotal}
            value={totalAmountCounters.blockTotal.value}
            accentColor={DECK_TRACKER_COLORS.blockTotal}
            bigStep={BIG_STEP}
            onIncrement={totalAmountCounters.blockTotal.increment}
            onDecrement={totalAmountCounters.blockTotal.decrement}
            onIncrementBy={totalAmountCounters.blockTotal.incrementBy}
            onDecrementBy={totalAmountCounters.blockTotal.decrementBy}
            onReset={totalAmountCounters.blockTotal.reset}
          />
          <CounterField
            label={DECK_TRACKER_LABELS.starCostTotal}
            value={totalAmountCounters.starCostTotal.value}
            accentColor={DECK_TRACKER_COLORS.starCostTotal}
            onIncrement={totalAmountCounters.starCostTotal.increment}
            onDecrement={totalAmountCounters.starCostTotal.decrement}
            onReset={totalAmountCounters.starCostTotal.reset}
          />
          <CounterField
            label={DECK_TRACKER_LABELS.starGainTotal}
            value={totalAmountCounters.starGainTotal.value}
            accentColor={DECK_TRACKER_COLORS.starGainTotal}
            onIncrement={totalAmountCounters.starGainTotal.increment}
            onDecrement={totalAmountCounters.starGainTotal.decrement}
            onReset={totalAmountCounters.starGainTotal.reset}
          />
          <div className={styles.readOnlyRow} style={{ borderLeftColor: DECK_TRACKER_COLORS.starCost }}>
            <CountDisplay label={CRESCENT_SPEAR.label} value={crescentSpearPower} />
          </div>
          <div className={styles.readOnlyRow} style={{ borderLeftColor: DECK_TRACKER_COLORS.starCost }}>
            <CountDisplay label={CRESCENT_SPEAR.plusLabel} value={crescentSpearPlusPower} />
          </div>
        </div>
      </section>
    </div>
  );
};
