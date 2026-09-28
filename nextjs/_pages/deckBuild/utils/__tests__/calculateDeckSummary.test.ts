import { describe, it, expect } from 'vitest';
import { calculateDeckSummary } from '../calculateDeckSummary';
import type { DeckSummaryInput } from '../calculateDeckSummary';
import type { CardData } from '../../const/types';

const createCard = (overrides: Partial<CardData> & Pick<CardData, 'id' | 'type'>): CardData => ({
  name: overrides.id,
  rarity: 'コモン',
  energyCostBase: 1,
  starCostBase: 0,
  energyCostPlus: 1,
  starCostPlus: 0,
  valueKind: 'none',
  baseValue: null,
  plusValue: null,
  aggregatable: true,
  starGainBase: null,
  starGainPlus: null,
  effectBase: '',
  effectPlus: '',
  ...overrides,
});

const STRIKE = createCard({ id: 'strike', type: 'attack', valueKind: 'damage', baseValue: 6, plusValue: 9 });
const DEFEND = createCard({ id: 'defend', type: 'skill', valueKind: 'block', baseValue: 5, plusValue: 8 });
const STAR_SKILL = createCard({
  id: 'star-skill',
  type: 'skill',
  energyCostBase: 0,
  energyCostPlus: 0,
  starCostBase: 2,
  starCostPlus: 1,
  starGainBase: null,
});
const STAR_GAIN_POWER = createCard({
  id: 'star-gain-power',
  type: 'power',
  energyCostBase: 2,
  energyCostPlus: 1,
  aggregatable: false,
  valueKind: 'damage',
  baseValue: 100,
  plusValue: 100,
  starGainBase: 3,
  starGainPlus: 4,
});

const EMPTY_INPUT: DeckSummaryInput = {
  catalogs: [],
  irregularCounts: { attack: 0, skill: 0, power: 0 },
  junkCount: 0,
  totalPowerAdjustment: 0,
  totalBlockAdjustment: 0,
};

describe('calculateDeckSummary', () => {
  it('カードが0枚の場合、合計も平均もすべて0になる', () => {
    const summary = calculateDeckSummary(EMPTY_INPUT);

    expect(summary.totalCardCount).toBe(0);
    expect(summary.totalDeckCount).toBe(0);
    expect(summary.averageAttackPower).toBe(0);
    expect(summary.averageBlock).toBe(0);
    expect(summary.averageEnergyCost).toBe(0);
  });

  it('無印と+版でそれぞれの値を使って総威力・総ブロックを集計する', () => {
    const summary = calculateDeckSummary({
      ...EMPTY_INPUT,
      catalogs: [
        {
          cards: [STRIKE, DEFEND],
          counts: { strike: { base: 2, plus: 1 }, defend: { base: 1, plus: 2 } },
        },
      ],
    });

    expect(summary.totalPower).toBe(6 * 2 + 9 * 1);
    expect(summary.totalBlock).toBe(5 * 1 + 8 * 2);
    expect(summary.countByType).toEqual({ attack: 3, skill: 3, power: 0 });
    expect(summary.blockSkillCount).toBe(3);
    expect(summary.nonBlockSkillCount).toBe(0);
    expect(summary.averageAttackPower).toBe(21 / 3);
    expect(summary.averageBlock).toBe(21 / 3);
  });

  it('複数のカタログを合算する', () => {
    const summary = calculateDeckSummary({
      ...EMPTY_INPUT,
      catalogs: [
        { cards: [STRIKE], counts: { strike: { base: 1, plus: 0 } } },
        { cards: [DEFEND], counts: { defend: { base: 1, plus: 0 } } },
      ],
    });

    expect(summary.totalCardCount).toBe(2);
    expect(summary.totalPower).toBe(6);
    expect(summary.totalBlock).toBe(5);
  });

  it('aggregatable=falseのカードは枚数には数えるが威力には含めない', () => {
    const summary = calculateDeckSummary({
      ...EMPTY_INPUT,
      catalogs: [{ cards: [STAR_GAIN_POWER], counts: { 'star-gain-power': { base: 1, plus: 1 } } }],
    });

    expect(summary.countByType.power).toBe(2);
    expect(summary.totalPower).toBe(0);
    expect(summary.totalStarGain).toBe(3 + 4);
    expect(summary.starGainCardCount).toBe(2);
    expect(summary.totalEnergyCost).toBe(2 + 1);
  });

  it('✦コストが1以上のカードだけを✦コストカード枚数に数え、三日月の槍の威力に反映する', () => {
    const summary = calculateDeckSummary({
      ...EMPTY_INPUT,
      catalogs: [
        {
          cards: [STRIKE, STAR_SKILL],
          counts: { strike: { base: 4, plus: 0 }, 'star-skill': { base: 1, plus: 2 } },
        },
      ],
    });

    expect(summary.totalStarCost).toBe(2 * 1 + 1 * 2);
    expect(summary.starCostCardCount).toBe(3);
    expect(summary.nonBlockSkillCount).toBe(3);
    expect(summary.crescentSpearPower).toBe(8 + 2 * 3);
    expect(summary.crescentSpearPlusPower).toBe(8 + 3 * 3);
  });

  it('イレギュラーカードとごみ札はデッキ総数に含め、カード枚数には含めない', () => {
    const summary = calculateDeckSummary({
      ...EMPTY_INPUT,
      catalogs: [{ cards: [STRIKE], counts: { strike: { base: 1, plus: 0 } } }],
      irregularCounts: { attack: 1, skill: 2, power: 3 },
      junkCount: 4,
    });

    expect(summary.totalCardCount).toBe(1);
    expect(summary.totalDeckCount).toBe(1 + 6 + 4);
    expect(summary.countByType).toEqual({ attack: 2, skill: 2, power: 3 });
    expect(summary.nonBlockSkillCount).toBe(2);
    expect(summary.totalPower).toBe(6);
  });

  it('手動調整値を総威力・総ブロックと、その平均に上乗せする（負数も可）', () => {
    const summary = calculateDeckSummary({
      ...EMPTY_INPUT,
      catalogs: [
        {
          cards: [STRIKE, DEFEND],
          counts: { strike: { base: 2, plus: 0 }, defend: { base: 1, plus: 0 } },
        },
      ],
      totalPowerAdjustment: 8,
      totalBlockAdjustment: -2,
    });

    expect(summary.totalPower).toBe(12 + 8);
    expect(summary.totalBlock).toBe(5 - 2);
    expect(summary.averageAttackPower).toBe(20 / 2);
    expect(summary.averageBlock).toBe(3);
  });
});
