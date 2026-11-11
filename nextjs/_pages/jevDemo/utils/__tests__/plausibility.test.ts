import { describe, it, expect } from 'vitest';
import { computePlausibility, normalizeScore } from '../plausibility';
import type { EvaluationAnswers } from '../plausibility';
import type { ScoreAnswer } from '../../types';

const score = (value: number, confidence = 0.9): ScoreAnswer => ({
  type: 'score',
  score: value,
  probabilities: {},
  confidence,
});

const ANSWERS: EvaluationAnswers = {
  isDiabolo: score(2),
  startState: { type: 'noul', noul: 1 },
  endState: { type: 'noul', noul: 1 },
  motion: score(3),
  completion: score(2),
};

describe('normalizeScore', () => {
  it('(段階数 - 1) で割って 0〜1 にする', () => {
    expect(normalizeScore(0, 4)).toBe(0);
    expect(normalizeScore(1.5, 4)).toBe(0.5);
    expect(normalizeScore(3, 4)).toBe(1);
    expect(normalizeScore(1, 3)).toBe(0.5);
  });

  it('範囲外の値は 0〜1 に丸める', () => {
    expect(normalizeScore(-1, 3)).toBe(0);
    expect(normalizeScore(5, 3)).toBe(1);
  });

  it('段階が2つ未満の場合はエラーを投げる', () => {
    expect(() => normalizeScore(0, 1)).toThrow();
  });
});

describe('computePlausibility', () => {
  it('すべての観点が満点なら total は 1', () => {
    const result = computePlausibility(ANSWERS);
    expect(result.gated).toBe(false);
    expect(result.total).toBeCloseTo(1);
  });

  it('重み付きで合成する', () => {
    const result = computePlausibility({
      ...ANSWERS,
      startState: { type: 'noul', noul: 0 },
      motion: score(1.5),
    });
    // 0.25*0 + 0.25*1 + 0.35*0.5 + 0.15*1
    expect(result.total).toBeCloseTo(0.575);
  });

  it('ディアボロ動画でないと判定されたら打ち切って 0 を返す', () => {
    const result = computePlausibility({ ...ANSWERS, isDiabolo: score(0.5) });
    expect(result.gated).toBe(true);
    expect(result.total).toBe(0);
    expect(result.aspects).toHaveLength(5);
  });

  it('confidence が低い Score と 0.5 付近の Noul は uncertain になる', () => {
    const result = computePlausibility({
      ...ANSWERS,
      motion: score(2, 0.2),
      endState: { type: 'noul', noul: 0.55 },
    });
    const uncertain = result.aspects.filter((a) => a.uncertain).map((a) => a.key);
    expect(uncertain).toEqual(['endState', 'motion']);
  });

  it('観点は決まった順で返す', () => {
    const keys = computePlausibility(ANSWERS).aspects.map((a) => a.key);
    expect(keys).toEqual(['isDiabolo', 'startState', 'endState', 'motion', 'completion']);
  });
});
