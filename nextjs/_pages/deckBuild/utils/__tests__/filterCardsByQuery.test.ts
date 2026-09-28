import { describe, it, expect } from 'vitest';
import { filterCardsByQuery } from '../filterCardsByQuery';
import type { CardData } from '../../const/types';

const createCard = (id: string, name: string, effectBase: string): CardData => ({
  id,
  name,
  type: 'attack',
  rarity: 'コモン',
  energyCostBase: 1,
  starCostBase: 0,
  energyCostPlus: 1,
  starCostPlus: 0,
  valueKind: 'damage',
  baseValue: 6,
  plusValue: 9,
  aggregatable: true,
  starGainBase: null,
  starGainPlus: null,
  effectBase,
  effectPlus: '',
});

const CARDS = [
  createCard('strike', 'ストライク', '6ダメージを与える。'),
  createCard('falling-star', '落星', '✦を得る。'),
];

describe('filterCardsByQuery', () => {
  it('検索語が空の場合、全件を返す', () => {
    expect(filterCardsByQuery(CARDS, '')).toEqual(CARDS);
  });

  it('検索語が空白のみの場合、全件を返す', () => {
    expect(filterCardsByQuery(CARDS, '   ')).toEqual(CARDS);
  });

  it('カード名に検索語を含むカードを返す', () => {
    expect(filterCardsByQuery(CARDS, 'ストライク').map((card) => card.id)).toEqual(['strike']);
  });

  it('効果に検索語を含むカードを返す', () => {
    expect(filterCardsByQuery(CARDS, '✦').map((card) => card.id)).toEqual(['falling-star']);
  });

  it('前後の空白を除いて検索する', () => {
    expect(filterCardsByQuery(CARDS, ' 落星 ').map((card) => card.id)).toEqual(['falling-star']);
  });

  it('一致するカードがない場合、空配列を返す', () => {
    expect(filterCardsByQuery(CARDS, '存在しない')).toEqual([]);
  });
});
