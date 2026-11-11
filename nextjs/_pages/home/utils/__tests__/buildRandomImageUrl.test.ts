import { describe, it, expect } from 'vitest';
import { buildRandomImageUrl } from '../buildRandomImageUrl';

describe('buildRandomImageUrl', () => {
  it('rating が1つなら rating=値 を1つ付ける', () => {
    expect(buildRandomImageUrl(['safe'])).toBe('https://api.nekosapi.com/v5/images/random?rating=safe');
  });

  it('rating が複数なら値ごとに rating を繰り返す', () => {
    expect(buildRandomImageUrl(['safe', 'suggestive'])).toBe(
      'https://api.nekosapi.com/v5/images/random?rating=safe&rating=suggestive'
    );
  });

  it('rating が空ならクエリを付けない', () => {
    expect(buildRandomImageUrl([])).toBe('https://api.nekosapi.com/v5/images/random');
  });
});
