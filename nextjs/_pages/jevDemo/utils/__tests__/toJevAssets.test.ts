import { describe, it, expect } from 'vitest';
import { Image } from '@typesafe-ai/sdk';
import { toJevAssets } from '../toJevAssets';

// 1x1 の PNG
const PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
const PNG_DATA_URL = `data:image/png;base64,${PNG_BASE64}`;

describe('toJevAssets', () => {
  it('画像の data URL を Image に置き換える', () => {
    expect(toJevAssets(PNG_DATA_URL)).toBeInstanceOf(Image);
  });

  it('ネストしたオブジェクト・配列の中も置き換える', () => {
    const result = toJevAssets({ frames: { whole: [PNG_DATA_URL, PNG_DATA_URL] }, label: 'サン' }) as {
      frames: { whole: unknown[] };
      label: string;
    };
    expect(result.frames.whole).toHaveLength(2);
    result.frames.whole.forEach((frame) => expect(frame).toBeInstanceOf(Image));
    expect(result.label).toBe('サン');
  });

  it('画像以外の値はそのまま返す', () => {
    expect(toJevAssets('data:text/plain;base64,aGk=')).toBe('data:text/plain;base64,aGk=');
    expect(toJevAssets(1)).toBe(1);
    expect(toJevAssets(null)).toBeNull();
  });

  it('元のオブジェクトを変更しない', () => {
    const state = { frames: [PNG_DATA_URL] };
    toJevAssets(state);
    expect(state.frames[0]).toBe(PNG_DATA_URL);
  });
});
