import clsx from 'clsx';
import { toPercent } from '../../utils/percent';
import styles from './ProbabilityBars.module.scss';

export type ProbabilityBarItem = {
  label: string;
  /** 0〜1 */
  value: number;
  /** バーの右に添える補足 (例: 重み) */
  note?: string;
  highlighted?: boolean;
  /** 判断が割れているマーク */
  flagged?: boolean;
};

type ProbabilityBarsProps = {
  title: string;
  items: ProbabilityBarItem[];
};

export const ProbabilityBars: React.FC<ProbabilityBarsProps> = ({ title, items }) => {
  return (
    <figure className={styles.chart}>
      <figcaption className={styles.title}>{title}</figcaption>
      <ul className={styles.list}>
        {items.map((item) => (
          <li
            key={item.label}
            className={clsx(styles.row, item.highlighted && styles.highlighted)}
            title={`${item.label}: ${toPercent(item.value)}${item.note ? `（${item.note}）` : ''}`}
          >
            <span className={styles.label}>
              {item.label}
              {item.flagged && <span className={styles.flag}>判断が割れた</span>}
            </span>
            <span className={styles.track}>
              <span className={styles.bar} style={{ width: toPercent(item.value) }} />
            </span>
            <span className={styles.value}>{toPercent(item.value)}</span>
            {item.note && <span className={styles.note}>{item.note}</span>}
          </li>
        ))}
      </ul>
    </figure>
  );
};
