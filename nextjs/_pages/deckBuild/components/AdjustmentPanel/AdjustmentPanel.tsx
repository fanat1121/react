import React from 'react';
import { CounterField } from '@/components/common/ui/CounterField';
import type { UseCounterResult } from '@/hooks/useCounter';
import styles from './AdjustmentPanel.module.scss';

export type AdjustmentPanelProps = {
  /** カードから自動集計した値に調整分を上乗せした総威力 */
  totalPower: number;
  totalBlock: number;
  totalPowerAdjustment: UseCounterResult;
  totalBlockAdjustment: UseCounterResult;
};

/** ±1ボタンの外側に出す大きい増減幅 */
const BIG_STEP = 10;

/**
 * UI層。総威力・総ブロックを表示し、エンチャント等で自動集計とずれた分を
 * 手動で上乗せ調整するカウンターを描画する（リセットは調整分のみ0に戻す）。
 */
export const AdjustmentPanel: React.FC<AdjustmentPanelProps> = ({
  totalPower,
  totalBlock,
  totalPowerAdjustment,
  totalBlockAdjustment,
}) => {
  return (
    <>
      <div className={styles.adjustmentRow}>
        <CounterField
          label="総威力"
          value={totalPower}
          bigStep={BIG_STEP}
          onIncrement={totalPowerAdjustment.increment}
          onDecrement={totalPowerAdjustment.decrement}
          onIncrementBy={totalPowerAdjustment.incrementBy}
          onDecrementBy={totalPowerAdjustment.decrementBy}
          onReset={totalPowerAdjustment.reset}
        />
        <CounterField
          label="総ブロック"
          value={totalBlock}
          bigStep={BIG_STEP}
          onIncrement={totalBlockAdjustment.increment}
          onDecrement={totalBlockAdjustment.decrement}
          onIncrementBy={totalBlockAdjustment.incrementBy}
          onDecrementBy={totalBlockAdjustment.decrementBy}
          onReset={totalBlockAdjustment.reset}
        />
      </div>
      <p className={styles.note}>
        総威力・総ブロックはカードから自動集計した値に、エンチャント等のズレ分を+/-で上乗せ調整できるのです（リセットは調整分のみ0に戻すのです）。
      </p>
    </>
  );
};
