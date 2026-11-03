import { describe, it, expect } from 'vitest';
import { buildNoulRequest, toNoulJudgeResponse } from '../buildNoulRequest';
import { NOUL_INSTRUCTIONS_PREFIX } from '../../const/noul';

const DRAWING = 'data:image/png;base64,AAAA';

describe('buildNoulRequest', () => {
  it('入力した文を instructions に入れた Noul 質問を作る', () => {
    const request = buildNoulRequest(DRAWING, '丸が2つある');
    expect(request.questions.statement).toEqual({
      type: 'noul',
      instructions: `${NOUL_INSTRUCTIONS_PREFIX}丸が2つある`,
    });
    expect(request.state).toEqual({ drawing: DRAWING });
  });
});

describe('toNoulJudgeResponse', () => {
  it('判定した文と yes の確率、Jev のレスポンスをまとめる', () => {
    const raw = { model: 'jev' };
    const result = toNoulJudgeResponse('丸が2つある', { type: 'noul', noul: 0.82 }, raw);
    expect(result).toEqual({ statement: '丸が2つある', noul: 0.82, raw });
  });
});
