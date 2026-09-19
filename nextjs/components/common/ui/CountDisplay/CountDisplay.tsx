import React from 'react';
import styles from './CountDisplay.module.scss';

export type CountDisplayProps = {
  label: string;
  value: number;
  unit?: string;
  className?: string;
};

/**
 * 数値表示専用の最小UI部品。増減ロジックを持たず、value/label/unitを
 * そのまま描画するだけなので、手動カウンターに限らず算出値の表示にも流用できる。
 */
export const CountDisplay: React.FC<CountDisplayProps> = ({
  label,
  value,
  unit = '',
  className = '',
}) => {
  return (
    <div className={[styles.countDisplay, className].filter(Boolean).join(' ')}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>
        {value}
        {unit}
      </span>
    </div>
  );
};
