import styles from './SketchJudgeLayout.module.scss';

type SketchResultHeroProps = {
  /** 大きく出す答え */
  value: string;
  /** 答えに添える説明 */
  label: string;
};

/** 結果欄の先頭に出す、答えの一行 */
export const SketchResultHero: React.FC<SketchResultHeroProps> = ({ value, label }) => {
  return (
    <div className={styles.hero}>
      <p className={styles.heroValue}>{value}</p>
      <p className={styles.heroLabel}>{label}</p>
    </div>
  );
};
