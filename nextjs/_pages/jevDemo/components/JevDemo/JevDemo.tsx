import { Button } from '@/components/common/ui/Button';
import { PlausibilityResult } from '../PlausibilityResult/PlausibilityResult';
import styles from './JevDemo.module.scss';
import type { JudgeResponse, TrickCandidate } from '../../types';

export type JudgeStatus = 'idle' | 'ready' | 'extracting' | 'judging' | 'done' | 'error';

type JevDemoProps = {
  candidates: TrickCandidate[];
  isFallbackCandidates: boolean;
  videoUrl: string | null;
  status: JudgeStatus;
  errorMessage: string;
  framePreviews: string[];
  result: JudgeResponse | null;
  onFileChange: (file: File | null) => void;
  onJudge: () => void;
};

/** ファイル選択済みで、処理中でない状態 */
const JUDGEABLE_STATUSES: JudgeStatus[] = ['ready', 'done', 'error'];

const BUSY_LABELS: Partial<Record<JudgeStatus, string>> = {
  extracting: 'フレームを抜き出し中...',
  judging: 'Jev で判定中...',
};

export const JevDemo: React.FC<JevDemoProps> = ({
  candidates,
  isFallbackCandidates,
  videoUrl,
  status,
  errorMessage,
  framePreviews,
  result,
  onFileChange,
  onJudge,
}) => {
  const busyLabel = BUSY_LABELS[status];
  const canJudge = JUDGEABLE_STATUSES.includes(status);

  return (
    <div className={styles.demo}>
      <section className={styles.section}>
        <h2 className={styles.heading}>1. 動画を選ぶ</h2>
        <label className={styles.fileLabel}>
          ディアボロの動画ファイル
          <input
            type="file"
            accept="video/*"
            onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
            disabled={!!busyLabel}
          />
        </label>
        {videoUrl && <video className={styles.video} src={videoUrl} controls muted playsInline />}
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>2. 判定する</h2>
        <p className={styles.caption}>
          判定候補（{isFallbackCandidates ? 'デモ用ダミー：技マスタを取得できませんでした' : '技マスタより'}）：
          {candidates.map((trick) => trick.name).join(' / ')}
        </p>
        <div>
          <Button variant="primary" size="large" onClick={onJudge} disabled={!canJudge}>
            {busyLabel ?? 'それらしさを判定'}
          </Button>
        </div>
        {status === 'error' && <p className={styles.error}>{errorMessage}</p>}
        {framePreviews.length > 0 && (
          <ol className={styles.frames} aria-label="Jev に渡したフレーム">
            {framePreviews.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element -- data URL のため next/image は使わない
              <li key={i}><img src={src} alt={`フレーム ${i + 1}`} /></li>
            ))}
          </ol>
        )}
      </section>

      {result && (
        <section className={styles.section}>
          <h2 className={styles.heading}>3. 結果</h2>
          <PlausibilityResult result={result} />
        </section>
      )}
    </div>
  );
};
