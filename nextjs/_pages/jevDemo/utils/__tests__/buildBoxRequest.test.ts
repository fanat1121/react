import { describe, it, expect } from 'vitest';
import { buildBoxRequest, toBoxJudgeResponse } from '../buildBoxRequest';
import { BOX_INSTRUCTIONS_PREFIX } from '../../const/box';

const DRAWING = 'data:image/png;base64,AAAA';
const BOX = { top: 0.1, bottom: 0.6, left: 0.2, right: 0.7 };

describe('buildBoxRequest', () => {
  it('探すものを instructions に入れた Box 質問を作る', () => {
    const request = buildBoxRequest(DRAWING, '三角');
    expect(request.questions.location).toEqual({
      type: 'box',
      instructions: `${BOX_INSTRUCTIONS_PREFIX}三角`,
    });
    expect(request.state).toEqual({ drawing: DRAWING });
  });
});

describe('toBoxJudgeResponse', () => {
  it('探したもの、位置、confidence、Jev のレスポンスをまとめる', () => {
    const raw = { model: 'jev' };
    const result = toBoxJudgeResponse('三角', { type: 'box', box: BOX, confidence: 0.9 }, raw);
    expect(result).toEqual({ target: '三角', box: BOX, confidence: 0.9, raw });
  });

  it('confidence が返らなかったときは null のまま渡す', () => {
    const result = toBoxJudgeResponse('三角', { type: 'box', box: BOX, confidence: null }, null);
    expect(result.confidence).toBeNull();
  });
});
