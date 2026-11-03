import { DEMO_TRICKS, DIABOLO_EQUIPMENT_NAME, MAX_TRICK_CANDIDATES } from '../const/domain';
import type { TrickDetailResponse } from '@/_pages/trickMaster/types';
import type { TrickCandidate } from '../types';

const GO_API_URL = process.env.GO_API_URL ?? 'http://localhost:8080';

export type TrickCandidatesResult = {
  candidates: TrickCandidate[];
  /** 技マスタが取れずデモ用ダミーを使っている */
  isFallback: boolean;
};

function toCandidate(trick: TrickDetailResponse): TrickCandidate {
  return {
    id: trick.id,
    name: trick.name,
    categoryName: trick.category_name,
    description: trick.description,
    startStateName: trick.start_state_name,
    endStateName: trick.end_state_name,
  };
}

/**
 * 技マスタからディアボロの技を判定候補として取得する
 * Go API が落ちている・該当が無いときはデモ用ダミーを返す
 */
export async function fetchTrickCandidates(): Promise<TrickCandidatesResult> {
  try {
    const response = await fetch(`${GO_API_URL}/api/tricks`, { cache: 'no-store' });
    const json = await response.json();
    const tricks: TrickDetailResponse[] = json.success ? json.data : [];
    const candidates = tricks
      .filter((trick) => trick.equipment_name === DIABOLO_EQUIPMENT_NAME)
      .slice(0, MAX_TRICK_CANDIDATES)
      .map(toCandidate);

    if (candidates.length > 0) return { candidates, isFallback: false };
  } catch {
    // フォールバックへ
  }
  return { candidates: DEMO_TRICKS, isFallback: true };
}
