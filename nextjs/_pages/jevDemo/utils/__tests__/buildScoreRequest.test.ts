import { describe, it, expect } from 'vitest';
import { buildScoreRequest, toScoreJudgeResponse } from '../buildScoreRequest';
import { ROUNDNESS_LEVELS } from '../../const/score';

const DRAWING = 'data:image/png;base64,AAAA';

describe('buildScoreRequest', () => {
  it('丸のきれいさの段階を criteria にした Score 質問を作る', () => {
    const request = buildScoreRequest(DRAWING);
    expect(request.questions.roundness.type).toBe('score');
    expect(request.questions.roundness.criteria).toEqual(ROUNDNESS_LEVELS);
    expect(request.state).toEqual({ drawing: DRAWING });
  });
});

describe('toScoreJudgeResponse', () => {
  it('段階番号の確率を、段階の低い順の内訳にする', () => {
    const result = toScoreJudgeResponse(
      { type: 'score', score: 2.3, confidence: 0.6, probabilities: { '0': 0, '1': 0.1, '2': 0.5, '3': 0.4 } },
      null
    );
    expect(result.levels.map((level) => level.label)).toEqual(ROUNDNESS_LEVELS);
    expect(result.levels.map((level) => level.probability)).toEqual([0, 0.1, 0.5, 0.4]);
    expect(result.score).toBe(2.3);
    expect(result.confidence).toBe(0.6);
  });

  it('回答に無い段階は確率 0 にする', () => {
    const result = toScoreJudgeResponse({ type: 'score', score: 3, confidence: 1, probabilities: { '3': 1 } }, null);
    expect(result.levels[0].probability).toBe(0);
  });

  it('Jev のレスポンスをそのまま raw に添える', () => {
    const raw = { model: 'jev', answers: {}, usage: { input_tokens: 1 } };
    const result = toScoreJudgeResponse({ type: 'score', score: 0, confidence: 1, probabilities: { '0': 1 } }, raw);
    expect(result.raw).toBe(raw);
  });
});
