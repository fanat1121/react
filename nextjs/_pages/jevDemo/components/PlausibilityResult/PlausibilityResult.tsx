import { ProbabilityBars } from '../ProbabilityBars/ProbabilityBars';
import styles from './PlausibilityResult.module.scss';
import type { JudgeResponse } from '../../types';

type PlausibilityResultProps = {
  result: JudgeResponse;
};

const PERCENT = 100;

const toPercent = (value: number) => `${Math.round(value * PERCENT)}%`;

export const PlausibilityResult: React.FC<PlausibilityResultProps> = ({ result }) => {
  const { guesses, guessConfidence, topTrick, plausibility } = result;
  const hasUncertain = plausibility.aspects.some((aspect) => aspect.uncertain);

  return (
    <section className={styles.result} aria-label="判定結果">
      <div className={styles.hero}>
        <p className={styles.heroLabel}>「{topTrick.name}」としてのそれらしさ</p>
        <p className={styles.heroValue}>{plausibility.gated ? '—' : toPercent(plausibility.total)}</p>
        {plausibility.gated && <p className={styles.gated}>ディアボロの動画ではないと判定したため、採点を打ち切りました</p>}
        {!plausibility.gated && hasUncertain && (
          <p className={styles.uncertain}>判断が割れた観点があります（判定保留扱い）</p>
        )}
      </div>

      <ProbabilityBars
        title={`どの技っぽいか（confidence ${toPercent(guessConfidence)}）`}
        items={guesses.map((guess) => ({
          label: guess.label,
          value: guess.probability,
          highlighted: guess.label === topTrick.name,
        }))}
      />

      <ProbabilityBars
        title="観点ごとの内訳"
        items={plausibility.aspects.map((aspect) => ({
          label: aspect.label,
          value: aspect.value,
          note: aspect.weight > 0 ? `重み ${toPercent(aspect.weight)}` : 'ゲート（50%未満で打ち切り）',
          flagged: aspect.uncertain,
        }))}
      />
    </section>
  );
};
