import { describe, it, expect } from 'vitest';
import {
  buildClassifyRequest,
  buildEvaluateRequest,
  pickRelevantTerms,
  seedFromFrames,
  shuffleWithSeed,
} from '../buildJevRequest';
import { DEMO_TRICKS } from '../../const/domain';
import type { ExtractedFrames } from '../../types';

const FRAMES: ExtractedFrames = {
  opening: ['data:image/jpeg;base64,o1'],
  whole: ['data:image/jpeg;base64,w1', 'data:image/jpeg;base64,w2'],
  ending: ['data:image/jpeg;base64,e1'],
};

describe('pickRelevantTerms', () => {
  const glossary = { 水平: 'A', 垂直: 'B', '2ディア': 'C' };

  it('テキストに出てくる用語だけを返す', () => {
    expect(pickRelevantTerms(glossary, ['水平1ディア', 'サン'])).toEqual({ 水平: 'A' });
  });

  it('該当がなければ空オブジェクトを返す', () => {
    expect(pickRelevantTerms(glossary, ['トス'])).toEqual({});
  });
});

describe('shuffleWithSeed', () => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8];

  it('同じシードなら同じ順序になる', () => {
    expect(shuffleWithSeed(items, 42)).toEqual(shuffleWithSeed(items, 42));
  });

  it('要素の集合は変わらず、元の配列も変更しない', () => {
    const shuffled = shuffleWithSeed(items, 7);
    expect([...shuffled].sort((a, b) => a - b)).toEqual(items);
    expect(items).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });
});

describe('seedFromFrames', () => {
  it('同じフレームなら同じシードになる', () => {
    expect(seedFromFrames(FRAMES)).toBe(seedFromFrames({ ...FRAMES }));
  });

  it('フレームが違えばシードも変わる', () => {
    expect(seedFromFrames(FRAMES)).not.toBe(seedFromFrames({ ...FRAMES, whole: ['data:image/jpeg;base64,x'] }));
  });
});

describe('buildClassifyRequest', () => {
  it('候補の技名を選択肢にした Choice 質問を作る', () => {
    const request = buildClassifyRequest(FRAMES, DEMO_TRICKS, 1);
    const choices = Object.keys(request.questions.trick.criteria);
    expect(choices.sort()).toEqual(DEMO_TRICKS.map((t) => t.name).sort());
    expect(request.state.frames).toEqual({ whole: FRAMES.whole });
  });

  it('state に道具の定義を入れる', () => {
    const request = buildClassifyRequest(FRAMES, DEMO_TRICKS, 1);
    expect(request.state.domain).toMatchObject({ equipment: expect.stringContaining('ディアボロ') });
  });
});

describe('buildEvaluateRequest', () => {
  const trick = DEMO_TRICKS[0];

  it('5つの観点の質問を作る', () => {
    const request = buildEvaluateRequest(FRAMES, trick);
    expect(Object.keys(request.questions)).toEqual(['isDiabolo', 'startState', 'endState', 'motion', 'completion']);
  });

  it('開始・終了状態の質問に技マスタの状態名を埋め込む', () => {
    const request = buildEvaluateRequest(FRAMES, trick);
    expect(request.questions.startState.instructions).toContain(trick.startStateName);
    expect(request.questions.endState.instructions).toContain(trick.endStateName);
  });

  it('用語は対象の技に関係するものだけを入れる', () => {
    const request = buildEvaluateRequest(FRAMES, trick);
    const terms = (request.state.domain as { terms: Record<string, string> }).terms;
    expect(Object.keys(terms)).toContain('水平');
    expect(Object.keys(terms)).not.toContain('2ディア');
  });
});
