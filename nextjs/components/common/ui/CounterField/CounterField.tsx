import React from 'react';
import { Button } from '../Button';
import { BUTTON_VARIANTS, BUTTON_SIZES } from '../Button/const/buttonVariants';
import { CountDisplay } from '../CountDisplay';
import styles from './CounterField.module.scss';

export type CounterFieldProps = {
  label: string;
  value: number;
  unit?: string;
  onIncrement: () => void;
  onDecrement: () => void;
  /** 個別リセット。未指定ならリセットボタン自体を表示しない */
  onReset?: () => void;
  /** 指定すると±1ボタンの外側に±bigStepボタンを追加表示する */
  bigStep?: number;
  onIncrementBy?: (amount: number) => void;
  onDecrementBy?: (amount: number) => void;
  /** 項目ごとの識別用アクセントカラー（左端のバー） */
  accentColor?: string;
  className?: string;
};

/**
 * CountDisplay（数値表示）に増減・個別リセットのボタン操作を合成したUI部品。
 * 増減/リセットの実処理は呼び出し側（Container層）から受け取る。
 */
export const CounterField: React.FC<CounterFieldProps> = ({
  label,
  value,
  unit = '',
  onIncrement,
  onDecrement,
  onReset,
  bigStep,
  onIncrementBy,
  onDecrementBy,
  accentColor,
  className = '',
}) => {
  const showBigStep = bigStep !== undefined && onIncrementBy && onDecrementBy;

  return (
    <div
      className={[styles.field, className].filter(Boolean).join(' ')}
      style={accentColor ? { borderLeftColor: accentColor } : undefined}
    >
      <CountDisplay label={label} value={value} unit={unit} />
      <div className={styles.controls}>
        {showBigStep && (
          <Button
            variant={BUTTON_VARIANTS.OUTLINE}
            size={BUTTON_SIZES.SMALL}
            onClick={() => onDecrementBy!(bigStep!)}
          >
            −{bigStep}
          </Button>
        )}
        <Button variant={BUTTON_VARIANTS.OUTLINE} size={BUTTON_SIZES.SMALL} onClick={onDecrement}>
          −
        </Button>
        <Button variant={BUTTON_VARIANTS.OUTLINE} size={BUTTON_SIZES.SMALL} onClick={onIncrement}>
          ＋
        </Button>
        {showBigStep && (
          <Button
            variant={BUTTON_VARIANTS.OUTLINE}
            size={BUTTON_SIZES.SMALL}
            onClick={() => onIncrementBy!(bigStep!)}
          >
            +{bigStep}
          </Button>
        )}
        {onReset && (
          <Button variant={BUTTON_VARIANTS.SECONDARY} size={BUTTON_SIZES.SMALL} onClick={onReset}>
            リセット
          </Button>
        )}
      </div>
    </div>
  );
};
