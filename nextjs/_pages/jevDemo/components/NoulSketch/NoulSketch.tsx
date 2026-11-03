import { Input } from '@/components/common/ui/Input';
import { ProbabilityBars } from '../ProbabilityBars/ProbabilityBars';
import { SketchJudgeLayout } from '../SketchJudgeLayout/SketchJudgeLayout';
import { SketchResultHero } from '../SketchJudgeLayout/SketchResultHero';
import { STATEMENT_MAX_LENGTH } from '../../const/noul';
import { NOUL_UNCERTAIN_MARGIN } from '../../const/plausibility';
import { toPercent } from '../../utils/percent';
import type { SketchJudgeStatus } from '../../hooks/useSketchJudge';
import type { NoulJudgeResponse } from '../../types';

type NoulSketchProps = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  hasDrawing: boolean;
  status: SketchJudgeStatus;
  errorMessage: string;
  statement: string;
  result: NoulJudgeResponse | null;
  onStatementChange: (statement: string) => void;
  onStroke: () => void;
  onClear: () => void;
  onJudge: () => void;
};

/** yes / no が五分五分のときの値 */
const EVEN = 0.5;

export const NoulSketch: React.FC<NoulSketchProps> = ({ statement, result, onStatementChange, ...rest }) => {
  return (
    <SketchJudgeLayout
      {...rest}
      instruction="何か描いて、その絵について一文書く"
      canJudge={statement.trim().length > 0}
      controls={
        <Input
          id="noul-statement"
          label="判定する文"
          value={statement}
          maxLength={STATEMENT_MAX_LENGTH}
          disabled={rest.status === 'judging'}
          onChange={(e) => onStatementChange(e.target.value)}
        />
      }
      raw={result?.raw}
      resultContent={
        result && (
          <>
            <SketchResultHero value={toPercent(result.noul)} label={`の確率で「${result.statement}」は正しい`} />
            <ProbabilityBars
              title="yes と no"
              items={[
                {
                  label: 'yes（正しい）',
                  value: result.noul,
                  highlighted: result.noul >= EVEN,
                  flagged: Math.abs(result.noul - EVEN) < NOUL_UNCERTAIN_MARGIN,
                },
                {
                  label: 'no（正しくない）',
                  value: 1 - result.noul,
                  note: 'Jev が返すのは yes の確率だけ。no は 1 − yes で計算',
                  highlighted: result.noul < EVEN,
                },
              ]}
            />
          </>
        )
      }
    />
  );
};
