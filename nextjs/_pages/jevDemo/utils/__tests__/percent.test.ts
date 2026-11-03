import { describe, it, expect } from 'vitest';
import { toPercent } from '../percent';

describe('toPercent', () => {
  it('0〜1 の値を四捨五入したパーセント表記にする', () => {
    expect(toPercent(0)).toBe('0%');
    expect(toPercent(0.724)).toBe('72%');
    expect(toPercent(0.725)).toBe('73%');
    expect(toPercent(1)).toBe('100%');
  });
});
