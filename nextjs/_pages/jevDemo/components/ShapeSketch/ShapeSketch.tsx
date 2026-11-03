import { ProbabilityBars } from '../ProbabilityBars/ProbabilityBars';
import { SketchJudgeLayout } from '../SketchJudgeLayout/SketchJudgeLayout';
import { SketchResultHero } from '../SketchJudgeLayout/SketchResultHero';
import { toPercent } from '../../utils/percent';
import type { SketchJudgeStatus } from '../../hooks/useSketchJudge';
import type { ShapeJudgeResponse } from '../../types';

type ShapeSketchProps = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  hasDrawing: boolean;
  status: SketchJudgeStatus;
  errorMessage: string;
  result: ShapeJudgeResponse | null;
  onStroke: () => void;
  onClear: () => void;
  onJudge: () => void;
};

export const ShapeSketch: React.FC<ShapeSketchProps> = ({ result, ...rest }) => {
  return (
    <SketchJudgeLayout
      {...rest}
      instruction="丸・三角・四角のどれかを描く"
      raw={result?.raw}
      resultContent={
        result && (
          <>
            <SketchResultHero
              value={`「${result.choice}」`}
              label={`に見えます（confidence ${toPercent(result.confidence)}）`}
            />
            <ProbabilityBars
              title="図形ごとのそれらしさ"
              items={result.guesses.map((guess) => ({
                label: guess.label,
                value: guess.probability,
                highlighted: guess.label === result.choice,
              }))}
            />
          </>
        )
      }
    />
  );
};
