import { ProbabilityBars } from '../ProbabilityBars/ProbabilityBars';
import { SketchJudgeLayout } from '../SketchJudgeLayout/SketchJudgeLayout';
import { SketchResultHero } from '../SketchJudgeLayout/SketchResultHero';
import { toPercent } from '../../utils/percent';
import styles from './ScoreSketch.module.scss';
import type { SketchJudgeStatus } from '../../hooks/useSketchJudge';
import type { ScoreJudgeResponse } from '../../types';

type ScoreSketchProps = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  hasDrawing: boolean;
  status: SketchJudgeStatus;
  errorMessage: string;
  result: ScoreJudgeResponse | null;
  onStroke: () => void;
  onClear: () => void;
  onJudge: () => void;
};

/** score の表示桁数 */
const SCORE_DIGITS = 2;

export const ScoreSketch: React.FC<ScoreSketchProps> = ({ result, ...rest }) => {
  return (
    <SketchJudgeLayout
      {...rest}
      instruction="できるだけきれいな丸を描く"
      raw={result?.raw}
      resultContent={result && <ScoreResult result={result} />}
    />
  );
};

const ScoreResult: React.FC<{ result: ScoreJudgeResponse }> = ({ result }) => {
  const maxLevel = result.levels.length - 1;
  const nearestLevel = Math.round(result.score);

  return (
    <>
      <SketchResultHero
        value={result.score.toFixed(SCORE_DIGITS)}
        label={`/ ${maxLevel}（confidence ${toPercent(result.confidence)}）`}
      />
      <figure className={styles.scale}>
        <figcaption className={styles.scaleTitle}>段階のどこにあるか</figcaption>
        <div className={styles.track}>
          <span
            className={styles.marker}
            style={{ left: toPercent(result.score / maxLevel) }}
            aria-label={`score ${result.score.toFixed(SCORE_DIGITS)}`}
          />
        </div>
        <ol className={styles.ticks} start={0}>
          {result.levels.map((level, index) => (
            <li key={level.label}>{index}</li>
          ))}
        </ol>
      </figure>
      <ProbabilityBars
        title="段階ごとの確率"
        items={result.levels.map((level, index) => ({
          label: `${index}：${level.label}`,
          value: level.probability,
          highlighted: index === nearestLevel,
        }))}
      />
    </>
  );
};
