import type { CardType } from './types';

export const CARD_TYPES: CardType[] = ['attack', 'skill', 'power'];

export const TYPE_LABELS: Record<CardType, string> = {
  attack: 'アタック',
  skill: 'スキル',
  power: 'パワー',
};
