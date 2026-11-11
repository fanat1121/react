import { Input } from '@/components/common/ui/Input';
import { SketchJudgeLayout } from '../SketchJudgeLayout/SketchJudgeLayout';
import { SketchResultHero } from '../SketchJudgeLayout/SketchResultHero';
import { TARGET_MAX_LENGTH } from '../../const/box';
import { toPercent } from '../../utils/percent';
import styles from './BoxSketch.module.scss';
import type { SketchJudgeStatus } from '../../hooks/useSketchJudge';
import type { BoxJudgeResponse } from '../../types';

type BoxSketchProps = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  hasDrawing: boolean;
  status: SketchJudgeStatus;
  errorMessage: string;
  target: string;
  result: BoxJudgeResponse | null;
  onTargetChange: (target: string) => void;
  onStroke: () => void;
  onClear: () => void;
  onJudge: () => void;
};

export const BoxSketch: React.FC<BoxSketchProps> = ({ target, result, onTargetChange, ...rest }) => {
  return (
    <SketchJudgeLayout
      {...rest}
      instruction="図形をいくつか描いて、探すものを書く"
      canJudge={target.trim().length > 0}
      box={result?.box}
      controls={
        <Input
          id="box-target"
          label="探すもの"
          value={target}
          maxLength={TARGET_MAX_LENGTH}
          disabled={rest.status === 'judging'}
          onChange={(e) => onTargetChange(e.target.value)}
        />
      }
      raw={result?.raw}
      resultContent={
        result && (
          <>
            <SketchResultHero
              value={`「${result.target}」`}
              label={`はキャンバスの枠の位置（confidence ${
                result.confidence === null ? '未報告' : toPercent(result.confidence)
              }）`}
            />
            <dl className={styles.edges} aria-label="枠の位置">
              <dt>上端</dt>
              <dd>{toPercent(result.box.top)}</dd>
              <dt>下端</dt>
              <dd>{toPercent(result.box.bottom)}</dd>
              <dt>左端</dt>
              <dd>{toPercent(result.box.left)}</dd>
              <dt>右端</dt>
              <dd>{toPercent(result.box.right)}</dd>
            </dl>
            <p className={styles.note}>上端・下端は画像の高さ、左端・右端は画像の幅に対する割合です。</p>
          </>
        )
      }
    />
  );
};
