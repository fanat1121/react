import { describe, it, expect } from 'vitest';
import { buildShapeRequest, toShapeJudgeResponse } from '../buildShapeRequest';
import { hashString } from '../buildJevRequest';
import { SHAPE_OPTIONS } from '../../const/shape';

const DRAWING = 'data:image/png;base64,AAAA';
const LABELS = SHAPE_OPTIONS.map((option) => option.label);

describe('buildShapeRequest', () => {
  it('丸・三角・四角・どれでもないを選択肢にした Choice 質問を作る', () => {
    const request = buildShapeRequest(DRAWING);
    expect(Object.keys(request.questions.shape.criteria).sort()).toEqual([...LABELS].sort());
    expect(request.state).toEqual({ drawing: DRAWING });
  });

  it('同じ絵なら選択肢の並びも同じになる', () => {
    const first = Object.keys(buildShapeRequest(DRAWING).questions.shape.criteria);
    const second = Object.keys(buildShapeRequest(DRAWING).questions.shape.criteria);
    expect(first).toEqual(second);
  });
});

describe('hashString', () => {
  it('同じ文字列なら同じ値、違う文字列なら違う値になる', () => {
    expect(hashString('abc')).toBe(hashString('abc'));
    expect(hashString('abc')).not.toBe(hashString('abd'));
  });
});

describe('toShapeJudgeResponse', () => {
  it('確率を表示用の固定順に並べる', () => {
    const result = toShapeJudgeResponse({
      type: 'choice',
      choice: '三角',
      confidence: 0.7,
      probabilities: { 四角: 0.1, 三角: 0.8, 丸: 0.05, どれでもない: 0.05 },
    }, null);
    expect(result.guesses.map((g) => g.label)).toEqual(LABELS);
    expect(result.guesses[1]).toEqual({ label: '三角', probability: 0.8 });
    expect(result.choice).toBe('三角');
    expect(result.confidence).toBe(0.7);
  });

  it('Jev のレスポンスをそのまま raw に添える', () => {
    const raw = { model: 'jev', answers: {}, usage: { input_tokens: 1 } };
    const result = toShapeJudgeResponse({ type: 'choice', choice: '丸', confidence: 1, probabilities: { 丸: 1 } }, raw);
    expect(result.raw).toBe(raw);
  });

  it('回答に無いラベルは確率 0 にする', () => {
    const result = toShapeJudgeResponse({ type: 'choice', choice: '丸', confidence: 1, probabilities: { 丸: 1 } }, null);
    expect(result.guesses.find((g) => g.label === '四角')?.probability).toBe(0);
  });
});
