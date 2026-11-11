import { describe, it, expect } from 'vitest';
import { isDisplayableImage } from '../isDisplayableImage';
import type { NekoImageData } from '../../schemas/schema';

const image = (rating: NekoImageData['rating']): NekoImageData => ({
  id: 'abc',
  url: 'https://cdn.nekosapi.com/nekos-api/images/abc.webp',
  rating,
  tags: [],
});

describe('isDisplayableImage', () => {
  it('表示対象の rating なら true', () => {
    expect(isDisplayableImage(image('safe'), ['safe'])).toBe(true);
  });

  it('表示対象に無い rating なら false', () => {
    expect(isDisplayableImage(image('borderline'), ['safe'])).toBe(false);
  });

  it('表示対象を広げればその rating も true', () => {
    expect(isDisplayableImage(image('suggestive'), ['safe', 'suggestive'])).toBe(true);
  });
});
