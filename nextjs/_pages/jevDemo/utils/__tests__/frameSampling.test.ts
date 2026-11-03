import { describe, it, expect } from 'vitest';
import { fitFrameSize, pickFrameTimes } from '../frameSampling';

describe('pickFrameTimes', () => {
  it('10秒の動画で、冒頭2枚・全体6枚・末尾2枚の時刻を返す', () => {
    const times = pickFrameTimes(10);
    expect(times.opening).toEqual([0.5, 1.2]);
    expect(times.ending).toEqual([8.8, 9.5]);
    expect(times.whole).toHaveLength(6);
    expect(times.whole[0]).toBe(1);
    expect(times.whole[5]).toBe(9);
  });

  it('全体のフレームは時間順に並ぶ', () => {
    const { whole } = pickFrameTimes(7.3);
    const sorted = [...whole].sort((a, b) => a - b);
    expect(whole).toEqual(sorted);
  });

  it('すべての時刻が動画の長さに収まる', () => {
    const duration = 3.21;
    const { opening, whole, ending } = pickFrameTimes(duration);
    for (const t of [...opening, ...whole, ...ending]) {
      expect(t).toBeGreaterThanOrEqual(0);
      expect(t).toBeLessThanOrEqual(duration);
    }
  });

  it('長さが0以下・非数値の場合はエラーを投げる', () => {
    expect(() => pickFrameTimes(0)).toThrow();
    expect(() => pickFrameTimes(-1)).toThrow();
    expect(() => pickFrameTimes(Number.NaN)).toThrow();
    expect(() => pickFrameTimes(Number.POSITIVE_INFINITY)).toThrow();
  });
});

describe('fitFrameSize', () => {
  it('横長の動画は長辺640pxに縮小する', () => {
    expect(fitFrameSize(1920, 1080)).toEqual({ width: 640, height: 360 });
  });

  it('縦長の動画は長辺640pxに縮小する', () => {
    expect(fitFrameSize(1080, 1920)).toEqual({ width: 360, height: 640 });
  });

  it('短辺が280px未満になる場合は短辺280pxに合わせる', () => {
    expect(fitFrameSize(1920, 600)).toEqual({ width: 896, height: 280 });
  });

  it('小さい動画は拡大して制約を満たす', () => {
    expect(fitFrameSize(320, 240)).toEqual({ width: 640, height: 480 });
  });

  it('縦横比が極端で制約を満たせない場合はnullを返す', () => {
    expect(fitFrameSize(4000, 400)).toBeNull();
  });

  it('サイズが0以下の場合はnullを返す', () => {
    expect(fitFrameSize(0, 100)).toBeNull();
    expect(fitFrameSize(100, -1)).toBeNull();
  });
});
