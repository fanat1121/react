import {
  ASPECT_LABELS,
  ASPECT_WEIGHTS,
  COMPLETION_CRITERIA,
  DIABOLO_GATE_THRESHOLD,
  IS_DIABOLO_CRITERIA,
  LOW_CONFIDENCE_THRESHOLD,
  MOTION_CRITERIA,
  NOUL_UNCERTAIN_MARGIN,
} from '../const/plausibility';
import type { AspectKey, AspectResult, NoulAnswer, PlausibilityResult, ScoreAnswer } from '../types';

export type EvaluationAnswers = {
  isDiabolo: ScoreAnswer;
  startState: NoulAnswer;
  endState: NoulAnswer;
  motion: ScoreAnswer;
  completion: ScoreAnswer;
};

const ASPECT_ORDER: AspectKey[] = ['isDiabolo', 'startState', 'endState', 'motion', 'completion'];

const LEVEL_COUNTS = {
  isDiabolo: IS_DIABOLO_CRITERIA.length,
  motion: MOTION_CRITERIA.length,
  completion: COMPLETION_CRITERIA.length,
} as const;

/**
 * Score の値を 0〜1 に正規化する
 * 段階数が違うと範囲も違うため、(段階数 - 1) で割ってから重みを掛ける
 */
export function normalizeScore(score: number, levelCount: number): number {
  if (levelCount < 2) throw new Error('段階は2つ以上必要です');
  const normalized = score / (levelCount - 1);
  return Math.min(1, Math.max(0, normalized));
}

function fromScore(key: 'isDiabolo' | 'motion' | 'completion', answer: ScoreAnswer): AspectResult {
  return {
    key,
    label: ASPECT_LABELS[key],
    value: normalizeScore(answer.score, LEVEL_COUNTS[key]),
    weight: ASPECT_WEIGHTS[key],
    uncertain: answer.confidence < LOW_CONFIDENCE_THRESHOLD,
  };
}

function fromNoul(key: 'startState' | 'endState', answer: NoulAnswer): AspectResult {
  return {
    key,
    label: ASPECT_LABELS[key],
    value: answer.noul,
    weight: ASPECT_WEIGHTS[key],
    uncertain: Math.abs(answer.noul - 0.5) < NOUL_UNCERTAIN_MARGIN,
  };
}

/**
 * 観点ごとの回答から「それらしさ」を合成する
 * 観点0 (ディアボロ動画か) がしきい値未満なら打ち切って 0 を返す
 */
export function computePlausibility(answers: EvaluationAnswers): PlausibilityResult {
  const byKey: Record<AspectKey, AspectResult> = {
    isDiabolo: fromScore('isDiabolo', answers.isDiabolo),
    startState: fromNoul('startState', answers.startState),
    endState: fromNoul('endState', answers.endState),
    motion: fromScore('motion', answers.motion),
    completion: fromScore('completion', answers.completion),
  };
  const aspects = ASPECT_ORDER.map((key) => byKey[key]);

  if (byKey.isDiabolo.value < DIABOLO_GATE_THRESHOLD) {
    return { total: 0, gated: true, aspects };
  }

  const total = aspects.reduce((sum, aspect) => sum + aspect.value * aspect.weight, 0);
  return { total, gated: false, aspects };
}
