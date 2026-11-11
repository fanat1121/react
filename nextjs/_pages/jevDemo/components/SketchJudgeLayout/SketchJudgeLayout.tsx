import { Button } from '@/components/common/ui/Button';
import { RawResponse } from '../RawResponse/RawResponse';
import { SketchCanvas } from '../SketchCanvas/SketchCanvas';
import styles from './SketchJudgeLayout.module.scss';
import type { SketchJudgeStatus } from '../../hooks/useSketchJudge';
import type { BoxCoordinates } from '../../types';

type SketchJudgeLayoutProps = {
  /** 「1. 」に続く、何を描くかの指示 */
  instruction: string;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  hasDrawing: boolean;
  status: SketchJudgeStatus;
  errorMessage: string;
  /** 描いた絵のほかに判定に要る入力がそろっているか */
  canJudge?: boolean;
  /** キャンバスとボタンの間に置く入力欄 */
  controls?: React.ReactNode;
  /** キャンバスに重ねる枠 */
  box?: BoxCoordinates | null;
  /** 判定結果の中身。null のあいだは結果欄を出さない */
  resultContent: React.ReactNode | null;
  /** Jev が返したレスポンス */
  raw: unknown;
  onStroke: () => void;
  onClear: () => void;
  onJudge: () => void;
};

/** 「描く → 判定する → 結果」の並びを図形判定の各デモで揃える */
export const SketchJudgeLayout: React.FC<SketchJudgeLayoutProps> = ({
  instruction,
  canvasRef,
  hasDrawing,
  status,
  errorMessage,
  canJudge = true,
  controls,
  box = null,
  resultContent,
  raw,
  onStroke,
  onClear,
  onJudge,
}) => {
  const isJudging = status === 'judging';

  return (
    <div className={styles.layout}>
      <section className={styles.section}>
        <h2 className={styles.heading}>1. {instruction}</h2>
        <SketchCanvas canvasRef={canvasRef} onStroke={onStroke} disabled={isJudging} box={box} />
        {controls}
        <div className={styles.actions}>
          <Button variant="primary" size="large" onClick={onJudge} disabled={!hasDrawing || !canJudge || isJudging}>
            {isJudging ? 'Jev で判定中...' : '判定する'}
          </Button>
          <Button variant="outline" size="large" onClick={onClear} disabled={!hasDrawing || isJudging}>
            消す
          </Button>
        </div>
        {status === 'error' && <p className={styles.error}>{errorMessage}</p>}
      </section>

      {resultContent && (
        <section className={styles.section} aria-label="判定結果">
          <h2 className={styles.heading}>2. 結果</h2>
          {resultContent}
          <RawResponse value={raw} />
        </section>
      )}
    </div>
  );
};
